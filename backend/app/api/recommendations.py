"""
订阅源推荐 API - 基于用户兴趣推荐新订阅源
"""
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import select, func
from app.core.database import async_session
from app.models.feed import Feed, FeedItem

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


class FeedRecommendation(BaseModel):
    feed_id: int
    name: str
    url: str
    feed_type: str
    description: str | None
    category: str | None
    reason: str  # 推荐原因
    popularity: int  # 热度


# 预置推荐列表
PRESET_RECOMMENDATIONS = [
    {"name": "Hacker News", "url": "https://hnrss.org/frontpage", "feed_type": "rss", "category": "tech", "description": "Tech news and discussions", "reason": "Popular in tech community"},
    {"name": "Product Hunt", "url": "https://www.producthunt.com/feed", "feed_type": "rss", "category": "product", "description": "New products daily", "reason": "Discover new products"},
    {"name": "TechCrunch", "url": "https://techcrunch.com/feed/", "feed_type": "rss", "category": "tech", "description": "Startup and tech news", "reason": "Leading tech news"},
    {"name": "MIT Technology Review", "url": "https://www.technologyreview.com/feed/", "feed_type": "rss", "category": "tech", "description": "Technology insights", "reason": "Deep tech analysis"},
    {"name": "Dev.to", "url": "https://dev.to/feed", "feed_type": "rss", "category": "programming", "description": "Developer community", "reason": "Programming articles"},
    {"name": "Smashing Magazine", "url": "https://www.smashingmagazine.com/feed/", "feed_type": "rss", "category": "design", "description": "Web design resources", "reason": "Design and UX"},
    {"name": "CSS-Tricks", "url": "https://css-tricks.com/feed/", "feed_type": "rss", "category": "programming", "description": "Web development tips", "reason": "Frontend development"},
    {"name": "JavaScript Weekly", "url": "https://javascriptweekly.com/rss", "feed_type": "rss", "category": "programming", "description": "JS news weekly", "reason": "JavaScript updates"},
    {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml", "feed_type": "rss", "category": "tech", "description": "Tech and science news", "reason": "Popular tech media"},
    {"name": "Ars Technica", "url": "https://feeds.arstechnica.com/arstechnica/index", "feed_type": "rss", "category": "tech", "description": "Technology news", "reason": "In-depth tech coverage"},
]


@router.get("/feeds", response_model=list[FeedRecommendation])
async def get_feed_recommendations(limit: int = 10):
    """获取订阅源推荐"""
    async with async_session() as db:
        # 获取用户已有的 feed 类型
        existing_result = await db.execute(select(Feed.feed_type))
        existing_types = set([f[0] for f in existing_result.all()])

        # 获取用户的阅读偏好
        read_feeds_result = await db.execute(
            select(FeedItem.feed_id, func.count(FeedItem.id).label("count"))
            .where(FeedItem.is_read == True)
            .group_by(FeedItem.feed_id)
            .order_by(func.count(FeedItem.id).desc())
            .limit(5)
        )
        top_feeds = [f.feed_id for f in read_feeds_result.all()]

        # 过滤掉用户已订阅的
        existing_urls_result = await db.execute(select(Feed.url))
        existing_urls = set([f[0] for f in existing_urls_result.all()])

        recommendations = []
        for rec in PRESET_RECOMMENDATIONS:
            if rec["url"] not in existing_urls:
                recommendations.append(FeedRecommendation(
                    feed_id=0,
                    name=rec["name"],
                    url=rec["url"],
                    feed_type=rec["feed_type"],
                    description=rec["description"],
                    category=rec["category"],
                    reason=rec["reason"],
                    popularity=50
                ))

        return recommendations[:limit]


@router.get("/similar/{feed_id}")
async def get_similar_feeds(feed_id: int, limit: int = 5):
    """获取相似订阅源"""
    async with async_session() as db:
        # 获取当前 feed 信息
        feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
        feed = feed_result.scalar_one_or_none()

        if not feed:
            return []

        # 基于 feed_type 查找同类
        similar_result = await db.execute(
            select(Feed)
            .where(Feed.feed_type == feed.feed_type)
            .where(Feed.id != feed_id)
            .limit(limit)
        )

        return [
            {
                "feed_id": f.id,
                "name": f.name,
                "url": f.url,
                "feed_type": f.feed_type,
                "description": f.description,
                "reason": f"Same type as {feed.name}"
            }
            for f in similar_result.scalars().all()
        ]


@router.post("/subscribe/{rec_index}")
async def subscribe_recommendation(rec_index: int):
    """快速订阅推荐"""
    if rec_index >= len(PRESET_RECOMMENDATIONS):
        return {"success": False, "error": "Invalid recommendation index"}

    rec = PRESET_RECOMMENDATIONS[rec_index]
    async with async_session() as db:
        # 检查是否已存在
        existing = await db.execute(select(Feed).where(Feed.url == rec["url"]))
        if existing.scalar_one_or_none():
            return {"success": False, "error": "Already subscribed"}

        feed = Feed(
            name=rec["name"],
            url=rec["url"],
            feed_type=rec["feed_type"],
            category=rec["category"],
            description=rec["description"]
        )
        db.add(feed)
        await db.commit()
        await db.refresh(feed)

        return {"success": True, "feed_id": feed.id}
