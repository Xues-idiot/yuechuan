"""
社交分享 API - 自定义分享内容和平台
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/social", tags=["social"])


class ShareTemplate(BaseModel):
    title: str
    content: str
    url: str
    via: str | None = None


class SharePlatform(BaseModel):
    id: str
    name: str
    icon: str
    color: str


PLATFORMS = [
    {"id": "twitter", "name": "Twitter", "icon": "🐦", "color": "#1DA1F2"},
    {"id": "weibo", "name": "Weibo", "icon": "🔴", "color": "#E6162D"},
    {"id": "telegram", "name": "Telegram", "icon": "✈️", "color": "#0088CC"},
    {"id": "whatsapp", "name": "WhatsApp", "icon": "💬", "color": "#25D366"},
    {"id": "reddit", "name": "Reddit", "icon": "🤖", "color": "#FF4500"},
    {"id": "linkedin", "name": "LinkedIn", "icon": "💼", "color": "#0077B5"},
    {"id": "copy", "name": "Copy Link", "icon": "📋", "color": "#666666"},
]


@router.get("/platforms", response_model=list[SharePlatform])
async def get_share_platforms():
    """获取支持的分享平台"""
    return PLATFORMS


@router.post("/prepare/{platform}")
async def prepare_share(platform: str, template: ShareTemplate):
    """准备分享内容"""
    if platform == "twitter":
        text = f"{template.title}\n\n{template.url}"
        if template.via:
            text += f"\n\nvia @{template.via}"
        return {"url": f"https://twitter.com/intent/tweet?text={text}"}

    elif platform == "weibo":
        text = f"{template.title} {template.url}"
        return {"url": f"https://service.weibo.com/share/share.php?url={template.url}&title={template.title}"}

    elif platform == "telegram":
        text = f"{template.title}\n\n{template.url}"
        return {"url": f"https://t.me/share/url?url={template.url}&text={text}"}

    elif platform == "reddit":
        return {"url": f"https://reddit.com/submit?url={template.url}&title={template.title}"}

    elif platform == "linkedin":
        return {"url": f"https://www.linkedin.com/sharing/share-offsite/?url={template.url}"}

    elif platform == "whatsapp":
        text = f"{template.title} {template.url}"
        return {"url": f"https://wa.me/?text={text}"}

    elif platform == "copy":
        return {"text": f"{template.title}\n{template.url}"}

    return {"error": "Unknown platform"}


@router.post("/save-template")
async def save_share_template(template: ShareTemplate):
    """保存自定义分享模板"""
    # TODO: 存储到数据库
    return {"success": True}


@router.get("/templates")
async def get_share_templates():
    """获取已保存的分享模板"""
    return [
        {
            "id": "default",
            "name": "Default",
            "template": "{title}\n\n{url}"
        },
        {
            "id": "detailed",
            "name": "Detailed",
            "template": "{title}\n\n摘要: {summary}\n\n链接: {url}"
        }
    ]
