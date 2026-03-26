"""
阅读成就系统模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Achievement(Base):
    """成就定义"""
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True)  # 成就代码
    name: Mapped[str] = mapped_column(String(100))  # 成就名称
    description: Mapped[str] = mapped_column(String(500))  # 成就描述
    icon: Mapped[str] = mapped_column(String(50))  # 图标 emoji
    category: Mapped[str] = mapped_column(String(50))  # 分类: reading, streak, ai, social
    requirement: Mapped[int] = mapped_column(Integer)  # 解锁条件数值
    reward_points: Mapped[int] = mapped_column(Integer, default=0)  # 奖励积分
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_achievements_code", "code"),
    )


class UserAchievement(Base):
    """用户成就进度"""
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id", ondelete="CASCADE"))
    progress: Mapped[int] = mapped_column(Integer, default=0)  # 当前进度
    unlocked: Mapped[bool] = mapped_column(Boolean, default=False)  # 是否已解锁
    unlocked_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)  # 解锁时间
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_user_achievements_user_achievement", "user_id", "achievement_id", unique=True),
    )
