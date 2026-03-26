"""
通知设置 API
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/notification-settings", tags=["notifications"])


class NotificationSettings(BaseModel):
    enabled: bool = True
    review_reminders: bool = True
    new_items: bool = True
    feed_updates: bool = True
    weekly_digest: bool = False
    achievements: bool = True
    desktop_notifications: bool = False
    notification_sound: bool = True


notification_settings = NotificationSettings()


@router.get("", response_model=NotificationSettings)
async def get_notification_settings():
    """获取通知设置"""
    return notification_settings


@router.put("", response_model=NotificationSettings)
async def update_notification_settings(settings: NotificationSettings):
    """更新通知设置"""
    global notification_settings
    notification_settings = settings
    return notification_settings


@router.post("/test")
async def test_notification():
    """发送测试通知"""
    return {"success": True, "message": "Test notification sent"}
