from typing import Optional, List, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.feed import FeedItem
from app.agents.summarizer import SummarizerAgent


class AIService:
    """AI 处理服务"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.summarizer = SummarizerAgent()

    async def generate_summary(self, item_id: int) -> Dict[str, Any]:
        """
        为内容生成 AI 摘要

        Returns:
            {"summary": str, "success": bool, "error": Optional[str]}
        """
        result = await self.db.execute(select(FeedItem).where(FeedItem.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            return {"summary": "", "success": False, "error": "内容不存在"}

        content = item.content_text or item.content or ""
        if not content:
            return {"summary": "", "success": False, "error": "内容为空"}

        try:
            summary = await self.summarizer.summarize(content, item.title)
            item.ai_summary = summary
            await self.db.commit()
            return {"summary": summary, "success": True}
        except Exception as e:
            return {"summary": "", "success": False, "error": str(e)}

    async def generate_key_points(self, item_id: int) -> Dict[str, Any]:
        """
        提取内容关键点

        Returns:
            {"key_points": List[str], "success": bool, "error": Optional[str]}
        """
        result = await self.db.execute(select(FeedItem).where(FeedItem.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            return {"key_points": [], "success": False, "error": "内容不存在"}

        content = item.content_text or item.content or ""
        if not content:
            return {"key_points": [], "success": False, "error": "内容为空"}

        try:
            key_points = await self.summarizer.extract_key_points(content)
            return {"key_points": key_points, "success": True}
        except Exception as e:
            return {"key_points": [], "success": False, "error": str(e)}

    async def translate_content(self, item_id: int) -> Dict[str, Any]:
        """
        翻译内容为中文

        Returns:
            {"translation": str, "success": bool, "error": Optional[str]}
        """
        result = await self.db.execute(select(FeedItem).where(FeedItem.id == item_id))
        item = result.scalar_one_or_none()
        if not item:
            return {"translation": "", "success": False, "error": "内容不存在"}

        content = item.content_text or item.content or ""
        if not content:
            return {"translation": "", "success": False, "error": "内容为空"}

        try:
            translation = await self.summarizer.translate_to_chinese(content)
            item.ai_translated = translation
            await self.db.commit()
            return {"translation": translation, "success": True}
        except Exception as e:
            return {"translation": "", "success": False, "error": str(e)}
