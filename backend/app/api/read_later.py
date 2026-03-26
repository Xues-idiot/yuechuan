from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.feed import FeedItem

router = APIRouter(prefix="/read-later", tags=["read-later"])


@router.get("")
async def get_read_later_items(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """获取稍后阅读列表"""
    # 注意：实际项目中应该有专门的 read_later 关联表
    # 这里临时使用收藏功能代替
    result = await db.execute(
        select(FeedItem)
        .where(FeedItem.is_starred == True)
        .order_by(FeedItem.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = result.scalars().all()

    return {
        "items": items,
        "limit": limit,
        "offset": offset
    }


@router.post("/add/{item_id}")
async def add_to_read_later(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """添加到稍后阅读"""
    result = await db.execute(select(FeedItem).where(FeedItem.id == item_id))
    item = result.scalar_one_or_none()

    if not item:
        return {"success": False, "message": "内容不存在"}

    # 标记为稍后阅读（使用 is_starred 暂时替代）
    item.is_starred = True
    await db.commit()

    return {"success": True, "message": "已添加到稍后阅读"}


@router.delete("/remove/{item_id}")
async def remove_from_read_later(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """从稍后阅读移除"""
    result = await db.execute(select(FeedItem).where(FeedItem.id == item_id))
    item = result.scalar_one_or_none()

    if not item:
        return {"success": False, "message": "内容不存在"}

    item.is_starred = False
    await db.commit()

    return {"success": True, "message": "已从稍后阅读移除"}


@router.post("/clear")
async def clear_read_later(
    db: AsyncSession = Depends(get_db)
):
    """清空稍后阅读列表"""
    result = await db.execute(
        select(FeedItem).where(FeedItem.is_starred == True)
    )
    items = result.scalars().all()

    for item in items:
        item.is_starred = False

    await db.commit()

    return {"success": True, "cleared": len(items)}
