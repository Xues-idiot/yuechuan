"""
阅读模式设置 API - 自定义阅读体验
"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.core.database import async_session
from sqlalchemy import select

router = APIRouter(prefix="/reading-mode", tags=["reading-mode"])

# 存储用户设置（简化实现）
reading_mode_settings = {
    "font_size": 18,
    "line_height": 1.8,
    "font_family": "system-ui",
    "theme": "light",  # light, dark, sepia
    "width": "normal",  # narrow, normal, wide, full
    "auto_mark_read": True,
    "show_images": True,
    "text_align": "left"  # left, justify
}


class ReadingModeSettings(BaseModel):
    font_size: int
    line_height: float
    font_family: str
    theme: str
    width: str
    auto_mark_read: bool
    show_images: bool
    text_align: str


@router.get("/settings", response_model=ReadingModeSettings)
async def get_reading_mode_settings():
    """获取阅读模式设置"""
    return reading_mode_settings


@router.put("/settings")
async def update_reading_mode_settings(settings: ReadingModeSettings):
    """更新阅读模式设置"""
    global reading_mode_settings
    reading_mode_settings = settings.model_dump()
    return {"success": True}


@router.get("/preview")
async def get_reading_mode_preview():
    """获取阅读模式预览配置"""
    return {
        "fonts": [
            {"value": "system-ui", "label": "系统默认"},
            {"value": "Georgia", "label": "Georgia"},
            {"value": "Merriweather", "label": "Merriweather"},
            {"value": "Palatino", "label": "Palatino"},
            {"value": "Helvetica Neue", "label": "Helvetica Neue"}
        ],
        "themes": [
            {"value": "light", "label": "浅色", "bg": "#ffffff", "text": "#333333"},
            {"value": "dark", "label": "深色", "bg": "#1a1a1a", "text": "#e0e0e0"},
            {"value": "sepia", "label": "护眼", "bg": "#f4ecd8", "text": "#5b4636"}
        ],
        "sizes": [14, 16, 18, 20, 22, 24],
        "line_heights": [1.4, 1.6, 1.8, 2.0, 2.2],
        "widths": [
            {"value": "narrow", "label": "窄", "max_width": "600px"},
            {"value": "normal", "label": "正常", "max_width": "720px"},
            {"value": "wide", "label": "宽", "max_width": "900px"},
            {"value": "full", "label": "全宽", "max_width": "100%"}
        ]
    }
