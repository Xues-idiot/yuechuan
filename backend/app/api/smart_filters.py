"""
智能过滤 API
"""
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.smart_filter import SmartFilter

router = APIRouter(prefix="/smart-filters", tags=["smart-filters"])


class SmartFilterCreate(BaseModel):
    name: str
    filter_type: str
    config: dict
    is_active: bool = True


class SmartFilterResponse(BaseModel):
    id: int
    name: str
    filter_type: str
    config: dict
    is_active: bool
    created_at: str


@router.get("", response_model=list[SmartFilterResponse])
async def list_smart_filters():
    """获取所有智能过滤器"""
    async with async_session() as db:
        result = await db.execute(
            select(SmartFilter)
            .where(SmartFilter.user_id == 1)
            .order_by(SmartFilter.created_at.desc())
        )
        filters = result.scalars().all()

        return [
            SmartFilterResponse(
                id=f.id,
                name=f.name,
                filter_type=f.filter_type,
                config=json.loads(f.config) if f.config else {},
                is_active=f.is_active,
                created_at=f.created_at.isoformat()
            )
            for f in filters
        ]


@router.post("", response_model=SmartFilterResponse)
async def create_smart_filter(data: SmartFilterCreate):
    """创建智能过滤器"""
    async with async_session() as db:
        filter_record = SmartFilter(
            user_id=1,
            name=data.name,
            filter_type=data.filter_type,
            config=json.dumps(data.config),
            is_active=data.is_active
        )
        db.add(filter_record)
        await db.commit()
        await db.refresh(filter_record)

        return SmartFilterResponse(
            id=filter_record.id,
            name=filter_record.name,
            filter_type=filter_record.filter_type,
            config=data.config,
            is_active=filter_record.is_active,
            created_at=filter_record.created_at.isoformat()
        )


@router.put("/{filter_id}", response_model=SmartFilterResponse)
async def update_smart_filter(filter_id: int, data: SmartFilterCreate):
    """更新智能过滤器"""
    async with async_session() as db:
        result = await db.execute(
            select(SmartFilter).where(SmartFilter.id == filter_id)
        )
        filter_record = result.scalar_one_or_none()

        if not filter_record:
            raise HTTPException(status_code=404, detail="过滤器不存在")

        filter_record.name = data.name
        filter_record.filter_type = data.filter_type
        filter_record.config = json.dumps(data.config)
        filter_record.is_active = data.is_active

        await db.commit()
        await db.refresh(filter_record)

        return SmartFilterResponse(
            id=filter_record.id,
            name=filter_record.name,
            filter_type=filter_record.filter_type,
            config=json.loads(filter_record.config),
            is_active=filter_record.is_active,
            created_at=filter_record.created_at.isoformat()
        )


@router.delete("/{filter_id}")
async def delete_smart_filter(filter_id: int):
    """删除智能过滤器"""
    async with async_session() as db:
        result = await db.execute(
            select(SmartFilter).where(SmartFilter.id == filter_id)
        )
        filter_record = result.scalar_one_or_none()

        if not filter_record:
            raise HTTPException(status_code=404, detail="过滤器不存在")

        await db.delete(filter_record)
        await db.commit()

        return {"success": True}


@router.post("/toggle/{filter_id}")
async def toggle_smart_filter(filter_id: int):
    """切换过滤器状态"""
    async with async_session() as db:
        result = await db.execute(
            select(SmartFilter).where(SmartFilter.id == filter_id)
        )
        filter_record = result.scalar_one_or_none()

        if not filter_record:
            raise HTTPException(status_code=404, detail="过滤器不存在")

        filter_record.is_active = not filter_record.is_active

        await db.commit()

        return {"success": True, "is_active": filter_record.is_active}
