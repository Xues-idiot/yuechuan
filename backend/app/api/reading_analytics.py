"""
阅读分析 API - 详细的数据分析
"""
from fastapi import APIRouter
from datetime import datetime, timedelta
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import FeedItem, Feed

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/overview")
async def get_analytics_overview():
    """获取分析概览"""
    async with async_session() as db:
        # 总数统计
        total_items = await db.execute(select(func.count(FeedItem.id)))
        total_feeds = await db.execute(select(func.count(Feed.id)))

        read_items = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_read == True)
        )
        unread_items = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_read == False)
        )
        starred_items = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_starred == True)
        )

        # AI 使用统计
        ai_summarized = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.ai_summary.isnot(None))
        )
        ai_translated = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.ai_translated.isnot(None))
        )

        return {
            "total_items": total_items.scalar() or 0,
            "total_feeds": total_feeds.scalar() or 0,
            "read_items": read_items.scalar() or 0,
            "unread_items": unread_items.scalar() or 0,
            "starred_items": starred_items.scalar() or 0,
            "ai_summarized": ai_summarized.scalar() or 0,
            "ai_translated": ai_translated.scalar() or 0
        }


@router.get("/feed-analysis")
async def get_feed_analysis():
    """获取订阅源分析"""
    async with async_session() as db:
        # 按 feed 分组统计
        result = await db.execute(
            select(
                FeedItem.feed_id,
                func.count(FeedItem.id).label("total"),
                func.sum(FeedItem.is_read.cast()).label("read")
            )
            .group_by(FeedItem.feed_id)
        )

        feed_stats = []
        for row in result.all():
            feed_result = await db.execute(select(Feed).where(Feed.id == row.feed_id))
            feed = feed_result.scalar_one_or_none()
            if feed:
                feed_stats.append({
                    "feed_id": row.feed_id,
                    "feed_name": feed.name,
                    "total": row.total,
                    "read": row.read or 0,
                    "unread": row.total - (row.read or 0),
                    "read_rate": round((row.read or 0) / row.total * 100, 1) if row.total > 0 else 0
                })

        # 按阅读率排序
        feed_stats.sort(key=lambda x: x["read_rate"], reverse=True)

        return feed_stats[:10]  # 返回前10


@router.get("/time-distribution")
async def get_time_distribution():
    """获取阅读时间分布"""
    async with async_session() as db:
        # 按小时统计
        from sqlalchemy import extract

        result = await db.execute(
            select(
                extract("hour", FeedItem.updated_at).label("hour"),
                func.count(FeedItem.id).label("count")
            )
            .where(FeedItem.is_read == True)
            .group_by(extract("hour", FeedItem.updated_at))
        )

        hourly = [0] * 24
        for row in result.all():
            if row.hour is not None:
                hourly[int(row.hour)] = row.count

        # 按星期统计
        result = await db.execute(
            select(
                extract("dow", FeedItem.updated_at).label("dow"),
                func.count(FeedItem.id).label("count")
            )
            .where(FeedItem.is_read == True)
            .group_by(extract("dow", FeedItem.updated_at))
        )

        weekly = [0] * 7
        for row in result.all():
            if row.dow is not None:
                weekly[int(row.dow)] = row.count

        return {
            "hourly": hourly,
            "weekly": weekly,
            "peak_hour": hourly.index(max(hourly)) if max(hourly) > 0 else 0,
            "peak_day": weekly.index(max(weekly)) if max(weekly) > 0 else 0
        }


@router.get("/productivity")
async def get_productivity_score():
    """获取生产力评分"""
    async with async_session() as db:
        from app.models.streak import UserStreak

        streak_result = await db.execute(select(UserStreak).where(UserStreak.user_id == 1))
        streak = streak_result.scalar_one_or_none()

        # 计算综合评分
        streak_score = min((streak.current_streak if streak else 0) * 5, 50)

        # 本周阅读量
        week_ago = datetime.utcnow() - timedelta(days=7)
        week_read = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= week_ago)
        )
        week_count = week_read.scalar() or 0
        reading_score = min(week_count * 2, 30)

        # 收藏率
        total = await db.execute(select(func.count(FeedItem.id)))
        total_count = total.scalar() or 0
        starred = await db.execute(select(func.count(FeedItem.id)).where(FeedItem.is_starred == True))
        starred_count = starred.scalar() or 0
        star_rate = (starred_count / total_count * 100) if total_count > 0 else 0
        star_score = min(star_rate, 20)

        total_score = streak_score + reading_score + star_score

        return {
            "total_score": round(total_score, 1),
            "breakdown": {
                "streak": streak_score,
                "reading": reading_score,
                "engagement": star_score
            },
            "level": "初级" if total_score < 30 else "中级" if total_score < 60 else "高级",
            "week_read_count": week_count
        }
