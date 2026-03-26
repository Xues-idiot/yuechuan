"""
API Key 管理 API
"""
import secrets
import hashlib
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.api_key import ApiKey

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


class ApiKeyCreate(BaseModel):
    name: str
    permissions: list[str] | None = None
    expires_in_days: int | None = None


class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key_prefix: str  # 显示前几位
    permissions: list | None
    last_used_at: str | None
    expires_at: str | None
    is_active: bool
    created_at: str


def hash_key(key: str) -> str:
    """Hash API key for storage"""
    return hashlib.sha256(key.encode()).hexdigest()


@router.get("", response_model=list[ApiKeyResponse])
async def list_api_keys():
    """获取所有 API Keys"""
    async with async_session() as db:
        result = await db.execute(
            select(ApiKey)
            .where(ApiKey.user_id == 1)
            .order_by(ApiKey.created_at.desc())
        )
        keys = result.scalars().all()

        return [
            ApiKeyResponse(
                id=k.id,
                name=k.name,
                key_prefix=k.key_hash[:8] + "...",
                permissions=json.loads(k.permissions) if k.permissions else None,
                last_used_at=k.last_used_at.isoformat() if k.last_used_at else None,
                expires_at=k.expires_at.isoformat() if k.expires_at else None,
                is_active=k.is_active,
                created_at=k.created_at.isoformat()
            )
            for k in keys
        ]


@router.post("")
async def create_api_key(data: ApiKeyCreate):
    """创建新的 API Key"""
    async with async_session() as db:
        # 生成随机 key
        raw_key = f"yuechuan_{secrets.token_urlsafe(32)}"
        key_hash = hash_key(raw_key)

        expires_at = None
        if data.expires_in_days:
            from datetime import timedelta
            expires_at = datetime.utcnow() + timedelta(days=data.expires_in_days)

        api_key = ApiKey(
            user_id=1,
            name=data.name,
            key_hash=key_hash,
            permissions=json.dumps(data.permissions) if data.permissions else None,
            expires_at=expires_at,
            is_active=True
        )
        db.add(api_key)
        await db.commit()
        await db.refresh(api_key)

        return {
            "id": api_key.id,
            "name": api_key.name,
            "key": raw_key,  # 只在创建时返回完整 key
            "key_prefix": key_hash[:8] + "...",
            "permissions": data.permissions,
            "expires_at": expires_at.isoformat() if expires_at else None,
            "created_at": api_key.created_at.isoformat()
        }


@router.delete("/{key_id}")
async def delete_api_key(key_id: int):
    """删除 API Key"""
    async with async_session() as db:
        result = await db.execute(
            select(ApiKey).where(ApiKey.id == key_id)
        )
        api_key = result.scalar_one_or_none()

        if not api_key:
            raise HTTPException(status_code=404, detail="API Key 不存在")

        await db.delete(api_key)
        await db.commit()

        return {"success": True}
