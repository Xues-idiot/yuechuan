from datetime import datetime
from typing import Optional, List

from sqlalchemy import String, Text, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Feed(Base):
    __tablename__ = "feeds"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    url: Mapped[str] = mapped_column(Text)  # Original URL or RSSHub route
    feed_type: Mapped[str] = mapped_column(String(50))  # wechat, bilibili, xiaohongshu, etc.
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # 订阅源分组
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_fetched_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    items: Mapped[List["FeedItem"]] = relationship(back_populates="feed", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_feeds_url", "url"),
        Index("ix_feeds_feed_type", "feed_type"),
        Index("ix_feeds_is_active", "is_active"),
    )


class FeedItem(Base):
    __tablename__ = "feed_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    feed_id: Mapped[int] = mapped_column(ForeignKey("feeds.id", ondelete="CASCADE"))
    guid: Mapped[str] = mapped_column(String(500))  # Unique identifier from source
    title: Mapped[str] = mapped_column(String(500))
    url: Mapped[str] = mapped_column(Text)
    author: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # HTML content
    content_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Plain text
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    is_starred: Mapped[bool] = mapped_column(Boolean, default=False)
    ai_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_translated: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    transcription: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # For video content
    tags: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # 逗号分隔的标签
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # 用户笔记
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    feed: Mapped["Feed"] = relationship(back_populates="items")
    reading_progress: Mapped[Optional["UserReadingProgress"]] = relationship(back_populates="item")

    __table_args__ = (
        Index("ix_feed_items_feed_id_published", "feed_id", "published_at"),
        Index("ix_feed_items_guid", "guid"),
        Index("ix_feed_items_is_starred", "is_starred"),
        Index("ix_feed_items_is_read", "is_read"),
    )


class UserReadingProgress(Base):
    """用户阅读进度"""
    __tablename__ = "user_reading_progress"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("feed_items.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[Optional[int]] = mapped_column(nullable=True)  # 未来支持多用户
    position: Mapped[int] = mapped_column(default=0)  # 0-100 百分比
    scroll_position: Mapped[Optional[int]] = mapped_column(nullable=True)  # 滚动位置
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    item: Mapped["FeedItem"] = relationship(back_populates="reading_progress")
