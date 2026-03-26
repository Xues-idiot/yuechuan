from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.feed import FeedItem, Feed
from app.services.knowledge_graph import KnowledgeGraphService

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

_kg_service = None


def get_kg_service() -> KnowledgeGraphService:
    global _kg_service
    if _kg_service is None:
        _kg_service = KnowledgeGraphService()
    return _kg_service


class SearchSimilarRequest(BaseModel):
    query: str
    limit: int = 5
    exclude_item_id: int | None = None


@router.post("/items/{item_id}/add")
async def add_item_to_knowledge(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    kg: KnowledgeGraphService = Depends(get_kg_service)
):
    """将内容添加到知识库"""
    result = await db.execute(select(FeedItem).where(FeedItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="内容不存在")

    feed_result = await db.execute(select(Feed).where(Feed.id == item.feed_id))
    feed = feed_result.scalar_one_or_none()
    feed_name = feed.name if feed else ""

    content = item.content_text or item.content or ""
    if not content:
        raise HTTPException(status_code=400, detail="内容为空，无法添加")

    kg.add_item(
        item_id=item.id,
        feed_id=item.feed_id,
        title=item.title,
        content=content,
        feed_name=feed_name,
        tags=[]
    )

    return {"status": "ok", "message": "已添加到知识库"}


@router.post("/search")
async def search_similar(
    request: SearchSimilarRequest,
    kg: KnowledgeGraphService = Depends(get_kg_service)
):
    """搜索相似内容"""
    similar = kg.search_similar(
        query=request.query,
        limit=request.limit,
        exclude_id=request.exclude_item_id
    )
    return {"status": "ok", "results": similar}


@router.delete("/items/{item_id}")
async def remove_from_knowledge(
    item_id: int,
    kg: KnowledgeGraphService = Depends(get_kg_service)
):
    """从知识库删除内容"""
    kg.delete_item(item_id)
    return {"status": "ok", "message": "已从知识库删除"}


@router.get("/items/{item_id}/similar")
async def get_similar_items(
    item_id: int,
    limit: int = 5,
    db: AsyncSession = Depends(get_db),
    kg: KnowledgeGraphService = Depends(get_kg_service)
):
    """获取与指定内容相似的其他内容"""
    result = await db.execute(select(FeedItem).where(FeedItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="内容不存在")

    content = item.content_text or item.content or ""
    if not content:
        return {"status": "ok", "results": []}

    similar = kg.search_similar(
        query=f"{item.title}\n{content[:500]}",
        limit=limit,
        exclude_id=item_id
    )

    return {"status": "ok", "results": similar}
