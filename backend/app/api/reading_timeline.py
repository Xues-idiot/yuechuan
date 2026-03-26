"""
阅读时间线 API - 按时间线展示阅读历史
"""
from datetime import datetime, timedelta
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import FeedItem, Feed

router = APIRouter(prefix="/reading-timeline", tags=["timeline"])


class TimelineEntry(BaseModel):
    date: str
    items: list
    total_read: int
    total_time_minutes: int


@router.get("", response_model=list[TimelineEntry])
async def get_reading_timeline(days: int = 7):
    """获取阅读时间线"""
    async with async_session() as db:
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)

        # 获取这段时间的所有已读文章
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= start_date)
            .order_by(FeedItem.updated_at.desc())
        )
        items = result.scalars().all()

        # 按日期分组
        timeline = {}
        for item in items:
            date_key = item.updated_at.strftime("%Y-%m-%d") if item.updated_at else start_date.strftime("%Y-%m-%d")
            if date_key not in timeline:
                timeline[date_key] = {
                    "date": date_key,
                    "items": [],
                    "total_read": 0,
                    "total_time_minutes": 0
                }

            # 估算阅读时间
            content_length = len(item.content_text or item.content or "")
            reading_time = max(1, content_length // 500)  # 每500字符1分钟

            timeline[date_key]["items"].append({
                "id": item.id,
                "title": item.title,
                "url": item.url,
                "feed_id": item.feed_id,
                "published_at": item.published_at.isoformat() if item.published_at else None,
                "reading_time_minutes": reading_time
            })
            timeline[date_key]["total_read"] += 1
            timeline[date_key]["total_time_minutes"] += reading_time

        return list(timeline.values())


@router.get("/monthly")
async def get_monthly_summary():
    """获取月度阅读总结"""
    async with async_session() as db:
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= month_start)
        )
        items = result.scalars().all()

        total_read = len(items)
        total_time = sum(len(i.content_text or i.content or "") // 500 for i in items)

        # 按 feed 分组
        feed_stats = {}
        for item in items:
            if item.feed_id not in feed_stats:
                feed_stats[item.feed_id] = {"count": 0, "time": 0}
            feed_stats[item.feed_id]["count"] += 1
            feed_stats[item.feed_id]["time"] += len(item.content_text or "") // 500

        return {
            "month": now.strftime("%Y-%m"),
            "total_read": total_read,
            "total_time_minutes": total_time,
            "daily_avg": round(total_read / max(1, now.day), 1),
            "top_feeds": [
                {"feed_id": fid, "count": stats["count"]}
                for fid, stats in sorted(feed_stats.items(), key=lambda x: x[1]["count"], reverse=True)[:5]
            ]
        }


@router.get("/insights")
async def get_reading_insights():
    """获取阅读洞察"""
    async with async_session() as db:
        now = datetime.utcnow()

        # 获取统计数据
        total_result = await db.execute(select(func.count(FeedItem.id)))
        total_items = total_result.scalar() or 0

        read_result = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_read == True)
        )
        read_items = read_result.scalar() or 0

        starred_result = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_starred == True)
        )
        starred_items = starred_result.scalar() or 0

        # 最近7天的阅读趋势
        week_ago = now - timedelta(days=7)
        daily_counts = []
        for i in range(7):
            day = week_ago + timedelta(days=i+1)
            day_start = day.replace(hour=0, minute=0, second=0)
            day_end = day.replace(hour=23, minute=59, second=59)

            count_result = await db.execute(
                select(func.count(FeedItem.id))
                .where(FeedItem.is_read == True)
                .where(FeedItem.updated_at >= day_start)
                .where(FeedItem.updated_at <= day_end)
            )
            daily_counts.append({
                "date": day.strftime("%Y-%m-%d"),
                "count": count_result.scalar() or 0
            })

        return {
            "total_items": total_items,
            "read_items": read_items,
            "starred_items": starred_items,
            "completion_rate": round(read_items / total_items * 100, 1) if total_items > 0 else 0,
            "weekly_trend": daily_counts
        }
