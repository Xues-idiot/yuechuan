"""
文章高亮 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.highlight import ArticleHighlight

router = APIRouter(prefix="/highlights", tags=["highlights"])


class HighlightCreate(BaseModel):
    item_id: int
    text: str
    note: str | None = None
    color: str = "yellow"
    start_offset: int = 0
    end_offset: int = 0


class HighlightResponse(BaseModel):
    id: int
    item_id: int
    text: str
    note: str | None
    color: str
    start_offset: int
    end_offset: int
    created_at: str


@router.get("/item/{item_id}", response_model=list[HighlightResponse])
async def get_item_highlights(item_id: int):
    """获取文章的所有高亮"""
    async with async_session() as db:
        result = await db.execute(
            select(ArticleHighlight)
            .where(ArticleHighlight.item_id == item_id)
            .order_by(ArticleHighlight.start_offset)
        )
        highlights = result.scalars().all()

        return [
            HighlightResponse(
                id=h.id,
                item_id=h.item_id,
                text=h.text,
                note=h.note,
                color=h.color,
                start_offset=h.start_offset,
                end_offset=h.end_offset,
                created_at=h.created_at.isoformat()
            )
            for h in highlights
        ]


@router.post("", response_model=HighlightResponse)
async def create_highlight(data: HighlightCreate):
    """创建高亮"""
    async with async_session() as db:
        highlight = ArticleHighlight(
            item_id=data.item_id,
            text=data.text,
            note=data.note,
            color=data.color,
            start_offset=data.start_offset,
            end_offset=data.end_offset
        )
        db.add(highlight)
        await db.commit()
        await db.refresh(highlight)

        return HighlightResponse(
            id=highlight.id,
            item_id=highlight.item_id,
            text=highlight.text,
            note=highlight.note,
            color=highlight.color,
            start_offset=highlight.start_offset,
            end_offset=highlight.end_offset,
            created_at=highlight.created_at.isoformat()
        )


@router.put("/{highlight_id}", response_model=HighlightResponse)
async def update_highlight(highlight_id: int, data: HighlightCreate):
    """更新高亮"""
    async with async_session() as db:
        result = await db.execute(
            select(ArticleHighlight).where(ArticleHighlight.id == highlight_id)
        )
        highlight = result.scalar_one_or_none()

        if not highlight:
            raise HTTPException(status_code=404, detail="高亮不存在")

        highlight.text = data.text
        highlight.note = data.note
        highlight.color = data.color
        highlight.start_offset = data.start_offset
        highlight.end_offset = data.end_offset

        await db.commit()
        await db.refresh(highlight)

        return HighlightResponse(
            id=highlight.id,
            item_id=highlight.item_id,
            text=highlight.text,
            note=highlight.note,
            color=highlight.color,
            start_offset=highlight.start_offset,
            end_offset=highlight.end_offset,
            created_at=highlight.created_at.isoformat()
        )


@router.delete("/{highlight_id}")
async def delete_highlight(highlight_id: int):
    """删除高亮"""
    async with async_session() as db:
        result = await db.execute(
            select(ArticleHighlight).where(ArticleHighlight.id == highlight_id)
        )
        highlight = result.scalar_one_or_none()

        if not highlight:
            raise HTTPException(status_code=404, detail="高亮不存在")

        await db.delete(highlight)
        await db.commit()

        return {"success": True}
