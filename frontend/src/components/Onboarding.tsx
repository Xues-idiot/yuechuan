"use client";

import { useState, useEffect } from "react";
import { ONBOARDING_STEPS, completeOnboarding } from "@/lib/onboarding";

interface OnboardingProps {
  onComplete?: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查是否完成过 onboarding
    const completed = localStorage.getItem("onboarding_complete");
    if (!completed) {
      setVisible(true);
    }
  }, []);

  function handleNext() {
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      setVisible(false);
      onComplete?.();
    }
  }

  function handleSkip() {
    completeOnboarding();
    setVisible(false);
    onComplete?.();
  }

  if (!visible) return null;

  const currentStep = ONBOARDING_STEPS[step];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📚</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{currentStep.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{currentStep.content}</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === step ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            跳过
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {step < ONBOARDING_STEPS.length - 1 ? "下一步" : "开始使用"}
          </button>
        </div>
      </div>
    </div>
  );
}
