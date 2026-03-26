"use client";

import { useState } from "react";

export default function Bookmarklets() {
  const [showPanel, setShowPanel] = useState(false);

  const bookmarklets = [
    {
      name: "阅川快捷收藏",
      code: `javascript:(function(){var%20url=encodeURIComponent(window.location.href);var%20title=encodeURIComponent(document.title);window.open('http://localhost:3000/feeds/add?url='+url+'&title='+title,'_blank');})();`,
      description: "快速将当前页面添加到阅川",
    },
    {
      name: "保存到稍后阅读",
      code: `javascript:(function(){var%20url=encodeURIComponent(window.location.href);var%20title=encodeURIComponent(document.title);localStorage.setItem('read_later_temp',JSON.stringify({url:url,title:title}));alert('已保存到稍后阅读');})();`,
      description: "将当前页面保存到稍后阅读列表",
    },
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">🔖 书签小工具</h3>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showPanel ? "收起" : "展开"}
        </button>
      </div>

      {showPanel && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            拖动以下按钮到书签栏，或右键添加到书签
          </p>
          {bookmarklets.map((bm, i) => (
            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-medium text-sm">{bm.name}</p>
              <p className="text-xs text-gray-500 mb-2">{bm.description}</p>
              <a
                href={bm.code}
                className="inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded hover:bg-blue-200"
                onClick={(e) => {
                  e.preventDefault();
                  alert("请右键点击此链接，选择'添加为书签'");
                }}
              >
                {bm.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
