import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import Onboarding from "@/components/Onboarding";
import RSShubStatus from "@/components/RSShubStatus";
import ReadingGoalWidget from "@/components/ReadingGoalWidget";
import ReadingStreak from "@/components/ReadingStreak";
import RecentItems from "@/components/RecentItems";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <Onboarding />
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">阅川</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              阅读如江河，内容汇聚
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <ThemeToggle />
          </div>
        </header>

        {/* 状态栏 */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <RSShubStatus />
          <ReadingGoalWidget />
          <ReadingStreak />
          <RecentItems />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/feeds"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📡 订阅源管理</h2>
            <p className="text-gray-600 dark:text-gray-400">
              添加和管理你的内容订阅源
            </p>
          </Link>

          <Link
            href="/discover"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🔍 发现内容</h2>
            <p className="text-gray-600 dark:text-gray-400">
              浏览热门订阅源推荐
            </p>
          </Link>

          <Link
            href="/search"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🧠 知识搜索</h2>
            <p className="text-gray-600 dark:text-gray-400">
              搜索知识库中的相关内容
            </p>
          </Link>

          <Link
            href="/stats"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📊 阅读统计</h2>
            <p className="text-gray-600 dark:text-gray-400">
              查看你的阅读数据和AI使用统计
            </p>
          </Link>

          <Link
            href="/settings"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">⚙️ 设置</h2>
            <p className="text-gray-600 dark:text-gray-400">
              配置 API 和外观设置
            </p>
          </Link>

          <Link
            href="/history"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📜 阅读历史</h2>
            <p className="text-gray-600 dark:text-gray-400">
              查看你的阅读记录
            </p>
          </Link>

          <Link
            href="/read-later"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📋 稍后阅读</h2>
            <p className="text-gray-600 dark:text-gray-400">
              保存内容稍后阅读
            </p>
          </Link>

          <Link
            href="/review"
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🧠 间隔复习</h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI 辅助巩固记忆
            </p>
          </Link>

          <Link
            href="/features"
            className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">✨ 新功能</h2>
            <p className="text-gray-600 dark:text-gray-400">
              查看所有新功能
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">已完成功能</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>✅ 多平台订阅 (RSSHub)</div>
            <div>✅ AI 摘要生成</div>
            <div>✅ AI 翻译</div>
            <div>✅ 知识图谱</div>
            <div>✅ 标签与笔记</div>
            <div>✅ 阅读统计</div>
            <div>✅ 间隔复习</div>
            <div>✅ 暗色模式</div>
            <div>✅ 视频转录</div>
            <div>✅ Notion 导出</div>
            <div>✅ 阅读进度同步</div>
            <div>✅ 国际化</div>
            <div>✅ 阅读打卡</div>
            <div>✅ 自定义分类</div>
            <div>✅ 阅读成就</div>
            <div>✅ 智能过滤器</div>
            <div>✅ 阅读提醒</div>
            <div>✅ 订阅源健康</div>
            <div>✅ 每周摘要</div>
            <div>✅ 专注模式</div>
            <div>✅ 数据备份</div>
            <div>✅ API Key管理</div>
            <div>✅ Pocket集成</div>
            <div>✅ 文章高亮</div>
            <div>✅ 智能排序</div>
            <div>✅ 标签管理</div>
            <div>✅ 阅读目标</div>
          </div>
        </div>
      </div>
    </main>
  );
}
