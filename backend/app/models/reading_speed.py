"""
阅读速度追踪模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Float, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ReadingSpeedLog(Base):
    """阅读速度记录"""
    __tablename__ = "reading_speed_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("feed_items.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(default=1)
    reading_time_seconds: Mapped[int] = mapped_column(Integer, default=0)  # 阅读时长（秒）
    content_length: Mapped[int] = mapped_column(Integer, default=0)  # 内容长度（字符）
    speed_wpm: Mapped[Float] = mapped_column(Float, default=0)  # 每分钟字数
    completed: Mapped[bool] = mapped_column(default=False)  # 是否读完
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_reading_speed_logs_item_id", "item_id"),
    )
