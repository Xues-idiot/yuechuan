"""
阅读提醒 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.reading_reminder import ReadingReminder

router = APIRouter(prefix="/reminders", tags=["reminders"])


class ReminderCreate(BaseModel):
    reminder_type: str
    time: str
    days_of_week: str | None = None
    enabled: bool = True
    message: str | None = None


class ReminderResponse(BaseModel):
    id: int
    reminder_type: str
    time: str
    days_of_week: str | None
    enabled: bool
    message: str | None
    last_sent_at: str | None


@router.get("", response_model=list[ReminderResponse])
async def list_reminders():
    """获取所有提醒设置"""
    async with async_session() as db:
        result = await db.execute(
            select(ReadingReminder)
            .where(ReadingReminder.user_id == 1)
            .order_by(ReadingReminder.created_at)
        )
        reminders = result.scalars().all()

        return [
            ReminderResponse(
                id=r.id,
                reminder_type=r.reminder_type,
                time=r.time,
                days_of_week=r.days_of_week,
                enabled=r.enabled,
                message=r.message,
                last_sent_at=r.last_sent_at.isoformat() if r.last_sent_at else None
            )
            for r in reminders
        ]


@router.post("", response_model=ReminderResponse)
async def create_reminder(data: ReminderCreate):
    """创建提醒"""
    async with async_session() as db:
        reminder = ReadingReminder(
            user_id=1,
            reminder_type=data.reminder_type,
            time=data.time,
            days_of_week=data.days_of_week,
            enabled=data.enabled,
            message=data.message
        )
        db.add(reminder)
        await db.commit()
        await db.refresh(reminder)

        return ReminderResponse(
            id=reminder.id,
            reminder_type=reminder.reminder_type,
            time=reminder.time,
            days_of_week=reminder.days_of_week,
            enabled=reminder.enabled,
            message=reminder.message,
            last_sent_at=None
        )


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(reminder_id: int, data: ReminderCreate):
    """更新提醒"""
    async with async_session() as db:
        result = await db.execute(
            select(ReadingReminder).where(ReadingReminder.id == reminder_id)
        )
        reminder = result.scalar_one_or_none()

        if not reminder:
            raise HTTPException(status_code=404, detail="提醒不存在")

        reminder.reminder_type = data.reminder_type
        reminder.time = data.time
        reminder.days_of_week = data.days_of_week
        reminder.enabled = data.enabled
        reminder.message = data.message

        await db.commit()
        await db.refresh(reminder)

        return ReminderResponse(
            id=reminder.id,
            reminder_type=reminder.reminder_type,
            time=reminder.time,
            days_of_week=reminder.days_of_week,
            enabled=reminder.enabled,
            message=reminder.message,
            last_sent_at=reminder.last_sent_at.isoformat() if reminder.last_sent_at else None
        )


@router.delete("/{reminder_id}")
async def delete_reminder(reminder_id: int):
    """删除提醒"""
    async with async_session() as db:
        result = await db.execute(
            select(ReadingReminder).where(ReadingReminder.id == reminder_id)
        )
        reminder = result.scalar_one_or_none()

        if not reminder:
            raise HTTPException(status_code=404, detail="提醒不存在")

        await db.delete(reminder)
        await db.commit()

        return {"success": True}
