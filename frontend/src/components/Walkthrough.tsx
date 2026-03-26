"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

interface WalkthroughStep {
  target: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

interface WalkthroughProps {
  steps: WalkthroughStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function Walkthrough({
  steps,
  isOpen,
  onClose,
  onComplete,
}: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.();
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete?.();
    onClose();
  };

  if (!isOpen || !step) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={false}
    >
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
          <h3 className="text-lg font-semibold">{step.title}</h3>
        </div>

        <div className="mb-6 min-h-[80px]">
          <p className="text-gray-600 dark:text-gray-400">{step.content}</p>
        </div>

        {/* 目标高亮指示 */}
        {step.target && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700">
            <code className="text-sm text-blue-600 dark:text-blue-400">
              #{step.target}
            </code>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            跳过引导
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                上一步
              </Button>
            )}
            <Button variant="primary" onClick={handleNext}>
              {isLastStep ? "完成" : "下一步"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
