"""
Widget API - 提供仪表板小部件数据
"""
from fastapi import APIRouter
from sqlalchemy import select
from app.core.database import async_session

router = APIRouter(prefix="/widgets", tags=["widgets"])


@router.get("/dashboard")
async def get_dashboard_data():
    """获取仪表板数据"""
    async with async_session() as db:
        from app.models.feed import Feed, FeedItem
        from app.models.streak import UserStreak
        from sqlalchemy import func

        # 订阅源统计
        total_feeds = await db.execute(select(func.count(Feed.id)))
        active_feeds = await db.execute(select(func.count(Feed.id)).where(Feed.is_active == True))

        # 文章统计
        total_items = await db.execute(select(func.count(FeedItem.id)))
        unread_items = await db.execute(select(func.count(FeedItem.id)).where(FeedItem.is_read == False))
        starred_items = await db.execute(select(func.count(FeedItem.id)).where(FeedItem.is_starred == True))

        # 阅读打卡
        streak_result = await db.execute(select(UserStreak).where(UserStreak.user_id == 1))
        streak = streak_result.scalar_one_or_none()

        return {
            "feeds": {
                "total": total_feeds.scalar() or 0,
                "active": active_feeds.scalar() or 0
            },
            "items": {
                "total": total_items.scalar() or 0,
                "unread": unread_items.scalar() or 0,
                "starred": starred_items.scalar() or 0
            },
            "streak": {
                "current": streak.current_streak if streak else 0,
                "longest": streak.longest_streak if streak else 0,
                "today_read": streak.today_read_count if streak else 0
            }
        }


@router.get("/quick-stats")
async def get_quick_stats():
    """获取快速统计"""
    async with async_session() as db:
        from app.models.feed import FeedItem
        from sqlalchemy import func
        from datetime import datetime, timedelta

        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        today_read = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= today)
        )

        return {
            "today_read": today_read.scalar() or 0,
            "timestamp": datetime.utcnow().isoformat()
        }
