# 项目目录结构

## 概述

本项目是一个基于Cloudflare边缘平台的全栈移动应用模板，采用Turborepo管理的monorepo结构，集成了多种现代化技术和最佳实践。

## 目录结构

```
.
├── apps/                  # 应用程序目录
│   ├── apiservice/        # Cloudflare Worker API服务
│   │   ├── src/           # API源代码
│   │   ├── wrangler.toml  # Cloudflare Worker配置
│   │   └── package.json   # 依赖配置
│   ├── astro/             # Astro静态网站(落地页)
│   │   ├── src/           # 网站源代码
│   │   ├── public/        # 静态资源
│   │   └── functions/     # Cloudflare Pages函数
│   ├── expo/              # Expo移动应用
│   │   ├── app/           # 应用页面和组件
│   │   └── assets/        # 移动应用资源
│   └── workflows/         # Cloudflare Workflows持久化任务处理
│       └── src/           # 工作流源代码
├── docs/                  # 项目文档
│   ├── CONTRIBUTING.md    # 贡献指南
│   └── DEVELOPMENT_GUIDELINES.md # 开发指南
├── packages/              # 共享包目录
│   ├── db/                # 数据库模块
│   │   ├── migrations/    # 数据库迁移文件
│   │   └── src/           # 数据库schema和工具
│   └── trpc/              # tRPC API定义
│       └── src/           # tRPC路由和类型
├── tooling/               # 开发工具和配置
│   ├── eslint/            # ESLint配置
│   ├── github/            # GitHub工作流配置
│   ├── prettier/          # Prettier代码格式化配置
│   ├── tailwind/          # Tailwind CSS配置
│   └── typescript/        # TypeScript配置
├── turbo/                 # Turborepo配置
│   └── generators/        # 代码生成器模板
├── .env.example           # 环境变量示例
├── package.json           # 项目依赖和脚本
└── pnpm-workspace.yaml    # PNPM工作区配置
```

## 主要目录和文件说明

### apps/

- **apiservice/**: Cloudflare Worker API服务，处理后端API请求
  - 提供tRPC端点，处理数据库操作和业务逻辑
  - 通过wrangler.toml配置与Cloudflare资源的连接

- **astro/**: 基于Astro框架的静态网站，作为项目的落地页
  - 使用Tailwind CSS进行样式设计
  - 包含Cloudflare Pages函数用于服务端逻辑

- **expo/**: 基于Expo的跨平台移动应用
  - 使用React Native构建UI组件
  - 通过tRPC客户端与后端API通信

- **workflows/**: Cloudflare Workflows持久化任务处理
  - 处理长时间运行的AI任务和异步操作

### packages/

- **db/**: 数据库模块
  - 使用Drizzle ORM定义数据库schema
  - 包含数据库迁移文件和客户端连接配置
  - 与Cloudflare D1(边缘SQLite数据库)集成

- **trpc/**: tRPC API定义
  - 定义类型安全的API路由和过程
  - 提供前后端共享的类型定义

### tooling/

包含各种开发工具和配置，确保项目代码质量和一致性：

- ESLint配置用于代码检查
- Prettier配置用于代码格式化
- Tailwind CSS配置用于样式设计
- TypeScript配置用于类型检查

## 关键文件

- **package.json**: 定义项目依赖和脚本命令
- **pnpm-workspace.yaml**: 配置PNPM工作区
- **turbo.json**: Turborepo配置，定义构建管道和缓存策略
- **wrangler.toml**: 各应用中的Cloudflare Worker配置文件

## 技术栈概览

- **前端**: React Native (Expo), Astro, Tailwind CSS
- **后端**: Cloudflare Workers, Workflows
- **数据库**: Cloudflare D1 (SQLite) + Drizzle ORM
- **存储**: Cloudflare R2
- **API**: tRPC
- **认证**: Clerk
- **AI处理**: Cloudflare Workers AI
- **构建工具**: Turborepo, PNPM

这种结构设计使项目具有良好的模块化和可扩展性，同时利用Cloudflare的边缘计算能力提供高性能的用户体验。