"""
RSS 解析规则 API - 自定义解析规则
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session

router = APIRouter(prefix="/parser-rules", tags=["parser"])


class ParserRule(BaseModel):
    feed_type: str  # 自定义类型
    title_selector: str | None = None  # CSS 选择器
    content_selector: str | None = None
    author_selector: str | None = None
    date_selector: str | None = None
    date_format: str | None = None  # 日期格式
    remove_selectors: str | None = None  # 要移除的元素


PRESET_RULES = {
    "zhihu": {
        "feed_type": "zhihu",
        "title_selector": ".Post-Title",
        "content_selector": ".Post-RichText",
        "author_selector": ".AuthorInfo-name",
        "date_format": "%Y-%m-%d %H:%M:%S"
    },
    "juejin": {
        "feed_type": "juejin",
        "title_selector": ".article-title",
        "content_selector": ".article-content",
        "author_selector": ".author-name",
        "date_format": "%Y-%m-%d %H:%M:%S"
    }
}


@router.get("/presets")
async def get_parser_presets():
    """获取预设解析规则"""
    return PRESET_RULES


@router.get("/{feed_type}")
async def get_parser_rule(feed_type: str):
    """获取指定类型的解析规则"""
    if feed_type in PRESET_RULES:
        return PRESET_RULES[feed_type]

    # TODO: 从数据库获取用户自定义规则
    return {"error": "Rule not found"}


@router.post("/test")
async def test_parser_rule(feed_url: str, rule: ParserRule):
    """测试解析规则"""
    # TODO: 实际抓取并测试规则
    return {
        "success": True,
        "message": "Rule test not implemented",
        "sample": {
            "title": "Sample Title",
            "content": "Sample content...",
            "author": "Author Name"
        }
    }
