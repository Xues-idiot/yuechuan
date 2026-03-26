from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.feed import Feed, FeedItem

router = APIRouter(prefix="/history", tags=["history"])


@router.get("")
async def get_reading_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """获取阅读历史"""
    result = await db.execute(
        select(FeedItem)
        .where(FeedItem.is_read == True)
        .order_by(FeedItem.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = result.scalars().all()

    total_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.is_read == True)
    )
    total = total_result.scalar() or 0

    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset
    }


@router.get("/by-date")
async def get_history_by_date(
    date: str = Query(..., description="日期格式: YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db)
):
    """按日期获取阅读历史"""
    result = await db.execute(
        select(FeedItem)
        .where(
            FeedItem.is_read == True,
            func.date(FeedItem.created_at) == date
        )
        .order_by(FeedItem.created_at.desc())
    )
    items = result.scalars().all()

    return {
        "date": date,
        "items": items,
        "count": len(items)
    }


@router.get("/date-range")
async def get_history_in_date_range(
    start_date: str = Query(..., description="开始日期: YYYY-MM-DD"),
    end_date: str = Query(..., description="结束日期: YYYY-MM-DD"),
    db: AsyncSession = Depends(get_db)
):
    """获取日期范围内的阅读历史"""
    result = await db.execute(
        select(FeedItem)
        .where(
            FeedItem.is_read == True,
            func.date(FeedItem.created_at) >= start_date,
            func.date(FeedItem.created_at) <= end_date
        )
        .order_by(FeedItem.created_at.desc())
    )
    items = result.scalars().all()

    # 统计
    total_result = await db.execute(
        select(func.count(FeedItem.id)).where(
            FeedItem.is_read == True,
            func.date(FeedItem.created_at) >= start_date,
            func.date(FeedItem.created_at) <= end_date
        )
    )
    total = total_result.scalar() or 0

    return {
        "start_date": start_date,
        "end_date": end_date,
        "items": items,
        "total": total,
        "count": len(items)
    }


@router.post("/mark-all-read")
async def mark_all_as_read(
    feed_id: int = Query(..., description="订阅源 ID"),
    db: AsyncSession = Depends(get_db)
):
    """将订阅源的所有内容标记为已读"""
    feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
    feed = feed_result.scalar_one_or_none()

    if not feed:
        raise HTTPException(status_code=404, detail="订阅源不存在")

    result = await db.execute(
        select(FeedItem).where(
            FeedItem.feed_id == feed_id,
            FeedItem.is_read == False
        )
    )
    items = result.scalars().all()

    for item in items:
        item.is_read = True

    await db.commit()

    return {
        "success": True,
        "feed_id": feed_id,
        "feed_name": feed.name,
        "marked_count": len(items)
    }


@router.delete("/clear")
async def clear_history(
    before_date: str = Query(None, description="清除此日期之前的历史"),
    db: AsyncSession = Depends(get_db)
):
    """清除阅读历史"""
    if before_date:
        # 清除特定日期之前的历史
        result = await db.execute(
            select(FeedItem).where(
                FeedItem.is_read == True,
                func.date(FeedItem.created_at) < before_date
            )
        )
    else:
        # 清除所有历史
        result = await db.execute(
            select(FeedItem).where(FeedItem.is_read == True)
        )

    items = result.scalars().all()

    for item in items:
        item.is_read = False

    await db.commit()

    return {
        "success": True,
        "cleared_count": len(items)
    }
