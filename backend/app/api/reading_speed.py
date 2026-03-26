"""
阅读速度 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.reading_speed import ReadingSpeedLog

router = APIRouter(prefix="/reading-speed", tags=["reading-speed"])


class SpeedLogCreate(BaseModel):
    item_id: int
    reading_time_seconds: int
    content_length: int
    completed: bool = False


class SpeedStats(BaseModel):
    total_sessions: int
    total_time_minutes: int
    avg_speed_wpm: float
    total_items_read: int
    completed_items: int


@router.post("/log")
async def log_reading_speed(data: SpeedLogCreate):
    """记录阅读速度"""
    async with async_session() as db:
        # 计算 WPM (word per minute)
        # 假设中文每字符为1词，英文每词为1词
        content_length = data.content_length
        reading_time_minutes = data.reading_time_seconds / 60

        if reading_time_minutes > 0:
            speed_wpm = content_length / reading_time_minutes
        else:
            speed_wpm = 0

        log = ReadingSpeedLog(
            item_id=data.item_id,
            reading_time_seconds=data.reading_time_seconds,
            content_length=content_length,
            speed_wpm=speed_wpm,
            completed=data.completed
        )
        db.add(log)
        await db.commit()

        return {"success": True, "speed_wpm": round(speed_wpm, 1)}


@router.get("/stats", response_model=SpeedStats)
async def get_speed_stats():
    """获取阅读速度统计"""
    async with async_session() as db:
        # 总阅读次数
        count_result = await db.execute(select(func.count(ReadingSpeedLog.id)))
        total_sessions = count_result.scalar() or 0

        # 总阅读时间
        time_result = await db.execute(select(func.sum(ReadingSpeedLog.reading_time_seconds)))
        total_seconds = time_result.scalar() or 0
        total_time_minutes = int(total_seconds / 60)

        # 平均速度
        avg_result = await db.execute(select(func.avg(ReadingSpeedLog.speed_wpm)))
        avg_speed = avg_result.scalar() or 0

        # 完成的项目数
        completed_result = await db.execute(
            select(func.count(ReadingSpeedLog.id)).where(ReadingSpeedLog.completed == True)
        )
        completed_items = completed_result.scalar() or 0

        # 阅读过的项目数（去重）
        items_result = await db.execute(
            select(func.count(func.distinct(ReadingSpeedLog.item_id)))
        )
        total_items = items_result.scalar() or 0

        return SpeedStats(
            total_sessions=total_sessions,
            total_time_minutes=total_time_minutes,
            avg_speed_wpm=round(avg_speed, 1),
            total_items_read=total_items,
            completed_items=completed_items
        )


@router.get("/history")
async def get_speed_history(limit: int = 20):
    """获取阅读速度历史"""
    async with async_session() as db:
        result = await db.execute(
            select(ReadingSpeedLog)
            .order_by(ReadingSpeedLog.created_at.desc())
            .limit(limit)
        )
        logs = result.scalars().all()

        return [
            {
                "id": log.id,
                "item_id": log.item_id,
                "reading_time_seconds": log.reading_time_seconds,
                "content_length": log.content_length,
                "speed_wpm": round(log.speed_wpm, 1),
                "completed": log.completed,
                "created_at": log.created_at.isoformat()
            }
            for log in logs
        ]
