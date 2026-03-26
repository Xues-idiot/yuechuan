"use client";

interface HelpLinksProps {
  links?: Array<{ label: string; href: string; icon?: string }>;
}

const defaultLinks = [
  { label: "使用文档", href: "https://docs.example.com", icon: "📖" },
  { label: "常见问题", href: "https://faq.example.com", icon: "❓" },
  { label: "反馈问题", href: "https://github.com/issues", icon: "🐛" },
  { label: "更新日志", href: "https://changelog.example.com", icon: "📝" },
];

export default function HelpLinks({ links = defaultLinks }: HelpLinksProps) {
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {link.icon && <span>{link.icon}</span>}
          <span className="flex-1">{link.label}</span>
          <span className="text-gray-400">→</span>
        </a>
      ))}
    </div>
  );
}
