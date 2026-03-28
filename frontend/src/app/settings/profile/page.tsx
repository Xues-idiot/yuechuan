"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  User,
  Mail,
  Bell,
  Shield,
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  joinedDate: string;
}

export default function SettingsProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "阅川用户",
    email: "user@example.com",
    bio: "热爱阅读，追求知识沉淀",
    location: "北京",
    website: "https://example.com",
    joinedDate: "2026-01-15",
  });
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const stats = [
    { label: "阅读文章", value: "1,234" },
    { label: "收藏内容", value: "89" },
    { label: "阅读时长", value: "256h" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 text-sm mb-3 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              返回设置
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: 'var(--text-primary)' }}>
              个人资料
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Profile Header Card */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-lg)] border overflow-hidden relative"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-x-0 top-0 h-24 -mx-6 -mt-6 rounded-t-[var(--radius-lg)]"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              opacity: 0.15,
            }}
          />

          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <Avatar
                name={profile.name}
                size="xl"
                status="online"
                glassmorphism
              />
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--surface-primary)',
                  color: 'white',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 pt-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input mb-3"
                  placeholder="你的名字"
                />
              ) : (
                <h2 className="text-xl font-serif font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {profile.name}
                </h2>
              )}
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {profile.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Edit3 className="w-4 h-4" />}
                onClick={() => setIsEditing(true)}
              >
                编辑
              </Button>
            )}
          </div>
        </section>

        {/* Profile Details */}
        <section
          className="mb-6 p-6 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            详细信息
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <Mail className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  邮箱
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input"
                    placeholder="你的邮箱"
                  />
                ) : (
                  <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {profile.email}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <User className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  位置
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="input"
                    placeholder="你所在的城市"
                  />
                ) : (
                  <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {profile.location}
                  </div>
                )}
              </div>
            </div>

            {/* Website */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  网站
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="input"
                    placeholder="你的网站"
                  />
                ) : (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors"
                    style={{ color: 'var(--color-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {profile.website}
                  </a>
                )}
              </div>
            </div>

            {/* Joined Date */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <Calendar className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className="flex-1">
                <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>
                  加入时间
                </div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {new Date(profile.joinedDate).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" icon={<X className="w-4 h-4" />} onClick={handleCancel}>
              取消
            </Button>
            <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
              保存更改
            </Button>
          </div>
        )}

        {/* Notification Preferences Link */}
        <section
          className="mt-6 p-5 rounded-[var(--radius-md)] border"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <Link
            href="/settings/notifications"
            className="flex items-center gap-4 group"
          >
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <Bell className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                通知设置
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                管理推送通知和提醒偏好
              </p>
            </div>
            <ChevronRight
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              style={{ color: 'var(--text-tertiary)' }}
            />
          </Link>
        </section>
      </div>
    </main>
  );
}