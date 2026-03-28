"use client";

import { useState, useId } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  caption?: string;
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = "暂无数据",
  loading = false,
  caption,
  className = "",
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const tableId = useId();

  const handleSort = (key: string) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return key;
      } else {
        setSortOrder("asc");
        return key;
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: T) => {
    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRowClick(item);
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = (a as any)[sortKey];
        const bVal = (b as any)[sortKey];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      })
    : data;

  if (loading) {
    return (
      <div
        className={`w-full p-8 text-center rounded-[var(--radius-md)] ${className}`}
        style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)' }}
        role="status"
        aria-live="polite"
      >
        <span style={{ color: 'var(--text-tertiary)' }}>加载中...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`w-full p-8 text-center rounded-[var(--radius-md)] ${className}`}
        style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-default)' }}
        role="status"
      >
        <span style={{ color: 'var(--text-tertiary)' }}>{emptyMessage}</span>
      </div>
    );
  }

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`overflow-x-auto rounded-[var(--radius-md)] ${className}`} style={{ border: '1px solid var(--border-default)' }}>
      <table className="w-full" aria-labelledby={caption ? `${tableId}-caption` : undefined}>
        {caption && (
          <caption id={`${tableId}-caption`} className="sr-only">
            {caption}
          </caption>
        )}
        <thead style={{ backgroundColor: 'var(--surface-secondary)' }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-sm font-medium ${alignClasses[col.align || 'left']}`}
                style={{ width: col.width, color: 'var(--text-secondary)' }}
                aria-sort={sortKey === col.key ? (sortOrder === "asc" ? "ascending" : "descending") : undefined}
              >
                {col.sortable !== false ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-[var(--radius-sm)]"
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = sortKey === col.key ? 'var(--color-primary)' : 'var(--text-secondary)';
                    }}
                    aria-label={`${col.header}${sortKey === col.key ? (sortOrder === "asc" ? "，已升序排列" : "，已降序排列") : "，点击排序"}`}
                  >
                    {col.header}
                    {sortKey === col.key && (
                      <span aria-hidden="true">
                        {sortOrder === "asc" ? (
                          <ArrowUp className="w-3 h-3 inline" />
                        ) : (
                          <ArrowDown className="w-3 h-3 inline" />
                        )}
                      </span>
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, rowIndex) => (
            <tr
              key={String(item[keyField])}
              onClick={() => onRowClick?.(item)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              tabIndex={onRowClick ? 0 : undefined}
              role={onRowClick ? "button" : undefined}
              style={{
                borderTop: '1px solid var(--border-default)',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              onFocus={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.outline = '2px solid var(--border-focus)';
                  e.currentTarget.style.outlineOffset = '-2px';
                }
              }}
              onBlur={(e) => {
                if (onRowClick) {
                  e.currentTarget.style.outline = 'none';
                }
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm ${alignClasses[col.align || 'left']}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {col.render
                    ? col.render(item)
                    : String((item as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
