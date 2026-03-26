"""
PDF 导出 API
"""
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from app.core.database import async_session
from app.models.feed import FeedItem

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/pdf/{item_id}")
async def export_item_to_pdf(item_id: int):
    """将文章导出为 PDF"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem).where(FeedItem.id == item_id)
        )
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="Article not found")

        # 简化实现：返回文本内容
        # 实际应使用 weasyprint, pdfkit 等库生成 PDF
        content = f"""
        <html>
        <head>
            <title>{item.title}</title>
            <style>
                body {{ font-family: sans-serif; padding: 40px; }}
                h1 {{ color: #333; }}
                .meta {{ color: #666; margin-bottom: 20px; }}
                .content {{ line-height: 1.8; }}
            </style>
        </head>
        <body>
            <h1>{item.title}</h1>
            <div class="meta">
                <p>Author: {item.author or 'Unknown'}</p>
                <p>Source: {item.url}</p>
                <p>Date: {item.published_at or 'Unknown'}</p>
            </div>
            <div class="content">
                {item.content_text or item.content or 'No content available'}
            </div>
        </body>
        </html>
        """

        return StreamingResponse(
            io.BytesIO(content.encode()),
            media_type="text/html",
            headers={
                "Content-Disposition": f"attachment; filename={item.title[:50]}.html"
            }
        )


@router.get("/markdown/{item_id}")
async def export_item_to_markdown(item_id: int):
    """将文章导出为 Markdown"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem).where(FeedItem.id == item_id)
        )
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="Article not found")

        # 转换为 Markdown
        import re
        content = item.content_text or ""

        # 简单 HTML 转 Markdown
        content = re.sub(r'<h1[^>]*>(.*?)</h1>', r'# \1\n', content)
        content = re.sub(r'<h2[^>]*>(.*?)</h2>', r'## \1\n', content)
        content = re.sub(r'<h3[^>]*>(.*?)</h3>', r'### \1\n', content)
        content = re.sub(r'<p[^>]*>(.*?)</p>', r'\1\n\n', content)
        content = re.sub(r'<br\s*/?>', r'\n', content)
        content = re.sub(r'<[^>]+>', '', content)

        markdown = f"""# {item.title}

**Author:** {item.author or 'Unknown'}
**Source:** {item.url}
**Date:** {item.published_at or 'Unknown'}

---

{content}

---

*Exported from 阅川*
"""

        return StreamingResponse(
            io.BytesIO(markdown.encode()),
            media_type="text/markdown",
            headers={
                "Content-Disposition": f"attachment; filename={item.title[:50]}.md"
            }
        )


@router.get("/html/{item_id}")
async def export_item_to_html(item_id: int):
    """将文章导出为 HTML"""
    async with async_session() as db:
        result = await db.execute(
            select(FeedItem).where(FeedItem.id == item_id)
        )
        item = result.scalar_one_or_none()

        if not item:
            raise HTTPException(status_code=404, detail="Article not found")

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{item.title}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.8;
            color: #333;
        }}
        h1 {{ font-size: 2em; margin-bottom: 10px; }}
        .meta {{ color: #666; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }}
        .meta p {{ margin: 5px 0; }}
        img {{ max-width: 100%; height: auto; }}
        pre, code {{ background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }}
    </style>
</head>
<body>
    <h1>{item.title}</h1>
    <div class="meta">
        <p><strong>Author:</strong> {item.author or 'Unknown'}</p>
        <p><strong>Source:</strong> <a href="{item.url}">{item.url}</a></p>
        <p><strong>Published:</strong> {item.published_at or 'Unknown'}</p>
    </div>
    <div class="content">
        {item.content or item.content_text or 'No content available'}
    </div>
</body>
</html>"""

        return StreamingResponse(
            io.BytesIO(html.encode()),
            media_type="text/html",
            headers={
                "Content-Disposition": f"attachment; filename={item.title[:50]}.html"
            }
        )
