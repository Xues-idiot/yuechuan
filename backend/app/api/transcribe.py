"""
视频转录 API - 使用 Whisper 进行音视频转文字
"""
import httpx
import whisper
import tempfile
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/transcribe", tags=["转录"])

# 全局模型缓存
_model_cache: Optional[whisper.Whisper] = None

def get_model():
    """获取或加载 Whisper 模型"""
    global _model_cache
    if _model_cache is None:
        _model_cache = whisper.load_model("base")
    return _model_cache

class TranscribeResponse(BaseModel):
    text: str
    language: Optional[str] = None
    segments: list = []

@router.post("", response_model=TranscribeResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    language: Optional[str] = None,
    model: str = "base"
):
    """
    转录音视频文件为文字

    - **file**: 音视频文件 (mp3, mp4, wav, m4a, etc.)
    - **language**: 可选，指定语言以加速处理
    """
    # 验证文件类型
    allowed_types = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a",
                    "audio/x-m4a", "video/mp4", "video/webm", "application/octet-stream"]
    content_type = file.content_type or "application/octet-stream"

    if not any(t in content_type for t in allowed_types):
        raise HTTPException(status_code=400, detail=f"不支持的文件类型: {content_type}")

    # 读取文件到临时文件
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # 加载模型并转录
        whisper_model = get_model()
        options = {"task": "transcribe"}
        if language:
            options["language"] = language

        result = whisper_model.transcribe(tmp_path, **options)

        return TranscribeResponse(
            text=result["text"],
            language=result.get("language"),
            segments=result.get("segments", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"转录失败: {str(e)}")
    finally:
        # 清理临时文件
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/url")
async def transcribe_from_url(url: str, language: Optional[str] = None):
    """
    从 URL 下载音视频并转录

    - **url**: 音视频文件的 URL
    - **language**: 可选，指定语言
    """
    allowed_extensions = (".mp3", ".mp4", ".wav", ".m4a", ".webm")
    if not any(url.lower().endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="URL 必须指向音视频文件")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(url)
            response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        try:
            whisper_model = get_model()
            options = {"task": "transcribe"}
            if language:
                options["language"] = language

            result = whisper_model.transcribe(tmp_path, **options)

            return TranscribeResponse(
                text=result["text"],
                language=result.get("language"),
                segments=result.get("segments", [])
            )
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    except httpx.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"下载失败: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"转录失败: {str(e)}")
