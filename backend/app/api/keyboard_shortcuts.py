"""
键盘快捷键自定义 API
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/keyboard-shortcuts", tags=["keyboard"])


class KeyboardShortcut(BaseModel):
    key: str
    modifiers: list[str] = []  # ctrl, shift, alt, meta
    action: str
    description: str


DEFAULT_SHORTCUTS = [
    {"key": "j", "modifiers": [], "action": "next_item", "description": "下一项"},
    {"key": "k", "modifiers": [], "action": "prev_item", "description": "上一项"},
    {"key": "o", "modifiers": [], "action": "open_item", "description": "打开文章"},
    {"key": "m", "modifiers": [], "action": "mark_read", "description": "标记已读"},
    {"key": "s", "modifiers": [], "action": "star_item", "description": "收藏"},
    {"key": "r", "modifiers": [], "action": "refresh", "description": "刷新"},
    {"key": "/", "modifiers": [], "action": "search", "description": "搜索"},
    {"key": "?", "modifiers": [], "action": "show_help", "description": "显示帮助"},
    {"key": "f", "modifiers": [], "action": "focus_mode", "description": "专注模式"},
    {"key": "t", "modifiers": ["ctrl"], "action": "new_tab", "description": "新标签页"},
]

# 存储用户自定义（简化实现）
user_shortcuts = {}


@router.get("", response_model=list[KeyboardShortcut])
async def get_shortcuts():
    """获取所有快捷键"""
    shortcuts = DEFAULT_SHORTCUTS.copy()
    for action, custom in user_shortcuts.items():
        for shortcut in shortcuts:
            if shortcut["action"] == action:
                shortcut.update(custom)
                break
    return shortcuts


@router.put("/{action}")
async def update_shortcut(action: str, shortcut: KeyboardShortcut):
    """更新快捷键"""
    user_shortcuts[action] = {
        "key": shortcut.key,
        "modifiers": shortcut.modifiers
    }
    return {"success": True}


@router.post("/reset")
async def reset_shortcuts():
    """重置所有快捷键"""
    user_shortcuts.clear()
    return {"success": True}


@router.get("/config")
async def get_shortcut_config():
    """获取快捷键配置信息"""
    return {
        "shortcuts": DEFAULT_SHORTCUTS,
        "supported_modifiers": ["ctrl", "shift", "alt", "meta"],
        "supported_keys": [
            "a-z", "0-9", "f1-f12",
            "enter", "escape", "space", "tab",
            "arrowup", "arrowdown", "arrowleft", "arrowright"
        ]
    }
