"""
增强搜索 API - 高级搜索和过滤
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, or_, and_
from app.core.database import async_session
from app.models.feed import FeedItem, Feed

router = APIRouter(prefix="/search", tags=["search"])


class SearchResult(BaseModel):
    items: list
    total: int
    page: int
    page_size: int


@router.get("/advanced", response_model=SearchResult)
async def advanced_search(
    q: str | None = None,
    feed_id: int | None = None,
    feed_type: str | None = None,
    is_read: bool | None = None,
    is_starred: bool | None = None,
    tags: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    author: str | None = None,
    page: int = 1,
    page_size: int = 20
):
    """高级搜索"""
    async with async_session() as db:
        query = select(FeedItem)

        if q:
            search_term = f"%{q}%"
            query = query.where(
                or_(
                    FeedItem.title.ilike(search_term),
                    FeedItem.content.ilike(search_term),
                    FeedItem.content_text.ilike(search_term),
                    FeedItem.ai_summary.ilike(search_term)
                )
            )

        if feed_id:
            query = query.where(FeedItem.feed_id == feed_id)

        if is_read is not None:
            query = query.where(FeedItem.is_read == is_read)

        if is_starred is not None:
            query = query.where(FeedItem.is_starred == is_starred)

        if tags:
            for tag in tags.split(","):
                query = query.where(FeedItem.tags.contains(tag.strip()))

        if author:
            query = query.where(FeedItem.author.ilike(f"%{author}%"))

        if date_from:
            query = query.where(FeedItem.published_at >= date_from)

        if date_to:
            query = query.where(FeedItem.published_at <= date_to)

        # 计数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页
        query = query.order_by(FeedItem.published_at.desc())
        query = query.limit(page_size).offset((page - 1) * page_size)

        result = await db.execute(query)
        items = result.scalars().all()

        return SearchResult(
            items=[
                {
                    "id": i.id,
                    "title": i.title,
                    "url": i.url,
                    "author": i.author,
                    "feed_id": i.feed_id,
                    "published_at": i.published_at.isoformat() if i.published_at else None,
                    "is_read": i.is_read,
                    "is_starred": i.is_starred,
                    "tags": i.tags,
                    "ai_summary": i.ai_summary[:200] if i.ai_summary else None
                }
                for i in items
            ],
            total=total,
            page=page,
            page_size=page_size
        )


@router.get("/suggestions")
async def get_search_suggestions(q: str, limit: int = 10):
    """获取搜索建议"""
    async with async_session() as db:
        search_term = f"%{q}%"

        # 搜索标题
        result = await db.execute(
            select(FeedItem.title)
            .where(FeedItem.title.ilike(search_term))
            .limit(limit)
        )
        titles = [r[0] for r in result.all()]

        # 搜索标签
        tag_result = await db.execute(
            select(FeedItem.tags)
            .where(FeedItem.tags.ilike(search_term))
            .limit(limit)
        )
        tags = set()
        for tag_str in tag_result.scalars().all():
            if tag_str:
                for t in tag_str.split(","):
                    if q.lower() in t.lower():
                        tags.add(t.strip())
        tags = list(tags)[:limit]

        # 搜索作者
        author_result = await db.execute(
            select(FeedItem.author)
            .where(FeedItem.author.ilike(search_term))
            .distinct()
            .limit(limit)
        )
        authors = [r[0] for r in author_result.all() if r[0]]

        return {
            "titles": titles,
            "tags": tags,
            "authors": authors
        }


from sqlalchemy import func
