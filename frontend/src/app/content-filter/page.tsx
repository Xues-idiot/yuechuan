"use client";

import { useState, useEffect } from "react";

interface FilterRule {
  field: string;
  operator: string;
  value: string;
  action: string;
}

interface FilterPreset {
  name: string;
  rules: FilterRule[];
}

interface FilterResult {
  count: number;
  items: Array<{
    id: number;
    title: string;
    url: string;
    is_read: boolean;
  }>;
}

const FIELDS = [
  { value: "title", label: "标题" },
  { value: "tags", label: "标签" },
  { value: "is_read", label: "已读状态" },
  { value: "is_starred", label: "收藏状态" }
];

const OPERATORS = [
  { value: "contains", label: "包含" },
  { value: "not_contains", label: "不包含" },
  { value: "equals", label: "等于" },
  { value: "starts_with", label: "开头是" }
];

const ACTIONS = [
  { value: "include", label: "包含", color: "green" },
  { value: "exclude", label: "排除", color: "red" }
];

export default function ContentFilterPage() {
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [activePreset, setActivePreset] = useState<FilterPreset | null>(null);
  const [customRules, setCustomRules] = useState<FilterRule[]>([]);
  const [results, setResults] = useState<FilterResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [filterName, setFilterName] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    loadPresets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPresets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/content-filter/presets`);
      const data = await res.json();
      setPresets(data);
    } catch (error) {
      console.error("Failed to load presets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: FilterPreset) => {
    setActivePreset(preset);
    setCustomRules([...preset.rules]);
    setFilterName(preset.name);
    setResults(null);
  };

  const addRule = () => {
    setCustomRules([
      ...customRules,
      { field: "title", operator: "contains", value: "", action: "include" }
    ]);
  };

  const removeRule = (index: number) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, updates: Partial<FilterRule>) => {
    setCustomRules(
      customRules.map((rule, i) =>
        i === index ? { ...rule, ...updates } : rule
      )
    );
  };

  const handleApply = async () => {
    if (customRules.length === 0) {
      alert("请先添加过滤规则");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch(`${API_BASE}/content-filter/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: filterName || "自定义过滤",
          rules: customRules.filter((r) => r.value)
        })
      });
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Failed to apply filter:", error);
    } finally {
      setApplying(false);
    }
  };

  const handleClear = () => {
    setCustomRules([]);
    setActivePreset(null);
    setFilterName("");
    setResults(null);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🔍 内容过滤</h1>
          <p className="text-gray-600 dark:text-gray-400">
            使用过滤规则快速找到想要的内容
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Presets Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold">预设过滤</h2>
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(preset)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      activePreset?.name === preset.name
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {preset.rules.length} 条规则
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Rules Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Name */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                过滤器名称
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="给过滤器起个名字"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              />
            </div>

            {/* Rules */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="font-semibold">过滤规则</h2>
                <button
                  onClick={addRule}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + 添加规则
                </button>
              </div>
              <div className="p-4 space-y-3">
                {customRules.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-4xl mb-2">📋</p>
                    <p>暂无规则，点击上方按钮添加</p>
                  </div>
                ) : (
                  customRules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      {/* Action */}
                      <select
                        value={rule.action}
                        onChange={(e) => updateRule(index, { action: e.target.value })}
                        className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
                      >
                        {ACTIONS.map((action) => (
                          <option key={action.value} value={action.value}>
                            {action.label}
                          </option>
                        ))}
                      </select>

                      {/* Field */}
                      <select
                        value={rule.field}
                        onChange={(e) => updateRule(index, { field: e.target.value })}
                        className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
                      >
                        {FIELDS.map((field) => (
                          <option key={field.value} value={field.value}>
                            {field.label}
                          </option>
                        ))}
                      </select>

                      {/* Operator */}
                      <select
                        value={rule.operator}
                        onChange={(e) => updateRule(index, { operator: e.target.value })}
                        className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
                      >
                        {OPERATORS.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>

                      {/* Value */}
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => updateRule(index, { value: e.target.value })}
                        placeholder="输入值"
                        className="flex-1 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-sm"
                      />

                      {/* Remove */}
                      <button
                        onClick={() => removeRule(index)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applying || customRules.length === 0}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {applying ? "应用中..." : "应用过滤"}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                清空
              </button>
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold">
                    过滤结果 {results.count > 0 && `(${results.count} 条)`}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                  {results.items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-4xl mb-2">📭</p>
                      <p>没有找到匹配的内容</p>
                    </div>
                  ) : (
                    results.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <span className={`w-2 h-2 rounded-full ${item.is_read ? "bg-green-500" : "bg-blue-500"}`} />
                        <span className="flex-1 truncate">{item.title}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">💡 使用提示</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• 「包含」规则会筛选出符合条件的内容</li>
            <li>• 「排除」规则会移除符合条件的内容</li>
            <li>• 可以组合多个规则来实现复杂的过滤条件</li>
            <li>• 点击预设可以直接加载预设规则</li>
          </ul>
        </div>
      </div>
    </main>
  );
}