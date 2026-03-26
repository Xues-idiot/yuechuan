"""
文章高亮/标注模型
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, DateTime, Integer, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class ArticleHighlight(Base):
    """文章高亮记录"""
    __tablename__ = "article_highlights"

    id: Mapped[int] = mapped_column(primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("feed_items.id", ondelete="CASCADE"))
    user_id: Mapped[int] = mapped_column(default=1)
    text: Mapped[str] = mapped_column(Text)  # 高亮的文本
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # 用户笔记
    color: Mapped[str] = mapped_column(String(20), default="yellow")  # 高亮颜色
    start_offset: Mapped[int] = mapped_column(Integer, default=0)  # 起始位置
    end_offset: Mapped[int] = mapped_column(Integer, default=0)  # 结束位置
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    __table_args__ = (
        Index("ix_article_highlights_item_id", "item_id"),
    )
