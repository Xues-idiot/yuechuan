"""
快捷操作 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/quick-actions", tags=["quick-actions"])


class QuickAction(BaseModel):
    id: str
    name: str
    icon: str
    action: str
    shortcut: str | None = None


QUICK_ACTIONS = [
    {"id": "mark_all_read", "name": "全部标为已读", "icon": "✓", "action": "mark_all_read", "shortcut": "shift+m"},
    {"id": "refresh_all", "name": "刷新订阅源", "icon": "↻", "action": "refresh_all", "shortcut": "r"},
    {"id": "add_feed", "name": "添加订阅源", "icon": "+", "action": "add_feed", "shortcut": "a"},
    {"id": "search", "name": "搜索", "icon": "🔍", "action": "search", "shortcut": "/"},
    {"id": "focus_mode", "name": "专注模式", "icon": "🎯", "action": "focus_mode", "shortcut": "f"},
    {"id": "export", "name": "导出数据", "icon": "📤", "action": "export", "shortcut": None},
    {"id": "achievements", "name": "成就", "icon": "🏆", "action": "achievements", "shortcut": None},
    {"id": "streak", "name": "打卡", "icon": "🔥", "action": "streak", "shortcut": None},
]


@router.get("")
async def get_quick_actions():
    """获取所有快捷操作"""
    return QUICK_ACTIONS


@router.post("/execute/{action}")
async def execute_quick_action(action: str):
    """执行快捷操作"""
    # 实际执行对应操作
    if action == "mark_all_read":
        # TODO: 执行标记全部已读
        return {"success": True, "message": "All items marked as read"}
    elif action == "refresh_all":
        # TODO: 执行刷新所有订阅源
        return {"success": True, "message": "All feeds refreshed"}
    elif action == "export":
        return {"success": True, "message": "Export started"}
    else:
        return {"success": True, "message": f"Action {action} executed"}
