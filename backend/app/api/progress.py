"""
阅读进度同步 API - 跨设备同步阅读进度
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.feed import FeedItem, UserReadingProgress

router = APIRouter(prefix="/progress", tags=["阅读进度"])

class ProgressUpdate(BaseModel):
    item_id: int
    position: int  # 0-100 百分比
    scroll_position: Optional[int] = None  # 滚动位置像素
    completed: bool = False

class ProgressResponse(BaseModel):
    item_id: int
    position: int
    scroll_position: Optional[int]
    completed: bool
    updated_at: datetime

@router.post("/sync")
async def sync_progress(
    updates: list[ProgressUpdate],
    db: AsyncSession = Depends(get_db)
):
    """
    批量同步阅读进度到服务器

    - **updates**: 进度更新列表
    """
    updated = []
    for update in updates:
        # 查找或创建进度记录
        result = await db.execute(
            select(UserReadingProgress).where(
                UserReadingProgress.item_id == update.item_id
            )
        )
        progress = result.scalar_one_or_none()

        if progress:
            progress.position = update.position
            progress.scroll_position = update.scroll_position
            progress.completed = update.completed
            progress.updated_at = datetime.utcnow()
        else:
            progress = UserReadingProgress(
                item_id=update.item_id,
                position=update.position,
                scroll_position=update.scroll_position,
                completed=update.completed
            )
            db.add(progress)

        updated.append(progress)

    await db.commit()
    return {"synced": len(updated), "items": updated}

@router.get("/{item_id}", response_model=ProgressResponse)
async def get_progress(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """获取特定文章的阅读进度"""
    result = await db.execute(
        select(UserReadingProgress).where(
            UserReadingProgress.item_id == item_id
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        raise HTTPException(status_code=404, detail="未找到进度记录")

    return progress

@router.get("/item/{item_id}/position")
async def get_reading_position(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """获取文章阅读位置（百分比）"""
    result = await db.execute(
        select(UserReadingProgress).where(
            UserReadingProgress.item_id == item_id
        )
    )
    progress = result.scalar_one_or_none()

    return {
        "position": progress.position if progress else 0,
        "scroll_position": progress.scroll_position if progress else 0,
        "completed": progress.completed if progress else False
    }

@router.post("/{item_id}/complete")
async def mark_as_completed(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """标记文章为已读"""
    result = await db.execute(
        select(UserReadingProgress).where(
            UserReadingProgress.item_id == item_id
        )
    )
    progress = result.scalar_one_or_none()

    if progress:
        progress.position = 100
        progress.completed = True
        progress.updated_at = datetime.utcnow()
    else:
        progress = UserReadingProgress(
            item_id=item_id,
            position=100,
            completed=True
        )
        db.add(progress)

    await db.commit()
    return {"success": True}

@router.delete("/{item_id}")
async def delete_progress(
    item_id: int,
    db: AsyncSession = Depends(get_db)
):
    """删除进度记录（重置阅读进度）"""
    result = await db.execute(
        select(UserReadingProgress).where(
            UserReadingProgress.item_id == item_id
        )
    )
    progress = result.scalar_one_or_none()

    if progress:
        await db.delete(progress)
        await db.commit()

    return {"success": True}
