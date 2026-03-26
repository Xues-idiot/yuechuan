const ONBOARDING_KEY = "onboarding_complete";

export interface OnboardingStep {
  title: string;
  content: string;
  highlight?: string;  // 要高亮的元素选择器
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "欢迎使用阅川",
    content: "阅川是一个多平台内容聚合阅读器，支持微信公众号、B站、小红书、微博、知乎等内容源的订阅。",
  },
  {
    title: "AI 智能处理",
    content: "使用 AI 功能可以为内容生成摘要、翻译，让阅读更高效。快捷键：S=摘要，T=翻译。",
  },
  {
    title: "知识图谱",
    content: "收藏的内容会自动加入知识图谱，系统会为你推荐相关内容。",
  },
  {
    title: "间隔复习",
    content: "为重要内容添加笔记，系统会按照记忆曲线安排复习，帮助巩固知识。",
  },
];

export function isOnboardingComplete(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function completeOnboarding(): void {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
}
