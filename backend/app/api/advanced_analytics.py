"""
高级分析报告 API - 生成详细的数据分析报告
"""
from datetime import datetime, timedelta
from fastapi import APIRouter
from sqlalchemy import select, func, extract
from app.core.database import async_session
from app.models.feed import FeedItem, Feed
from app.models.streak import UserStreak

router = APIRouter(prefix="/advanced-analytics", tags=["advanced-analytics"])


@router.get("/report")
async def generate_advanced_report():
    """生成高级分析报告"""
    async with async_session() as db:
        now = datetime.utcnow()

        # ===== 基本统计 =====
        total_items = await db.execute(select(func.count(FeedItem.id)))
        total = total_items.scalar() or 0

        read_items = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_read == True)
        )
        read = read_items.scalar() or 0

        starred_items = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.is_starred == True)
        )
        starred = starred_items.scalar() or 0

        # ===== 阅读习惯分析 =====
        # 按小时分布
        hourly_result = await db.execute(
            select(
                extract("hour", FeedItem.updated_at).label("hour"),
                func.count(FeedItem.id).label("count")
            )
            .where(FeedItem.is_read == True)
            .group_by(extract("hour", FeedItem.updated_at))
        )
        hourly = {int(row.hour): row.count for row in hourly_result.all() if row.hour is not None}

        # 找出阅读高峰时段
        peak_hour = max(hourly.items(), key=lambda x: x[1])[0] if hourly else 9
        reading_slots = ["凌晨", "早上", "上午", "中午", "下午", "傍晚", "晚上"]
        time_of_day = reading_slots[peak_hour // 4] if peak_hour else "早上"

        # ===== 内容质量分析 =====
        ai_summarized = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.ai_summary.isnot(None))
        )
        ai_count = ai_summarized.scalar() or 0

        ai_translated = await db.execute(
            select(func.count(FeedItem.id)).where(FeedItem.ai_translated.isnot(None))
        )
        translated_count = ai_translated.scalar() or 0

        # ===== 订阅源分析 =====
        feed_stats_result = await db.execute(
            select(
                FeedItem.feed_id,
                func.count(FeedItem.id).label("total"),
                func.sum(FeedItem.is_read.cast()).label("read")
            ).group_by(FeedItem.feed_id)
        )

        feed_stats = []
        for row in feed_stats_result.all():
            feed_result = await db.execute(select(Feed).where(Feed.id == row.feed_id))
            feed = feed_result.scalar_one_or_none()
            if feed:
                feed_stats.append({
                    "feed_id": row.feed_id,
                    "name": feed.name,
                    "total": row.total,
                    "read": row.read or 0,
                    "rate": round((row.read or 0) / row.total * 100, 1) if row.total > 0 else 0
                })

        feed_stats.sort(key=lambda x: x["rate"], reverse=True)
        top_feed = feed_stats[0] if feed_stats else None

        # ===== 阅读连续性分析 =====
        streak_result = await db.execute(select(UserStreak).where(UserStreak.user_id == 1))
        streak = streak_result.scalar_one_or_none()

        streak_info = {
            "current": streak.current_streak if streak else 0,
            "longest": streak.longest_streak if streak else 0,
            "total_days": streak.total_read_days if streak else 0
        }

        # ===== 预测和建议 =====
        suggestions = []

        if read == 0:
            suggestions.append("开始阅读你的第一篇文章吧！")
        elif read / max(total, 1) < 0.3:
            suggestions.append("你的已读率较低，考虑每天花更多时间阅读")
        else:
            suggestions.append("继续保持良好的阅读习惯！")

        if streak and streak.current_streak < 3:
            suggestions.append("尝试连续阅读3天以上来培养习惯")

        if ai_count == 0:
            suggestions.append("试试 AI 摘要功能，可以更快了解文章内容")

        # ===== 报告生成 =====
        return {
            "report_date": now.isoformat(),
            "period": "all_time",
            "basic_stats": {
                "total_articles": total,
                "articles_read": read,
                "articles_starred": starred,
                "read_rate": round(read / max(total, 1) * 100, 1),
                "ai_summarized": ai_count,
                "ai_translated": translated_count
            },
            "reading_habits": {
                "peak_hour": peak_hour,
                "time_of_day": time_of_day,
                "hourly_distribution": hourly,
                "reading_streak": streak_info
            },
            "top_feed": top_feed,
            "feed_rankings": feed_stats[:5],
            "suggestions": suggestions,
            "insights": [
                f"你累计阅读了 {read} 篇文章",
                f"最活跃的阅读时段是 {time_of_day}",
                f"已连续打卡 {streak_info['current']} 天",
                f"AI 辅助使用了 {ai_count} 次"
            ]
        }


@router.get("/weekly-comparison")
async def weekly_comparison():
    """本周与上周对比"""
    async with async_session() as db:
        now = datetime.utcnow()
        week_start = now - timedelta(days=now.weekday())
        week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)

        last_week_start = week_start - timedelta(days=7)
        last_week_end = week_start

        # 本周数据
        this_week_read = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= week_start)
        )
        this_week_count = this_week_read.scalar() or 0

        this_week_starred = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.is_starred == True)
            .where(FeedItem.created_at >= week_start)
        )
        this_week_star = this_week_starred.scalar() or 0

        # 上周数据
        last_week_read = await db.execute(
            select(func.count(FeedItem.id))
            .where(FeedItem.is_read == True)
            .where(FeedItem.updated_at >= last_week_start)
            .where(FeedItem.updated_at < last_week_start)
        )
        last_week_count = last_week_read.scalar() or 0

        # 计算变化
        read_change = this_week_count - last_week_count
        read_change_pct = round((read_change / max(last_week_count, 1)) * 100, 1)

        return {
            "this_week": {
                "read": this_week_count,
                "starred": this_week_star
            },
            "last_week": {
                "read": last_week_count,
                "starred": 0
            },
            "change": {
                "read": read_change,
                "read_pct": read_change_pct,
                "trend": "up" if read_change > 0 else "down" if read_change < 0 else "same"
            }
        }


@router.get("/topic-analysis")
async def topic_analysis():
    """主题分析 - 基于标签和内容"""
    async with async_session() as db:
        # 获取所有标签
        tags_result = await db.execute(
            select(FeedItem.tags)
            .where(FeedItem.tags.isnot(None))
            .where(FeedItem.tags != "")
        )
        tags_data = tags_result.scalars().all()

        # 统计标签频率
        tag_counts = {}
        for tags_str in tags_data:
            tags = [t.strip() for t in tags_str.split(",") if t.strip()]
            for tag in tags:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1

        # 排序并获取前10
        top_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)[:10]

        return {
            "total_unique_tags": len(tag_counts),
            "top_tags": [
                {"tag": tag, "count": count}
                for tag, count in top_tags
            ],
            "analysis": f"你最关注的话题是 {top_tags[0][0] if top_tags else '暂无'}"
        }
