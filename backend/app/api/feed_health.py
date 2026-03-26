"""
订阅源健康监控 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed_health import FeedHealth

router = APIRouter(prefix="/feed-health", tags=["feed-health"])


class FeedHealthResponse(BaseModel):
    feed_id: int
    status: str
    last_check_at: str | None
    last_success_at: str | None
    consecutive_failures: int
    error_message: str | None
    avg_response_time_ms: int
    update_frequency_hours: int


class FeedHealthSummary(BaseModel):
    total_feeds: int
    healthy_feeds: int
    degraded_feeds: int
    unhealthy_feeds: int


@router.get("/summary", response_model=FeedHealthSummary)
async def get_health_summary():
    """获取订阅源健康概览"""
    async with async_session() as db:
        from app.models.feed import Feed

        total_result = await db.execute(select(Feed))
        total_feeds = len(total_result.scalars().all())

        healthy_result = await db.execute(
            select(FeedHealth).where(FeedHealth.status == "healthy")
        )
        healthy_feeds = len(healthy_result.scalars().all())

        degraded_result = await db.execute(
            select(FeedHealth).where(FeedHealth.status == "degraded")
        )
        degraded_feeds = len(degraded_result.scalars().all())

        unhealthy_result = await db.execute(
            select(FeedHealth).where(FeedHealth.status == "unhealthy")
        )
        unhealthy_feeds = len(unhealthy_result.scalars().all())

        return FeedHealthSummary(
            total_feeds=total_feeds,
            healthy_feeds=healthy_feeds,
            degraded_feeds=degraded_feeds,
            unhealthy_feeds=unhealthy_feeds
        )


@router.get("/{feed_id}", response_model=FeedHealthResponse)
async def get_feed_health(feed_id: int):
    """获取订阅源健康状态"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedHealth).where(FeedHealth.feed_id == feed_id)
        )
        health = result.scalar_one_or_none()

        if not health:
            return FeedHealthResponse(
                feed_id=feed_id,
                status="unknown",
                last_check_at=None,
                last_success_at=None,
                consecutive_failures=0,
                error_message=None,
                avg_response_time_ms=0,
                update_frequency_hours=24
            )

        return FeedHealthResponse(
            feed_id=health.feed_id,
            status=health.status,
            last_check_at=health.last_check_at.isoformat() if health.last_check_at else None,
            last_success_at=health.last_success_at.isoformat() if health.last_success_at else None,
            consecutive_failures=health.consecutive_failures,
            error_message=health.error_message,
            avg_response_time_ms=health.avg_response_time_ms,
            update_frequency_hours=health.update_frequency_hours
        )


@router.post("/{feed_id}/check")
async def check_feed_health(feed_id: int):
    """手动检查订阅源健康状态"""
    async with async_session() as db:
        from datetime import datetime
        import httpx

        result = await db.execute(
            select(FeedHealth).where(FeedHealth.feed_id == feed_id)
        )
        health = result.scalar_one_or_none()

        if not health:
            health = FeedHealth(feed_id=feed_id)
            db.add(health)

        health.last_check_at = datetime.utcnow()

        try:
            from app.models.feed import Feed
            feed_result = await db.execute(select(Feed).where(Feed.id == feed_id))
            feed = feed_result.scalar_one_or_none()

            if feed:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(feed.url)
                    if response.status_code == 200:
                        health.status = "healthy"
                        health.last_success_at = datetime.utcnow()
                        health.consecutive_failures = 0
                    else:
                        health.status = "degraded"
                        health.consecutive_failures += 1
        except Exception as e:
            health.status = "unhealthy"
            health.consecutive_failures += 1
            health.error_message = str(e)

        await db.commit()

        return {"success": True, "status": health.status}
