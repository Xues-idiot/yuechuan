"""
阅读成就 API
"""
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.core.database import async_session
from app.models.achievement import Achievement, UserAchievement

router = APIRouter(prefix="/achievements", tags=["achievements"])


class AchievementResponse(BaseModel):
    id: int
    code: str
    name: str
    description: str
    icon: str
    category: str
    requirement: int
    reward_points: int
    progress: int
    unlocked: bool
    unlocked_at: str | None


@router.get("", response_model=list[AchievementResponse])
async def get_achievements():
    """获取所有成就及其进度"""
    async with async_session() as db:
        # 确保成就数据存在
        await ensure_achievements(db)

        result = await db.execute(
            select(Achievement)
            .outerjoin(UserAchievement)
            .order_by(Achievement.category, Achievement.requirement)
        )
        achievements = result.scalars().all()

        return [
            AchievementResponse(
                id=a.id,
                code=a.code,
                name=a.name,
                description=a.description,
                icon=a.icon,
                category=a.category,
                requirement=a.requirement,
                reward_points=a.reward_points,
                progress=a.user_achievements[0].progress if a.user_achievements else 0,
                unlocked=a.user_achievements[0].unlocked if a.user_achievements else False,
                unlocked_at=a.user_achievements[0].unlocked_at.isoformat() if a.user_achievements and a.user_achievements[0].unlocked_at else None
            )
            for a in achievements
        ]


@router.post("/progress/{code}")
async def update_progress(code: str, progress: int):
    """更新成就进度"""
    async with async_session() as db:
        result = await db.execute(
            select(Achievement).where(Achievement.code == code)
        )
        achievement = result.scalar_one_or_none()

        if not achievement:
            raise HTTPException(status_code=404, detail="成就不存在")

        # 获取或创建用户成就
        ua_result = await db.execute(
            select(UserAchievement).where(
                UserAchievement.user_id == 1,
                UserAchievement.achievement_id == achievement.id
            )
        )
        user_ach = ua_result.scalar_one_or_none()

        if not user_ach:
            user_ach = UserAchievement(
                user_id=1,
                achievement_id=achievement.id,
                progress=progress
            )
            db.add(user_ach)
        else:
            user_ach.progress = max(user_ach.progress, progress)

        # 检查是否解锁
        if not user_ach.unlocked and user_ach.progress >= achievement.requirement:
            user_ach.unlocked = True
            user_ach.unlocked_at = datetime.utcnow()

        await db.commit()

        return {
            "success": True,
            "progress": user_ach.progress,
            "unlocked": user_ach.unlocked
        }


@router.get("/stats")
async def get_achievement_stats():
    """获取成就统计"""
    async with async_session() as db:
        total_result = await db.execute(select(func.count(Achievement.id)))
        total = total_result.scalar() or 0

        unlocked_result = await db.execute(
            select(func.count(UserAchievement.id))
            .where(UserAchievement.unlocked == True)
        )
        unlocked = unlocked_result.scalar() or 0

        return {
            "total": total,
            "unlocked": unlocked,
            "percentage": round(unlocked / total * 100, 1) if total > 0 else 0
        }


async def ensure_achievements(db):
    """确保预设成就不存在"""
    default_achievements = [
        {"code": "first_read", "name": "初出茅庐", "description": "阅读第一篇文章", "icon": "📖", "category": "reading", "requirement": 1, "reward_points": 10},
        {"code": "read_10", "name": "阅读达人", "description": "累计阅读10篇文章", "icon": "📚", "category": "reading", "requirement": 10, "reward_points": 50},
        {"code": "read_100", "name": "阅读狂人", "description": "累计阅读100篇文章", "icon": "📚", "category": "reading", "requirement": 100, "reward_points": 200},
        {"code": "read_500", "name": "阅读大师", "description": "累计阅读500篇文章", "icon": "🏆", "category": "reading", "requirement": 500, "reward_points": 500},
        {"code": "streak_3", "name": "三天打鱼", "description": "连续阅读3天", "icon": "🔥", "category": "streak", "requirement": 3, "reward_points": 30},
        {"code": "streak_7", "name": "一周坚持", "description": "连续阅读7天", "icon": "🔥", "category": "streak", "requirement": 7, "reward_points": 70},
        {"code": "streak_30", "name": "月度阅读", "description": "连续阅读30天", "icon": "🔥", "category": "streak", "requirement": 30, "reward_points": 300},
        {"code": "ai_summary_10", "name": "AI助手", "description": "使用AI摘要10次", "icon": "🤖", "category": "ai", "requirement": 10, "reward_points": 100},
        {"code": "ai_translate_5", "name": "翻译官", "description": "使用AI翻译5次", "icon": "🌐", "category": "ai", "requirement": 5, "reward_points": 50},
        {"code": "star_10", "name": "收藏家", "description": "收藏10篇文章", "icon": "⭐", "category": "social", "requirement": 10, "reward_points": 50},
    ]

    for ach_data in default_achievements:
        existing = await db.execute(
            select(Achievement).where(Achievement.code == ach_data["code"])
        )
        if not existing.scalar_one_or_none():
            db.add(Achievement(**ach_data))

    await db.commit()
