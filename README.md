# 阅川 (YueChuan)

> 阅读如江河，内容汇聚

**多平台内容聚合 + AI智能阅读器** - 订阅万物，AI消化，直接消费

[![Stars](https://img.shields.io/github/stars/Xues-idiot/yuechuan)](https://github.com/Xues-idiot/yuechuan)
[![License](https://img.shields.io/github/license/Xues-idiot/yuechuan)](LICENSE)

---

## 核心功能

| 功能 | 描述 |
|------|------|
| 📡 **多平台订阅** | 微信公众号 / 小红书 / B站 / 抖音 / YouTube / 微博 / 知乎 / 即刻 |
| 🎬 **视频转文字** | AI 转录视频内容，直接当文章阅读 |
| 🤖 **AI 摘要** | 一句话概括 + 关键点提炼 |
| 🌐 **沉浸式翻译** | 外语内容实时翻译成中文 |
| 🕸️ **知识图谱** | 知识点自动关联，发现相关内容 |

---

## 为什么是阅川

| 痛点 | 阅川解决 |
|------|----------|
| 太多平台要刷 | 统一订阅入口，一个地方看完所有更新 |
| 视频太长不想看 | AI 转文字，直接读 |
| 外语内容看不懂 | 沉浸式翻译，当中文读 |
| 内容太多看不过来 | AI 摘要提炼精华 |
| 看完就忘 | 知识图谱关联，形成知识网络 |

---

## 快速开始

### 前置要求

- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- ChromaDB

### 安装

```bash
# 克隆项目
git clone https://github.com/Xues-idiot/yuechuan.git
cd yuechuan

# 安装后端
cd backend
pip install -r requirements.txt

# 安装前端
cd ../frontend
npm install
```

### 运行

```bash
# 启动后端
cd backend
python main.py

# 启动前端 (另一个终端)
cd frontend
npm run dev
```

---

## 项目结构

```
yuechuan/
├── backend/           # 后端 (Python + FastAPI)
│   ├── agents/        # AI Agent
│   ├── services/      # 服务层
│   └── api/           # API 路由
├── frontend/          # 前端 (Next.js)
│   └── src/
│       ├── app/       # 页面
│       └── components/# 组件
├── shared/            # 共享包
└── _reference/        # 参考项目
```

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 15 / React / Tailwind CSS |
| 后端 | Python / FastAPI / SQLAlchemy |
| 数据库 | PostgreSQL / ChromaDB |
| AI | OpenAI GPT / Whisper |

### 设计系统
- 风格：Editorial Minimalism + Glassmorphism
- 配色：Slate Navy + Cyan Accent (#0369A1)
- 字体：Source Serif 4 + Inter + JetBrains Mono

---

## 竞品对比

| 产品 | 中文 | 视频转录 | 开源 | AI摘要 |
|------|:----:|:--------:|:----:|:------:|
| Folo | ❌ | ❌ | ❌ | ✅ |
| Readwise | ❌ | ❌ | ❌ | ✅ |
| RSSHub | ✅ | ❌ | ✅ | ❌ |
| **阅川** | ✅ | ✅ | ✅ | ✅ |

---

## Roadmap

- [x] MVP: 多平台订阅 + 图文阅读 + AI摘要
- [x] V1.0: 视频转录 + 翻译
- [x] V2.0: 知识图谱 + 间隔复习
- [x] 前端设计系统重构 (1000轮迭代)

---

## License

MIT

---

*阅川 - 让阅读更高效 | 2026-03-28*
