# 阅川 - 技术架构

> 本文档描述阅川系统的技术架构

---

## 一、系统概述

```
┌─────────────────────────────────────────────────────────────┐
│                      用户界面层 (Next.js)                    │
│  - 订阅源管理                                                │
│  - 内容阅读器                                                │
│  - 知识图谱                                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API 网关层 (FastAPI)                    │
│  - REST API                                                 │
│  - WebSocket (实时)                                         │
│  - SSE (流式响应)                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      AI 服务层                               │
│  - summarizer: 摘要生成                                      │
│  - transcriber: 视频转录                                    │
│  - translator: 翻译服务                                      │
│  - keyword_checker: 关键词审核                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      内容服务层                              │
│  - rss_processor: RSS处理                                    │
│  - platform_fetcher: 各平台内容获取                          │
│  - content_storage: 内容存储                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      知识图谱层                              │
│  - knowledge_graph: 知识点关联                              │
│  - vector_store: ChromaDB 向量存储                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、目录结构

```
yuechuan/
├── backend/
│   ├── agents/              # AI Agent
│   │   ├── __init__.py
│   │   ├── summarizer.py    # 摘要生成 Agent
│   │   ├── transcriber.py   # 视频转录 Agent
│   │   └── translator.py    # 翻译 Agent
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── rss_processor.py # RSS 订阅处理
│   │   ├── platform_fetcher.py # 平台内容获取
│   │   ├── content_storage.py  # 内容存储
│   │   └── knowledge_graph.py  # 知识图谱
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes/
│   │   │   ├── subscriptions.py  # 订阅管理 API
│   │   │   ├── content.py        # 内容 API
│   │   │   └── ai.py            # AI 服务 API
│   │   └── middleware/
│   │
│   ├── db/
│   │   ├── __init__.py
│   │   ├── models.py        # 数据模型
│   │   └── migrations/      # 数据库迁移
│   │
│   ├── config.py            # 配置
│   └── main.py              # 入口
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (routes)/   # 页面
│   │   │   │   ├── feed/   # 订阅源
│   │   │   │   ├── read/   # 阅读器
│   │   │   │   ├── graph/  # 知识图谱
│   │   │   │   └── settings/ # 设置
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/         # shadcn/ui 组件
│   │   │   ├── feed/       # 订阅源组件
│   │   │   ├── reader/     # 阅读器组件
│   │   │   └── graph/      # 知识图谱组件
│   │   │
│   │   ├── lib/            # 工具函数
│   │   ├── hooks/          # React Hooks
│   │   └── stores/          # Zustand 状态
│   │
│   └── package.json
│
├── shared/                  # 共享包
│   └── ai-core/            # 与其他项目共享的 AI 能力
│
├── _reference/             # 参考项目
│   ├── FreshRSS/
│   ├── RSSHub/
│   ├── v2/ (Miniflux)
│   └── deer-flow/
│
├── docs/                   # 文档
├── tests/                  # 测试
├── README.md
├── PROJECT.md
├── WORKFLOW.md
└── ARCHITECTURE.md
```

---

## 三、核心模块

### 3.1 AI 服务层

#### Summarizer (摘要生成)

```python
class SummarizerAgent:
    """AI 摘要生成 Agent"""

    def summarize_content(content: str, options: SummarizeOptions) -> Summary:
        """
        输入：长文本 / 视频转录
        输出：结构化摘要
            -一句话概括
            -关键点列表
            -标签/分类
        """
```

**Prompt 设计**：
```
你是一个内容摘要专家。请对以下内容生成简洁、准确的摘要。

要求：
1. 一句话概括核心内容（不超过50字）
2. 列出3-5个关键点
3. 生成3-5个标签

内容：{content}
```

#### Transcriber (视频转录)

```python
class TranscriberAgent:
    """视频转文字 Agent"""

    async def transcribe_video(
        video_url: str,
        language: str = "auto"
    ) -> TranscribeResult:
        """
        输入：视频URL
        输出：转录结果
            -完整文本
            -时间戳（可选）
            -语言检测
        """
```

**技术方案**：
- 本地：Whisper (openai/whisper)
- API：MiniMax / 第三方 ASR API

#### Translator (翻译)

```python
class TranslatorAgent:
    """翻译 Agent"""

    async def translate(
        text: str,
        target_lang: str = "zh",
        service: str = "immersive"  # immersive / deepl / gpt
    ) -> Translation:
        """
        输入：原文
        输出：翻译结果（双语对照）
        """
```

---

### 3.2 内容服务层

#### RSS Processor

```python
class RSSProcessor:
    """RSS 订阅处理"""

    async def fetch_feed(feed_url: str) -> Feed:
        """获取 RSS 源内容"""

    async def discover_feeds(source_url: str) -> List[Feed]:
        """自动发现 RSS 源"""

    async def parse_entry(entry: Any) -> ContentItem:
        """解析单条内容"""
```

#### Platform Fetcher

```python
class PlatformFetcher:
    """各平台内容获取"""

    # 支持的平台
    PLATFORMS = [
        "wechat",      # 微信公众号
        "xiaohongshu", # 小红书
        "bilibili",    # 哔哩哔哩
        "douyin",      # 抖音
        "youtube",     # YouTube
        "weibo",       # 微博
        "zhihu",       # 知乎
        "jike",        # 即刻
    ]

    async def fetch_content(
        platform: str,
        url: str
    ) -> PlatformContent:
        """获取指定平台的内容"""
```

---

### 3.3 知识图谱层

```python
class KnowledgeGraph:
    """知识图谱"""

    async def add_content(
        content_id: str,
        embedding: List[float],
        metadata: ContentMetadata
    ):
        """添加内容到知识图谱"""

    async def find_related(
        content_id: str,
        top_k: int = 5
    ) -> List[RelatedContent]:
        """查找相关内容"""

    async def get_graph_view() -> GraphData:
        """获取知识图谱可视化数据"""
```

**向量存储**：ChromaDB

---

## 四、API 设计

### 4.1 订阅管理

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/subscriptions` | 获取订阅列表 |
| POST | `/api/subscriptions` | 添加订阅源 |
| DELETE | `/api/subscriptions/{id}` | 删除订阅 |
| PUT | `/api/subscriptions/{id}` | 更新订阅 |

### 4.2 内容 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/feed` | 获取订阅源更新 |
| GET | `/api/content/{id}` | 获取内容详情 |
| POST | `/api/content/{id}/transcribe` | 转录视频 |
| POST | `/api/content/{id}/summarize` | 生成摘要 |
| POST | `/api/content/{id}/translate` | 翻译内容 |

### 4.3 知识图谱 API

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/graph` | 获取知识图谱数据 |
| GET | `/api/graph/related/{id}` | 获取相关内容 |

---

## 五、数据模型

### Subscription

```python
class Subscription:
    id: str
    platform: str          # wechat/xiaohongshu/bilibili/...
    url: str               # 订阅源URL
    title: str             # 显示名称
    icon: str              # 图标
    category: str          # 分类
    created_at: datetime
    updated_at: datetime
```

### ContentItem

```python
class ContentItem:
    id: str
    subscription_id: str
    platform: str
    url: str
    title: str
    author: str
    published_at: datetime
    content_type: str      # article/video
    content: str           # 正文/转录
    summary: str           # 摘要
    translation: str       # 翻译
    tags: List[str]
    is_read: bool
    created_at: datetime
```

---

## 六、技术选型

| 层级 | 技术 | 备注 |
|------|------|------|
| 前端框架 | Next.js 15 | App Router |
| UI 组件 | shadcn/ui | Tailwind CSS |
| 状态管理 | Zustand | 轻量级 |
| 后端框架 | FastAPI | Python |
| AI 框架 | LangGraph | Agent 编排 |
| 数据库 | PostgreSQL | 主数据 |
| 向量存储 | ChromaDB | 知识图谱 |
| 视频转录 | Whisper | 本地/云端 |
| 翻译 | 沉浸式翻译 API | 多引擎 |

---

## 七、部署架构

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  (反向代理)  │
                    └─────────────┘
                           ↓
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Frontend    │  │    Backend    │  │   Worker      │
│   (Next.js)   │  │   (FastAPI)   │  │  (Whisper)    │
│               │  │               │  │               │
│   :3000       │  │   :8000       │  │   GPU         │
└───────────────┘  └───────────────┘  └───────────────┘
                           ↓
                   ┌───────────────┐
                   │  PostgreSQL   │
                   │  + ChromaDB   │
                   └───────────────┘
```

---

*架构文档 | 阅川 | 2026-03-25*
