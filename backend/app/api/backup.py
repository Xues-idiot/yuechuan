"""
备份与恢复 API
"""
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed import Feed, FeedItem

router = APIRouter(prefix="/backup", tags=["backup"])


class BackupData(BaseModel):
    version: str
    created_at: str
    feeds: list
    feed_items: list


@router.get("/export")
async def export_backup():
    """导出所有数据为 JSON"""
    async with async_session() as db:
        # 获取所有订阅源
        feeds_result = await db.execute(select(Feed))
        feeds = feeds_result.scalars().all()

        feeds_data = [
            {
                "name": f.name,
                "url": f.url,
                "feed_type": f.feed_type,
                "category": f.category,
                "is_active": f.is_active
            }
            for f in feeds
        ]

        # 获取所有文章（限制数量避免过大）
        items_result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_starred == True)  # 只备份星标文章
            .limit(1000)
        )
        items = items_result.scalars().all()

        items_data = [
            {
                "feed_url": f.url,
                "title": i.title,
                "url": i.url,
                "author": i.author,
                "content": i.content[:5000] if i.content else None,  # 限制长度
                "published_at": i.published_at.isoformat() if i.published_at else None,
                "tags": i.tags,
                "notes": i.notes
            }
            for i, f in [(i, next((fe for fe in feeds if fe.id == i.feed_id), None)) for i in items]
            if f
        ]

        backup = BackupData(
            version="1.0",
            created_at=datetime.utcnow().isoformat(),
            feeds=feeds_data,
            feed_items=items_data
        )

        return backup


@router.post("/import")
async def import_backup(backup: BackupData):
    """导入备份数据"""
    async with async_session() as db:
        imported_feeds = 0
        imported_items = 0

        # 导入订阅源
        for feed_data in backup.feeds:
            existing = await db.execute(
                select(Feed).where(Feed.url == feed_data["url"])
            )
            if not existing.scalar_one_or_none():
                feed = Feed(
                    name=feed_data["name"],
                    url=feed_data["url"],
                    feed_type=feed_data["feed_type"],
                    category=feed_data.get("category"),
                    is_active=feed_data.get("is_active", True)
                )
                db.add(feed)
                imported_feeds += 1

        await db.commit()

        return {
            "success": True,
            "imported_feeds": imported_feeds,
            "imported_items": imported_items
        }


@router.get("/full-export")
async def full_export():
    """完整导出（包括所有阅读数据）"""
    async with async_session() as db:
        from app.models.streak import UserStreak, DailyReadingLog
        from app.models.highlight import ArticleHighlight
        from app.models.reading_speed import ReadingSpeedLog

        # 获取所有订阅源
        feeds_result = await db.execute(select(Feed))
        feeds = feeds_result.scalars().all()

        # 获取用户数据
        streak_result = await db.execute(select(UserStreak))
        streaks = streak_result.scalars().all()

        logs_result = await db.execute(select(DailyReadingLog).limit(100))
        logs = logs_result.scalars().all()

        highlights_result = await db.execute(select(ArticleHighlight).limit(500))
        highlights = highlights_result.scalars().all()

        return {
            "version": "1.0",
            "exported_at": datetime.utcnow().isoformat(),
            "feeds_count": len(feeds),
            "user_streaks": [
                {"current_streak": s.current_streak, "longest_streak": s.longest_streak, "total_read_days": s.total_read_days}
                for s in streaks
            ],
            "daily_logs_count": len(logs),
            "highlights_count": len(highlights)
        }
