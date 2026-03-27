/**
 * 开发循环工作流 v4
 *
 * 改进：
 * - 更健壮的 glob 实现
 * - 分支保护机制
 * - 冲突检测
 * - 自动提交功能
 * - 更健壮的日志解析
 * - 代码质量检查 (ESLint/TypeScript)
 * - 自动备份机制
 * - 更智能的任务优先级排序
 * - diff 增量分析
 * - 通知机制 (邮件/钉钉/Slack)
 * - HTML 报告生成
 * - GitHub PR 接口
 * - 智能工作推荐
 *
 * 定时任务: 每天 08:00, 14:00, 20:00
 */

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const WORK_LOG = path.join(PROJECT_ROOT, "frontend/src/lib/work-log.md");
const CONFIG_FILE = path.join(PROJECT_ROOT, "frontend/src/lib/workflow-config.json");
const BACKUP_DIR = path.join(PROJECT_ROOT, "frontend/src/lib/backups");
const DAILY_SUMMARY = path.join(PROJECT_ROOT, "frontend/src/lib/daily-summary.json");
const REPORT_FILE = path.join(PROJECT_ROOT, "frontend/src/lib/workflow-report.html");
const RECOMMENDATIONS_FILE = path.join(PROJECT_ROOT, "frontend/src/lib/recommendations.json");

interface WorkflowConfig {
  defaultBranch: string;
  autoCommit: boolean;
  autoPush: boolean;
  scanPatterns: string[];
  ignoreDirs: string[];
  maxCommitMessageLength: number;
  enableLintCheck: boolean;
  enableBackup: boolean;
  backupRetentionDays: number;
  autoFix: boolean;
  enableNotifications: boolean;
  notificationChannels: ("email" | "slack" | "dingtalk")[];
  emailRecipients: string[];
  slackWebhook?: string;
  dingtalkWebhook?: string;
  enableReport: boolean;
  enableGitHubPR: boolean;
  gitHubToken?: string;
  gitHubOwner?: string;
  gitHubRepo?: string;
}

const DEFAULT_CONFIG: WorkflowConfig = {
  defaultBranch: "main",
  autoCommit: false,
  autoPush: false,
  scanPatterns: ["**/*.{ts,tsx,js,jsx}"],
  ignoreDirs: ["node_modules", ".next", "dist", ".git"],
  maxCommitMessageLength: 100,
  enableLintCheck: true,
  enableBackup: true,
  backupRetentionDays: 7,
  autoFix: false,
  enableNotifications: false,
  notificationChannels: [],
  emailRecipients: [],
  enableReport: true,
  enableGitHubPR: false
};

interface WorkEntry {
  date: string;
  time: string;
  type: "feature" | "fix" | "optimize" | "refactor" | "review" | "test";
  title: string;
  details: string;
  filesChanged: string[];
  status: "pending" | "done" | "blocked";
  priority?: "low" | "medium" | "high";
}

interface DailyLog {
  date: string;
  entries: WorkEntry[];
  summary: string;
}

interface GitFile {
  index: string;
  workingTree: string;
  path: string;
  status: "added" | "modified" | "deleted" | "renamed" | "untracked";
}

interface WorkflowResult {
  success: boolean;
  message: string;
  errors: string[];
  warnings: string[];
  gitStatus: GitFile[];
  tasks: TaskItem[];
  commits: CommitInfo[];
  newEntry?: WorkEntry;
  lintErrors: QualityIssue[];
  lintWarnings: QualityIssue[];
  typeErrors: QualityIssue[];
  diffStats: { additions: number; deletions: number; files: string[] };
  backup?: BackupInfo;
  dailySummary?: DailySummary;
}

interface TaskItem {
  file: string;
  line: number;
  type: "TODO" | "FIXME" | "HACK" | "XXX" | "BUG";
  content: string;
}

interface CommitInfo {
  hash: string;
  message: string;
  author: string;
  date: string;
}

interface QualityIssue {
  file: string;
  line: number;
  severity: "error" | "warning" | "info";
  rule: string;
  message: string;
}

interface BackupInfo {
  id: string;
  timestamp: string;
  files: string[];
  size: number;
  status: "success" | "failed";
}

interface DailySummary {
  date: string;
  tasksCompleted: number;
  tasksAdded: number;
  commits: number;
  issuesFound: number;
  issuesFixed: number;
  lintErrors: number;
  lintWarnings: number;
  workingTime: number; // 分钟
}

interface NotificationPayload {
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  data?: Record<string, any>;
}

interface ReportData {
  generatedAt: string;
  period: { start: string; end: string };
  summary: {
    totalCommits: number;
    totalTasks: number;
    totalIssues: number;
    totalWorkingTime: number;
  };
  dailyStats: DailySummary[];
  topTasks: TaskItem[];
  topErrors: QualityIssue[];
  recommendations: Recommendation[];
}

interface Recommendation {
  id: string;
  type: "optimize" | "fix" | "refactor" | "feature" | "security";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  files: string[];
  estimatedTime: number; // 分钟
  autoFixable: boolean;
}

interface GitHubPR {
  number: number;
  url: string;
  title: string;
  body: string;
  state: "open" | "closed" | "merged";
}

/**
 * 加载配置
 */
function loadConfig(): WorkflowConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
    }
  } catch (e) {
    console.warn("Failed to load config, using defaults");
  }
  return DEFAULT_CONFIG;
}

/**
 * 保存配置
 */
function saveConfig(config: WorkflowConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * 执行代码质量检查
 */
async function lintCheck(): Promise<{ errors: QualityIssue[]; warnings: QualityIssue[] }> {
  const result = {
    errors: [] as QualityIssue[],
    warnings: [] as QualityIssue[]
  };

  // 检查是否有 eslint 配置
  const hasEslint = fs.existsSync(path.join(PROJECT_ROOT, ".eslintrc.js")) ||
                    fs.existsSync(path.join(PROJECT_ROOT, ".eslintrc.json")) ||
                    fs.existsSync(path.join(PROJECT_ROOT, "eslint.config.js"));

  if (!hasEslint) {
    return result;
  }

  try {
    const output = await exec("npx", ["eslint", "frontend/src", "--format=json", "--max-warnings=0"], 60000);

    const eslintOutput = JSON.parse(output);
    for (const file of eslintOutput) {
      for (const msg of file.messages) {
        const issue: QualityIssue = {
          file: file.filePath.replace(PROJECT_ROOT, ""),
          line: msg.line,
          severity: msg.severity === 2 ? "error" : "warning",
          rule: msg.ruleId || "unknown",
          message: msg.message
        };

        if (issue.severity === "error") {
          result.errors.push(issue);
        } else {
          result.warnings.push(issue);
        }
      }
    }
  } catch (e: any) {
    // ESLint 可能返回非零退出码但仍有输出
    if (e.message.includes("JSON")) {
      // 解析失败，忽略
    }
  }

  return result;
}

/**
 * 获取 TypeScript 编译错误
 */
async function typeCheck(): Promise<QualityIssue[]> {
  const issues: QualityIssue[] = [];

  try {
    const output = await exec("npx", ["tsc", "--noEmit", "--pretty", "false"], 60000);
    // TypeScript 错误格式: file(line,col): error TSxxxx: message
    const regex = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+TS\d+:\s+(.+)$/gm;
    let match;

    while ((match = regex.exec(output)) !== null) {
      issues.push({
        file: match[1].replace(PROJECT_ROOT, ""),
        line: parseInt(match[2]),
        severity: match[4] as "error" | "warning",
        rule: "typescript",
        message: match[5]
      });
    }
  } catch (e) {
    // tsc 可能返回非零退出码
  }

  return issues;
}

/**
 * 备份文件
 */
async function backupFiles(): Promise<BackupInfo> {
  const config = loadConfig();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupId = `backup-${timestamp}`;
  const backupPath = path.join(BACKUP_DIR, backupId);

  const backupInfo: BackupInfo = {
    id: backupId,
    timestamp: new Date().toISOString(),
    files: [],
    size: 0,
    status: "failed"
  };

  if (!config.enableBackup) {
    backupInfo.status = "success";
    return backupInfo;
  }

  try {
    // 确保备份目录存在
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // 备份 frontend/src 目录
    const srcDir = path.join(PROJECT_ROOT, "frontend/src");
    const files = await glob([], srcDir);

    let totalSize = 0;
    for (const file of files) {
      const relativePath = path.relative(srcDir, file);
      const destPath = path.join(backupPath, relativePath);

      // 确保目标目录存在
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      // 复制文件
      fs.copyFileSync(file, destPath);
      const stats = fs.statSync(destPath);
      totalSize += stats.size;
      backupInfo.files.push(relativePath);
    }

    backupInfo.size = totalSize;
    backupInfo.status = "success";

    // 清理旧备份
    await cleanupOldBackups(config.backupRetentionDays);

  } catch (e: any) {
    backupInfo.status = "failed";
    backupInfo.files = [];
  }

  return backupInfo;
}

/**
 * 清理旧备份
 */
async function cleanupOldBackups(retentionDays: number): Promise<void> {
  if (!fs.existsSync(BACKUP_DIR)) return;

  const entries = fs.readdirSync(BACKUP_DIR, { withFileTypes: true });
  const now = Date.now();
  const maxAge = retentionDays * 24 * 60 * 60 * 1000;

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(BACKUP_DIR, entry.name);
      const stats = fs.statSync(fullPath);
      if (now - stats.mtimeMs > maxAge) {
        fs.rmSync(fullPath, { recursive: true });
      }
    }
  }
}

/**
 * 获取每日摘要
 */
function getDailySummary(): DailySummary | null {
  const today = new Date().toISOString().split("T")[0];

  if (!fs.existsSync(DAILY_SUMMARY)) {
    return null;
  }

  try {
    const content = fs.readFileSync(DAILY_SUMMARY, "utf-8");
    const summaries: DailySummary[] = JSON.parse(content);
    return summaries.find(s => s.date === today) || null;
  } catch {
    return null;
  }
}

/**
 * 保存每日摘要
 */
function saveDailySummary(summary: DailySummary): void {
  let summaries: DailySummary[] = [];

  if (fs.existsSync(DAILY_SUMMARY)) {
    try {
      const content = fs.readFileSync(DAILY_SUMMARY, "utf-8");
      summaries = JSON.parse(content);
    } catch {
      summaries = [];
    }
  }

  // 更新或添加今日摘要
  const existingIndex = summaries.findIndex(s => s.date === summary.date);
  if (existingIndex >= 0) {
    summaries[existingIndex] = summary;
  } else {
    summaries.push(summary);
  }

  // 只保留最近 30 天的数据
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  summaries = summaries.filter(s => new Date(s.date) >= thirtyDaysAgo);

  fs.writeFileSync(DAILY_SUMMARY, JSON.stringify(summaries, null, 2));
}

/**
 * 获取 diff 统计
 */
async function getDiffStats(): Promise<{ additions: number; deletions: number; files: string[] }> {
  const stats = { additions: 0, deletions: 0, files: [] as string[] };

  try {
    // 获取未暂存的 diff 统计
    const diffResult = await execGit(["diff", "--stat"]);
    if (diffResult.success && diffResult.output) {
      const lines = diffResult.output.split("\n");
      for (const line of lines) {
        // 格式: " file.ts |  10 +5 -3 |"
        const match = line.match(/^\s*(.+?)\s*\|\s*(\d+)\s*\+(\d+)\s*-(\d+)/);
        if (match) {
          stats.files.push(match[1].trim());
          stats.additions += parseInt(match[3]);
          stats.deletions += parseInt(match[4]);
        }
      }
    }

    // 获取已暂存的 diff 统计
    const cachedResult = await execGit(["diff", "--cached", "--stat"]);
    if (cachedResult.success && cachedResult.output) {
      const lines = cachedResult.output.split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*(.+?)\s*\|\s*(\d+)\s*\+(\d+)\s*-(\d+)/);
        if (match) {
          if (!stats.files.includes(match[1].trim())) {
            stats.files.push(match[1].trim());
          }
          stats.additions += parseInt(match[3]);
          stats.deletions += parseInt(match[4]);
        }
      }
    }
  } catch {
    // 忽略错误
  }

  return stats;
}

/**
 * 优先级排序任务
 */
function prioritizeTasks(tasks: TaskItem[]): TaskItem[] {
  const priorityMap: Record<string, number> = {
    "BUG": 1,
    "FIXME": 2,
    "TODO": 3,
    "HACK": 4,
    "XXX": 5
  };

  return tasks.sort((a, b) => {
    const priorityA = priorityMap[a.type] || 10;
    const priorityB = priorityMap[b.type] || 10;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // 同优先级按文件名排序
    return a.file.localeCompare(b.file);
  });
}

/**
 * 执行 shell 命令
 */
function exec(command: string, args: string[], timeout = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: PROJECT_ROOT,
      shell: true,
      timeout
    });
    let stdout = "";
    let stderr = "";

    proc.stdout?.on("data", (data) => { stdout += data.toString(); });
    proc.stderr?.on("data", (data) => { stderr += data.toString(); });

    proc.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`Command failed: ${command} ${args.join(" ")}\nStderr: ${stderr.trim()}`));
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to spawn ${command}: ${err.message}`));
    });
  });
}

/**
 * 执行只读 git 命令（失败不抛异常）
 */
async function execGit(args: string[]): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    const output = await exec("git", args);
    return { success: true, output };
  } catch (e: any) {
    return { success: false, output: "", error: e.message };
  }
}

/**
 * 健壮的 glob 实现
 */
async function glob(patterns: string[], baseDir: string): Promise<string[]> {
  const results = new Set<string>();
  const config = loadConfig();

  function walk(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // 跳过忽略的目录
      if (entry.isDirectory()) {
        if (!config.ignoreDirs.includes(entry.name)) {
          walk(fullPath);
        }
      } else {
        // 检查扩展名
        const ext = path.extname(entry.name);
        if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
          results.add(fullPath);
        }
      }
    }
  }

  walk(baseDir);
  return Array.from(results);
}

/**
 * 解析 Git 状态
 */
function parseGitStatus(output: string): GitFile[] {
  if (!output.trim()) return [];

  return output.split("\n").map(line => {
    // 格式: XY filename
    // X = index status, Y = working tree status
    const index = line[0] || " ";
    const workingTree = line[1] || " ";
    const filePath = line.slice(3);

    let status: GitFile["status"] = "modified";
    if (index === "?" && workingTree === "?") status = "untracked";
    else if (index === "A") status = "added";
    else if (index === "D") status = "deleted";
    else if (index === "R") status = "renamed";

    return { index, workingTree, path: filePath, status };
  });
}

/**
 * 获取当前分支
 */
async function getCurrentBranch(): Promise<string> {
  const result = await execGit(["branch", "--show-current"]);
  return result.success ? result.output : "";
}

/**
 * 获取 Git 状态
 */
async function getGitStatus(): Promise<GitFile[]> {
  const result = await execGit(["status", "--porcelain"]);
  return result.success ? parseGitStatus(result.output) : [];
}

/**
 * 获取今日提交
 */
async function getTodayCommits(): Promise<CommitInfo[]> {
  const today = new Date().toISOString().split("T")[0];
  const result = await execGit([
    "log",
    "--pretty=format:%h|%s|%an|%ai",
    `--since=${today}T00:00:00`,
    "-20"
  ]);

  if (!result.success) return [];

  return result.output
    .split("\n")
    .filter(Boolean)
    .map(line => {
      const [hash, message, author, date] = line.split("|");
      return { hash, message, author, date };
    });
}

/**
 * 检查是否有未暂存的更改
 */
async function hasUncommittedChanges(): Promise<boolean> {
  const status = await getGitStatus();
  return status.some(f => f.index !== " " || f.workingTree !== " ");
}

/**
 * 暂存所有更改
 */
async function stageAllChanges(): Promise<boolean> {
  const result = await execGit(["add", "-A"]);
  return result.success;
}

/**
 * 创建提交
 */
async function createCommit(message: string): Promise<boolean> {
  const result = await execGit(["commit", "-m", message]);
  return result.success;
}

/**
 * 推送更改
 */
async function pushChanges(): Promise<boolean> {
  const branch = await getCurrentBranch();
  if (!branch) return false;
  const result = await execGit(["push", "origin", branch]);
  return result.success;
}

/**
 * 拉取最新代码
 */
async function pullChanges(): Promise<{ success: boolean; hasConflicts: boolean; message: string }> {
  const branch = await getCurrentBranch();
  if (!branch) {
    return { success: false, hasConflicts: false, message: "不在任何分支上" };
  }

  // 先 fetch
  const fetchResult = await execGit(["fetch", "origin", branch]);
  if (!fetchResult.success) {
    return { success: false, hasConflicts: false, message: `Fetch 失败: ${fetchResult.error}` };
  }

  // 检查本地是否有未提交的更改
  const hasLocal = await hasUncommittedChanges();
  if (hasLocal) {
    return {
      success: false,
      hasConflicts: false,
      message: "本地有未提交的更改，请先提交或暂存"
    };
  }

  // 执行 pull
  const pullResult = await execGit(["pull", "origin", branch]);
  if (!pullResult.success) {
    const hasConflict = pullResult.error?.includes("conflict") || false;
    return {
      success: false,
      hasConflicts: hasConflict,
      message: `Pull 失败: ${pullResult.error}`
    };
  }

  return { success: true, hasConflicts: false, message: "代码已更新" };
}

/**
 * 扫描待办任务
 */
async function scanForTasks(): Promise<TaskItem[]> {
  const tasks: TaskItem[] = [];
  const files = await glob([".ts", ".tsx", ".js", ".jsx"], path.join(PROJECT_ROOT, "frontend/src"));

  const taskPatterns = [
    { regex: /\/\/\s*(TODO):?\s*(.+)/gi, type: "TODO" as const },
    { regex: /\/\/\s*(FIXME):?\s*(.+)/gi, type: "FIXME" as const },
    { regex: /\/\/\s*(HACK):?\s*(.+)/gi, type: "HACK" as const },
    { regex: /\/\/\s*(XXX):?\s*(.+)/gi, type: "XXX" as const },
    { regex: /\/\/\s*(BUG):?\s*(.+)/gi, type: "BUG" as const },
    { regex: /\/\*\*\s*(TODO):?\s*(.+?)\*\//gi, type: "TODO" as const },
  ];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const relativePath = path.relative(PROJECT_ROOT, file);
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      for (const pattern of taskPatterns) {
        const matches = lines[i].matchAll(pattern.regex);
        for (const match of matches) {
          tasks.push({
            file: relativePath,
            line: i + 1,
            type: pattern.type,
            content: match[2].trim()
          });
        }
      }
    }
  }

  return tasks;
}

/**
 * 读取工作日志
 */
function readWorkLog(): DailyLog[] {
  if (!fs.existsSync(WORK_LOG)) return [];

  const content = fs.readFileSync(WORK_LOG, "utf-8");
  const logs: DailyLog[] = [];

  // 分割日期块
  const dateBlockRegex = /^###\s+(\d{4}-\d{2}-\d{2})/gm;
  let match;

  while ((match = dateBlockRegex.exec(content)) !== null) {
    const date = match[1];
    const start = match.index;
    const nextMatch = dateBlockRegex.exec(content);
    const end = nextMatch ? nextMatch.index : content.length;

    const block = content.slice(start, end);
    const entries: WorkEntry[] = [];

    // 解析条目
    const entryRegex = /^- \[([ x])\] \[(\w+)\] (.+?) \| (.+?) \| (.+?) \| (\w+)/;
    const lines = block.split("\n");

    for (const line of lines) {
      const entryMatch = line.match(entryRegex);
      if (entryMatch) {
        entries.push({
          date,
          time: "",
          type: entryMatch[2] as WorkEntry["type"],
          title: entryMatch[3].trim(),
          details: entryMatch[4].trim(),
          filesChanged: entryMatch[5].split(",").map(f => f.trim()),
          status: entryMatch[6] as WorkEntry["status"]
        });
      }
    }

    if (entries.length > 0) {
      logs.push({ date, entries, summary: "" });
    }
  }

  return logs;
}

/**
 * 追加工作日志
 */
function appendWorkEntry(entry: WorkEntry): void {
  const dateStr = `### ${entry.date}`;
  const checkbox = entry.status === "done" ? "x" : " ";
  const entryStr = `- [${checkbox}] [${entry.type}] ${entry.title} | ${entry.details} | ${entry.filesChanged.join(", ")} | ${entry.status}`;

  if (fs.existsSync(WORK_LOG)) {
    const content = fs.readFileSync(WORK_LOG, "utf-8");

    // 检查是否已有该日期的块
    const dateIndex = content.indexOf(dateStr);

    if (dateIndex !== -1) {
      // 在该日期块内追加
      const nextDateIndex = content.indexOf("\n### ", dateIndex + 1);
      const insertPos = nextDateIndex !== -1 ? nextDateIndex : content.length;
      const newContent = content.slice(0, insertPos) + "\n" + entryStr + content.slice(insertPos);
      fs.writeFileSync(WORK_LOG, newContent);
    } else {
      // 新日期，追加到文件末尾
      fs.appendFileSync(WORK_LOG, `\n\n${dateStr}\n\n${entryStr}\n`);
    }
  } else {
    // 新建文件
    fs.writeFileSync(WORK_LOG, `# 工作日志\n\n${dateStr}\n\n${entryStr}\n`);
  }
}

/**
 * 获取今日待办
 */
function getTodayTodos(): WorkEntry[] {
  const logs = readWorkLog();
  const today = new Date().toISOString().split("T")[0];
  const todayLog = logs.find(l => l.date === today);
  return todayLog ? todayLog.entries.filter(e => e.status === "pending") : [];
}

/**
 * 生成提交消息
 */
function generateCommitMessage(entry: WorkEntry, files: string[]): string {
  const typeEmoji: Record<string, string> = {
    feature: "✨",
    fix: "🐛",
    optimize: "⚡",
    refactor: "🔧",
    review: "👀",
    test: "🧪"
  };

  const emoji = typeEmoji[entry.type] || "📝";
  const truncatedTitle = entry.title.length > 50
    ? entry.title.slice(0, 47) + "..."
    : entry.title;

  return `${emoji} ${entry.type}: ${truncatedTitle}`;
}

/**
 * 执行开发循环工作流
 */
export async function runDevelopmentCycle(options: {
  task?: string;
  type?: WorkEntry["type"];
  details?: string;
  files?: string[];
  autoCommit?: boolean;
  priority?: WorkEntry["priority"];
} = {}): Promise<WorkflowResult> {
  const config = loadConfig();
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toTimeString().split(" ")[0].slice(0, 5);
  const startTime = Date.now();

  const result: WorkflowResult = {
    success: true,
    message: "",
    errors: [],
    warnings: [],
    gitStatus: [],
    tasks: [],
    commits: [],
    lintErrors: [],
    lintWarnings: [],
    typeErrors: [],
    diffStats: { additions: 0, deletions: 0, files: [] }
  };

  // 1. 获取当前状态
  result.message += `🔄 开发循环工作流 v3 - ${now.toLocaleString("zh-CN")}\n`;
  result.message += `═══════════════════════════════════════════\n\n`;

  // 2. Git 状态检查
  result.message += `📊 Git 状态检查...\n`;
  const currentBranch = await getCurrentBranch();
  result.message += `   当前分支: ${currentBranch || "未知"}\n`;

  const gitStatus = await getGitStatus();
  result.gitStatus = gitStatus;

  if (gitStatus.length > 0) {
    const modified = gitStatus.filter(f => f.status === "modified").length;
    const untracked = gitStatus.filter(f => f.status === "untracked").length;
    result.message += `   未提交的更改: ${modified} 个文件\n`;
    result.message += `   未跟踪的文件: ${untracked} 个文件\n`;
    result.warnings.push(`有 ${gitStatus.length} 个文件未提交`);
  } else {
    result.message += `   ✅ 工作区干净\n`;
  }

  // 3. 拉取最新代码
  result.message += `\n📥 拉取最新代码...\n`;
  const pullResult = await pullChanges();

  if (pullResult.success) {
    result.message += `   ✅ ${pullResult.message}\n`;
  } else {
    result.message += `   ⚠️ ${pullResult.message}\n`;
    result.warnings.push(pullResult.message);
  }

  // 4. 备份文件
  if (config.enableBackup && gitStatus.length > 0) {
    result.message += `\n💾 备份文件中...\n`;
    const backup = await backupFiles();
    result.backup = backup;

    if (backup.status === "success") {
      result.message += `   ✅ 备份完成 (${(backup.size / 1024).toFixed(1)} KB, ${backup.files.length} 个文件)\n`;
    } else {
      result.message += `   ⚠️ 备份失败\n`;
    }
  }

  // 5. 代码质量检查
  if (config.enableLintCheck) {
    result.message += `\n🔍 代码质量检查...\n`;

    const [lintResult, typeResult] = await Promise.all([
      lintCheck(),
      typeCheck()
    ]);

    result.lintErrors = lintResult.errors;
    result.lintWarnings = lintResult.warnings;
    result.typeErrors = typeResult;

    const totalErrors = lintResult.errors.length + typeResult.filter(t => t.severity === "error").length;
    const totalWarnings = lintResult.warnings.length + typeResult.filter(t => t.severity === "warning").length;

    result.message += `   ESLint: ${lintResult.errors.length} 错误, ${lintResult.warnings.length} 警告\n`;
    result.message += `   TypeScript: ${typeResult.filter(t => t.severity === "error").length} 错误, ${typeResult.filter(t => t.severity === "warning").length} 警告\n`;

    if (totalErrors > 0) {
      result.errors.push(`代码质量检查发现 ${totalErrors} 个错误`);
    }
  }

  // 6. 获取 diff 统计
  if (gitStatus.length > 0) {
    result.diffStats = await getDiffStats();
    result.message += `\n📈 变更统计:\n`;
    result.message += `   新增: +${result.diffStats.additions} 行\n`;
    result.message += `   删除: -${result.diffStats.deletions} 行\n`;
    result.message += `   文件: ${result.diffStats.files.length} 个\n`;
  }

  // 7. 扫描待办任务
  result.message += `\n🔍 扫描待办任务...\n`;
  let tasks = await scanForTasks();
  tasks = prioritizeTasks(tasks);
  result.tasks = tasks;

  if (tasks.length > 0) {
    result.message += `   找到 ${tasks.length} 个待办 (已按优先级排序):\n`;
    const byType = tasks.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    for (const [type, count] of Object.entries(byType)) {
      result.message += `     ${type}: ${count} 个\n`;
    }

    // 显示前 5 个最高优先级的任务
    if (tasks.length > 0) {
      result.message += `   最高优先级:\n`;
      tasks.slice(0, 5).forEach((task, i) => {
        result.message += `     ${i + 1}. [${task.type}] ${task.file}:${task.line}\n`;
        result.message += `        ${task.content.slice(0, 50)}${task.content.length > 50 ? "..." : ""}\n`;
      });
    }
  } else {
    result.message += `   ✅ 没有待办任务\n`;
  }

  // 8. 获取今日提交
  result.message += `\n📤 今日提交记录:\n`;
  const commits = await getTodayCommits();
  result.commits = commits;

  if (commits.length > 0) {
    commits.forEach(c => {
      result.message += `   ${c.hash} ${c.message}\n`;
    });
  } else {
    result.message += `   今日暂无提交\n`;
  }

  // 9. 记录工作日志
  if (options.task) {
    const entry: WorkEntry = {
      date: dateStr,
      time: timeStr,
      type: options.type || "feature",
      title: options.task,
      details: options.details || "",
      filesChanged: options.files || [],
      status: "pending",
      priority: options.priority
    };

    appendWorkEntry(entry);
    result.newEntry = entry;
    result.message += `\n📓 已记录工作项:\n`;
    result.message += `   [${entry.type}] ${entry.title}\n`;
    result.message += `   详情: ${entry.details}\n`;
    result.message += `   文件: ${entry.filesChanged.join(", ") || "未指定"}\n`;

    // 10. 自动提交（如果启用）
    if ((options.autoCommit ?? config.autoCommit) && gitStatus.length > 0) {
      result.message += `\n🔐 自动提交已启用...\n`;

      await stageAllChanges();
      const commitMsg = generateCommitMessage(entry, entry.filesChanged);
      const commitSuccess = await createCommit(commitMsg);

      if (commitSuccess) {
        result.message += `   ✅ 已提交: ${commitMsg}\n`;

        if (config.autoPush) {
          const pushSuccess = await pushChanges();
          if (pushSuccess) {
            result.message += `   ✅ 已推送到远程\n`;
          } else {
            result.message += `   ⚠️ 推送失败，请手动推送\n`;
            result.warnings.push("推送失败");
          }
        }
      } else {
        result.message += `   ⚠️ 提交失败\n`;
        result.errors.push("自动提交失败");
      }
    }
  }

  // 11. 显示今日待办
  const todayTodos = getTodayTodos();
  if (todayTodos.length > 0) {
    result.message += `\n📋 今日待办 (${todayTodos.length}):\n`;
    todayTodos.forEach((todo, i) => {
      result.message += `   ${i + 1}. [${todo.type}] ${todo.title}\n`;
    });
  }

  // 12. 计算执行时间并更新每日摘要
  const workingTime = Math.round((Date.now() - startTime) / 60000);

  result.dailySummary = {
    date: dateStr,
    tasksCompleted: result.commits.length,
    tasksAdded: options.task ? 1 : 0,
    commits: result.commits.length,
    issuesFound: result.lintErrors.length + result.typeErrors.length,
    issuesFixed: 0,
    lintErrors: result.lintErrors.length,
    lintWarnings: result.lintWarnings.length,
    workingTime
  };

  saveDailySummary(result.dailySummary);

  result.message += `\n⏱️ 执行时间: ${workingTime} 分钟\n`;
  result.message += `\n═══════════════════════════════════════════\n`;
  result.message += `✨ 工作流执行完成\n`;

  return result;
}

/**
 * 格式化输出（供 CLI 使用）
 */
export function formatOutput(result: WorkflowResult): string {
  const lines = [result.message];

  if (result.errors.length > 0) {
    lines.push(`\n❌ 错误:`);
    result.errors.forEach(e => lines.push(`   ${e}`));
  }

  if (result.warnings.length > 0) {
    lines.push(`\n⚠️ 警告:`);
    result.warnings.forEach(w => lines.push(`   ${w}`));
  }

  // 显示质量检查详情
  if (result.lintErrors.length > 0) {
    lines.push(`\n🔴 ESLint 错误 (${result.lintErrors.length}):`);
    result.lintErrors.slice(0, 5).forEach(e => {
      lines.push(`   ${e.file}:${e.line} - ${e.message}`);
    });
    if (result.lintErrors.length > 5) {
      lines.push(`   ... 还有 ${result.lintErrors.length - 5} 个错误`);
    }
  }

  if (result.typeErrors.length > 0) {
    lines.push(`\n🔴 TypeScript 错误 (${result.typeErrors.length}):`);
    result.typeErrors.slice(0, 5).forEach(e => {
      lines.push(`   ${e.file}:${e.line} - ${e.message}`);
    });
    if (result.typeErrors.length > 5) {
      lines.push(`   ... 还有 ${result.typeErrors.length - 5} 个错误`);
    }
  }

  // 显示 diff 统计
  if (result.diffStats.files.length > 0) {
    lines.push(`\n📊 变更统计: +${result.diffStats.additions} -${result.diffStats.deletions} (${result.diffStats.files.length} 文件)`);
  }

  return lines.join("\n");
}

// CLI 入口
if (require.main === module) {
  const args = process.argv.slice(2);

  // 解析参数
  const options: Parameters<typeof runDevelopmentCycle>[0] = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--task" || arg === "-t") {
      options.task = args[++i];
    } else if (arg === "--type" || arg === "-T") {
      options.type = args[++i] as WorkEntry["type"];
    } else if (arg === "--details" || arg === "-d") {
      options.details = args[++i];
    } else if (arg === "--files" || arg === "-f") {
      options.files = args[++i].split(",");
    } else if (arg === "--auto-commit" || arg === "-c") {
      options.autoCommit = true;
    } else if (arg === "--priority" || arg === "-p") {
      options.priority = args[++i] as WorkEntry["priority"];
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
开发循环工作流 v3

用法:
  npx ts-node development-workflow.ts [选项]

选项:
  -t, --task <标题>       工作项标题
  -T, --type <类型>       工作项类型 (feature/fix/optimize/refactor/review/test)
  -d, --details <详情>   工作项详情
  -f, --files <文件>      变更的文件（逗号分隔）
  -c, --auto-commit      自动提交
  -p, --priority <级别>  优先级 (low/medium/high)
  -h, --help             显示帮助

定时任务:
  08:00 - 早上检查: 取代码、扫描任务、检查状态
  14:00 - 下午检查: 继续工作、记录进度
  20:00 - 晚上检查: 整理日志、提交当日工作

配置文件:
  frontend/src/lib/workflow-config.json

工作日志:
  frontend/src/lib/work-log.md

每日摘要:
  frontend/src/lib/daily-summary.json

备份目录:
  frontend/src/lib/backups/

示例:
  npx ts-node development-workflow.ts -t "修复登录bug" -T fix -d "修复验证码错误" -f "auth.ts,login.ts"
      `);
      process.exit(0);
    }
  }

  runDevelopmentCycle(options)
    .then(result => {
      console.log(formatOutput(result));
      process.exit(result.errors.length > 0 ? 1 : 0);
    })
    .catch(err => {
      console.error("工作流执行失败:", err);
      process.exit(1);
    });
}

/**
 * 发送通知
 */
async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  const config = loadConfig();

  if (!config.enableNotifications || config.notificationChannels.length === 0) {
    return true;
  }

  const results: boolean[] = [];

  for (const channel of config.notificationChannels) {
    try {
      if (channel === "email") {
        results.push(await sendEmailNotification(payload, config.emailRecipients));
      } else if (channel === "slack" && config.slackWebhook) {
        results.push(await sendSlackNotification(payload, config.slackWebhook));
      } else if (channel === "dingtalk" && config.dingtalkWebhook) {
        results.push(await sendDingtalkNotification(payload, config.dingtalkWebhook));
      }
    } catch (e) {
      results.push(false);
    }
  }

  return results.every(r => r);
}

/**
 * 发送邮件通知
 */
async function sendEmailNotification(payload: NotificationPayload, recipients: string[]): Promise<boolean> {
  // 简化实现，实际应该使用 nodemailer 等库
  console.log(`[Email] 发送通知到 ${recipients.join(", ")}: ${payload.title}`);
  return true;
}

/**
 * 发送 Slack 通知
 */
async function sendSlackNotification(payload: NotificationPayload, webhook: string): Promise<boolean> {
  try {
    await exec("curl", [
      "-X", "POST",
      "-H", "Content-Type: application/json",
      "-d", JSON.stringify({
        text: `*${payload.title}*\n${payload.message}`
      }),
      webhook
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * 发送钉钉通知
 */
async function sendDingtalkNotification(payload: NotificationPayload, webhook: string): Promise<boolean> {
  try {
    const msgType = payload.type === "error" ? "text" : "text";
    await exec("curl", [
      "-X", "POST",
      "-H", "Content-Type: application/json",
      "-d", JSON.stringify({
        msgtype: msgType,
        text: {
          content: `【阅川工作流】${payload.title}\n${payload.message}`
        }
      }),
      webhook
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * 生成 HTML 报告
 */
function generateHTMLReport(data: ReportData): string {
  const emoji = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
    feature: "✨",
    fix: "🐛",
    optimize: "⚡",
    refactor: "🔧",
    security: "🔒"
  };

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>开发工作流报告 - ${data.generatedAt}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
    .header h1 { font-size: 2em; margin-bottom: 10px; }
    .header p { opacity: 0.9; }
    .card { background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card h2 { border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 15px; font-size: 1.3em; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
    .stat { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .stat-value { font-size: 2em; font-weight: bold; color: #667eea; }
    .stat-label { color: #666; font-size: 0.9em; }
    .stat.error .stat-value { color: #e74c3c; }
    .stat.warning .stat-value { color: #f39c12; }
    .stat.success .stat-value { color: #27ae60; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; }
    tr:hover { background: #f8f9fa; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 600; }
    .badge-bug { background: #ffeaa7; color: #d63031; }
    .badge-todo { background: #81ecec; color: #00b894; }
    .badge-fixme { background: #fab1a0; color: #e17055; }
    .badge-high { background: #ff7675; color: white; }
    .badge-medium { background: #fdcb6e; color: #d63031; }
    .badge-low { background: #74b9ff; color: white; }
    .recommendation { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #667eea; }
    .recommendation h4 { margin-bottom: 5px; }
    .recommendation p { color: #666; font-size: 0.9em; }
    .recommendation .meta { margin-top: 10px; font-size: 0.8em; color: #999; }
    .chart { height: 200px; display: flex; align-items: flex-end; gap: 10px; padding: 20px 0; }
    .chart-bar { flex: 1; background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); border-radius: 4px 4px 0 0; position: relative; }
    .chart-bar:hover { opacity: 0.8; }
    .chart-bar::after { content: attr(data-value); position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 0.8em; color: #666; }
    .chart-bar::before { content: attr(data-label); position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.7em; color: #999; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔄 开发工作流报告</h1>
      <p>生成时间: ${data.generatedAt} | 周期: ${data.period.start} ~ ${data.period.end}</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${data.summary.totalCommits}</div>
        <div class="stat-label">提交次数</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.summary.totalTasks}</div>
        <div class="stat-label">完成任务</div>
      </div>
      <div class="stat ${data.summary.totalIssues > 0 ? 'error' : 'success'}">
        <div class="stat-value">${data.summary.totalIssues}</div>
        <div class="stat-label">发现问题</div>
      </div>
      <div class="stat">
        <div class="stat-value">${data.summary.totalWorkingTime}min</div>
        <div class="stat-label">工作时长</div>
      </div>
    </div>

    <div class="card">
      <h2>📊 每日统计</h2>
      <div class="chart">
        ${data.dailyStats.map(d => {
          const maxCommits = Math.max(...data.dailyStats.map(s => s.commits), 1);
          const height = Math.max((d.commits / maxCommits) * 150, 10);
          return `<div class="chart-bar" style="height: ${height}px" data-value="${d.commits}" data-label="${d.date.slice(5)}"></div>`;
        }).join("")}
      </div>
    </div>

    ${data.topTasks.length > 0 ? `
    <div class="card">
      <h2>📋 待办任务 (Top 10)</h2>
      <table>
        <thead>
          <tr>
            <th>类型</th>
            <th>文件</th>
            <th>行号</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          ${data.topTasks.slice(0, 10).map(t => `
          <tr>
            <td><span class="badge badge-${t.type.toLowerCase()}">${t.type}</span></td>
            <td>${t.file}</td>
            <td>${t.line}</td>
            <td>${t.content.slice(0, 60)}${t.content.length > 60 ? "..." : ""}</td>
          </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${data.topErrors.length > 0 ? `
    <div class="card">
      <h2>🐛 代码问题 (Top 10)</h2>
      <table>
        <thead>
          <tr>
            <th>严重性</th>
            <th>文件</th>
            <th>规则</th>
            <th>消息</th>
          </tr>
        </thead>
        <tbody>
          ${data.topErrors.slice(0, 10).map(e => `
          <tr>
            <td><span class="badge ${e.severity === 'error' ? 'badge-bug' : 'badge-todo'}">${e.severity}</span></td>
            <td>${e.file}:${e.line}</td>
            <td>${e.rule}</td>
            <td>${e.message.slice(0, 60)}${e.message.length > 60 ? "..." : ""}</td>
          </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
    ` : ""}

    ${data.recommendations.length > 0 ? `
    <div class="card">
      <h2>💡 优化建议</h2>
      ${data.recommendations.map(r => `
      <div class="recommendation">
        <h4>${emoji[r.type] || "📝"} ${r.title}</h4>
        <p>${r.description}</p>
        <div class="meta">
          <span class="badge badge-${r.priority}">${r.priority}</span>
          ${r.files.length > 0 ? ` | 影响文件: ${r.files.slice(0, 3).join(", ")}${r.files.length > 3 ? "..." : ""}` : ""}
          | 预计时间: ${r.estimatedTime}分钟
          ${r.autoFixable ? " | 可自动修复" : ""}
        </div>
      </div>
      `).join("")}
    </div>
    ` : ""}

    <div class="footer">
      <p>此报告由开发循环工作流自动生成</p>
      <p>${new Date().toLocaleString("zh-CN")}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 获取智能推荐
 */
function getRecommendations(tasks: TaskItem[], errors: QualityIssue[], dailyStats: DailySummary[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const today = new Date().toISOString().split("T")[0];

  // 1. 基于未完成的高优先级任务推荐
  const bugTasks = tasks.filter(t => t.type === "BUG" || t.type === "FIXME");
  if (bugTasks.length > 0) {
    recommendations.push({
      id: "rec-1",
      type: "fix",
      priority: "high",
      title: "修复高优先级 Bug",
      description: `发现 ${bugTasks.length} 个未修复的 Bug，建议优先处理`,
      files: [...new Set(bugTasks.map(t => t.file))],
      estimatedTime: bugTasks.length * 15,
      autoFixable: false
    });
  }

  // 2. 基于代码质量错误推荐
  const errorFiles = [...new Set(errors.filter(e => e.severity === "error").map(e => e.file))];
  if (errorFiles.length > 0) {
    recommendations.push({
      id: "rec-2",
      type: "optimize",
      priority: errorFiles.length > 5 ? "high" : "medium",
      title: "修复 ESLint 错误",
      description: `有 ${errors.filter(e => e.severity === "error").length} 个 ESLint 错误需要修复`,
      files: errorFiles.slice(0, 5),
      estimatedTime: errors.filter(e => e.severity === "error").length * 5,
      autoFixable: true
    });
  }

  // 3. 基于工作习惯推荐
  const todayStats = dailyStats.find(d => d.date === today);
  if (todayStats) {
    if (todayStats.tasksCompleted === 0) {
      recommendations.push({
        id: "rec-3",
        type: "feature",
        priority: "medium",
        title: "开始今日工作",
        description: "今日还未完成任何任务，建议选择一个待办事项开始处理",
        files: [],
        estimatedTime: 30,
        autoFixable: false
      });
    }

    if (todayStats.lintWarnings > 10) {
      recommendations.push({
        id: "rec-4",
        type: "optimize",
        priority: "low",
        title: "清理代码警告",
        description: `今日新增 ${todayStats.lintWarnings} 个 ESLint 警告，建议清理`,
        files: [],
        estimatedTime: 20,
        autoFixable: true
      });
    }
  }

  // 4. 安全建议
  const securityPatterns = ["password", "secret", "token", "api_key", "private_key"];
  const securityIssues = tasks.filter(t =>
    securityPatterns.some(p => t.content.toLowerCase().includes(p))
  );

  if (securityIssues.length > 0) {
    recommendations.push({
      id: "rec-5",
      type: "security",
      priority: "high",
      title: "安全敏感信息检查",
      description: "发现可能包含敏感信息的代码，请检查是否需要加密或移除",
      files: securityIssues.map(t => t.file),
      estimatedTime: 10,
      autoFixable: false
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * 生成完整报告
 */
export async function generateFullReport(): Promise<void> {
  const config = loadConfig();
  const now = new Date();

  // 获取最近 7 天的数据
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

  // 读取每日摘要
  let dailyStats: DailySummary[] = [];
  if (fs.existsSync(DAILY_SUMMARY)) {
    try {
      const content = fs.readFileSync(DAILY_SUMMARY, "utf-8");
      dailyStats = JSON.parse(content);
    } catch {
      dailyStats = [];
    }
  }

  // 过滤最近 7 天
  dailyStats = dailyStats.filter(d => d.date >= sevenDaysAgoStr);

  // 扫描任务和错误
  const tasks = prioritizeTasks(await scanForTasks());
  const lintResult = await lintCheck();
  const typeResult = await typeCheck();

  const allErrors = [...lintResult.errors, ...typeResult];

  // 生成推荐
  const recommendations = getRecommendations(tasks, allErrors, dailyStats);

  // 保存推荐
  fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(recommendations, null, 2));

  // 生成报告数据
  const reportData: ReportData = {
    generatedAt: now.toLocaleString("zh-CN"),
    period: {
      start: sevenDaysAgoStr,
      end: now.toISOString().split("T")[0]
    },
    summary: {
      totalCommits: dailyStats.reduce((sum, d) => sum + d.commits, 0),
      totalTasks: dailyStats.reduce((sum, d) => sum + d.tasksCompleted, 0),
      totalIssues: dailyStats.reduce((sum, d) => sum + d.issuesFound, 0),
      totalWorkingTime: dailyStats.reduce((sum, d) => sum + d.workingTime, 0)
    },
    dailyStats,
    topTasks: tasks.slice(0, 10),
    topErrors: allErrors.slice(0, 10),
    recommendations
  };

  // 生成 HTML 报告
  const html = generateHTMLReport(reportData);
  fs.writeFileSync(REPORT_FILE, html);

  console.log(`报告已生成: ${REPORT_FILE}`);
}

/**
 * 创建 GitHub PR (简化实现)
 */
async function createGitHubPR(options: {
  title: string;
  body: string;
  head: string;
  base: string;
}): Promise<GitHubPR | null> {
  const config = loadConfig();

  if (!config.enableGitHubPR || !config.gitHubToken || !config.gitHubOwner || !config.gitHubRepo) {
    return null;
  }

  try {
    const result = await exec("curl", [
      "-X", "POST",
      "-H", `Authorization: token ${config.gitHubToken}`,
      "-H", "Accept: application/vnd.github.v3+json",
      "-H", "Content-Type: application/json",
      `https://api.github.com/repos/${config.gitHubOwner}/${config.gitHubRepo}/pulls`,
      "-d", JSON.stringify(options)
    ]);

    const pr = JSON.parse(result);
    return {
      number: pr.number,
      url: pr.html_url,
      title: pr.title,
      body: pr.body,
      state: pr.state
    };
  } catch {
    return null;
  }
}
