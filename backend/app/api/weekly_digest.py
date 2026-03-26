"""
每周摘要 API - 生成每周阅读摘要
"""
from datetime import datetime, timedelta
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/weekly-digest", tags=["weekly-digest"])


class WeeklyDigestResponse(BaseModel):
    start_date: str
    end_date: str
    total_articles: int
    read_articles: int
    top_feeds: list
    top_articles: list
    reading_time_estimate: int  # 分钟


@router.get("", response_model=WeeklyDigestResponse)
async def get_weekly_digest():
    """获取本周阅读摘要"""
    async with async_session() as db:
        now = datetime.utcnow()
        week_start = now - timedelta(days=now.weekday())
        week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)

        # 本周文章统计
        total_result = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.created_at >= week_start)
        )
        total_articles = total_result.scalar() or 0

        # 已读文章
        read_result = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.created_at >= week_start)
            .where(FeedItem.is_read == True)
        )
        read_articles = read_result.scalar() or 0

        # 获取 feed 统计
        feeds_result = await db.execute(
            select(FeedItem.feed_id, func.count(FeedItem.id).label("count"))
            .where(FeedItem.created_at >= week_start)
            .group_by(FeedItem.feed_id)
            .order_by(func.count(FeedItem.id).desc())
            .limit(5)
        )
        top_feeds = [{"feed_id": f.feed_id, "count": f.count} for f in feeds_result.all()]

        # 热门文章（按阅读次数，这里用星标替代）
        popular_result = await db.execute(
            select(FeedItem)
            .where(FeedItem.created_at >= week_start)
            .where(FeedItem.is_starred == True)
            .order_by(FeedItem.updated_at.desc())
            .limit(5)
        )
        top_articles = [
            {"id": a.id, "title": a.title, "url": a.url}
            for a in popular_result.scalars().all()
        ]

        # 预估阅读时间
        reading_time_estimate = total_articles * 5  # 每篇约5分钟

        return WeeklyDigestResponse(
            start_date=week_start.isoformat(),
            end_date=now.isoformat(),
            total_articles=total_articles,
            read_articles=read_articles,
            top_feeds=top_feeds,
            top_articles=top_articles,
            reading_time_estimate=reading_time_estimate
        )
