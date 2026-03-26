from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/items/{item_id}/summarize")
async def summarize_item(item_id: int, db: AsyncSession = Depends(get_db)):
    """为内容生成 AI 摘要"""
    service = AIService(db)
    result = await service.generate_summary(item_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "未知错误"))
    return {"status": "ok", "summary": result["summary"]}


@router.post("/items/{item_id}/key-points")
async def extract_key_points(item_id: int, db: AsyncSession = Depends(get_db)):
    """提取内容关键点"""
    service = AIService(db)
    result = await service.generate_key_points(item_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "未知错误"))
    return {"status": "ok", "key_points": result["key_points"]}


@router.post("/items/{item_id}/translate")
async def translate_item(item_id: int, db: AsyncSession = Depends(get_db)):
    """翻译内容为中文"""
    service = AIService(db)
    result = await service.translate_content(item_id)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result.get("error", "未知错误"))
    return {"status": "ok", "translation": result["translation"]}
