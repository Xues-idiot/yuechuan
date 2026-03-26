"""
自定义订阅源分类模型
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, Integer, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class FeedCategory(Base):
    """自定义分类"""
    __tablename__ = "feed_categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))  # 分类名称
    icon: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # 图标 emoji
    color: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # 颜色 hex
    sort_order: Mapped[int] = mapped_column(Integer, default=0)  # 排序
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)  # 是否默认分类
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    feeds: Mapped[List["CategoryFeed"]] = relationship(back_populates="category", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_feed_categories_sort_order", "sort_order"),
    )


class CategoryFeed(Base):
    """分类与订阅源的关联"""
    __tablename__ = "category_feeds"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("feed_categories.id", ondelete="CASCADE"))
    feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    category: Mapped["FeedCategory"] = relationship(back_populates="feeds")

    __table_args__ = (
        Index("ix_category_feeds_unique", "category_id", "feed_id", unique=True),
    )
