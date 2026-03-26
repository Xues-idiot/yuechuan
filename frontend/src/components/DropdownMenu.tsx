"use client";

import { useState } from "react";
import Popover from "./Popover";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export default function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  return (
    <Popover trigger={trigger} position="bottom">
      <div className="space-y-1">{children}</div>
    </Popover>
  );
}

interface DropdownItemProps {
  icon?: string;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

export function DropdownItem({
  icon,
  children,
  onClick,
  danger = false,
}: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
