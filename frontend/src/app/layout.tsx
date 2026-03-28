import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "阅川 - 多平台内容聚合阅读器",
    template: "%s | 阅川",
  },
  description: "订阅万物，AI消化，直接消费",
  keywords: ["RSS阅读器", "内容聚合", "AI摘要", "多平台订阅", "微信公众号", "哔哩哔哩"],
  authors: [{ name: "阅川" }],
  creator: "阅川",
  publisher: "阅川",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "阅川",
    title: "阅川 - 多平台内容聚合阅读器",
    description: "订阅万物，AI消化，直接消费",
  },
  twitter: {
    card: "summary_large_image",
    title: "阅川 - 多平台内容聚合阅读器",
    description: "订阅万物，AI消化，直接消费",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0369A1" },
    { media: "(prefers-color-scheme: dark)", color: "#0EA5E9" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch for faster external resource loading */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to external domains for faster connections */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts - Source Serif 4 (标题) + Inter (正文) + JetBrains Mono (代码) */}
        {/* font-display: swap prevents FOIT (Flash of Invisible Text) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=optional"
          rel="stylesheet"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
