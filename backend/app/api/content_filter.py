"""
内容过滤 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, or_, and_
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/content-filter", tags=["content-filter"])


class FilterRule(BaseModel):
    field: str  # title, content, author, tags
    operator: str  # contains, not_contains, equals, starts_with
    value: str
    action: str  # include, exclude


class FilterPreset(BaseModel):
    name: str
    rules: list[FilterRule]


@router.get("/presets")
async def get_filter_presets():
    """获取预设过滤器"""
    return [
        {
            "name": "只看科技",
            "rules": [
                {"field": "tags", "operator": "contains", "value": "tech,科技,技术", "action": "include"}
            ]
        },
        {
            "name": "排除已读",
            "rules": [
                {"field": "is_read", "operator": "equals", "value": "false", "action": "include"}
            ]
        },
        {
            "name": "只看收藏",
            "rules": [
                {"field": "is_starred", "operator": "equals", "value": "true", "action": "include"}
            ]
        }
    ]


@router.post("/apply")
async def apply_filter(preset: FilterPreset):
    """应用过滤器"""
    async with async_session() as db:
        query = select(FeedItem)

        for rule in preset.rules:
            if rule.field == "is_read":
                val = rule.value == "true"
                if rule.operator == "equals":
                    query = query.where(FeedItem.is_read == val)
            elif rule.field == "is_starred":
                val = rule.value == "true"
                if rule.operator == "equals":
                    query = query.where(FeedItem.is_starred == val)
            elif rule.field == "title":
                if rule.operator == "contains":
                    query = query.where(FeedItem.title.ilike(f"%{rule.value}%"))
            elif rule.field == "tags":
                if rule.operator == "contains":
                    query = query.where(FeedItem.tags.ilike(f"%{rule.value}%"))

        result = await db.execute(query.limit(100))
        items = result.scalars().all()

        return {
            "count": len(items),
            "items": [
                {"id": i.id, "title": i.title, "url": i.url, "is_read": i.is_read}
                for i in items
            ]
        }
