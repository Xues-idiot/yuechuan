"""
Pocket/Instapaper 集成 API
"""
import httpx
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed import FeedItem
from app.core.config import settings

router = APIRouter(prefix="/integrations/pocket", tags=["integrations"])


class PocketSettings(BaseModel):
    enabled: bool
    access_token: str | None = None
    username: str | None = None


@router.get("/settings", response_model=PocketSettings)
async def get_pocket_settings():
    """获取 Pocket 设置"""
    # 简化实现，实际应从数据库或缓存读取
    return PocketSettings(
        enabled=False,
        access_token=None,
        username=None
    )


@router.post("/connect")
async def connect_pocket(api_key: str, access_token: str):
    """连接 Pocket 账号"""
    async with async_session() as db:
        try:
            async with httpx.AsyncClient() as client:
                # 验证 access token
                response = await client.post(
                    "https://getpocket.com/v3/get",
                    json={
                        "consumer_key": api_key,
                        "access_token": access_token,
                        "count": 1
                    },
                    headers={"Content-Type": "application/json"}
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="Pocket 认证失败")

                # 保存设置到本地
                # 实际应加密存储 access_token
                return {"success": True, "username": "connected"}

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.post("/add/{item_id}")
async def add_to_pocket(item_id: int, api_key: str, access_token: str):
    """将文章添加到 Pocket"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem).where(FeedItem.id == item_id)
        )
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="文章不存在")

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://getpocket.com/v3/add",
                    json={
                        "consumer_key": api_key,
                        "access_token": access_token,
                        "url": item.url,
                        "title": item.title
                    },
                    headers={"Content-Type": "application/json"}
                )

                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="添加到 Pocket 失败")

                return {"success": True}

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/items")
async def get_pocket_items(api_key: str, access_token: str, limit: int = 20):
    """从 Pocket 获取已保存文章"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://getpocket.com/v3/get",
                json={
                    "consumer_key": api_key,
                    "access_token": access_token,
                    "count": limit,
                    "detailType": "simple"
                },
                headers={"Content-Type": "application/json"}
            )

            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="获取 Pocket 文章失败")

            data = response.json()
            items = data.get("list", [])

            return {
                "items": [
                    {
                        "id": v.get("item_id"),
                        "title": v.get("resolved_title", v.get("given_title")),
                        "url": v.get("resolved_url", v.get("given_url")),
                        "excerpt": v.get("excerpt"),
                        "status": v.get("status")
                    }
                    for v in items.values()
                ]
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
