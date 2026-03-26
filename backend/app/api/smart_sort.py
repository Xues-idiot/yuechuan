"""
智能排序 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import Feed, FeedItem

router = APIRouter(prefix="/smart-sort", tags=["smart-sort"])


class SortOption(BaseModel):
    field: str  # relevance, date, feed, unread, reading_time
    direction: str = "desc"  # asc, desc


@router.get("/feeds/{feed_id}/items")
async def get_sorted_items(feed_id: int, sort: str = "date"):
    """获取智能排序的文章列表"""
    async with async_session() as db:
        # 检查 feed 是否存在
        feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
        feed = feed_result.scalar_one_or_none()

        if not feed:
            raise HTTPException(status_code=404, detail="订阅源不存在")

        query = select(FeedItem).where(FeedItem.feed_id == feed_id)

        if sort == "date":
            query = query.order_by(FeedItem.published_at.desc())
        elif sort == "unread":
            query = query.where(FeedItem.is_read == False).order_by(FeedItem.published_at.desc())
        elif sort == "title":
            query = query.order_by(FeedItem.title)
        else:  # relevance - 默认按时间
            query = query.order_by(FeedItem.published_at.desc())

        result = await db.execute(query.limit(50))
        items = result.scalars().all()

        return {
            "items": [
                {
                    "id": i.id,
                    "title": i.title,
                    "url": i.url,
                    "author": i.author,
                    "published_at": i.published_at.isoformat() if i.published_at else None,
                    "is_read": i.is_read,
                    "is_starred": i.is_starred,
                    "ai_summary": i.ai_summary[:200] + "..." if i.ai_summary and len(i.ai_summary) > 200 else i.ai_summary
                }
                for i in items
            ]
        }


@router.get("/recommendations")
async def get_recommendations(limit: int = 10):
    """获取推荐阅读（基于阅读历史）"""
    async with async_session() as db:
        # 获取用户阅读最多的 feed
        popular_feeds = await db.execute(
            select(FeedItem.feed_id, func.count(FeedItem.id).label("count"))
            .where(FeedItem.is_read == True)
            .group_by(FeedItem.feed_id)
            .order_by(func.count(FeedItem.id).desc())
            .limit(3)
        )

        feed_ids = [f.feed_id for f in popular_feeds.all()]

        if not feed_ids:
            return {"items": []}

        # 从这些 feed 获取未读文章
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.feed_id.in_(feed_ids))
            .where(FeedItem.is_read == False)
            .order_by(FeedItem.published_at.desc())
            .limit(limit)
        )

        items = result.scalars().all()

        return {
            "items": [
                {
                    "id": i.id,
                    "title": i.title,
                    "url": i.url,
                    "feed_id": i.feed_id,
                    "published_at": i.published_at.isoformat() if i.published_at else None,
                    "reason": "基于你的阅读偏好推荐"
                }
                for i in items
            ]
        }
