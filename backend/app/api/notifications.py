"""
通知系统 API - 推送通知和提醒
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime, timedelta
from enum import Enum

router = APIRouter(prefix="/notifications", tags=["通知"])

class NotificationType(str, Enum):
    NEW_CONTENT = "new_content"       # 新内容
    REVIEW_REMINDER = "review_reminder"  # 复习提醒
    GOAL_ACHIEVED = "goal_achieved"    # 目标达成
    SYSTEM = "system"                 # 系统通知

class Notification(BaseModel):
    id: str
    type: NotificationType
    title: str
    body: str
    url: Optional[str] = None
    read: bool = False
    created_at: datetime

class NotificationSettings(BaseModel):
    enabled: bool = True
    new_content: bool = True
    review_reminder: bool = True
    goal_achieved: bool = True
    quiet_hours_start: Optional[str] = None  # "22:00"
    quiet_hours_end: Optional[str] = None    # "08:00"

# 内存存储（生产环境使用数据库）
_notification_settings: NotificationSettings = NotificationSettings()
_notifications: list[Notification] = []

@router.get("", response_model=list[Notification])
async def get_notifications(
    unread_only: bool = False,
    limit: int = 20
):
    """获取通知列表"""
    notifs = _notifications
    if unread_only:
        notifs = [n for n in notifs if not n.read]
    return notifs[-limit:][::-1]  # 最新的在前

@router.post("/mark-read/{notification_id}")
async def mark_as_read(notification_id: str):
    """标记通知为已读"""
    for notif in _notifications:
        if notif.id == notification_id:
            notif.read = True
            return {"success": True}
    raise HTTPException(status_code=404, detail="通知不存在")

@router.post("/mark-all-read")
async def mark_all_as_read():
    """标记所有通知为已读"""
    for notif in _notifications:
        notif.read = True
    return {"success": True, "count": len(_notifications)}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    """删除通知"""
    global _notifications
    _notifications = [n for n in _notifications if n.id != notification_id]
    return {"success": True}

@router.get("/settings", response_model=NotificationSettings)
async def get_notification_settings():
    """获取通知设置"""
    return _notification_settings

@router.put("/settings", response_model=NotificationSettings)
async def update_notification_settings(settings: NotificationSettings):
    """更新通知设置"""
    global _notification_settings
    _notification_settings = settings
    return _notification_settings

@router.post("/test")
async def send_test_notification():
    """发送测试通知"""
    from uuid import uuid4
    test_notif = Notification(
        id=str(uuid4()),
        type=NotificationType.SYSTEM,
        title="测试通知",
        body="这是一条测试通知，用于验证通知功能是否正常。",
        created_at=datetime.utcnow()
    )
    _notifications.append(test_notif)
    return {"success": True, "notification": test_notif}

def create_notification(
    notif_type: NotificationType,
    title: str,
    body: str,
    url: Optional[str] = None
) -> Notification:
    """创建通知的辅助函数"""
    from uuid import uuid4
    notif = Notification(
        id=str(uuid4()),
        type=notif_type,
        title=title,
        body=body,
        url=url,
        created_at=datetime.utcnow()
    )
    _notifications.append(notif)

    # 保持通知数量限制
    global _notifications
    if len(_notifications) > 100:
        _notifications = _notifications[-50:]

    return notif

async def notify_new_content(feed_name: str, count: int):
    """通知新内容"""
    create_notification(
        NotificationType.NEW_CONTENT,
        "📥 新内容",
        f"{feed_name} 有 {count} 篇新内容待阅读",
    )

async def notify_review_reminder(due_count: int):
    """通知复习提醒"""
    if due_count > 0:
        create_notification(
            NotificationType.REVIEW_REMINDER,
            "🧠 复习提醒",
            f"您有 {due_count} 条内容待复习",
            "/review"
        )

async def notify_goal_achieved(goal_type: str, achieved: int, target: int):
    """通知目标达成"""
    create_notification(
        NotificationType.GOAL_ACHIEVED,
        "🎉 目标达成",
        f"您的{goal_type}目标已完成 {achieved}/{target}",
    )
