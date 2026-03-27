import Link from "next/link";

const FEATURE_CATEGORIES = [
  {
    title: "📊 数据分析",
    features: [
      { icon: "📈", title: "阅读统计", description: "详细的阅读数据分析", page: "/analytics" },
      { icon: "📊", title: "高级分析", description: "深度分析和优化建议", page: "/advanced-analytics" },
      { icon: "📈", title: "阅读时间线", description: "可视化阅读历史", page: "/reading-timeline" },
      { icon: "📊", title: "每周摘要", description: "本周阅读总结和趋势", page: "/weekly-digest" },
      { icon: "🎯", title: "阅读目标", description: "设置和追踪阅读目标", page: "/goals" },
    ]
  },
  {
    title: "🎯 阅读增强",
    features: [
      { icon: "🎨", title: "阅读模式", description: "自定义阅读体验", page: "/reading-mode" },
      { icon: "🎯", title: "专注模式", description: "无干扰专注阅读", page: "/focus-mode" },
      { icon: "⚡", title: "阅读速度", description: "追踪阅读效率", page: "/reading-speed" },
      { icon: "🔊", title: "语音播放", description: "文字转语音听书", page: "/audio" },
    ]
  },
  {
    title: "🏷️ 内容组织",
    features: [
      { icon: "📋", title: "标签管理", description: "管理和组织标签", page: "/tags" },
      { icon: "📁", title: "分类管理", description: "自定义订阅源分类", page: "/categories" },
      { icon: "✏️", title: "高亮笔记", description: "高亮和标注文章", page: "/highlights" },
      { icon: "🔄", title: "智能排序", description: "AI驱动的智能排序", page: "/smart-sort" },
      { icon: "🎛️", title: "内容过滤", description: "自定义过滤规则", page: "/content-filter" },
    ]
  },
  {
    title: "⚡ 快捷工具",
    features: [
      { icon: "📑", title: "批量操作", description: "批量管理文章", page: "/batch" },
      { icon: "⚡", title: "快捷操作", description: "快速访问常用功能", page: "/quick-actions" },
      { icon: "⌨️", title: "键盘快捷键", description: "自定义快捷键", page: "/keyboard" },
      { icon: "🔍", title: "智能过滤", description: "AI智能内容过滤", page: "/smart-filters" },
    ]
  },
  {
    title: "📤 数据管理",
    features: [
      { icon: "💾", title: "数据备份", description: "导入导出和备份", page: "/backup" },
      { icon: "📤", title: "阅读列表", description: "管理待读文章", page: "/reading-list" },
      { icon: "📄", title: "导出PDF", description: "导出为PDF/HTML格式", page: "/export/pdf" },
    ]
  },
  {
    title: "🔗 第三方集成",
    features: [
      { icon: "📦", title: "Pocket集成", description: "同步到Pocket", page: "/integrations/pocket" },
      { icon: "📱", title: "订阅源推荐", description: "发现新的订阅源", page: "/recommendations" },
      { icon: "🔑", title: "API密钥", description: "管理第三方访问", page: "/api-keys" },
    ]
  },
  {
    title: "⚙️ 设置",
    features: [
      { icon: "🔔", title: "通知设置", description: "配置通知偏好", page: "/notifications" },
      { icon: "🔧", title: "解析规则", description: "自定义RSS解析", page: "/parser-rules" },
      { icon: "💚", title: "订阅源健康", description: "监控订阅源状态", page: "/health" },
      { icon: "⏰", title: "阅读提醒", description: "设置每日提醒", page: "/reminders" },
    ]
  },
  {
    title: "🏆 成就与追踪",
    features: [
      { icon: "🏆", title: "成就系统", description: "完成挑战解锁徽章", page: "/achievements" },
      { icon: "📅", title: "阅读 streak", description: "每日阅读打卡追踪", page: "/streak" },
    ]
  }
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">✨ 功能一览</h1>
          <p className="text-gray-600 dark:text-gray-400">
            探索阅川的所有功能
          </p>
        </header>

        <div className="space-y-8">
          {FEATURE_CATEGORIES.map((category) => (
            <section key={category.title}>
              <h2 className="text-xl font-bold mb-4">{category.title}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.features.map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.page}
                    className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-md group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{feature.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                            {feature.title}
                          </h3>
                          <span className="text-gray-300 group-hover:text-blue-400 transition-colors">→</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Coming Soon */}
        <section className="mt-12">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🚧 即将推出</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>🤝</span>
                <span>协作阅读</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔗</span>
                <span>更多集成</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧠</span>
                <span>个性化推荐</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>多语言支持</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>移动端App</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400">快速链接</h3>
              <p className="text-sm text-gray-500">常用页面一键访问</p>
            </div>
            <div className="flex gap-3">
              <Link href="/feeds" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-sm">
                📡 订阅源
              </Link>
              <Link href="/search" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-sm">
                🔍 搜索
              </Link>
              <Link href="/settings" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 text-sm">
                ⚙️ 设置
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}