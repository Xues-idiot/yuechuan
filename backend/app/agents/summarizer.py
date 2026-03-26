from openai import AsyncOpenAI
from typing import Optional, List

from app.core.config import settings


class SummarizerAgent:
    """AI 摘要生成 Agent"""

    def __init__(self, api_key: Optional[str] = None):
        key = api_key or settings.OPENAI_API_KEY
        if not key:
            raise ValueError("OpenAI API key 未设置，请配置 OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=key)
        self.model = "gpt-4o-mini"

    async def summarize(self, content: str, title: str = "") -> str:
        """
        生成内容摘要

        Args:
            content: 原始内容（纯文本）
            title: 内容标题（可选）

        Returns:
            摘要文本
        """
        if not content or len(content.strip()) < 50:
            return content

        prompt = f"""请为以下内容生成简洁的摘要。

要求：
1. 一句话概括核心内容
2. 提取 3-5 个关键点
3. 总字数控制在 200 字以内

{"标题：" + title if title else ""}

内容：
{content[:3000]}

摘要："""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "你是一个内容摘要助手，负责提取文章的核心观点和关键信息。",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )

        return response.choices[0].message.content.strip()

    async def extract_key_points(self, content: str) -> List[str]:
        """
        提取关键点列表

        Args:
            content: 原始内容

        Returns:
            关键点列表
        """
        prompt = f"""从以下内容中提取关键点，每行一个点：

{content[:3000]}

关键点："""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "你是一个信息提取助手，从文本中提取关键观点。",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=300,
        )

        points = response.choices[0].message.content.strip()
        return [p.strip() for p in points.split("\n") if p.strip()]

    async def translate_to_chinese(self, content: str) -> str:
        """
        翻译内容为中文

        Args:
            content: 原文

        Returns:
            中文翻译
        """
        prompt = f"""将以下内容翻译为中文，保持原文风格：

{content[:3000]}

翻译："""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业的翻译助手，将外文翻译成流畅的中文。",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=2000,
        )

        return response.choices[0].message.content.strip()
