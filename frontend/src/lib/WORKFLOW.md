# 开发循环工作流

## 概述

每次工作时执行以下循环流程：

```
取代码 → 写功能/改bug → 优化 → 记录日志 → 上传
```

---

## 每日循环

### 早上 (08:00)

1. **取最新代码**
   ```bash
   git fetch origin
   git pull origin main
   ```

2. **检查状态**
   ```bash
   git status
   git diff --stat
   ```

3. **扫描待办**
   - 检查 TODO/FIXME/HACK/XXX/BUG 注释
   - 查看工作日志 `work-log.md`

4. **代码质量检查**
   ```bash
   npx eslint frontend/src --format json
   npx tsc --noEmit
   ```

5. **记录到 `work-log.md`**
   ```
   - [ ] [类型] 标题 | 详情 | 文件 | pending
   ```

---

### 工作中 (14:00)

1. **取最新代码**
   ```bash
   git fetch origin
   git pull origin main
   ```

2. **继续待办任务**
   - 查看今日待办
   - 处理 BUG/FIXME 优先

3. **如有变更**
   ```bash
   git add -A
   git commit -m "✨ feat: 标题"
   ```

4. **更新日志**
   - 在 `work-log.md` 标记完成的任务
   - 记录新发现的问题

---

### 晚上 (20:00)

1. **取最新代码**
   ```bash
   git fetch origin
   git pull origin main
   ```

2. **整理工作**
   - 检查未完成的任务
   - 更新 `daily-summary.json`

3. **生成报告**
   - 更新 `auto-review-report.md`
   - 确认 `workflow-report.html` 最新

4. **提交当日工作**
   ```bash
   git add -A
   git commit -m "📝 docs: 更新工作日志"
   git push origin main
   ```

---

## 工作类型

| 类型 | 说明 | emoji |
|------|------|-------|
| `feature` | 新功能 | ✨ |
| `fix` | Bug修复 | 🐛 |
| `optimize` | 优化 | ⚡ |
| `refactor` | 重构 | 🔧 |
| `review` | 代码审查 | 👀 |
| `test` | 测试 | 🧪 |

---

## 工作日志格式

```markdown
### YYYY-MM-DD

- [ ] [feature] 功能名称 | 功能描述 | 相关文件 | pending
- [x] [fix] Bug修复 | 修复内容 | 文件1,文件2 | done
- [ ] [optimize] 性能优化 | 优化点 | 文件 | blocked
```

---

## 文件说明

| 文件 | 说明 |
|------|------|
| `work-log.md` | 工作日志，记录每次循环的工作 |
| `workflow-config.json` | 工作流配置 |
| `daily-summary.json` | 每日统计（自动生成） |
| `auto-review-report.md` | 自动审查报告 |
| `workflow-report.html` | HTML 工作报告 |
| `recommendations.json` | 智能推荐（自动生成） |

---

## 代码质量检查清单

- [ ] ESLint 无错误
- [ ] TypeScript 无错误
- [ ] 文件命名与导出名一致
- [ ] 中文 UI 文本
- [ ] 日期使用 `zh-CN` locale
- [ ] 无敏感信息泄露

---

## 提交规范

```
✨ feat: 新功能描述
🐛 fix: 修复内容描述
⚡ optimize: 优化描述
🔧 refactor: 重构描述
👀 review: 审查描述
🧪 test: 测试描述
📝 docs: 文档更新
💄 style: 样式调整
🔒 security: 安全修复
```

---

## 循环检查点

每次循环时自问：

1. 代码有没有新问题？
2. 待办任务有没有更新？
3. 工作日志有没有记录？
4. 提交有没有遗漏？
5. 明天要优先做什么？
