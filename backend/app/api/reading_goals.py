"""
阅读目标 API - 设置和追踪阅读目标
"""
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/reading-goals", tags=["goals"])


class ReadingGoal(BaseModel):
    type: str  # daily, weekly, monthly
    target: int  # 目标数量
    current: int = 0
    period_start: str
    period_end: str


# 简化实现
DAILY_GOAL = ReadingGoal(
    type="daily",
    target=10,
    current=0,
    period_start=datetime.utcnow().strftime("%Y-%m-%d"),
    period_end=datetime.utcnow().strftime("%Y-%m-%d")
)

WEEKLY_GOAL = ReadingGoal(
    type="weekly",
    target=50,
    current=0,
    period_start="",
    period_end=""
)


@router.get("/current")
async def get_current_goals():
    """获取当前目标"""
    return {
        "daily": DAILY_GOAL,
        "weekly": WEEKLY_GOAL
    }


@router.post("/update")
async def update_goal(goal: ReadingGoal):
    """更新目标"""
    global DAILY_GOAL, WEEKLY_GOAL

    if goal.type == "daily":
        DAILY_GOAL = goal
    elif goal.type == "weekly":
        WEEKLY_GOAL = goal

    return {"success": True}


@router.get("/progress")
async def get_goal_progress():
    """获取目标进度"""
    daily_progress = (DAILY_GOAL.current / DAILY_GOAL.target * 100) if DAILY_GOAL.target > 0 else 0
    weekly_progress = (WEEKLY_GOAL.current / WEEKLY_GOAL.target * 100) if WEEKLY_GOAL.target > 0 else 0

    return {
        "daily": {
            "current": DAILY_GOAL.current,
            "target": DAILY_GOAL.target,
            "progress": round(daily_progress, 1),
            "remaining": max(0, DAILY_GOAL.target - DAILY_GOAL.current),
            "completed": DAILY_GOAL.current >= DAILY_GOAL.target
        },
        "weekly": {
            "current": WEEKLY_GOAL.current,
            "target": WEEKLY_GOAL.target,
            "progress": round(weekly_progress, 1),
            "remaining": max(0, WEEKLY_GOAL.target - WEEKLY_GOAL.current),
            "completed": WEEKLY_GOAL.current >= WEEKLY_GOAL.target
        }
    }


@router.post("/increment/{goal_type}")
async def increment_progress(goal_type: str, amount: int = 1):
    """增加进度"""
    global DAILY_GOAL, WEEKLY_GOAL

    if goal_type == "daily":
        DAILY_GOAL.current += amount
    elif goal_type == "weekly":
        WEEKLY_GOAL.current += amount

    return {"success": True, "current": amount}
