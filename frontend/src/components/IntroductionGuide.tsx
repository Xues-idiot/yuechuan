"use client";

import { useState } from "react";

interface IntroductionGuideProps {
  children: React.ReactNode;
}

export default function IntroductionGuide({ children }: IntroductionGuideProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">功能介绍</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📡</span>
                <div>
                  <h3 className="font-medium">多平台订阅</h3>
                  <p className="text-sm">支持 RSS、微信公众号、哔哩哔哩等多个平台</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-medium">AI 助手</h3>
                  <p className="text-sm">智能摘要、翻译、知识点提取</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="font-medium">间隔复习</h3>
                  <p className="text-sm">基于 SM-2 算法巩固记忆</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              开始使用
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
