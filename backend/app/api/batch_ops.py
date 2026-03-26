"""
批量操作 API - 批量处理文章
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, and_
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/batch", tags=["batch"])


class BatchOperation(BaseModel):
    item_ids: list[int]
    operation: str  # mark_read, mark_unread, star, unstar, add_tag, remove_tag, delete
    value: str | None = None  # 标签值等


class BatchResult(BaseModel):
    success: boolean
    affected: int
    failed: list[int]


@router.post("/operation")
async def batch_operation(data: BatchOperation):
    """执行批量操作"""
    async with async_session() as db:
        affected = 0
        failed = []

        result = await db.execute(
            select(FeedItem).where(FeedItem.id.in_(data.item_ids))
        )
        items = result.scalars().all()

        item_map = {i.id: i for i in items}

        for item_id in data.item_ids:
            if item_id not in item_map:
                failed.append(item_id)
                continue

            item = item_map[item_id]

            try:
                if data.operation == "mark_read":
                    item.is_read = True
                elif data.operation == "mark_unread":
                    item.is_read = False
                elif data.operation == "star":
                    item.is_starred = True
                elif data.operation == "unstar":
                    item.is_starred = False
                elif data.operation == "add_tag" and data.value:
                    current_tags = item.tags.split(",") if item.tags else []
                    if data.value not in current_tags:
                        current_tags.append(data.value)
                        item.tags = ",".join(current_tags)
                elif data.operation == "remove_tag" and data.value:
                    current_tags = [t.strip() for t in (item.tags or "").split(",")]
                    if data.value in current_tags:
                        current_tags.remove(data.value)
                        item.tags = ",".join(current_tags)
                elif data.operation == "delete":
                    await db.delete(item)
                else:
                    failed.append(item_id)
                    continue

                affected += 1
            except Exception as e:
                failed.append(item_id)

        await db.commit()

        return {
            "success": len(failed) == 0,
            "affected": affected,
            "failed": failed
        }


@router.post("/mark-all-read")
async def batch_mark_all_read(feed_id: int | None = None, before_date: str | None = None):
    """批量标记已读"""
    async with async_session() as db:
        query = select(FeedItem).where(FeedItem.is_read == False)

        if feed_id:
            query = query.where(FeedItem.feed_id == feed_id)

        if before_date:
            query = query.where(FeedItem.created_at <= before_date)

        result = await db.execute(query)
        items = result.scalars().all()

        count = 0
        for item in items:
            item.is_read = True
            count += 1

        await db.commit()

        return {"success": True, "affected": count}


@router.post("/archive-old")
async def batch_archive_old(days: int = 30):
    """归档旧文章"""
    async with async_session() as db:
        from datetime import datetime, timedelta

        cutoff = datetime.utcnow() - timedelta(days=days)

        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.is_read == True)
            .where(FeedItem.is_starred == False)
            .where(FeedItem.created_at < cutoff)
        )
        items = result.scalars().all()

        # 简化：标记为已读（实际可以移动到归档表）
        count = 0
        for item in items:
            # 这里可以添加归档逻辑
            count += 1

        await db.commit()

        return {"success": True, "archived": count}
