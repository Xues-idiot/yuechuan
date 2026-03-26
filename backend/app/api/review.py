"""
间隔复习 API - 基于 SM-2 算法
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.feed import FeedItem
from app.services.spaced_repetition import SM2ReviewSystem

router = APIRouter(prefix="/review", tags=["间隔复习"])

class ReviewRequest(BaseModel):
    quality: int  # 0-5 评分

class ReviewResponse(BaseModel):
    ease_factor: float
    interval: int
    next_review: str

class ReviewItemResponse(BaseModel):
    item: dict
    ease_factor: float
    interval: int
    next_review: str

# 内存中的复习系统（生产环境应使用数据库）
_review_system = SM2ReviewSystem()

@router.get("/items", response_model=list[ReviewItemResponse])
async def get_review_items(db: AsyncSession = Depends(get_db)):
    """获取所有待复习的项目"""
    due_items = _review_system.get_due_items()

    if not due_items:
        return []

    # 获取项目详情
    result = await db.execute(
        select(FeedItem).where(
            FeedItem.id.in_([item["item_id"] for item in due_items])
        )
    )
    items = result.scalars().all()
    items_map = {item.id: item for item in items}

    response = []
    for due_item in due_items:
        item_id = due_item["item_id"]
        if item_id in items_map:
            item = items_map[item_id]
            response.append({
                "item": {
                    "id": item.id,
                    "title": item.title,
                    "content": item.content_text or item.content or "",
                    "notes": item.notes,
                    "feed_id": item.feed_id,
                },
                "ease_factor": due_item["ease_factor"],
                "interval": due_item["interval"],
                "next_review": due_item["next_review"].isoformat(),
            })

    return response

@router.post("/items/{item_id}", response_model=ReviewResponse)
async def review_item(
    item_id: int,
    request: ReviewRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    提交复习结果

    - **quality**: 评分 0-5
      - 0: 完全忘记
      - 1: 错误但记住线索
      - 2: 模糊
      - 3: 记得
      - 4: 良好
      - 5: 完美
    """
    # 验证项目存在
    result = await db.execute(
        select(FeedItem).where(FeedItem.id == item_id)
    )
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="项目不存在")

    # 使用 SM-2 算法计算
    sm2_result = _review_system.review(item_id, request.quality)

    return ReviewResponse(
        ease_factor=sm2_result["ease_factor"],
        interval=sm2_result["interval"],
        next_review=sm2_result["next_review"].isoformat()
    )

@router.get("/stats")
async def get_review_stats():
    """获取复习统计"""
    return _review_system.get_stats()

@router.post("/items/{item_id}/reset")
async def reset_review(item_id: int):
    """重置项目的复习进度"""
    _review_system.reset(item_id)
    return {"success": True}
