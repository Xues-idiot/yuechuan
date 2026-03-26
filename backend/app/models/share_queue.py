"""
分享队列模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Integer, Text, Boolean, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ShareQueue(Base):
    """分享队列"""
    __tablename__ = "share_queue"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    item_id: Mapped[int] = mapped_column(Index("ix_share_queue_item_id"))
    platform: Mapped[str] = mapped_column(String(50))  # twitter, weibo, telegram, etc.
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, sent, failed
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    sent_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_share_queue_user_status", "user_id", "status"),
    )
