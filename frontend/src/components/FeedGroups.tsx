"use client";

import { useState, useEffect } from "react";
import { api, Feed } from "@/lib/api";

interface FeedGroup {
  id: string;
  name: string;
  color: string;
  feedIds: number[];
}

const GROUPS_STORAGE_KEY = "feed_groups";

export default function FeedGroups() {
  const [groups, setGroups] = useState<FeedGroup[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
    "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [savedGroups, allFeeds] = await Promise.all([
        Promise.resolve().then(() => {
          const saved = localStorage.getItem(GROUPS_STORAGE_KEY);
          if (!saved) return [];
          try {
            return JSON.parse(saved);
          } catch {
            return [];
          }
        }),
        api.listFeeds(),
      ]);

      setGroups(savedGroups);
      setFeeds(allFeeds);
    } catch (e) {
      console.error("Failed to load groups:", e);
    } finally {
      setLoading(false);
    }
  }

  function saveGroups(newGroups: FeedGroup[]) {
    setGroups(newGroups);
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(newGroups));
  }

  function createGroup(name: string, color: string) {
    const newGroup: FeedGroup = {
      id: Date.now().toString(),
      name,
      color,
      feedIds: [],
    };
    saveGroups([...groups, newGroup]);
  }

  function deleteGroup(groupId: string) {
    saveGroups(groups.filter((g) => g.id !== groupId));
  }

  function toggleFeedInGroup(groupId: string, feedId: number) {
    const updated = groups.map((g) => {
      if (g.id !== groupId) return g;
      const hasFeed = g.feedIds.includes(feedId);
      return {
        ...g,
        feedIds: hasFeed
          ? g.feedIds.filter((id) => id !== feedId)
          : [...g.feedIds, feedId],
      };
    });
    saveGroups(updated);
  }

  function getUngroupedFeeds() {
    const groupedFeedIds = groups.flatMap((g) => g.feedIds);
    return feeds.filter((f) => !groupedFeedIds.includes(f.id));
  }

  if (loading) {
    return <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">📁 订阅源分组</h3>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showEditor ? "完成" : "编辑"}
        </button>
      </div>

      {groups.length === 0 && !showEditor ? (
        <p className="text-sm text-gray-500">
          暂无分组
          <button
            onClick={() => setShowEditor(true)}
            className="ml-2 text-blue-600 hover:underline"
          >
            创建分组
          </button>
        </p>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${group.color}`} />
                <span className="font-medium">{group.name}</span>
                <span className="text-xs text-gray-500">
                  ({group.feedIds.length})
                </span>
                {showEditor && (
                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="ml-auto text-red-500 text-xs hover:underline"
                  >
                    删除
                  </button>
                )}
              </div>
              {showEditor && (
                <div className="flex flex-wrap gap-1">
                  {feeds.map((feed) => (
                    <button
                      key={feed.id}
                      onClick={() => toggleFeedInGroup(group.id, feed.id)}
                      className={`px-2 py-0.5 text-xs rounded ${
                        group.feedIds.includes(feed.id)
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {feed.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-500 mb-3">创建新分组</p>
          <div className="flex gap-2">
            <input
              type="text"
              id="new-group-name"
              placeholder="分组名称"
              className="flex-1 px-3 py-1 text-sm border rounded dark:bg-gray-700"
            />
            <select
              id="new-group-color"
              className="px-3 py-1 text-sm border rounded dark:bg-gray-700"
            >
              {colors.map((c) => (
                <option key={c} value={c}>{c.split("-")[1]}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const nameInput = document.getElementById("new-group-name") as HTMLInputElement;
                const colorSelect = document.getElementById("new-group-color") as HTMLSelectElement;
                if (nameInput.value.trim()) {
                  createGroup(nameInput.value.trim(), colorSelect.value);
                  nameInput.value = "";
                }
              }}
              className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              创建
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
