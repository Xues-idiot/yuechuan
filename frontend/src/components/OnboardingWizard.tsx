"use client";

import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface OnboardingStep {
  title: string;
  content: string;
  icon: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "欢迎使用阅川",
    content: "阅川是一个多平台内容聚合阅读器，支持 RSS、微信公众号、哔哩哔哩等多个平台的内容聚合。",
    icon: "📖",
  },
  {
    title: "AI 智能助手",
    content: "内置 AI 摘要、翻译、知识点提取功能，让你的阅读更高效。支持间隔重复复习，帮助巩固记忆。",
    icon: "🤖",
  },
  {
    title: "多端同步",
    content: "支持阅读进度同步、离线阅读、数据导出备份，让你的阅读体验无缝衔接。",
    icon: "🔄",
  },
  {
    title: "开始使用",
    content: "点击添加你的第一个订阅源，开始探索精彩内容吧！",
    icon: "🚀",
  },
];

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function OnboardingWizard({
  isOpen,
  onClose,
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <Modal isOpen={isOpen} onClose={handleSkip} size="md" showCloseButton={false}>
      <div className="p-8">
        {/* 进度指示器 */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? "bg-blue-500" : index < currentStep ? "bg-blue-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* 图标 */}
        <div className="text-center mb-6">
          <span className="text-6xl">{step.icon}</span>
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-center mb-4">{step.title}</h2>

        {/* 内容 */}
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {step.content}
        </p>

        {/* 操作按钮 */}
        <div className="flex justify-between gap-4">
          <Button variant="ghost" onClick={handleSkip}>
            跳过
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                上一步
              </Button>
            )}
            <Button variant="primary" onClick={handleNext}>
              {isLastStep ? "开始使用" : "下一步"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
