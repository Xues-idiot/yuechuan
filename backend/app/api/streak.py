"""
阅读打卡 streak API
"""
from datetime import datetime, date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.streak import UserStreak, DailyReadingLog

router = APIRouter(prefix="/streak", tags=["streak"])


class StreakResponse(BaseModel):
    current_streak: int
    longest_streak: int
    total_read_days: int
    today_read_count: int
    today_items: list
    week_logs: list


class StreakStats(BaseModel):
    total_items: int
    read_items: int
    unread_items: int
    completion_rate: float


def today():
    now = datetime.utcnow()
    return datetime(now.year, now.month, now.day)


@router.get("", response_model=StreakResponse)
async def get_streak():
    """获取用户的阅读打卡数据"""
    async with async_session() as db:
        # 获取或创建 streak 记录
        result = await db.execute(select(UserStreak).where(UserStreak.user_id == 1))
        streak = result.scalar_one_or_none()

        if not streak:
            streak = UserStreak(user_id=1, last_read_date=today())
            db.add(streak)
            await db.commit()
            await db.refresh(streak)

        # 检查是否需要重置今日计数
        if streak.today_date:
            streak_date = streak.today_date.date() if isinstance(streak.today_date, datetime) else streak.today_date
            today_date_obj = date.today()
            if streak_date != today_date_obj:
                streak.today_read_count = 0
                streak.today_date = today()

        # 获取今日阅读日志
        today_start = today()
        today_end = datetime(today_start.year, today_start.month, today_start.day, 23, 59, 59)
        log_result = await db.execute(
            select(DailyReadingLog)
            .where(DailyReadingLog.user_id == 1)
            .where(DailyReadingLog.date >= today_start)
            .where(DailyReadingLog.date <= today_end)
        )
        today_log = log_result.scalar_one_or_none()

        # 获取本周阅读日志
        week_start = today_start.replace(hour=0, minute=0, second=0)
        from datetime import timedelta
        week_start = week_start - timedelta(days=week_start.weekday())
        week_result = await db.execute(
            select(DailyReadingLog)
            .where(DailyReadingLog.user_id == 1)
            .where(DailyReadingLog.date >= week_start)
            .order_by(DailyReadingLog.date)
        )
        week_logs = week_result.scalars().all()

        # 获取今日已读文章列表（从阅读历史）
        from app.models.feed import FeedItem
        items_result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= today_start)
            .order_by(FeedItem.updated_at.desc())
            .limit(20)
        )
        today_items = items_result.scalars().all()

        return StreakResponse(
            current_streak=streak.current_streak,
            longest_streak=streak.longest_streak,
            total_read_days=streak.total_read_days,
            today_read_count=streak.today_read_count,
            today_items=[{"id": i.id, "title": i.title, "url": i.url} for i in today_items],
            week_logs=[{"date": str(l.date.date()), "items_read": l.items_read, "reading_time_minutes": l.reading_time_minutes} for l in week_logs]
        )


@router.post("/read/{item_id}")
async def record_read(item_id: int):
    """记录一篇文章的阅读"""
    async with async_session() as db:
        # 获取 streak 记录
        result = await db.execute(select(UserStreak).where(UserStreak.user_id == 1))
        streak = result.scalar_one_or_none()

        today_date_obj = date.today()

        if not streak:
            streak = UserStreak(user_id=1, current_streak=1, longest_streak=1, total_read_days=1, today_date=today())
            db.add(streak)
        else:
            last_date = streak.last_read_date.date() if isinstance(streak.last_read_date, datetime) else streak.last_read_date

            if last_date == today_date_obj:
                # 今天已阅读
                streak.today_read_count += 1
            elif last_date == today_date_obj.replace(day=today_date_obj.day - 1):
                # 昨天已阅读，连续打卡+1
                streak.current_streak += 1
                streak.today_read_count = 1
                streak.total_read_days += 1
                if streak.current_streak > streak.longest_streak:
                    streak.longest_streak = streak.current_streak
            else:
                # 中间断开，重新开始
                streak.current_streak = 1
                streak.today_read_count = 1
                streak.total_read_days += 1

        streak.last_read_date = today()
        streak.today_date = today()

        # 更新每日日志
        today_start = today()
        today_end = datetime(today_start.year, today_start.month, today_start.day, 23, 59, 59)
        log_result = await db.execute(
            select(DailyReadingLog)
            .where(DailyReadingLog.user_id == 1)
            .where(DailyReadingLog.date >= today_start)
            .where(DailyReadingLog.date <= today_end)
        )
        daily_log = log_result.scalar_one_or_none()

        if daily_log:
            daily_log.items_read += 1
        else:
            daily_log = DailyReadingLog(user_id=1, date=today(), items_read=1)
            db.add(daily_log)

        await db.commit()

        return {"success": True, "current_streak": streak.current_streak, "today_count": streak.today_read_count}


@router.get("/stats", response_model=StreakStats)
async def get_streak_stats():
    """获取阅读统计数据"""
    async with async_session() as db:
        from app.models.feed import FeedItem

        total_result = await db.execute(select(func.count(FeedItem.id)))
        total_items = total_result.scalar() or 0

        read_result = await db.execute(select(func.count(FeedItem.id)).where(FeedItem.is_read == True))
        read_items = read_result.scalar() or 0

        unread_items = total_items - read_items
        completion_rate = (read_items / total_items * 100) if total_items > 0 else 0

        return StreakStats(
            total_items=total_items,
            read_items=read_items,
            unread_items=unread_items,
            completion_rate=round(completion_rate, 1)
        )
