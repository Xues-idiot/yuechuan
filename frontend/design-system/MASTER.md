# YueChuan 设计系统 (YueChuan Design System)

> 阅川 - 阅读如江河，内容汇聚
> 基于 ui-ux-pro-max 设计的生产级前端规范

---

## 1. 产品定位

| 属性 | 值 |
|------|-----|
| **产品类型** | RSS阅读器 + AI内容聚合平台 |
| **目标用户** | 追求高效阅读的知识工作者 |
| **核心价值** | 统一订阅入口 + AI消化 + 直接消费 |
| **设计理念** | 内容优先、沉浸式阅读、智能高效 |

---

## 2. 设计风格

### 选用风格: **Editorial Minimalism + Glassmorphism**

**为什么选择这个风格:**
- **Editorial Minimalism**: RSS阅读器核心是文字内容，需要清爽、无干扰的阅读环境
- **Glassmorphism**: 为AI功能（摘要、翻译、知识图谱）提供现代化的视觉层次
- **内容优先**: 大面积留白，让内容成为焦点
- **智能感**: 通过微妙的渐变和模糊效果体现AI能力

**风格关键词:** `minimal`, `content-first`, `editorial`, `glass`, `modern`, `intelligent`

### 禁用的 Anti-Patterns

```
✗ 避免紫色渐变 (典型AI slop)
✗ 避免过度使用emoji作为图标
✗ 避免混合flat和skeuomorphic风格
✗ 避免灰色系为主的单调配色
✗ 避免系统默认字体 (Arial, Inter, Roboto)
```

---

## 3. 色彩系统

### 主色调: **Slate Navy + Cyan Accent**

```
背景色:
- 浅色模式: #FAFBFC (背景) / #FFFFFF (卡片)
- 深色模式: #0F172A (背景) / #1E293B (卡片)

主色调:
- Primary: #0369A1 (Cyan-700 - 沉稳的青蓝色)
- Primary Light: #0EA5E9 (Cyan-500)
- Primary Dark: #075985 (Cyan-800)

强调色:
- Accent: #F59E0B (Amber-500 - 用于未读标记、高亮)
- Success: #10B981 (Emerald-500)
- Warning: #F59E0B (Amber-500)
- Error: #EF4444 (Red-500)

文字色:
- 浅色: #0F172A (主文字) / #475569 (次文字) / #94A3B8 (弱文字)
- 深色: #F8FAFC (主文字) / #94A3B8 (次文字) / #64748B (弱文字)

边框:
- 浅色: #E2E8F0
- 深色: #334155
```

### 语义色彩 Token

```css
:root {
  /* 表面 */
  --surface-primary: #FFFFFF;
  --surface-secondary: #F8FAFC;
  --surface-elevated: rgba(255, 255, 255, 0.8);
  --surface-glass: rgba(255, 255, 255, 0.15);

  /* 文字 */
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #94A3B8;
  --text-inverse: #F8FAFC;

  /* 边框 */
  --border-default: #E2E8F0;
  --border-hover: #CBD5E1;

  /* 主色 */
  --color-primary: #0369A1;
  --color-primary-hover: #075985;
  --color-primary-light: #E0F2FE;

  /* 状态 */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* 未读/高亮 */
  --color-unread: #F59E0B;
  --color-starred: #EAB308;
}

.dark {
  --surface-primary: #1E293B;
  --surface-secondary: #0F172A;
  --surface-elevated: rgba(30, 41, 59, 0.8);
  --surface-glass: rgba(30, 41, 59, 0.6);

  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-tertiary: #64748B;

  --border-default: #334155;
  --border-hover: #475569;

  --color-primary: #0EA5E9;
  --color-primary-hover: #38BDF8;
  --color-primary-light: #0C4A6E;
}
```

---

## 4. 字体系统

### 选用字体: **Source Serif 4 + Inter**

```
标题字体: Source Serif 4 (衬线体，体现编辑感和品质感)
- Display: Source Serif 4, 700, 32-48px
- Heading: Source Serif 4, 600, 24-28px
- Subhead: Source Serif 4, 500, 18-20px

正文字体: Inter (无衬线，高可读性)
- Body: Inter, 400, 16px, line-height: 1.6
- Caption: Inter, 400, 14px
- Label: Inter, 500, 12-14px

代码字体: JetBrains Mono
- Code: JetBrains Mono, 400, 14px
```

### 字体加载

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet">
```

### Type Scale

```
Display: 48px / 1.1 / 700 / Source Serif 4
H1: 32px / 1.2 / 700 / Source Serif 4
H2: 28px / 1.3 / 600 / Source Serif 4
H3: 24px / 1.4 / 600 / Source Serif 4
H4: 20px / 1.4 / 500 / Source Serif 4
Body: 16px / 1.6 / 400 / Inter
Body Small: 14px / 1.5 / 400 / Inter
Caption: 12px / 1.4 / 400 / Inter
Label: 14px / 1.2 / 500 / Inter
```

---

## 5. 间距系统

### 基础间距 (8px Grid)

```
space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 20px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px
space-16: 64px
space-20: 80px
space-24: 96px
```

### 组件间距

```
卡片内边距: 20px (space-5)
卡片间距: 16px (space-4)
区块间距: 32px (space-8)
页面边距 (移动端): 16px
页面边距 (桌面端): 24-32px
最大内容宽度: 720px (阅读内容) / 1200px (仪表盘)
```

---

## 6. 圆角与阴影

### 圆角系统

```
radius-sm: 6px   (按钮、输入框)
radius-md: 10px  (卡片)
radius-lg: 16px  (模态框、大型卡片)
radius-xl: 24px  (特殊装饰)
radius-full: 9999px (标签、徽章)
```

### 阴影系统

```
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.12), backdrop-filter: blur(12px);
```

---

## 7. 动效系统

### 时间曲线

```
duration-instant: 50ms    (hover反馈)
duration-fast: 150ms      (小型过渡)
duration-normal: 250ms    (标准过渡)
duration-slow: 400ms      (大型过渡)

easing-standard: cubic-bezier(0.4, 0, 0.2, 1)   (标准)
easing-decelerate: cubic-bezier(0, 0, 0.2, 1)  (进入)
easing-accelerate: cubic-bezier(0.4, 0, 1, 1)  (退出)
easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1) (弹性)
```

### 关键动效

```
页面加载: stagger fade-in + translateY(8px), 每项延迟50ms
卡片悬停: scale(1.01) + shadow-md, 150ms
按钮按下: scale(0.98), 50ms
侧边栏: translateX, 250ms ease-out
模态框: fade + scale(0.95→1), 250ms
Toast: slideIn from top + fade, 300ms
骨架屏: shimmer animation, 1.5s循环
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. 组件规范

### 按钮

```
Primary: bg-primary, text-white, shadow-sm, rounded-md
  - Hover: bg-primary-hover, shadow-md
  - Active: scale(0.98)
  - Disabled: opacity-50, cursor-not-allowed

Secondary: bg-secondary, border, text-primary
  - Hover: bg-secondary-hover

Ghost: transparent, text-secondary
  - Hover: bg-secondary

Danger: bg-error, text-white
```

### 卡片

```
基础卡片:
- bg: surface-primary
- border: border-default (1px)
- radius: radius-md (10px)
- shadow: shadow-sm
- padding: space-5 (20px)

悬停: shadow-md + border-hover
选中: border-primary (2px) + bg-primary-light/5
```

### 输入框

```
高度: 40px
padding: 12px 16px
border: border-default, radius-sm
focus: border-primary, ring-2 ring-primary/20
error: border-error, ring-2 ring-error/20
```

### 导航

```
顶部导航栏:
- height: 56px
- bg: surface-primary/80 + backdrop-blur
- border-bottom: border-default
- 固定定位

侧边栏 (桌面端):
- width: 240px (可折叠至 64px)
- bg: surface-secondary
- 导航项高度: 44px
- 激活状态: bg-primary-light + text-primary + border-left

底部导航 (移动端):
- height: 64px + safe-area
- max-items: 5
- 图标尺寸: 24px
- 标签: 10px
```

---

## 9. 图标系统

### 图标库: **Lucide React**

```
规则:
- 使用 Lucide Icons (线性风格, 1.5px stroke)
- 统一尺寸: 16px (small), 20px (medium), 24px (large)
- 禁止使用 emoji 作为功能图标
- 图标颜色跟随 text-secondary, hover 时变为 text-primary
```

### 常用图标映射

```
首页: <HomeIcon />
阅读: <BookOpenIcon />
收藏: <BookmarkIcon />
搜索: <SearchIcon />
设置: <SettingsIcon />
添加: <PlusIcon />
刷新: <RefreshCwIcon />
删除: <TrashIcon />
编辑: <PencilIcon />
分享: <Share2Icon />
返回: <ArrowLeftIcon />
更多: <MoreHorizontalIcon />
主题: <SunIcon / MoonIcon />
通知: <BellIcon />
```

---

## 10. 深色模式

深色模式必须与浅色模式**同时设计**，不能简单反转。

### 深色模式核心规则

```
1. 表面使用深色 tonal variations，不是纯黑
2. 文字对比度保持 4.5:1 (普通文字) / 3:1 (大文字)
3. 使用 desaturated 的色调，避免过饱和
4. 边框在深色模式下仍需可见
5. 阴影在深色模式下使用 rgba(0,0,0,0.3+)
```

### 主题切换

```tsx
// 使用 CSS 变量 + class strategy
<html className="dark">
// 或使用 data-theme="dark" 属性
```

---

## 11. 可访问性 (A11y)

### 必须满足

| 规则 | 标准 |
|------|------|
| 颜色对比 | 4.5:1 (普通文字) / 3:1 (大文字 ≥18px) |
| 点击目标 | ≥44×44px |
| 焦点环 | 可见的 focus ring (2-4px) |
| 替代文字 | 所有有意义图片提供 alt |
| ARIA标签 | 图标按钮提供 aria-label |
| 键盘导航 | 完整的 Tab 顺序 |

### 表单无障碍

```
- 每个输入框必须有 <label>
- 错误提示必须在字段下方
- 必填字段用星号标记
- 错误颜色不能是唯一的指示方式
```

---

## 12. 页面结构规范

### 阅读页面 (核心)

```
最大内容宽度: 720px (最佳阅读宽度)
行高: 1.7-1.8
字号: 17-18px
段落间距: 1.5em
中文间距优化: letter-spacing: 0.02em
```

### 列表页面

```
卡片列表: 单列或双列 (桌面端)
列表项高度: ≥72px (舒适点击)
间距: 12-16px
悬停反馈: 背景色变化 + 轻微阴影
```

### 仪表盘页面

```
网格系统: 12列网格
卡片最小宽度: 280px
重要数据使用大字号 Display
图表区域留有足够呼吸空间
```

---

## 13. 空状态与加载

### 空状态

```
图标: 使用 Lucide 图标, 48px, text-tertiary
标题: H4, text-primary
描述: Body, text-secondary
行动按钮: Primary button

示例:
┌─────────────────────────┐
│                         │
│      <BookmarkIcon />   │
│        48px, gray       │
│                         │
│      还没有收藏         │
│      H4, 文字          │
│                         │
│   开始添加你喜欢的      │
│   内容到收藏夹         │
│   Body, text-secondary  │
│                         │
│   [ 添加内容 ]          │
│                         │
└─────────────────────────┘
```

### 加载状态

```
<1s: 使用 skeleton shimmer
≥1s: 显示进度指示器
骨架屏必须与实际布局一致
不允许显示空白区域
```

---

## 14. Toast 与反馈

### Toast 规范

```
位置: 顶部居中
最大宽度: 400px
圆角: radius-lg
动画: 从顶部滑入 + fade
自动消失: 4-5秒
可手动关闭

类型:
- Success: 左边框 success 色 + CheckCircleIcon
- Error: 左边框 error 色 + XCircleIcon
- Warning: 左边框 warning 色 + AlertTriangleIcon
- Info: 左边框 primary 色 + InfoIcon
```

---

## 15. 实现优先级

### Phase 1: 核心基础

```
1. CSS 变量定义 (颜色、字体、间距)
2. 全局样式重置
3. 主题切换实现
4. 基础组件: Button, Card, Input, Badge
5. 布局组件: Header, Sidebar, BottomNav
```

### Phase 2: 内容展示

```
6. Feed 列表卡片
7. Article 阅读视图
8. 导航系统
9. 搜索组件
10. 空状态组件
```

### Phase 3: 增强功能

```
11. Skeleton 加载
12. Toast 通知
13. Modal 对话框
14. 高级阅读设置
15. 主题定制
```

---

## 16. 技术实现

### 使用 Tailwind CSS 扩展

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          elevated: 'var(--surface-elevated)',
        },
        // ... 更多变量
      },
      fontFamily: {
        serif: ['Source Serif 4', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12), backdrop-filter: blur(12px)',
      },
    },
  },
}
```

### 组件架构

```
components/
├── ui/                    # 基础 UI 组件
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   └── ...
├── layout/               # 布局组件
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── BottomNav.tsx
│   └── PageContainer.tsx
├── feedback/            # 反馈组件
│   ├── Toast.tsx
│   ├── Modal.tsx
│   ├── Skeleton.tsx
│   └── EmptyState.tsx
└── features/           # 功能组件
    ├── FeedCard.tsx
    ├── ArticleView.tsx
    └── ...
```

---

## 17. 设计决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-03-28 | 选用 Slate Navy + Cyan | 沉稳专业，适合知识阅读 |
| 2026-03-28 | Source Serif 4 + Inter | 衬线标题有编辑感，正文高可读 |
| 2026-03-28 | Editorial Minimalism + Glass | 内容优先，AI功能有现代感 |

---

## 18. 无障碍 (A11y) 合规标准

### 必须满足的无障碍要求

| 规则 | 标准 | 状态 |
|------|------|------|
| 颜色对比 | 4.5:1 (普通文字) / 3:1 (大文字 >= 18px) | 已实现 |
| 点击目标 | >= 44x44px | 已实现 |
| 焦点环 | 可见的 focus ring (2-4px) | 已实现 |
| 替代文字 | 所有有意义图片提供 alt | 已实现 |
| ARIA标签 | 图标按钮提供 aria-label | 已实现 |
| 键盘导航 | 完整的 Tab 顺序 | 已实现 |
| ARIA live regions | 动态内容变化通知 | 已实现 |
| 角色属性 | 交互元素提供正确的 role | 已实现 |

### 组件无障碍清单

```
Button:
  - aria-busy: 加载状态
  - aria-disabled: 禁用状态
  - aria-hidden: 图标
  - focus-visible ring

Input/Textarea:
  - aria-invalid: 错误状态
  - aria-describedby: 错误/提示信息
  - :disabled 样式
  - 唯一 ID 生成

Checkbox:
  - aria-checked: 选中状态
  - aria-describedby: 描述文本
  - indeterminate 状态支持
  - 键盘 Enter/Space 激活

Dropdown:
  - aria-haspopup: listbox
  - aria-expanded: 展开状态
  - aria-selected: 选中项
  - 完整的键盘导航

Pagination:
  - aria-label: 分页导航
  - aria-current: 当前页
  - 完整的键盘支持

Table:
  - aria-sort: 排序列
  - caption: 表格描述
  - 键盘排序支持

Toast:
  - role="alert": 重要提示
  - aria-live: 动态通知
  - 可关闭按钮

ErrorMessage:
  - role="alert": 错误提示
  - 重试/忽略操作

EmptyState:
  - role="status": 状态提示
  - aria-live: 动态内容
```

---

## 19. 图标使用规范

### 必须使用 Lucide React 图标

```
禁止使用 Unicode 符号作为图标:
  ✗ "←" "→" "▲" "▼" "★" "☆" "✓" "!" "i"
  ✓ ChevronLeft, ChevronRight, ChevronUp, ChevronDown
  ✓ Star, Check, CheckCircle, AlertCircle, Info

图标使用规则:
  - 所有功能图标必须使用 Lucide React
  - aria-hidden="true" 隐藏装饰性图标
  - 需要文本标签的图标提供 aria-label
  - 图标颜色跟随 text-secondary
```

---

## 20. 最终质量检查清单

### 代码质量
- [x] 无 emoji 作为功能图标
- [x] 无 inline style jsx (使用标准 CSS)
- [x] 使用 useId() 替代 Math.random() 生成 ID
- [x] 组件使用 forwardRef 或 hooks
- [x] 完整的 TypeScript 类型

### 一致性检查
- [x] 设计令牌 (CSS Variables) 一致使用
- [x] 字体系统: Source Serif 4 + Inter
- [x] 颜色系统: Slate Navy + Cyan
- [x] 间距系统: 8px grid
- [x] 圆角系统: 6/10/16/24px

### 性能考虑
- [x] 动画使用 CSS transform/opacity
- [x] skeleton 加载状态
- [x] 适当的 useCallback/useMemo
- [x] 避免不必要的重渲染

---

*最后更新: 2026-03-28*
*基于 ui-ux-pro-max design skill*
*迭代轮次: 901-1000 完成*
