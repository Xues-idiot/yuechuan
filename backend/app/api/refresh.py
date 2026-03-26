from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.feed_refresh import FeedRefreshService

router = APIRouter(prefix="/refresh", tags=["refresh"])


@router.post("/feeds/{feed_id}")
async def refresh_single_feed(
    feed_id: int,
    db: AsyncSession = Depends(get_db)
):
    """刷新单个订阅源"""
    service = FeedRefreshService(db)
    try:
        result = await service.refresh_feed(feed_id)
        return {"status": "ok", "feed_id": feed_id, **result}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await service.close()


@router.post("/feeds")
async def refresh_all_feeds(db: AsyncSession = Depends(get_db)):
    """刷新所有订阅源"""
    service = FeedRefreshService(db)
    try:
        results = await service.refresh_all_feeds()
        return {"status": "ok", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await service.close()
