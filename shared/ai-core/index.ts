// Shared AI utilities for YueChuan
// This package can be used by both backend and other services

export interface AIConfig {
  apiKey: string;
  model?: string;
}

export const DEFAULT_MODELS = {
  summarizer: "gpt-4o-mini",
  translator: "gpt-4o-mini",
  transcriber: "whisper-1",
} as const;
