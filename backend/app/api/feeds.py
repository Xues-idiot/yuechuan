from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.feed import Feed, FeedItem
from app.schemas.feed import FeedCreate, FeedUpdate, FeedResponse, FeedItemResponse, FeedItemDetailResponse, FeedItemUpdate
from app.services.opml import feeds_to_opml, parse_opml

router = APIRouter(prefix="/feeds", tags=["feeds"])


@router.get("", response_model=list[FeedResponse])
async def list_feeds(db: AsyncSession = Depends(get_db)):
    """列出所有订阅源"""
    result = await db.execute(select(Feed).where(Feed.is_active == True).order_by(Feed.created_at.desc()))
    feeds = result.scalars().all()
    return feeds


@router.post("", response_model=FeedResponse, status_code=201)
async def create_feed(feed_data: FeedCreate, db: AsyncSession = Depends(get_db)):
    """添加新订阅源"""
    # 检查是否已存在
    result = await db.execute(select(Feed).where(Feed.url == feed_data.url))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="订阅源已存在")

    feed = Feed(**feed_data.model_dump())
    db.add(feed)
    await db.commit()
    await db.refresh(feed)
    return feed


@router.get("/{feed_id}", response_model=FeedResponse)
async def get_feed(feed_id: int, db: AsyncSession = Depends(get_db)):
    """获取单个订阅源"""
    result = await db.execute(select(Feed).where(Feed.id == feed_id))
    feed = result.scalar_one_or_none()
    if not feed:
        raise HTTPException(status_code=404, detail="订阅源不存在")
    return feed


@router.patch("/{feed_id}", response_model=FeedResponse)
async def update_feed(feed_id: int, feed_data: FeedUpdate, db: AsyncSession = Depends(get_db)):
    """更新订阅源"""
    result = await db.execute(select(Feed).where(Feed.id == feed_id))
    feed = result.scalar_one_or_none()
    if not feed:
        raise HTTPException(status_code=404, detail="订阅源不存在")

    update_data = feed_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(feed, key, value)

    await db.commit()
    await db.refresh(feed)
    return feed


@router.delete("/{feed_id}", status_code=204)
async def delete_feed(feed_id: int, db: AsyncSession = Depends(get_db)):
    """删除订阅源（软删除）"""
    result = await db.execute(select(Feed).where(Feed.id == feed_id))
    feed = result.scalar_one_or_none()
    if not feed:
        raise HTTPException(status_code=404, detail="订阅源不存在")

    feed.is_active = False
    await db.commit()


# ==================== Feed Items ====================

@router.get("/{feed_id}/items", response_model=list[FeedItemResponse])
async def list_feed_items(
    feed_id: int,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """列出订阅源的内容"""
    # 验证 feed 是否存在
    feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
    if not feed_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="订阅源不存在")

    result = await db.execute(
        select(FeedItem)
        .where(FeedItem.feed_id == feed_id)
        .order_by(FeedItem.published_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = result.scalars().all()
    return items


@router.get("/{feed_id}/items/{item_id}", response_model=FeedItemDetailResponse)
async def get_feed_item(feed_id: int, item_id: int, db: AsyncSession = Depends(get_db)):
    """获取内容详情"""
    # 验证 feed 是否存在
    feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
    if not feed_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="订阅源不存在")

    result = await db.execute(
        select(FeedItem)
        .options(selectinload(FeedItem.feed))
        .where(FeedItem.id == item_id, FeedItem.feed_id == feed_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="内容不存在")
    return item


@router.patch("/{feed_id}/items/{item_id}", response_model=FeedItemDetailResponse)
async def update_feed_item(
    feed_id: int,
    item_id: int,
    item_data: FeedItemUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新内容（标签、笔记、阅读状态）"""
    result = await db.execute(
        select(FeedItem)
        .options(selectinload(FeedItem.feed))
        .where(FeedItem.id == item_id, FeedItem.feed_id == feed_id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="内容不存在")

    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    await db.commit()
    await db.refresh(item)
    return item


@router.post("/{feed_id}/items/mark-all-read")
async def mark_all_items_read(
    feed_id: int,
    db: AsyncSession = Depends(get_db)
):
    """将订阅源的所有内容标记为已读"""
    # 验证 feed 是否存在
    feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
    if not feed_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="订阅源不存在")

    result = await db.execute(
        select(FeedItem).where(FeedItem.feed_id == feed_id, FeedItem.is_read == False)
    )
    items = result.scalars().all()

    for item in items:
        item.is_read = True

    await db.commit()
    return {"status": "ok", "updated": len(items)}


# ==================== OPML Import/Export ====================

@router.get("/opml/export")
async def export_opml(db: AsyncSession = Depends(get_db)):
    """导出所有订阅源为 OPML 格式"""
    result = await db.execute(select(Feed).where(Feed.is_active == True))
    feeds = result.scalars().all()

    feed_dicts = [
        {"name": feed.name, "url": feed.url, "description": feed.description or ""}
        for feed in feeds
    ]

    opml_content = feeds_to_opml(feed_dicts, "阅川订阅源")
    return {
        "content": opml_content,
        "filename": "yuechuan_feeds.opml"
    }


@router.post("/opml/import")
async def import_opml(
    content: str,
    db: AsyncSession = Depends(get_db)
):
    """导入 OPML 格式的订阅源"""
    try:
        feeds = parse_opml(content)
        imported = 0
        skipped = 0

        for feed_data in feeds:
            # 检查是否已存在
            result = await db.execute(select(Feed).where(Feed.url == feed_data["url"]))
            existing = result.scalar_one_or_none()
            if existing:
                skipped += 1
                continue

            # 创建新订阅源
            # 注意：OPML 通常不包含 feed_type，需要根据 URL 推断或默认
            feed = Feed(
                name=feed_data["name"],
                url=feed_data["url"],
                feed_type="wechat",  # 默认值
                description=feed_data.get("description", "")
            )
            db.add(feed)
            imported += 1

        await db.commit()
        return {
            "status": "ok",
            "imported": imported,
            "skipped": skipped,
            "message": f"成功导入 {imported} 个订阅源，跳过 {skipped} 个已存在的"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OPML 解析失败: {str(e)}")
