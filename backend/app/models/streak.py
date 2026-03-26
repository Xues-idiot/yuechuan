"""
阅读连续打卡模型 - 追踪用户的阅读连续天数
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class UserStreak(Base):
    """用户阅读连续打卡记录"""
    __tablename__ = "user_streaks"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)  # 未来支持多用户
    current_streak: Mapped[int] = mapped_column(Integer, default=0)  # 当前连续天数
    longest_streak: Mapped[int] = mapped_column(Integer, default=0)  # 最长连续天数
    last_read_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)  # 最后阅读日期
    total_read_days: Mapped[int] = mapped_column(Integer, default=0)  # 累计阅读天数
    today_read_count: Mapped[int] = mapped_column(Integer, default=0)  # 今日已读篇数
    today_date: Mapped[datetime] = mapped_column(DateTime, nullable=True)  # 记录今日日期
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_user_streaks_user_id", "user_id"),
    )


class DailyReadingLog(Base):
    """每日阅读日志"""
    __tablename__ = "daily_reading_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    date: Mapped[datetime] = mapped_column(DateTime)  # 阅读日期
    items_read: Mapped[int] = mapped_column(Integer, default=0)  # 当日阅读篇数
    reading_time_minutes: Mapped[int] = mapped_column(Integer, default=0)  # 累计阅读时长(分钟)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_daily_reading_logs_user_date", "user_id", "date"),
    )