"""
API Key 管理模型
"""
from datetime import datetime
from sqlalchemy import String, DateTime, Boolean, Text, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ApiKey(Base):
    """用户 API Key"""
    __tablename__ = "api_keys"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(default=1)
    name: Mapped[str] = mapped_column(String(100))  # Key 名称
    key_hash: Mapped[str] = mapped_column(String(255))  # 加密存储
    permissions: Mapped[str] = mapped_column(Text, nullable=True)  # JSON 权限列表
    last_used_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index("ix_api_keys_user_id", "user_id"),
    )
