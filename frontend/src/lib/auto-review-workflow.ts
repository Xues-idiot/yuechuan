/**
 * 自动循环审查工作流
 * 定时执行：检查项目、发现问题、自动修复、输出报告
 */

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const PROJECT_ROOT = path.join(__dirname, "../..");

interface ReviewReport {
  timestamp: string;
  filesScanned: number;
  issuesFound: number;
  issuesFixed: number;
  issues: Issue[];
}

interface Issue {
  file: string;
  type: "naming" | "import" | "chinese" | "unused" | "quality" | "other";
  description: string;
  autoFixable: boolean;
  status: "pending" | "fixed" | "ignored";
}

/**
 * 扫描所有需要审查的文件
 */
async function scanFiles(): Promise<string[]> {
  const extensions = [".ts", ".tsx", ".js", ".jsx"];
  const files: string[] = [];

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      // 跳过 node_modules, .next, dist 等目录
      if (entry.isDirectory()) {
        if (!["node_modules", ".next", "dist", ".git"].includes(entry.name)) {
          walkDir(fullPath);
        }
      } else if (extensions.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  walkDir(path.join(PROJECT_ROOT, "frontend/src"));
  return files;
}

/**
 * 检查文件命名是否与导出名称一致
 */
function checkNaming(filePath: string, content: string): Issue | null {
  const fileName = path.basename(filePath, path.extname(filePath));
  const exportMatch = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+(\w+)/);

  if (exportMatch) {
    const exportName = exportMatch[1];
    // 处理命名转换： kebab-case -> PascalCase
    const expectedPascalCase = fileName
      .split("-")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    if (exportName !== fileName && exportName !== expectedPascalCase) {
      return {
        file: filePath,
        type: "naming",
        description: `文件名 "${fileName}" 与导出名 "${exportName}" 不一致`,
        autoFixable: false,
        status: "pending"
      };
    }
  }
  return null;
}

/**
 * 检查是否缺少 "use client" 指令（Next.js 页面）
 */
function checkUseClient(filePath: string, content: string): Issue | null {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  const isPageFile = relativePath.includes("app/") && (filePath.endsWith(".tsx") || filePath.endsWith(".jsx"));

  if (isPageFile && !content.includes("'use client'") && !content.includes('"use client"')) {
    return {
      file: filePath,
      type: "quality",
      description: `Next.js 页面文件缺少 "use client" 指令`,
      autoFixable: false,
      status: "pending"
    };
  }
  return null;
}

/**
 * 检查控制台错误消息是否为中文（应该使用中文）
 */
function checkConsoleMessages(content: string, filePath: string): Issue[] {
  const issues: Issue[] = [];
  const consoleErrorMatches = content.matchAll(/console\.error\(['"]([^'"]+)['"]\)/g);

  for (const match of consoleErrorMatches) {
    const message = match[1];
    // 检查是否包含英文字母且没有中文字符的消息
    if (/[a-zA-Z]/.test(message) && !/[\u4e00-\u9fff]/.test(message)) {
      issues.push({
        file: filePath,
        type: "chinese",
        description: `console.error 应使用中文: "${message}"`,
        autoFixable: false,
        status: "pending"
      });
    }
  }
  return issues;
}

/**
 * 检查日期格式化是否使用 zh-CN locale
 */
function checkDateLocale(content: string, filePath: string): Issue[] {
  const issues: Issue[] = [];
  const localeDateMatches = content.matchAll(/toLocaleDateString\(['"]([a-z]{2}-[A-Z]{2})['"]\)/g);

  for (const match of localeDateMatches) {
    const locale = match[1];
    if (locale !== "zh-CN" && locale !== "zh-Hans") {
      issues.push({
        file: filePath,
        type: "quality",
        description: `日期格式化应使用 "zh-CN" locale，当前使用 "${locale}"`,
        autoFixable: true,
        status: "pending"
      });
    }
  }
  return issues;
}

/**
 * 检查是否有未使用的导入
 */
function checkUnusedImports(content: string, filePath: string): Issue | null {
  // 简单检查：导入的名称在文件中未使用
  const importMatches = content.matchAll(/import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g);
  const exportedNames = content.match(/(?:export\s+(?:default\s+)?(?:function|const|class)\s+(\w+))|(?:export\s+{([^}]+)})/g);

  if (!exportedNames || exportedNames.length === 0) {
    return null;
  }

  return null; // 需要更复杂的 AST 分析，这里简化处理
}

/**
 * 执行单次审查
 */
export async function runReview(): Promise<ReviewReport> {
  const files = await scanFiles();
  const report: ReviewReport = {
    timestamp: new Date().toISOString(),
    filesScanned: files.length,
    issuesFound: 0,
    issuesFixed: 0,
    issues: []
  };

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");

    // 检查命名
    const namingIssue = checkNaming(file, content);
    if (namingIssue) {
      report.issues.push(namingIssue);
    }

    // 检查 use client
    const useClientIssue = checkUseClient(file, content);
    if (useClientIssue) {
      report.issues.push(useClientIssue);
    }

    // 检查控制台消息
    const consoleIssues = checkConsoleMessages(content, file);
    report.issues.push(...consoleIssues);

    // 检查日期 locale
    const localeIssues = checkDateLocale(content, file);
    report.issues.push(...localeIssues);
  }

  report.issuesFound = report.issues.length;

  // 自动修复可修复的问题
  for (const issue of report.issues) {
    if (issue.autoFixable && issue.status === "pending") {
      // 这里可以实现自动修复逻辑
      issue.status = "pending"; // 需要手动修复
    }
  }

  return report;
}

/**
 * 生成审查报告
 */
export function formatReport(report: ReviewReport): string {
  const lines = [
    `=== 自动审查报告 ===`,
    `时间: ${new Date(report.timestamp).toLocaleString("zh-CN")}`,
    `扫描文件: ${report.filesScanned}`,
    `发现问题: ${report.issuesFound}`,
    `已修复: ${report.issuesFixed}`,
    ``
  ];

  if (report.issues.length > 0) {
    lines.push(`--- 问题详情 ---`);
    const byType = report.issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (const [type, count] of Object.entries(byType)) {
      lines.push(`  ${type}: ${count} 个`);
    }
    lines.push(``);

    for (const issue of report.issues.slice(0, 20)) {
      lines.push(`[${issue.type}] ${issue.file}`);
      lines.push(`  ${issue.description}`);
      if (issue.autoFixable) {
        lines.push(`  (可自动修复)`);
      }
      lines.push(``);
    }

    if (report.issues.length > 20) {
      lines.push(`... 还有 ${report.issues.length - 20} 个问题`);
    }
  } else {
    lines.push(`未发现问题，代码库状态良好！`);
  }

  return lines.join("\n");
}

// CLI 入口
if (require.main === module) {
  runReview().then(report => {
    console.log(formatReport(report));
    process.exit(report.issuesFound > 0 ? 1 : 0);
  }).catch(err => {
    console.error("审查失败:", err);
    process.exit(1);
  });
}
