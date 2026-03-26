from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ReadingStatsResponse(BaseModel):
    total_items: int
    read_items: int
    unread_items: int
    starred_items: int
    ai_summarized: int
    ai_translated: int
    knowledge_saved: int


class DailyStats(BaseModel):
    date: str
    items_read: int
    time_spent_minutes: int
