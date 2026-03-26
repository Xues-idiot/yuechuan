from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.models.feed import Feed, FeedItem
from app.schemas.stats import ReadingStatsResponse

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/reading", response_model=ReadingStatsResponse)
async def get_reading_stats(db: AsyncSession = Depends(get_db)):
    """获取阅读统计数据"""
    # 统计总内容数
    total_result = await db.execute(select(func.count(FeedItem.id)))
    total_items = total_result.scalar() or 0

    # 已读内容数
    read_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.is_read == True)
    )
    read_items = read_result.scalar() or 0

    # 收藏数
    starred_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.is_starred == True)
    )
    starred_items = starred_result.scalar() or 0

    # AI 摘要数
    summarized_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.ai_summary.isnot(None))
    )
    ai_summarized = summarized_result.scalar() or 0

    # AI 翻译数
    translated_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.ai_translated.isnot(None))
    )
    ai_translated = translated_result.scalar() or 0

    return ReadingStatsResponse(
        total_items=total_items,
        read_items=read_items,
        unread_items=total_items - read_items,
        starred_items=starred_items,
        ai_summarized=ai_summarized,
        ai_translated=ai_translated,
        knowledge_saved=starred_items  # 暂用收藏数代替知识库数
    )


@router.get("/unread-count")
async def get_unread_count(db: AsyncSession = Depends(get_db)):
    """获取所有订阅源的未读数统计"""
    # 按订阅源统计未读数
    result = await db.execute(
        select(Feed.id, Feed.name, func.count(FeedItem.id).label("unread_count"))
        .join(FeedItem, Feed.id == FeedItem.feed_id)
        .where(FeedItem.is_read == False)
        .group_by(Feed.id, Feed.name)
    )
    feeds_with_unread = result.all()

    # 总未读数
    total_unread_result = await db.execute(
        select(func.count(FeedItem.id)).where(FeedItem.is_read == False)
    )
    total_unread = total_unread_result.scalar() or 0

    return {
        "total_unread": total_unread,
        "feeds": [
            {"feed_id": feed_id, "name": name, "unread_count": unread_count}
            for feed_id, name, unread_count in feeds_with_unread
        ]
    }
