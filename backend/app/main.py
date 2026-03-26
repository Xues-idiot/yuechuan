from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.feeds import router as feeds_router
from app.api.refresh import router as refresh_router
from app.api.ai import router as ai_router
from app.api.knowledge import router as knowledge_router
from app.api.stats import router as stats_router
from app.api.transcribe import router as transcribe_router
from app.api.progress import router as progress_router
from app.api.notion import router as notion_router
from app.api.review import router as review_router
from app.api.notifications import router as notifications_router
from app.api.bookmarks import router as bookmarks_router
from app.api.reading_history import router as history_router
from app.api.read_later import router as read_later_router
from app.api.streak import router as streak_router
from app.api.categories import router as categories_router
from app.api.highlights import router as highlights_router
from app.api.achievements import router as achievements_router
from app.api.reading_speed import router as reading_speed_router
from app.api.smart_filters import router as smart_filters_router
from app.api.reading_reminders import router as reminders_router
from app.api.feed_health import router as feed_health_router
from app.api.weekly_digest import router as weekly_digest_router
from app.api.backup import router as backup_router
from app.api.api_keys import router as api_keys_router
from app.api.pocket import router as pocket_router
from app.api.audio import router as audio_router
from app.api.focus_mode import router as focus_mode_router
from app.api.smart_sort import router as smart_sort_router
from app.api.reading_list import router as reading_list_router
from app.api.reading_timeline import router as timeline_router
from app.api.recommendations import router as recommendations_router
from app.api.tags import router as tags_router
from app.api.batch_ops import router as batch_router
from app.api.search_enhanced import router as search_router
from app.api.reading_mode import router as reading_mode_router
from app.api.pdf_export import router as pdf_export_router
from app.api.keyboard_shortcuts import router as keyboard_router
from app.api.notification_settings import router as notification_settings_router
from app.api.widgets import router as widgets_router
from app.api.reading_analytics import router as analytics_router
from app.api.quick_actions import router as quick_actions_router
from app.api.content_filter import router as content_filter_router
from app.api.social_share import router as social_share_router
from app.api.parser_rules import router as parser_rules_router
from app.api.reading_goals import router as reading_goals_router
from app.api.advanced_analytics import router as advanced_analytics_router

app = FastAPI(title="阅川 API", version="0.4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feeds_router)
app.include_router(refresh_router)
app.include_router(ai_router)
app.include_router(knowledge_router)
app.include_router(stats_router)
app.include_router(transcribe_router)
app.include_router(progress_router)
app.include_router(notion_router)
app.include_router(review_router)
app.include_router(notifications_router)
app.include_router(bookmarks_router)
app.include_router(history_router)
app.include_router(read_later_router)
app.include_router(streak_router)
app.include_router(categories_router)
app.include_router(highlights_router)
app.include_router(achievements_router)
app.include_router(reading_speed_router)
app.include_router(smart_filters_router)
app.include_router(reminders_router)
app.include_router(feed_health_router)
app.include_router(weekly_digest_router)
app.include_router(backup_router)
app.include_router(api_keys_router)
app.include_router(pocket_router)
app.include_router(audio_router)
app.include_router(focus_mode_router)
app.include_router(smart_sort_router)
app.include_router(reading_list_router)
app.include_router(timeline_router)
app.include_router(recommendations_router)
app.include_router(tags_router)
app.include_router(batch_router)
app.include_router(search_router)
app.include_router(reading_mode_router)
app.include_router(pdf_export_router)
app.include_router(keyboard_router)
app.include_router(notification_settings_router)
app.include_router(widgets_router)
app.include_router(analytics_router)
app.include_router(quick_actions_router)
app.include_router(content_filter_router)
app.include_router(social_share_router)
app.include_router(parser_rules_router)
app.include_router(reading_goals_router)
app.include_router(advanced_analytics_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "0.2.0"}


@app.get("/")
async def root():
    return {"message": "阅川 API", "version": "0.4.0"}
