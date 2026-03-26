"""
文章音频播放 API
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/audio", tags=["audio"])


class TextToSpeechRequest(BaseModel):
    text: str
    language: str = "zh-CN"
    speed: float = 1.0


class TextToSpeechResponse(BaseModel):
    text: str
    audio_url: str | None = None
    duration_seconds: int
    word_count: int


@router.post("/tts", response_model=TextToSpeechResponse)
async def text_to_speech(request: TextToSpeechRequest):
    """将文本转换为语音"""
    # 简化实现，实际应调用 TTS 服务（如 Azure, Google, AWS Polly）
    word_count = len(request.text)
    duration_seconds = int(word_count / (5 * request.speed))  # 估算

    return TextToSpeechResponse(
        text=request.text[:100] + "..." if len(request.text) > 100 else request.text,
        audio_url=None,  # 实际应返回音频 URL
        duration_seconds=duration_seconds,
        word_count=word_count
    )


@router.get("/article/{item_id}")
async def get_article_audio(item_id: int):
    """获取文章的语音版本"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem).where(FeedItem.id == item_id)
        )
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="文章不存在")

        # 使用 AI 摘要或全文生成语音
        text = item.ai_summary or item.content_text or item.title
        word_count = len(text) if text else 0
        duration_seconds = int(word_count / 5)  # 估算

        return {
            "title": item.title,
            "text": text[:1000] if text else None,  # 限制长度
            "duration_seconds": duration_seconds,
            "word_count": word_count
        }


@router.get("/formats")
async def get_audio_formats():
    """获取支持的音频格式"""
    return {
        "formats": ["mp3", "wav", "ogg", "m4a"],
        "languages": ["zh-CN", "en-US", "ja-JP", "ko-KR"],
        "speeds": [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
    }
