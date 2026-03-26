"use client";

import { useState } from "react";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
}

export default function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onStepChange(step.id)}
            className={`flex items-center gap-2 ${
              index <= currentIndex
                ? "text-blue-600"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index < currentIndex
                  ? "bg-blue-500 text-white"
                  : index === currentIndex
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {index < currentIndex ? "✓" : index + 1}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-medium">{step.label}</p>
              {step.description && (
                <p className="text-xs text-gray-500">{step.description}</p>
              )}
            </div>
          </button>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 mx-2 ${
                index < currentIndex ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
