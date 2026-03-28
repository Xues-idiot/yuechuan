"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  siblingCount = 1,
}: PaginationProps) {
  const paginationId = useId();

  if (totalPages <= 1) return null;

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const getPaginationRange = () => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, 3 + siblingCount);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(totalPages - (2 + siblingCount), totalPages);
      return [1, '...', ...rightRange];
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [1, '...', ...middleRange, '...', totalPages];
  };

  const items = getPaginationRange();

  const handleKeyDown = (e: React.KeyboardEvent, page: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPageChange(page);
    }
  };

  return (
    <nav
      aria-label="分页导航"
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
        className="px-3 py-2 rounded-[var(--radius-sm)] border transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface-primary)',
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
          }
        }}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">上一页</span>
      </button>

      {items.map((item, index) => {
        if (item === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2"
              style={{ color: 'var(--text-tertiary)' }}
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const pageNum = item as number;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            onKeyDown={(e) => handleKeyDown(e, pageNum)}
            aria-label={`第 ${pageNum} 页`}
            aria-current={isActive ? 'page' : undefined}
            className="min-w-[40px] h-10 px-3 py-2 rounded-[var(--radius-sm)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={
              isActive
                ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                  }
                : {
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--surface-primary)',
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
              }
            }}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
        className="px-3 py-2 rounded-[var(--radius-sm)] border transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          borderColor: 'var(--border-default)',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface-primary)',
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
          }
        }}
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">下一页</span>
      </button>

      {/* Screen reader info */}
      <div className="sr-only" aria-live="polite">
        当前第 {currentPage} 页，共 {totalPages} 页
      </div>
    </nav>
  );
}
