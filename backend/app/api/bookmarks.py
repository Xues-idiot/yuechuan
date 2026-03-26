from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.feed import Feed, FeedItem
from app.schemas.feed import FeedItemResponse

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.get("", response_model=list[FeedItemResponse])
async def list_bookmarks(
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """获取所有收藏内容"""
    result = await db.execute(
        select(FeedItem)
        .where(FeedItem.is_starred == True)
        .order_by(FeedItem.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = result.scalars().all()
    return items


@router.get("/count")
async def get_bookmark_count(db: AsyncSession = Depends(get_db)):
    """获取收藏数量"""
    result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.is_starred == True)
    )
    count = result.scalar() or 0
    return {"count": count}


@router.get("/by-tag")
async def get_bookmarks_by_tag(
    tag: str,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """按标签获取收藏内容"""
    result = await db.execute(
        select(FeedItem)
        .where(
            FeedItem.is_starred == True,
            FeedItem.tags.contains(tag)
        )
        .order_by(FeedItem.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = result.scalars().all()
    return items


@router.post("/batch-star")
async def batch_star_items(
    item_ids: list[int],
    db: AsyncSession = Depends(get_db)
):
    """批量收藏"""
    result = await db.execute(
        select(FeedItem).where(FeedItem.id.in_(item_ids))
    )
    items = result.scalars().all()

    for item in items:
        item.is_starred = True

    await db.commit()
    return {"success": True, "updated": len(items)}


@router.post("/batch-unstar")
async def batch_unstar_items(
    item_ids: list[int],
    db: AsyncSession = Depends(get_db)
):
    """批量取消收藏"""
    result = await db.execute(
        select(FeedItem).where(FeedItem.id.in_(item_ids))
    )
    items = result.scalars().all()

    for item in items:
        item.is_starred = False

    await db.commit()
    return {"success": True, "updated": len(items)}
