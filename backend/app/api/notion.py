"""
Notion 导出 API - 将阅读内容导出到 Notion
"""
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.feed import FeedItem, Feed
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

router = APIRouter(prefix="/notion", tags=["Notion导出"])

class NotionConfig(BaseModel):
    api_key: str
    database_id: str

class NotionExportRequest(BaseModel):
    item_id: int
    include_notes: bool = True
    include_tags: bool = True

# Notion API 配置（用户需在设置中配置）
_notion_config: Optional[NotionConfig] = None

def set_notion_config(config: NotionConfig):
    global _notion_config
    _notion_config = config

def get_notion_config() -> NotionConfig:
    if not _notion_config:
        raise HTTPException(status_code=400, detail="请先在设置中配置 Notion API")
    return _notion_config

@router.post("/export")
async def export_to_notion(
    request: NotionExportRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    将文章导出到 Notion 数据库

    - **item_id**: 要导出的文章 ID
    - **include_notes**: 是否包含笔记
    - **include_tags**: 是否包含标签
    """
    config = get_notion_config()

    # 获取文章内容
    result = await db.execute(
        select(FeedItem).where(FeedItem.id == request.item_id)
    )
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 获取订阅源信息
    feed_result = await db.execute(
        select(Feed).where(Feed.id == item.feed_id)
    )
    feed = feed_result.scalar_one_or_none()

    # 构建 Notion 页面属性
    headers = {
        "Authorization": f"Bearer {config.api_key}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }

    # 构建页面内容
    properties = {
        "标题": {
            "title": [
                {"text": {"content": item.title[:2000]}}
            ]
        },
        "来源": {
            "rich_text": [
                {"text": {"content": feed.name if feed else "未知来源"}}
            ]
        },
        "链接": {
            "url": item.url or ""
        },
        "发布日期": {
            "date": {"start": item.published_at.isoformat() if item.published_at else None}
        }
    }

    # 添加标签
    if request.include_tags and item.tags:
        properties["标签"] = {
            "multi_select": [
                {"name": tag.strip()} for tag in item.tags.split(",") if tag.strip()
            ]
        }

    # 构建页面内容块
    children = []

    # 摘要/描述
    if item.ai_summary:
        children.append({
            "object": "block",
            "type": "heading_2",
            "heading_2": {
                "rich_text": [{"text": {"content": "摘要"}}]
            }
        })
        children.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"text": {"content": item.summary[:2000]}}]
            }
        })

    # 笔记
    if request.include_notes and item.notes:
        children.append({
            "object": "block",
            "type": "heading_2",
            "heading_2": {
                "rich_text": [{"text": {"content": "笔记"}}]
            }
        })
        children.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"text": {"content": item.notes[:5000]}}]
            }
        })

    # 内容链接
    if item.url:
        children.append({
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [
                    {"text": {"content": "原文链接: ", "link": None}},
                    {"text": {"content": item.url, "link": {"url": item.url}}}
                ]
            }
        })

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 创建 Notion 页面
            response = await client.post(
                "https://api.notion.com/v1/pages",
                headers=headers,
                json={
                    "parent": {"database_id": config.database_id},
                    "properties": properties,
                    "children": children[:100]  # Notion 限制每次最多 100 个块
                }
            )

            if response.status_code != 200:
                error_detail = response.json()
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Notion API 错误: {error_detail.get('message', '未知错误')}"
                )

            result_data = response.json()

            return {
                "success": True,
                "notion_url": result_data.get("url"),
                "page_id": result_data.get("id")
            }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"导出失败: {str(e)}")

@router.post("/test")
async def test_notion_connection(config: NotionConfig):
    """测试 Notion API 连接"""
    headers = {
        "Authorization": f"Bearer {config.api_key}",
        "Notion-Version": "2022-06-28"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                "https://api.notion.com/v1/users/me",
                headers=headers
            )

            if response.status_code == 200:
                user_data = response.json()
                return {
                    "success": True,
                    "user": user_data.get("name", "Unknown"),
                    "avatar": user_data.get("avatar_url")
                }
            else:
                return {
                    "success": False,
                    "error": "API 密钥无效或已过期"
                }

    except Exception as e:
        return {"success": False, "error": str(e)}
