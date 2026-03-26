"""
智能过滤器模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Text, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class SmartFilter(Base):
    """智能过滤规则"""
    __tablename__ = "smart_filters"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    name: Mapped[str] = mapped_column(String(100))  # 过滤器名称
    filter_type: Mapped[str] = mapped_column(String(50))  # keyword, category, feed, date, ai
    config: Mapped[str] = mapped_column(Text)  # JSON 配置
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_smart_filters_user_active", "user_id", "is_active"),
    )
