"""
阅读列表导入导出 API
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed import Feed, FeedItem

router = APIRouter(prefix="/reading-list", tags=["reading-list"])


class ReadingListItem(BaseModel):
    title: str
    url: str
    author: str | None = None
    published_date: str | None = None
    feed_title: str | None = None
    tags: list[str] = []
    notes: str | None = None


class ReadingListExport(BaseModel):
    version: str = "1.0"
    exported_at: str
    items: list[ReadingListItem]


@router.get("/export")
async def export_reading_list(format: str = "json"):
    """导出自定义阅读列表"""
    async with async_session() as db:
        # 获取所有星标文章
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_starred == True)
            .order_by(FeedItem.created_at.desc())
            .limit(500)
        )
        items = result.scalars().all()

        # 获取 feed 信息
        feed_ids = list(set([i.feed_id for i in items]))
        feeds_result = await db.execute(
            select(Feed).where(Feed.id.in_(feed_ids))
        )
        feeds = {f.id: f for f in feeds_result.scalars().all()}

        reading_list = [
            ReadingListItem(
                title=i.title,
                url=i.url,
                author=i.author,
                published_date=i.published_at.isoformat() if i.published_at else None,
                feed_title=feeds.get(i.feed_id).name if i.feed_id in feeds else None,
                tags=i.tags.split(",") if i.tags else [],
                notes=i.notes
            )
            for i in items
        ]

        export_data = ReadingListExport(
            exported_at=datetime.utcnow().isoformat(),
            items=reading_list
        )

        if format == "json":
            return export_data
        elif format == "txt":
            # 纯文本格式
            lines = [f"# Reading List - {datetime.utcnow().date()}\n"]
            for item in reading_list:
                lines.append(f"- {item.title}")
                lines.append(f"  URL: {item.url}")
                if item.author:
                    lines.append(f"  Author: {item.author}")
                lines.append("")
            return {"content": "\n".join(lines), "filename": "reading_list.txt"}
        else:
            raise HTTPException(status_code=400, detail="不支持的格式")


@router.post("/import")
async def import_reading_list(items: list[ReadingListItem]):
    """导入阅读列表"""
    async with async_session() as db:
        imported = 0
        skipped = 0

        for item in items:
            # 检查是否已存在
            existing = await db.execute(
                select(FeedItem).where(FeedItem.url == item.url)
            )
            if existing.scalar_one_or_none():
                skipped += 1
                continue

            # 查找或创建 feed
            feed = None
            if item.feed_title:
                feed_result = await db.execute(
                    select(Feed).where(Feed.name == item.feed_title)
                )
                feed = feed_result.scalar_one_or_none()

            if not feed:
                # 创建默认 feed
                feed = Feed(
                    name=item.feed_title or "Imported",
                    url=item.url,
                    feed_type="imported"
                )
                db.add(feed)
                await db.commit()
                await db.refresh(feed)

            # 创建文章
            feed_item = FeedItem(
                feed_id=feed.id,
                guid=item.url,
                title=item.title,
                url=item.url,
                author=item.author,
                tags=",".join(item.tags) if item.tags else None,
                notes=item.notes,
                is_starred=True
            )
            db.add(feed_item)
            imported += 1

        await db.commit()

        return {
            "success": True,
            "imported": imported,
            "skipped": skipped
        }


@router.get("/import-url")
async def import_from_url(url: str):
    """从 URL 导入单个文章"""
    async with async_session() as db:
        # 检查是否已存在
        existing = await db.execute(
            select(FeedItem).where(FeedItem.url == url)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="文章已存在")

        # 创建占位 feed
        feed = Feed(
            name="Imported",
            url=url,
            feed_type="imported"
        )
        db.add(feed)
        await db.commit()
        await db.refresh(feed)

        # 创建文章
        feed_item = FeedItem(
            feed_id=feed.id,
            guid=url,
            title="Imported Article",
            url=url,
            is_starred=True
        )
        db.add(feed_item)
        await db.commit()

        return {"success": True, "item_id": feed_item.id}
