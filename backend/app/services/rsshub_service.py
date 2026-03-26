import re
import httpx
import feedparser
from datetime import datetime
from typing import Optional, Dict, List, Any

from app.core.config import settings


class RSSHubService:
    """RSSHub 内容获取服务"""

    def __init__(self, rsshub_url: Optional[str] = None):
        self.rsshub_url = rsshub_url or settings.RSSHUB_URL
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={"User-Agent": "YueChuan/1.0 RSS Reader"}
        )
        # 简单的内存缓存
        self._cache: Dict[str, tuple] = {}  # key: route, value: (data, timestamp)
        self._cache_ttl = 300  # 5分钟缓存

    async def fetch_feed(self, route: str) -> Dict[str, Any]:
        """
        通过 RSSHub 获取订阅源内容（带缓存）

        Args:
            route: RSSHub 路由，如 "wechat/toc/xxx"

        Returns:
            解析后的 feed 数据
        """
        import time

        # 检查缓存
        now = time.time()
        if route in self._cache:
            data, timestamp = self._cache[route]
            if now - timestamp < self._cache_ttl:
                return data

        url = f"{self.rsshub_url}/{route}"
        response = await self.client.get(url)
        response.raise_for_status()

        feed = feedparser.parse(response.text)
        data = self._parse_feed(feed)

        # 更新缓存
        self._cache[route] = (data, now)

        return data

    def _parse_feed(self, feed: feedparser.Feed) -> Dict[str, Any]:
        """解析 feed 数据"""
        return {
            "title": feed.feed.get("title", ""),
            "description": feed.feed.get("description", ""),
            "link": feed.feed.get("link", ""),
            "items": [self._parse_entry(entry) for entry in feed.entries]
        }

    def _parse_entry(self, entry: feedparser.Entry) -> Dict[str, Any]:
        """解析 feed entry"""
        published = None
        if hasattr(entry, "published_parsed") and entry.published_parsed:
            published = datetime(*entry.published_parsed[:6])

        return {
            "guid": entry.get("id", entry.get("link", "")),
            "title": entry.get("title", ""),
            "url": entry.get("link", ""),
            "author": entry.get("author", ""),
            "content": entry.get("summary", ""),
            "content_text": self._html_to_text(entry.get("summary", "")),
            "image_url": self._extract_image(entry),
            "published_at": published,
        }

    def _extract_image(self, entry: feedparser.Entry) -> Optional[str]:
        """从 entry 中提取图片 URL"""
        # 尝试多种方式获取图片
        if hasattr(entry, "media_content") and entry.media_content:
            for media in entry.media_content:
                if media.get("medium") == "image":
                    return media.get("url")

        if hasattr(entry, "enclosures") and entry.enclosures:
            for enclosure in entry.enclosures:
                if enclosure.get("type", "").startswith("image"):
                    return enclosure.get("href")

        # 从 content 中提取第一张图片
        content = entry.get("summary", "")
        if content:
            img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
            if img_match:
                return img_match.group(1)

        return None

    def _html_to_text(self, html: str) -> str:
        """将 HTML 转换为纯文本"""
        if not html:
            return ""
        text = re.sub(r'<[^>]+>', '', html)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    async def close(self):
        await self.client.aclose()
        self._cache.clear()


# 平台路由映射
PLATFORM_ROUTES = {
    "wechat": "wechat/toc/{id}",           # 微信公众号
    "bilibili": "bilibili/user/video/{id}",  # B站用户视频
    "xiaohongshu": "xiaohongshu/user/{id}",  # 小红书
    "weibo": "weibo/user/{id}",              # 微博
    "zhihu": "zhihu/people/articles/{id}",  # 知乎
}


def build_rsshub_route(platform: str, channel_id: str) -> str:
    """构建 RSSHub 路由"""
    if platform not in PLATFORM_ROUTES:
        raise ValueError(f"不支持的平台: {platform}")
    return PLATFORM_ROUTES[platform].format(id=channel_id)
