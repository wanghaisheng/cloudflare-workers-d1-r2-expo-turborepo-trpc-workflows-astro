# 发布流程与插件管理

## 目录

- [发布流程概述](#发布流程概述)
- [版本管理策略](#版本管理策略)
- [发布前检查清单](#发布前检查清单)
- [构建与部署流程](#构建与部署流程)
- [环境管理](#环境管理)
- [Capacitor插件管理](#capacitor插件管理)
- [回滚策略](#回滚策略)
- [发布后监控](#发布后监控)

## 发布流程概述

本项目采用持续集成和持续部署(CI/CD)策略，通过自动化流程确保代码质量和部署效率。发布流程包括以下阶段：

1. **开发与测试**: 功能开发、代码审查和自动化测试
2. **预发布**: 在预发布环境验证功能和性能
3. **发布准备**: 版本标记、更新日志生成和发布说明
4. **生产部署**: 部署到生产环境
5. **发布后验证**: 确认部署成功并监控性能

## 版本管理策略

### 语义化版本

项目遵循[语义化版本](https://semver.org/)规范(SemVer)：

- **主版本号(X.0.0)**: 不兼容的API变更
- **次版本号(0.X.0)**: 向后兼容的功能新增
- **修订号(0.0.X)**: 向后兼容的问题修复

### 版本控制流程

1. **分支策略**
   - `main`: 主分支，包含最新稳定代码
   - `develop`: 开发分支，包含下一版本的功能
   - `release/vX.Y.Z`: 发布分支，用于准备特定版本
   - `hotfix/description`: 热修复分支，用于紧急修复

2. **版本标记**
   - 使用Git标签标记版本: `git tag -a vX.Y.Z -m "版本描述"`
   - 推送标签到远程仓库: `git push origin vX.Y.Z`

3. **更新日志**
   - 使用[Conventional Commits](https://www.conventionalcommits.org/)规范提交信息
   - 自动从提交信息生成更新日志

## 发布前检查清单

每次发布前必须完成以下检查：

### 代码质量检查

- [ ] 所有自动化测试通过
- [ ] 代码覆盖率达到目标要求
- [ ] 静态代码分析无严重问题
- [ ] 代码审查已完成并解决所有评论

### 功能验证

- [ ] 所有新功能按照验收标准测试通过
- [ ] 回归测试确保现有功能正常工作
- [ ] 边界情况和错误处理已测试
- [ ] 性能测试结果符合预期

### 文档更新

- [ ] API文档已更新
- [ ] 用户指南已更新
- [ ] 更新日志已生成
- [ ] 发布说明已准备

### 配置检查

- [ ] 环境变量已正确配置
- [ ] 第三方服务集成已验证
- [ ] 数据库迁移脚本已测试
- [ ] 缓存策略已验证

## 构建与部署流程

### 构建流程

1. **准备构建环境**
   ```bash
   pnpm install
   ```

2. **运行构建**
   ```bash
   pnpm build
   ```

3. **生成构建报告**
   - 构建大小分析
   - 依赖审计
   - 性能指标

### 部署流程

#### Cloudflare Workers部署

1. **部署API服务**
   ```bash
   cd apps/apiservice
   pnpm deploy
   ```

2. **部署数据库迁移**
   ```bash
   cd packages/db
   pnpm db:deploy
   ```

#### Expo应用发布

1. **构建Android应用**
   ```bash
   cd apps/expo
   pnpm build:android
   ```

2. **构建iOS应用**
   ```bash
   cd apps/expo
   pnpm build:ios
   ```

3. **提交应用商店**
   - 使用EAS提交到App Store和Google Play
   ```bash
   pnpm submit
   ```

#### Astro网站部署

```bash
   cd apps/astro
   pnpm deploy
```

### 自动化部署

使用GitHub Actions自动化部署流程：

```yaml
name: Deploy

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-api:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - name: Install dependencies
        run: pnpm install
      - name: Deploy API
        run: pnpm deploy:api
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - name: Install dependencies
        run: pnpm install
      - name: Deploy Web
        run: pnpm deploy:web
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - name: Install dependencies
        run: pnpm install
      - name: Setup EAS
        run: pnpm global add eas-cli
      - name: Build mobile apps
        run: cd apps/expo && pnpm build
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## 环境管理

### 环境类型

- **开发环境**: 用于日常开发和测试
- **预发布环境**: 用于发布前验证
- **生产环境**: 用户访问的环境

### 环境配置

使用环境变量和wrangler配置管理不同环境：

1. **环境变量文件**
   - `.env.development`: 开发环境配置
   - `.env.staging`: 预发布环境配置
   - `.env.production`: 生产环境配置

2. **Wrangler环境配置**
   ```toml
   # wrangler.toml
   [env.dev]
   name = "apiservice-dev"
   d1_databases = [{binding = "DB", database_name = "app-dev"}]
   r2_buckets = [{binding = "STORAGE", bucket_name = "app-storage-dev"}]

   [env.production]
   name = "apiservice"
   d1_databases = [{binding = "DB", database_name = "app"}]
   r2_buckets = [{binding = "STORAGE", bucket_name = "app-storage"}]
   ```

### 环境切换

```bash
# 开发环境
pnpm dev

# 预发布环境
pnpm dev:staging

# 生产环境部署
pnpm deploy:production
```

## Capacitor插件管理

### 已集成插件清单

| 插件名称 | 版本 | 用途 | 配置文件 |
|---------|------|------|----------|
| @capacitor/camera | ^5.0.0 | 相机访问和图片拍摄 | capacitor.config.ts |
| @capacitor/filesystem | ^5.0.0 | 文件系统访问和管理 | capacitor.config.ts |
| @capacitor/push-notifications | ^5.0.0 | 推送通知 | capacitor.config.ts |
| @capacitor/share | ^5.0.0 | 内容分享 | capacitor.config.ts |
| @capacitor/splash-screen | ^5.0.0 | 启动屏幕 | capacitor.config.ts |
| @capacitor/status-bar | ^5.0.0 | 状态栏管理 | capacitor.config.ts |

### 插件安装流程

1. **安装插件包**
   ```bash
   cd apps/expo
   pnpm add @capacitor/new-plugin
   ```

2. **更新Capacitor配置**
   ```typescript
   // capacitor.config.ts
   import { CapacitorConfig } from '@capacitor/cli';

   const config: CapacitorConfig = {
     appId: 'com.example.app',
     appName: 'My App',
     plugins: {
       // 添加插件配置
       NewPlugin: {
         option1: 'value1',
         option2: 'value2',
       },
     },
   };

   export default config;
   ```

3. **同步原生项目**
   ```bash
   npx cap sync
   ```

4. **创建TypeScript适配层**
   ```typescript
   // src/utils/plugins/newPlugin.ts
   import { Plugins } from '@capacitor/core';

   const { NewPlugin } = Plugins;

   export interface NewPluginOptions {
     option1: string;
     option2: string;
   }

   export async function useNewPlugin(options: NewPluginOptions) {
     try {
       return await NewPlugin.doSomething(options);
     } catch (error) {
       console.error('Error using NewPlugin:', error);
       throw error;
     }
   }
   ```

5. **添加平台特定代码**（如需）
   - iOS: 修改`ios/App/App/AppDelegate.swift`
   - Android: 修改`android/app/src/main/java/.../MainActivity.java`

### 插件测试

1. **单元测试**
   ```typescript
   // src/utils/plugins/__tests__/newPlugin.test.ts
   import { useNewPlugin } from '../newPlugin';
   import { Plugins } from '@capacitor/core';

   vi.mock('@capacitor/core', () => ({
     Plugins: {
       NewPlugin: {
         doSomething: vi.fn(),
       },
     },
   }));

   describe('useNewPlugin', () => {
     it('calls plugin with correct options', async () => {
       const options = { option1: 'test', option2: 'value' };
       await useNewPlugin(options);
       expect(Plugins.NewPlugin.doSomething).toHaveBeenCalledWith(options);
     });
   });
   ```

2. **设备测试**
   - 在真实设备上测试插件功能
   - 测试不同操作系统版本的兼容性
   - 测试权限请求和处理

### 插件文档

为每个插件创建使用文档，包含：

- 安装说明
- 配置选项
- API参考
- 使用示例
- 常见问题解答

## 回滚策略

### 何时回滚

- 发现严重bug影响核心功能
- 性能显著下降
- 安全漏洞
- 数据完整性问题

### 回滚流程

1. **API服务回滚**
   ```bash
   wrangler rollback apiservice
   ```

2. **数据库回滚**
   ```bash
   pnpm db:rollback
   ```

3. **移动应用回滚**
   - 在应用商店发布之前：停止发布流程
   - 已发布：提交紧急更新或使用应用内版本控制

4. **网站回滚**
   ```bash
   wrangler pages deployment rollback
   ```

### 回滚后操作

- 通知团队和利益相关者
- 分析问题原因
- 制定修复计划
- 更新测试用例防止类似问题

## 发布后监控

### 监控指标

- **性能指标**: 响应时间、加载时间、API延迟
- **错误率**: API错误、客户端异常、崩溃报告
- **使用指标**: 活跃用户、功能使用率、会话时长
- **资源使用**: CPU、内存、带宽、存储

### 监控工具

- Cloudflare Analytics: 监控Workers和Pages性能
- Sentry: 错误跟踪和性能监控
- Firebase Analytics: 移动应用使用分析
- Custom Logging: 自定义日志和指标收集

### 警报设置

配置关键指标的警报阈值：

- 错误率超过1%
- API响应时间超过500ms
- 崩溃率超过0.5%
- 资源使用接近限制

### 事件响应

1. **警报触发**
   - 通知负责团队（Slack、电子邮件、短信）
   - 自动创建事件跟踪工单

2. **问题诊断**
   - 检查日志和监控数据
   - 复现问题
   - 确定根本原因

3. **解决方案**
   - 实施修复或临时解决方案
   - 验证解决方案
   - 更新文档和知识库

通过遵循以上发布流程和插件管理规范，团队可以确保稳定、可靠的应用发布，同时保持高效的插件集成和管理。