from datetime import datetime
from typing import List, Dict, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.feed import Feed, FeedItem
from app.services.rsshub_service import RSSHubService, build_rsshub_route


class FeedRefreshService:
    """订阅源刷新服务"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.rsshub = RSSHubService()

    async def refresh_feed(self, feed_id: int) -> Dict[str, Any]:
        """
        刷新单个订阅源，获取最新内容

        Returns:
            {"added": int, "updated": int, "errors": List[str]}
        """
        result = await self.db.execute(select(Feed).where(Feed.id == feed_id))
        feed = result.scalar_one_or_none()
        if not feed:
            raise ValueError(f"订阅源 {feed_id} 不存在")

        try:
            route = build_rsshub_route(feed.feed_type, feed.url)
            feed_data = await self.rsshub.fetch_feed(route)
        except Exception as e:
            return {"added": 0, "updated": 0, "errors": [str(e)]}

        # 更新 feed 信息
        if not feed.name or feed.name == feed.url:
            feed.name = feed_data.get("title", feed.name)
        if not feed.description:
            feed.description = feed_data.get("description", "")

        feed.last_fetched_at = datetime.utcnow()

        # 处理内容
        added = 0
        updated = 0
        for item_data in feed_data.get("items", []):
            # 检查是否已存在
            item_result = await self.db.execute(
                select(FeedItem).where(FeedItem.guid == item_data["guid"])
            )
            existing = item_result.scalar_one_or_none()

            if existing:
                # 更新已有项
                for key, value in item_data.items():
                    if key not in ["id", "feed_id", "guid"] and value:
                        setattr(existing, key, value)
                updated += 1
            else:
                # 添加新项
                item = FeedItem(feed_id=feed_id, **item_data)
                self.db.add(item)
                added += 1

        await self.db.commit()
        return {"added": added, "updated": updated, "errors": []}

    async def refresh_all_feeds(self) -> List[Dict[str, Any]]:
        """刷新所有活跃订阅源"""
        result = await self.db.execute(
            select(Feed).where(Feed.is_active == True)
        )
        feeds = result.scalars().all()

        results = []
        for feed in feeds:
            try:
                refresh_result = await self.refresh_feed(feed.id)
                results.append({"feed_id": feed.id, "name": feed.name, **refresh_result})
            except Exception as e:
                results.append({"feed_id": feed.id, "name": feed.name, "errors": [str(e)]})

        return results

    async def close(self):
        await self.rsshub.close()
