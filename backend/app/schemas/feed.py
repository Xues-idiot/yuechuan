from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, field_validator

# 支持的平台类型
FEED_TYPES = Literal["wechat", "bilibili", "xiaohongshu", "weibo", "zhihu"]


# Feed schemas
class FeedBase(BaseModel):
    name: str
    url: str
    feed_type: str
    category: Optional[str] = None

    @field_validator("feed_type")
    @classmethod
    def validate_feed_type(cls, v: str) -> str:
        valid_types = {"wechat", "bilibili", "xiaohongshu", "weibo", "zhihu"}
        if v not in valid_types:
            raise ValueError(f"feed_type 必须是以下之一: {', '.join(sorted(valid_types))}")
        return v


class FeedCreate(FeedBase):
    pass


class FeedUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None
    category: Optional[str] = None


class FeedResponse(FeedBase):
    id: int
    avatar_url: Optional[str] = None
    description: Optional[str] = None
    is_active: bool
    last_fetched_at: Optional[datetime] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# FeedItem schemas
class FeedItemBase(BaseModel):
    title: str
    url: str


class FeedItemResponse(FeedItemBase):
    id: int
    feed_id: int
    guid: str
    author: Optional[str] = None
    content: Optional[str] = None
    content_text: Optional[str] = None
    image_url: Optional[str] = None
    published_at: Optional[datetime] = None
    is_read: bool
    is_starred: bool
    ai_summary: Optional[str] = None
    tags: Optional[str] = None  # 逗号分隔的标签
    created_at: datetime

    model_config = {"from_attributes": True}


class FeedItemDetailResponse(FeedItemResponse):
    ai_translated: Optional[str] = None
    transcription: Optional[str] = None
    notes: Optional[str] = None  # 用户笔记
    feed: FeedResponse

    model_config = {"from_attributes": True}


class FeedItemUpdate(BaseModel):
    is_read: Optional[bool] = None
    is_starred: Optional[bool] = None
    tags: Optional[str] = None
    notes: Optional[str] = None
