# 测试流程与用例规范

## 目录

- [测试策略概述](#测试策略概述)
- [测试类型与范围](#测试类型与范围)
- [测试文件组织](#测试文件组织)
- [单元测试规范](#单元测试规范)
- [集成测试规范](#集成测试规范)
- [端到端测试规范](#端到端测试规范)
- [Mock策略](#mock策略)
- [测试覆盖率要求](#测试覆盖率要求)
- [CI/CD集成](#cicd集成)
- [测试缺失检测](#测试缺失检测)

## 测试策略概述

本项目采用多层次测试策略，确保代码质量和功能稳定性：

- **单元测试**: 验证独立组件和函数的正确性
- **集成测试**: 验证多个组件或服务之间的交互
- **端到端测试**: 验证完整用户流程和场景
- **性能测试**: 验证系统在负载下的表现

每个新功能和修复都应包含相应的测试用例，确保代码变更不会引入回归问题。

## 测试类型与范围

### 必须测试的核心模块

1. **数据库操作**
   - Schema定义和迁移
   - CRUD操作和查询
   - 事务和并发处理

2. **API端点**
   - 输入验证
   - 业务逻辑
   - 错误处理
   - 权限控制

3. **UI组件**
   - 渲染正确性
   - 交互行为
   - 边界条件处理
   - 可访问性

4. **认证与授权**
   - 登录流程
   - 权限检查
   - 会话管理

5. **外部集成**
   - 第三方API调用
   - 文件上传和处理
   - 支付处理（如有）

## 测试文件组织

### 文件位置

测试文件应与被测代码放在相同的目录结构中，但位于`__tests__`子目录或使用`.test.ts`/`.spec.ts`后缀：

```
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       └── Button.test.tsx
│   ├── utils/
│   │   ├── format.ts
│   │   └── format.test.ts
```

### 命名约定

- **单元测试**: `[组件/函数名].test.ts`
- **集成测试**: `[功能/流程].spec.ts`
- **端到端测试**: `[场景].e2e.ts`

## 单元测试规范

### 测试框架

- 使用Vitest作为测试运行器和断言库
- React组件测试使用React Testing Library

### 测试结构

每个测试文件应包含：

1. **导入被测代码和测试工具**
2. **Mock依赖**（如需）
3. **测试套件**（describe块）
4. **测试用例**（test/it块）

示例：

```typescript
import { describe, it, expect, vi } from 'vitest';
import { formatDate } from '../format';

describe('formatDate', () => {
  it('formats date correctly with default format', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });

  it('formats date with custom format', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2023');
  });

  it('handles invalid date', () => {
    expect(() => formatDate('invalid' as any)).toThrow();
  });
});
```

### 测试命名

测试名称应清晰描述被测行为和预期结果，格式为：

- `"should [预期行为] when [条件]"`
- `"[函数/组件名] [动作] [预期结果]"`

### 组件测试

组件测试应关注：

1. **渲染**: 组件是否正确渲染
2. **交互**: 用户交互是否触发正确行为
3. **状态**: 状态变化是否正确反映在UI上

示例：

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

## 集成测试规范

### 测试范围

集成测试应关注组件或服务之间的交互：

1. **API调用**: 前端组件与API的交互
2. **数据流**: 数据在不同层之间的传递
3. **状态管理**: 全局状态与组件的交互

### 测试环境

- 使用测试数据库实例
- 模拟外部服务和API
- 使用测试专用的环境变量

### API测试示例

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../server';
import { client } from '../client';

describe('User API', () => {
  let server;

  beforeAll(async () => {
    server = await createServer();
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('creates a user successfully', async () => {
    const userData = { name: 'Test User', email: 'test@example.com' };
    const response = await client.users.create.mutate(userData);
    
    expect(response.id).toBeDefined();
    expect(response.name).toBe(userData.name);
    expect(response.email).toBe(userData.email);
  });

  it('returns error for invalid email', async () => {
    const userData = { name: 'Test User', email: 'invalid-email' };
    
    await expect(client.users.create.mutate(userData))
      .rejects.toThrow(/invalid email/i);
  });
});
```

## 端到端测试规范

### 测试工具

- 使用Playwright进行端到端测试
- 测试真实环境或接近真实的测试环境

### 测试场景

端到端测试应覆盖关键用户流程：

1. **用户注册和登录**
2. **核心功能操作**
3. **数据创建和修改**
4. **错误处理和恢复**

### 测试示例

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('user can sign up and log in', async ({ page }) => {
    // 注册流程
    await page.goto('/signup');
    await page.fill('[name=name]', 'Test User');
    await page.fill('[name=email]', `test-${Date.now()}@example.com`);
    await page.fill('[name=password]', 'Password123!');
    await page.click('button[type=submit]');
    
    // 验证注册成功并重定向到仪表板
    await expect(page).toHaveURL(/dashboard/);
    
    // 登出
    await page.click('[data-testid=logout-button]');
    
    // 登录流程
    await page.goto('/login');
    await page.fill('[name=email]', `test-${Date.now()}@example.com`);
    await page.fill('[name=password]', 'Password123!');
    await page.click('button[type=submit]');
    
    // 验证登录成功
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('[data-testid=user-name]')).toContainText('Test User');
  });
});
```

## Mock策略

### 何时使用Mock

- **外部依赖**: 第三方API、数据库、文件系统等
- **复杂计算**: 耗时的计算或处理
- **随机行为**: 日期、随机数等
- **网络请求**: HTTP请求和响应

### Mock实现

1. **函数Mock**
   - 使用Vitest的`vi.mock()`和`vi.fn()`
   - 模拟函数返回值和行为

2. **模块Mock**
   - 模拟整个模块的行为
   - 使用`__mocks__`目录或内联模拟

3. **服务Mock**
   - 使用MSW模拟API响应
   - 创建测试专用的服务实现

### Mock示例

```typescript
import { describe, it, expect, vi } from 'vitest';
import { fetchUserData } from '../api';
import { displayUserProfile } from '../profile';

// 模拟API模块
vi.mock('../api', () => ({
  fetchUserData: vi.fn(),
}));

describe('displayUserProfile', () => {
  it('displays user profile correctly', async () => {
    // 设置模拟返回值
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    fetchUserData.mockResolvedValue(mockUser);
    
    const profile = await displayUserProfile('1');
    
    expect(fetchUserData).toHaveBeenCalledWith('1');
    expect(profile).toContain(mockUser.name);
    expect(profile).toContain(mockUser.email);
  });

  it('handles API error', async () => {
    // 模拟API错误
    fetchUserData.mockRejectedValue(new Error('API error'));
    
    await expect(displayUserProfile('1')).rejects.toThrow('API error');
  });
});
```

## 测试覆盖率要求

### 覆盖率目标

- **核心业务逻辑**: 至少90%的代码覆盖率
- **UI组件**: 至少80%的代码覆盖率
- **工具函数**: 100%的代码覆盖率
- **整体项目**: 至少75%的代码覆盖率

### 覆盖率报告

- 使用Vitest的覆盖率报告功能
- CI流程中生成覆盖率报告
- 覆盖率不达标的PR不允许合并

### 覆盖率排除

以下类型的代码可以排除在覆盖率要求之外：

- 类型定义文件
- 配置文件
- 自动生成的代码
- 第三方库的类型声明

## CI/CD集成

### GitHub Actions配置

在`.github/workflows/test.yml`中配置测试流程：

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
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
      - name: Run linter
        run: pnpm lint
      - name: Run type check
        run: pnpm typecheck
      - name: Run unit and integration tests
        run: pnpm test
      - name: Run E2E tests
        run: pnpm test:e2e
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

### 预提交检查

使用husky和lint-staged配置预提交检查：

- 代码格式化
- 代码风格检查
- 类型检查
- 单元测试

## 测试缺失检测

### 自动检测工具

使用自定义脚本检测缺失的测试：

1. **组件测试检测**
   - 扫描组件目录，检查每个组件是否有对应的测试文件

2. **API测试检测**
   - 分析tRPC路由定义，确保每个过程都有测试覆盖

3. **覆盖率分析**
   - 分析覆盖率报告，识别覆盖率低的模块和函数

### 测试缺失报告

在CI流程中生成测试缺失报告，包含：

- 缺失测试的组件和函数列表
- 低覆盖率的模块列表
- 测试改进建议

### 测试债务管理

- 维护测试债务列表，记录需要补充测试的区域
- 定期分配时间专门用于补充测试
- 新功能开发前确保相关区域的测试覆盖

通过遵循以上测试规范，项目可以保持高质量的代码库，减少bug和回归问题，提高开发效率和用户体验。