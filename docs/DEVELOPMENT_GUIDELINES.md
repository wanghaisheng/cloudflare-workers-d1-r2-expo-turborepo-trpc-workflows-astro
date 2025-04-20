# Cloudflare Turbo Stack 开发规范

本文档提供了基于 Cloudflare Turbo Stack 项目的开发规范指南，旨在确保多人协作开发时保持一致性和高质量的代码标准。

## 目录

- [项目结构规范](#项目结构规范)
- [技术栈规范](#技术栈规范)
- [代码风格指南](#代码风格指南)
- [Git 工作流规范](#git-工作流规范)
- [依赖管理规范](#依赖管理规范)
- [环境变量管理](#环境变量管理)
- [构建与部署规范](#构建与部署规范)
- [测试规范](#测试规范)
- [文档规范](#文档规范)

## 项目结构规范

### Monorepo 结构

项目采用 Turborepo 管理的 Monorepo 结构，包含以下主要目录：

```
.
├── apps/                # 应用程序
│   ├── apiservice/      # Cloudflare Worker API
│   ├── astro/           # 静态网站/登陆页
│   ├── expo/            # 移动应用
│   └── workflows/       # Cloudflare Workflows
├── packages/            # 共享包
│   ├── db/              # 数据库模式和工具
│   └── trpc/            # tRPC 路由定义
└── tooling/             # 共享开发工具
    ├── eslint/          # ESLint 配置
    ├── github/          # GitHub 工作流配置
    ├── prettier/        # Prettier 配置
    ├── tailwind/        # Tailwind 配置
    └── typescript/      # TypeScript 配置
```

### 新应用/包的添加规则

1. **应用程序**：所有独立应用应放在 `apps/` 目录下
2. **共享包**：可重用的代码库应放在 `packages/` 目录下
3. **工具配置**：共享的开发工具配置应放在 `tooling/` 目录下
4. **命名规范**：
   - 包名使用小写字母，单词间用连字符（-）分隔
   - 内部包名前缀统一为 `@acme/`

## 技术栈规范

项目使用以下技术栈，新功能开发必须遵循这些选择以保持一致性：

- **前端**：React Native (Expo)、Astro
- **后端**：Cloudflare Workers、Workers AI
- **数据库**：Cloudflare D1 (SQLite)
- **存储**：Cloudflare R2
- **认证**：Clerk
- **API**：tRPC
- **构建工具**：Turborepo
- **包管理器**：pnpm

### 技术选择原则

1. 优先使用项目已有的技术和库
2. 添加新依赖前，必须在团队内讨论并获得批准
3. 避免引入功能重叠的库

## 代码风格指南

### TypeScript

- 使用项目提供的 TypeScript 配置（`@acme/tsconfig`）
- 严格模式（`strict: true`）
- 避免使用 `any` 类型，优先使用 `unknown` 或具体类型
- 使用类型推断，但在函数参数和返回值上显式声明类型

### ESLint

项目使用统一的 ESLint 配置，位于 `tooling/eslint/` 目录：

- 遵循基础配置 (`base.js`)
- React 项目使用 React 特定规则 (`react.js`)
- Next.js 项目使用 Next.js 特定规则 (`nextjs.js`)

运行 `pnpm lint` 检查代码，`pnpm lint:fix` 自动修复问题。

### Prettier

使用项目统一的 Prettier 配置（`tooling/prettier/index.js`）：

- 导入排序规则遵循配置中的 `importOrder`
- 使用 Tailwind CSS 插件确保类名排序一致

运行 `pnpm format` 检查格式，`pnpm format:fix` 自动修复格式问题。

### 命名约定

- **文件名**：
  - React 组件使用 PascalCase（如 `Button.tsx`）
  - 工具函数使用 camelCase（如 `formatDate.ts`）
  - 常量文件使用 kebab-case（如 `api-constants.ts`）
- **变量/函数**：使用 camelCase
- **类/接口/类型**：使用 PascalCase
- **常量**：使用 UPPER_SNAKE_CASE

## Git 工作流规范

### 分支策略

- **main**：主分支，保持可部署状态
- **feature/**：功能分支，从 main 分支创建
- **bugfix/**：修复分支，从 main 分支创建
- **release/**：发布分支，用于准备发布

### 提交规范

提交信息应遵循以下格式：

```
<类型>(<作用域>): <描述>

[可选的详细描述]

[可选的关闭问题引用]
```

类型包括：
- **feat**：新功能
- **fix**：错误修复
- **docs**：文档更改
- **style**：不影响代码含义的更改（空格、格式等）
- **refactor**：既不修复错误也不添加功能的代码更改
- **perf**：提高性能的代码更改
- **test**：添加或修正测试
- **chore**：对构建过程或辅助工具的更改

示例：`feat(auth): 添加用户注册功能`

### 代码审查

- 所有代码更改必须通过 Pull Request 提交
- 至少需要一名团队成员的审查和批准
- CI 检查必须通过（类型检查、lint、测试等）

## 依赖管理规范

### 包管理器

- 使用 pnpm 作为唯一的包管理器
- Node.js 版本要求：>=20.16.0
- pnpm 版本要求：^9.6.0

### 工作区依赖

- 工作区内部依赖使用 `workspace:*` 版本说明符
- 共享依赖使用 `catalog:` 版本说明符，确保版本一致性

### 添加依赖

- 添加全局依赖：`pnpm add -w <package>`
- 添加特定工作区依赖：`pnpm add <package> --filter <workspace>`
- 添加开发依赖：`pnpm add -D <package> [--filter <workspace>]`

## 环境变量管理

- 环境变量定义在项目根目录的 `.env` 文件中
- 使用 `.env.example` 作为模板，记录所需的环境变量
- 通过 `turbo.json` 的 `globalEnv` 配置共享环境变量
- 在代码中，使用 `import { env } from '~/env'` 访问环境变量，而不是直接使用 `process.env`

## 构建与部署规范

### 本地开发

- 启动所有服务：`pnpm dev`
- 启动特定应用：`pnpm dev -F @acme/<app-name>...`

### 构建

- 构建所有应用：`pnpm build`
- 构建特定应用：`pnpm build -F @acme/<app-name>...`

### 部署

- Cloudflare Workers 部署：`pnpm deploy -F @acme/<worker-name>`
- 数据库迁移：
  - 生成迁移：`pnpm db:generate`
  - 应用迁移：`pnpm -F @acme/db migrate`

## 测试规范

- 单元测试应放在与被测代码相同目录下的 `__tests__` 目录中
- 集成测试应放在应用的 `tests` 目录中
- 测试文件命名：`<被测文件名>.test.ts` 或 `<被测文件名>.spec.ts`
- 使用 Jest 或 Vitest 作为测试框架

## 文档规范

- 每个应用和包应有自己的 README.md 文件，描述其用途和使用方法
- API 文档应使用 JSDoc 注释
- 复杂功能应有设计文档，放在相关应用/包的 `docs` 目录下
- 项目级文档放在根目录，如本开发规范文档

---

## 前后端交互与 API 扩展规范

### 1. 交互架构说明
- **静态网站（Astro）** 和 **移动应用（Expo）** 通过 tRPC 客户端直接调用 `apiservice`（Cloudflare Worker API），实现无 REST 层的类型安全远程调用。
- tRPC 路由统一在 `packages/trpc` 维护，前端通过 `@acme/trpc` 包自动获得类型推断和 API 路由。
- 数据请求流程：前端页面/功能 → tRPC 客户端 → apiservice（tRPC handler）→ 数据库（Cloudflare D1）或存储（R2）。

### 2. 新增页面/功能时的 API 扩展流程
1. **前端页面增加（Astro/Expo）**：
   - 新建页面或功能组件，按需调用 tRPC 提供的 API。
   - 若需新接口，需同步扩展 tRPC 路由。
2. **API 扩展（apiservice & trpc）**：
   - 在 `packages/trpc/src/router/` 下新增或扩展对应路由文件，定义输入输出类型和业务逻辑。
   - 在 `packages/trpc/src/router/index.ts` 注册新路由。
   - 在 `apps/apiservice/src` 中确保 tRPC handler 正确引入路由。
3. **数据库 schema 联动**：
   - 若 API 涉及新表/字段，先在 `packages/db/src/schema/` 下定义/修改 schema。
   - 运行 `pnpm db:generate` 生成迁移脚本，`pnpm -F @acme/db migrate` 应用迁移。
   - API 层通过 ORM 访问数据库，保持类型一致。
4. **前端调用**：
   - 前端通过 `@acme/trpc` 的 hooks（如 `trpc.useQuery`、`trpc.useMutation`）调用新 API，自动获得类型提示。

### 3. tRPC 路由扩展与类型安全
- 路由定义集中在 `packages/trpc`，所有输入输出类型自动推断。
- 前端无需手动维护接口类型，避免类型漂移。
- 推荐每次扩展 API 时补充 JSDoc 注释，便于自动生成文档。

### 4. 典型开发流程示例
1. Astro/Expo 新增“用户资料”页面 → 发现需获取/更新用户信息
2. 在 `packages/trpc/src/router/user.ts` 新增 `getProfile`、`updateProfile` 方法
3. 在 `packages/db/src/schema/user.ts` 增加字段（如 avatar）并迁移
4. 在前端页面通过 `trpc.user.getProfile.useQuery()` 获取数据，`trpc.user.updateProfile.useMutation()` 更新
5. 代码提交后，CI 自动检查类型、lint、测试

### 5. 注意事项
- 所有 API 变更需同步更新 tRPC 路由和类型
- 数据库 schema 变更需生成并应用迁移，避免手动修改数据库
- 推荐前后端开发协同评审 API 设计，确保接口语义清晰

---

本规范文档应随项目演进而更新。团队成员有责任遵循这些规范，并在发现问题时提出改进建议。

## 数据库 Schema 变更与 tRPC 层同步流程

当数据库 schema 发生变化时，需同步更新 `packages/trpc/src/router` 目录下相关路由和输入/输出类型定义，确保前后端类型一致，保证类型安全。推荐流程如下：

1. **更新数据库 schema**：在 `packages/db` 中完成 schema 变更及迁移。
2. **同步 tRPC 路由与类型**：根据最新 schema，及时更新 `packages/trpc/src/router` 下相关路由的输入、输出类型定义和业务逻辑。
3. **类型检查**：确保 tRPC 路由的输入输出类型与数据库模型保持一致，充分利用 TypeScript 类型推断。
4. **端到端测试**：完成变更后，进行端到端测试，验证接口和数据结构的正确性，确保前端调用无类型错误。
5. **代码审查**：每次数据库 schema 变更，务必同步提交 tRPC 层相关更新，避免类型漂移。

> 建议：每次数据库 schema 变更后，务必检查并同步更新 tRPC 路由和类型定义，保证类型安全和接口一致性。