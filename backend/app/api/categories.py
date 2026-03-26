"""
自定义分类 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import async_session
from app.models.category import FeedCategory, CategoryFeed

router = APIRouter(prefix="/categories", tags=["categories"])


class CategoryCreate(BaseModel):
    name: str
    icon: str | None = None
    color: str | None = None
    sort_order: int = 0


class CategoryResponse(BaseModel):
    id: int
    name: str
    icon: str | None
    color: str | None
    sort_order: int
    is_default: bool
    feed_count: int = 0


class CategoryWithFeeds(CategoryResponse):
    feeds: list


@router.get("", response_model=list[CategoryResponse])
async def list_categories():
    """获取所有分类"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedCategory)
            .options(selectinload(FeedCategory.feeds))
            .order_by(FeedCategory.sort_order)
        )
        categories = result.scalars().all()

        return [
            CategoryResponse(
                id=c.id,
                name=c.name,
                icon=c.icon,
                color=c.color,
                sort_order=c.sort_order,
                is_default=c.is_default,
                feed_count=len(c.feeds)
            )
            for c in categories
        ]


@router.post("", response_model=CategoryResponse)
async def create_category(data: CategoryCreate):
    """创建新分类"""
    async with async_session() as db:
        category = FeedCategory(
            name=data.name,
            icon=data.icon,
            color=data.color,
            sort_order=data.sort_order
        )
        db.add(category)
        await db.commit()
        await db.refresh(category)

        return CategoryResponse(
            id=category.id,
            name=category.name,
            icon=category.icon,
            color=category.color,
            sort_order=category.sort_order,
            is_default=category.is_default,
            feed_count=0
        )


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, data: CategoryCreate):
    """更新分类"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedCategory).where(FeedCategory.id == category_id)
        )
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="分类不存在")

        category.name = data.name
        if data.icon is not None:
            category.icon = data.icon
        if data.color is not None:
            category.color = data.color
        category.sort_order = data.sort_order

        await db.commit()
        await db.refresh(category)

        return CategoryResponse(
            id=category.id,
            name=category.name,
            icon=category.icon,
            color=category.color,
            sort_order=category.sort_order,
            is_default=category.is_default,
            feed_count=0
        )


@router.delete("/{category_id}")
async def delete_category(category_id: int):
    """删除分类"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedCategory).where(FeedCategory.id == category_id)
        )
        category = result.scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="分类不存在")

        if category.is_default:
            raise HTTPException(status_code=400, detail="默认分类不能删除")

        await db.delete(category)
        await db.commit()

        return {"success": True}


@router.post("/{category_id}/feeds/{feed_id}")
async def add_feed_to_category(category_id: int, feed_id: int):
    """将订阅源添加到分类"""
    async with async_session() as db:
        # 检查分类是否存在
        cat_result = await db.execute(
            select(FeedCategory).where(FeedCategory.id == category_id)
        )
        if not cat_result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="分类不存在")

        # 检查是否已关联
        existing = await db.execute(
            select(CategoryFeed).where(
                CategoryFeed.category_id == category_id,
                CategoryFeed.feed_id == feed_id
            )
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="订阅源已在该分类中")

        link = CategoryFeed(category_id=category_id, feed_id=feed_id)
        db.add(link)
        await db.commit()

        return {"success": True}


@router.delete("/{category_id}/feeds/{feed_id}")
async def remove_feed_from_category(category_id: int, feed_id: int):
    """从分类移除订阅源"""
    async with async_session() as db:
        result = await db.execute(
            select(CategoryFeed).where(
                CategoryFeed.category_id == category_id,
                CategoryFeed.feed_id == feed_id
            )
        )
        link = result.scalar_one_or_none()

        if not link:
            raise HTTPException(status_code=404, detail="关联不存在")

        await db.delete(link)
        await db.commit()

        return {"success": True}
