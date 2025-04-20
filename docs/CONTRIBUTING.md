# 贡献指南

感谢您对 Cloudflare Turbo Stack 项目的贡献兴趣！本文档提供了参与项目开发的详细指南，帮助您快速上手并遵循项目的最佳实践。

## 目录

- [开发环境设置](#开发环境设置)
- [开发工作流程](#开发工作流程)
- [提交代码](#提交代码)
- [创建新应用或包](#创建新应用或包)
- [常见问题解决](#常见问题解决)

## 开发环境设置

### 前提条件

- Node.js >= 20.16.0
- pnpm >= 9.6.0
- Git

### 初始设置

1. 克隆仓库

```bash
git clone <repository-url>
cd cloudflare-workers-d1-r2-expo-turborepo-trpc-workflows-astro
```

2. 安装依赖

```bash
pnpm install
```

3. 环境变量配置

```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的环境变量
```

## 开发工作流程

### 启动开发服务器

启动所有服务：

```bash
pnpm dev
```

启动特定应用：

```bash
# 例如，仅启动 API 服务
pnpm dev -F @acme/apiservice...
```

### 数据库操作

生成数据库迁移：

```bash
pnpm db:generate
```

应用数据库迁移：

```bash
pnpm -F @acme/db migrate
```

打开数据库管理界面：

```bash
pnpm db:studio
```

### 代码质量检查

运行 ESLint 检查：

```bash
pnpm lint
```

自动修复 ESLint 问题：

```bash
pnpm lint:fix
```

检查代码格式：

```bash
pnpm format
```

自动修复格式问题：

```bash
pnpm format:fix
```

类型检查：

```bash
pnpm typecheck
```

## 提交代码

### 分支创建

从最新的 main 分支创建功能分支：

```bash
git checkout main
git pull
git checkout -b feature/your-feature-name
```

### 提交前检查

在提交代码前，确保：

1. 代码通过所有检查：

```bash
pnpm lint && pnpm format && pnpm typecheck
```

2. 所有应用能正常构建：

```bash
pnpm build
```

### 提交信息格式

遵循约定式提交规范：

```
<类型>(<作用域>): <描述>

[可选的详细描述]

[可选的关闭问题引用]
```

示例：

```
feat(auth): 添加用户注册功能

实现了基于 Clerk 的用户注册流程，包括邮箱验证和初始化用户配置文件。

Closes #123
```

### 创建 Pull Request

1. 推送分支到远程仓库：

```bash
git push -u origin feature/your-feature-name
```

2. 在 GitHub 上创建 Pull Request
3. 填写 PR 描述，包括：
   - 实现的功能或修复的问题
   - 实现方法的简要说明
   - 测试方法
   - 相关的 issue 链接

4. 等待代码审查和 CI 检查通过

## 创建新应用或包

### 创建新应用

1. 在 `apps` 目录下创建新目录
2. 初始化 package.json：

```json
{
  "name": "@acme/your-app-name",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "clean": "git clean -xdf .cache .turbo node_modules"
  },
  "dependencies": {
    "@acme/db": "workspace:*"
  },
  "devDependencies": {
    "@acme/eslint-config": "workspace:*",
    "@acme/tsconfig": "workspace:*"
  }
}
```

3. 创建 `tsconfig.json`，继承基础配置：

```json
{
  "extends": "@acme/tsconfig/base.json",
  "compilerOptions": {
    "tsBuildInfoFile": ".cache/tsbuildinfo.json"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

4. 创建 `turbo.json` 配置：

```json
{
  "extends": ["//"]
}
```

### 创建新包

1. 在 `packages` 目录下创建新目录
2. 初始化 package.json：

```json
{
  "name": "@acme/your-package-name",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "clean": "git clean -xdf .cache .turbo dist node_modules",
    "dev": "tsc --watch",
    "lint": "eslint",
    "typecheck": "tsc --noEmit --emitDeclarationOnly false"
  },
  "devDependencies": {
    "@acme/eslint-config": "workspace:*",
    "@acme/tsconfig": "workspace:*",
    "typescript": "catalog:"
  }
}
```

3. 创建 `tsconfig.json`，继承基础配置
4. 创建 `src/index.ts` 作为包的入口点

## 常见问题解决

### 依赖问题

如果遇到依赖相关问题，尝试：

```bash
# 清理 node_modules
pnpm clean

# 重新安装依赖
pnpm install
```

### Turborepo 缓存问题

如果遇到构建缓存问题：

```bash
# 清理 Turborepo 缓存
rm -rf .turbo
```

### 环境变量问题

确保所有必要的环境变量都已在 `.env` 文件中设置，并且已在 `turbo.json` 的 `globalEnv` 中声明。

---

如有任何问题或建议，请创建 issue 或联系项目维护者。我们欢迎所有形式的贡献！