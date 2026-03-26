"use client";

// 表单验证工具

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean | string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validate(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors.push({ field, message: `${field} 是必填项` });
      return;
    }

    if (value === undefined || value === null || value === "") {
      return; // 跳过空值，非必填
    }

    if (rule.minLength && String(value).length < rule.minLength) {
      errors.push({
        field,
        message: `${field} 至少需要 ${rule.minLength} 个字符`,
      });
    }

    if (rule.maxLength && String(value).length > rule.maxLength) {
      errors.push({
        field,
        message: `${field} 最多只能有 ${rule.maxLength} 个字符`,
      });
    }

    if (rule.min !== undefined && Number(value) < rule.min) {
      errors.push({ field, message: `${field} 不能小于 ${rule.min}` });
    }

    if (rule.max !== undefined && Number(value) > rule.max) {
      errors.push({ field, message: `${field} 不能大于 ${rule.max}` });
    }

    if (rule.pattern && !rule.pattern.test(String(value))) {
      errors.push({ field, message: `${field} 格式不正确` });
    }

    if (rule.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(String(value))) {
        errors.push({ field, message: `请输入有效的邮箱地址` });
      }
    }

    if (rule.url) {
      try {
        new URL(String(value));
      } catch {
        errors.push({ field, message: `请输入有效的 URL` });
      }
    }

    if (rule.custom) {
      const result = rule.custom(value);
      if (result !== true && typeof result === "string") {
        errors.push({ field, message: result });
      } else if (result === false) {
        errors.push({ field, message: `${field} 验证失败` });
      }
    }
  });

  return errors;
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function isValidFeedUrl(url: string): boolean {
  // 支持 RSS/Atom URL
  const pattern = /\.(rss|atom|xml)$/i;
  return pattern.test(url) || url.includes("feed=");
}
