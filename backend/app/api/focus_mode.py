"""
专注模式 API
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session

router = APIRouter(prefix="/focus-mode", tags=["focus-mode"])


class FocusModeSettings(BaseModel):
    enabled: bool = False
    hide_sidebar: bool = True
    hide_notifications: bool = True
    dim_others: bool = True
    font_size: int = 18
    line_height: float = 1.8
    font_family: str = "system-ui"
    auto_timer_minutes: int = 0  # 0 = 不自动开启


class FocusSession(BaseModel):
    started_at: str
    duration_minutes: int
    item_id: int | None
    paused: bool = False


focus_sessions = {}  # 简化实现，实际应存储到数据库


@router.get("/settings", response_model=FocusModeSettings)
async def get_focus_settings():
    """获取专注模式设置"""
    return FocusModeSettings()


@router.put("/settings")
async def update_focus_settings(settings: FocusModeSettings):
    """更新专注模式设置"""
    return {"success": True}


@router.post("/session/start")
async def start_focus_session(item_id: int | None = None, duration_minutes: int = 30):
    """开始专注阅读"""
    session_id = len(focus_sessions) + 1
    session = FocusSession(
        started_at=datetime.utcnow().isoformat(),
        duration_minutes=duration_minutes,
        item_id=item_id
    )
    focus_sessions[session_id] = session

    return {"session_id": session_id, "started_at": session.started_at}


@router.post("/session/{session_id}/end")
async def end_focus_session(session_id: int):
    """结束专注会话"""
    if session_id not in focus_sessions:
        raise HTTPException(status_code=404, detail="会话不存在")

    session = focus_sessions[session_id]
    elapsed = (datetime.utcnow() - datetime.fromisoformat(session.started_at)).seconds // 60

    del focus_sessions[session_id]

    return {"success": True, "elapsed_minutes": elapsed}


@router.post("/session/{session_id}/pause")
async def pause_focus_session(session_id: int):
    """暂停专注会话"""
    if session_id not in focus_sessions:
        raise HTTPException(status_code=404, detail="会话不存在")

    focus_sessions[session_id].paused = not focus_sessions[session_id].paused

    return {"success": True, "paused": focus_sessions[session_id].paused}
