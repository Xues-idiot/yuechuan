import Link from "next/link";

export default function NewFeaturesPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">New Features</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the latest features of YueChuan
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon="📅"
            title="Reading Streak"
            description="Track daily reading with streak tracking"
            link="/"
          />
          <FeatureCard
            icon="📁"
            title="Custom Categories"
            description="Organize feeds with custom categories"
            api="/categories"
          />
          <FeatureCard
            icon="🏆"
            title="Achievements"
            description="Complete reading challenges and unlock badges"
            api="/achievements"
          />
          <FeatureCard
            icon="⚡"
            title="Reading Speed"
            description="Track your reading speed and efficiency"
            api="/reading-speed"
          />
          <FeatureCard
            icon="🔍"
            title="Smart Filters"
            description="AI-powered content filtering"
            api="/smart-filters"
          />
          <FeatureCard
            icon="⏰"
            title="Reading Reminders"
            description="Set daily reading reminders"
            page="/reminders"
          />
          <FeatureCard
            icon="💚"
            title="Feed Health"
            description="Monitor your feed sources"
            page="/health"
          />
          <FeatureCard
            icon="📊"
            title="Weekly Digest"
            description="Weekly reading summary and trends"
            api="/weekly-digest"
          />
          <FeatureCard
            icon="🎯"
            title="Focus Mode"
            description="Distraction-free reading experience"
            api="/focus-mode"
          />
          <FeatureCard
            icon="💾"
            title="Backup"
            description="Export and import your reading data"
            api="/backup"
          />
          <FeatureCard
            icon="🔑"
            title="API Keys"
            description="Manage third-party access"
            api="/api-keys"
          />
          <FeatureCard
            icon="📤"
            title="Reading List"
            description="Import/export reading lists"
            api="/reading-list"
          />
          <FeatureCard
            icon="✏️"
            title="Highlights"
            description="Highlight and annotate articles"
            page="/highlights"
          />
          <FeatureCard
            icon="🔄"
            title="Smart Sort"
            description="AI-powered content sorting"
            api="/smart-sort"
          />
          <FeatureCard
            icon="📦"
            title="Pocket Integration"
            description="Sync with Pocket/Instapaper"
            api="/integrations/pocket"
          />
          <FeatureCard
            icon="🔊"
            title="Audio Playback"
            description="Text-to-speech article reading"
            api="/audio"
          />
          <FeatureCard
            icon="📈"
            title="Reading Timeline"
            description="Visual timeline of your reading history"
            api="/reading-timeline"
          />
          <FeatureCard
            icon="🔎"
            title="Advanced Search"
            description="Search with filters and suggestions"
            api="/search/advanced"
          />
          <FeatureCard
            icon="📋"
            title="Tags Management"
            description="Organize and manage all your tags"
            page="/tags"
          />
          <FeatureCard
            icon="📑"
            title="Batch Operations"
            description="Perform operations on multiple items"
            page="/batch"
          />
          <FeatureCard
            icon="🎨"
            title="Reading Mode"
            description="Customizable reading experience"
            page="/reading-mode"
          />
          <FeatureCard
            icon="📄"
            title="PDF/HTML Export"
            description="Export articles to various formats"
            api="/export/pdf"
          />
          <FeatureCard
            icon="📱"
            title="Feed Recommendations"
            description="Discover new feeds based on interests"
            api="/recommendations"
          />
          <FeatureCard
            icon="⌨️"
            title="Keyboard Shortcuts"
            description="Customizable keyboard shortcuts"
            page="/keyboard"
          />
          <FeatureCard
            icon="🔔"
            title="Notification Settings"
            description="Configure notification preferences"
            api="/notification-settings"
          />
          <FeatureCard
            icon="📈"
            title="Analytics Dashboard"
            description="Detailed reading analytics and insights"
            api="/analytics"
          />
          <FeatureCard
            icon="📊"
            title="Advanced Analytics"
            description="Deep analysis with insights and suggestions"
            api="/advanced-analytics"
          />
          <FeatureCard
            icon="⚡"
            title="Quick Actions"
            description="Quick access to common actions"
            page="/quick-actions"
          />
          <FeatureCard
            icon="🎛️"
            title="Content Filters"
            description="Filter content with custom rules"
            page="/content-filter"
          />
          <FeatureCard
            icon="🎯"
            title="Reading Goals"
            description="Set and track reading goals"
            page="/goals"
          />
          <FeatureCard
            icon="📤"
            title="Social Sharing"
            description="Share articles to social platforms"
            page="/share"
          />
          <FeatureCard
            icon="🔧"
            title="Parser Rules"
            description="Custom RSS parsing rules"
            api="/parser-rules"
          />
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>🤝 Collaborative reading</div>
            <div>🔗 More integrations</div>
            <div>🧠 Personalized recommendations</div>
            <div>🌐 Multi-language support</div>
            <div>📱 Mobile app</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description, link, page, api }: {
  icon: string;
  title: string;
  description: string;
  link?: string;
  page?: string;
  api?: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-3xl mb-3">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
      {link && (
        <Link href={link} className="text-blue-500 hover:underline text-sm">
          View on homepage
        </Link>
      )}
      {page && (
        <Link href={page} className="text-blue-500 hover:underline text-sm">
          Open →
        </Link>
      )}
      {api && !page && (
        <div className="text-gray-400 text-sm">API: {api}</div>
      )}
    </div>
  );
}
