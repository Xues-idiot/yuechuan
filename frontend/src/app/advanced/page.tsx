"use client";

import { useState } from "react";
import AdvancedSearch from "@/components/AdvancedSearch";
import Card from "@/components/Card";
import Tabs from "@/components/Tabs";
import { Search, BookOpen, Layers, Sparkles, Settings } from "lucide-react";

export default function AdvancedPage() {
  const [activeTab, setActiveTab] = useState("search");

  const tabs = [
    { id: "search", label: "高级搜索", icon: Search },
    { id: "reading", label: "阅读模式", icon: BookOpen },
    { id: "batch", label: "批量操作", icon: Layers },
  ];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <Sparkles className="w-6 h-6" style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
                高级功能
              </h1>
            </div>
          </div>
          <p className="text-base ml-15" style={{ color: 'var(--text-secondary)' }}>
            增强的阅读体验和强大的搜索功能
          </p>
        </header>

        {/* Tab Navigation */}
        <Tabs
          tabs={tabs.map(tab => ({
            id: tab.id,
            label: tab.label,
            icon: <tab.icon className="w-4 h-4" aria-hidden="true" />,
          }))}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="mb-8"
        />

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "search" && <AdvancedSearch />}

          {activeTab === "reading" && (
            <Card
              title="阅读模式设置"
              actions={
                <Settings className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
              }
            >
              <div className="space-y-4">
                <p style={{ color: 'var(--text-tertiary)' }}>
                  配置您的个性化阅读体验，从字体大小到阅读进度追踪。
                </p>
                <div
                  className="p-4 rounded-[var(--radius-md)]"
                  style={{ backgroundColor: 'var(--surface-secondary)' }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="font-size-select" className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>
                        字体大小
                      </label>
                      <select
                        id="font-size-select"
                        className="w-full px-3 py-2 rounded-[var(--radius-sm)] border input"
                        style={{
                          backgroundColor: 'var(--surface-primary)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <option>小</option>
                        <option selected>中</option>
                        <option>大</option>
                        <option>特大</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="line-height-select" className="text-sm font-medium block mb-2" style={{ color: 'var(--text-secondary)' }}>
                        行间距
                      </label>
                      <select
                        id="line-height-select"
                        className="w-full px-3 py-2 rounded-[var(--radius-sm)] border input"
                        style={{
                          backgroundColor: 'var(--surface-primary)',
                          borderColor: 'var(--border-default)',
                        }}
                      >
                        <option>紧凑</option>
                        <option selected>舒适</option>
                        <option>宽松</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "batch" && (
            <Card title="批量操作">
              <div className="space-y-4">
                <p style={{ color: 'var(--text-tertiary)' }}>
                  选择多个项目执行批量操作，提高管理效率。
                </p>
                <div
                  className="p-6 rounded-[var(--radius-md)] text-center"
                  style={{ backgroundColor: 'var(--surface-secondary)' }}
                >
                  <Layers className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
                  <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    批量操作说明
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    在内容列表页面勾选多个项目后，即可使用批量标记已读、收藏、添加标签等功能。
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
