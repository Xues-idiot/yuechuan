"""
订阅源健康监控模型
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, Integer, Text, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class FeedHealth(Base):
    """订阅源健康状态"""
    __tablename__ = "feed_health"

    id: Mapped[int] = mapped_column(primary_key=True)
    feed_id: Mapped[int] = mapped_column(unique=True)
    last_check_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    last_success_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    consecutive_failures: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="unknown")  # healthy, degraded, unhealthy, unknown
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    avg_response_time_ms: Mapped[int] = mapped_column(Integer, default=0)
    update_frequency_hours: Mapped[int] = mapped_column(Integer, default=24)  # 预估更新频率
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_feed_health_feed_id", "feed_id"),
    )
