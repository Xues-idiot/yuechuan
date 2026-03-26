"use client";

import { useState } from "react";

interface LoadingStateProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  skeleton?: React.ReactNode;
}

export default function LoadingState({
  children,
  isLoading,
  loadingText = "加载中...",
  skeleton,
}: LoadingStateProps) {
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;

    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">{loadingText}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
