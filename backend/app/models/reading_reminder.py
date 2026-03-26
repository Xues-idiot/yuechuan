"""
阅读提醒模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ReadingReminder(Base):
    """阅读提醒设置"""
    __tablename__ = "reading_reminders"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    reminder_type: Mapped[str] = mapped_column(String(50))  # daily, weekly, custom
    time: Mapped[str] = mapped_column(String(10))  # 时间 HH:MM
    days_of_week: Mapped[str] = mapped_column(String(50), nullable=True)  # 逗号分隔: 1,2,3,4,5
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    message: Mapped[str] = mapped_column(String(500), nullable=True)  # 自定义提醒消息
    last_sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
