"""
标签管理 API - 统一管理所有标签
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/tags", tags=["tags"])


class TagInfo(BaseModel):
    tag: str
    count: int
    items: list


class TagMergeRequest(BaseModel):
    source_tag: str
    target_tag: str


@router.get("", response_model=list[TagInfo])
async def get_all_tags():
    """获取所有标签及使用统计"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem.tags)
            .where(FeedItem.tags.isnot(None))
            .where(FeedItem.tags != "")
        )
        all_tags = result.scalars().all()

        # 统计标签频率
        tag_counts = {}
        for tags_str in all_tags:
            tags = [t.strip() for t in tags_str.split(",") if t.strip()]
            for tag in tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

        # 排序返回
        sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)

        return [
            TagInfo(tag=tag, count=count, items=[])
            for tag, count in sorted_tags[:50]  # 限制返回50个
        ]


@router.get("/{tag}/items")
async def get_tag_items(tag: str, limit: int = 20, offset: int = 0):
    """获取使用某标签的所有文章"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.tags.contains(tag))
            .order_by(FeedItem.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        items = result.scalars().all()

        return [
            {
                "id": i.id,
                "title": i.title,
                "url": i.url,
                "feed_id": i.feed_id,
                "tags": i.tags,
                "is_read": i.is_read,
                "created_at": i.created_at.isoformat()
            }
            for i in items
        ]


@router.post("/rename")
async def rename_tag(old_name: str, new_name: str):
    """重命名标签"""
    async with async_session() as db:
        # 查找所有包含旧标签的文章
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.tags.contains(old_name))
        )
        items = result.scalars().all()

        updated = 0
        for item in items:
            if item.tags:
                tags = [t.strip() for t in item.tags.split(",")]
                new_tags = []
                for t in tags:
                    if t == old_name:
                        new_tags.append(new_name)
                    else:
                        new_tags.append(t)
                item.tags = ",".join(new_tags)
                updated += 1

        await db.commit()

        return {"success": True, "updated": updated}


@router.post("/merge")
async def merge_tags(data: TagMergeRequest):
    """合并标签"""
    async with async_session() as db:
        # 查找所有包含源标签的文章
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.tags.contains(data.source_tag))
        )
        items = result.scalars().all()

        updated = 0
        for item in items:
            if item.tags:
                tags = [t.strip() for t in item.tags.split(",")]
                if data.source_tag in tags:
                    # 移除源标签，保留目标标签
                    tags = [t for t in tags if t != data.source_tag]
                    if data.target_tag not in tags:
                        tags.append(data.target_tag)
                    item.tags = ",".join(tags)
                    updated += 1

        await db.commit()

        return {"success": True, "updated": updated}


@router.delete("/{tag}")
async def delete_tag(tag: str):
    """删除标签（从所有文章中移除）"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem)
            .where(FeedItem.tags.contains(tag))
        )
        items = result.scalars().all()

        updated = 0
        for item in items:
            if item.tags:
                tags = [t.strip() for t in item.tags.split(",") if t.strip() != tag]
                item.tags = ",".join(tags)
                updated += 1

        await db.commit()

        return {"success": True, "updated": updated}
