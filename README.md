# 网站导航系统

一个基于 Next.js 14 的现代化网站导航平台，帮助用户发现和访问精选的优质网站资源。

## 功能特性

- 🌟 **精品推荐**：展示经过筛选的优质网站
- 🔥 **热门标识**：突出显示受欢迎的网站
- 📱 **响应式设计**：完美适配各种设备
- 🎨 **多主题支持**：包含护眼模式
- 🛡️ **管理员模式**：便于内容管理
- 🔍 **智能搜索**：快速查找目标网站
- 📂 **分类管理**：有序组织网站资源

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI 组件**: Radix UI + Tailwind CSS
- **状态管理**: Zustand
- **主题系统**: next-themes
- **图标**: Lucide React
- **类型检查**: TypeScript

## 快速开始

### 环境要求

- Node.js 18+ 
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 问题解决方案

### 已解决的问题

#### 1. next-themes 模块找不到错误

**问题**: `Module not found: Can't resolve 'next-themes'`

**解决方案**: 
```bash
pnpm install
```
重新安装依赖即可解决。

#### 2. 剪贴板功能兼容性问题

**问题**: `Copy to clipboard is not supported in this browser`

**解决方案**: 
- 创建了 `lib/clipboard.ts` 工具函数
- 提供跨浏览器兼容性支持
- 包含降级方案 (document.execCommand)
- 增强了全局错误处理

**使用方法**:
```typescript
import { safeCopyToClipboard } from '@/lib/clipboard'

const handleCopy = async () => {
  await safeCopyToClipboard(
    '要复制的内容',
    () => toast({ title: '复制成功!' }),
    (error) => toast({ title: '复制失败', description: error })
  )
}

// 或者使用基础方法
import { copyToClipboard } from '@/lib/clipboard'

const result = await copyToClipboard('要复制的内容')
if (result.success) {
  console.log('复制成功')
} else {
  console.log('复制失败:', result.error)
}
```

#### 3. 浏览器扩展JSON解析错误

**问题**: `"undefined" is not valid JSON` (来自Chrome扩展)

**原因**: 某些浏览器扩展在解析JSON时遇到undefined值，这不是项目代码的问题

**解决方案**:
- 创建了 `lib/json-utils.ts` 安全JSON处理工具
- 增强了localStorage数据处理的安全性
- 添加了 `components/error-boundary.tsx` 错误边界组件
- 特别针对扩展错误提供用户友好的提示

**技术改进**:
```typescript
// 使用安全的JSON工具函数
import { safeJsonParse, getFromLocalStorage, setToLocalStorage } from '@/lib/json-utils'

// 替代直接使用 JSON.parse()
const result = safeJsonParse(data, defaultValue)
if (result.success) {
  // 使用 result.data
}
```

#### 4. Next.js Hydration错误

**问题**: `Hydration failed because the server rendered HTML didn't match the client`

**原因**: 使用了Zustand的persist中间件，服务器端和客户端的初始状态不一致

**解决方案**:
- 创建了 `components/hydration-safe.tsx` 通用组件
- 修改了 `components/featured-section.tsx` 和 `components/category-section.tsx`
- 重构了主页组件，确保服务器端和客户端渲染一致
- 使用客户端挂载检查避免状态不匹配

**技术实现**:
```typescript
// 使用HydrationSafe组件包装客户端状态
import { HydrationSafe, ClientOnly } from '@/components/hydration-safe'

function MyComponent() {
  return (
    <HydrationSafe fallback={<div>Loading...</div>}>
      {/* 使用了客户端状态的内容 */}
    </HydrationSafe>
  )
}
```

#### 5. 全局错误处理增强

**新增功能**: 全局JavaScript错误捕获和处理

**实现方案**:
- 创建了 `app/global-error-handler.tsx` 全局错误处理器
- 自动识别并忽略浏览器扩展产生的错误
- 对真正的应用错误显示用户友好提示
- 增强了剪贴板工具的错误处理

**技术特点**:
```typescript
// 自动捕获未处理的错误
window.addEventListener('error', handleError)
window.addEventListener('unhandledrejection', handleUnhandledRejection)

// 智能错误分类和处理
const isIgnorableError = error?.stack?.includes?.('chrome-extension://')
```

## 项目结构

```
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # 主页
│   ├── layout.tsx         # 布局组件
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── hydration-safe.tsx# hydration安全组件
│   ├── error-boundary.tsx# 错误边界组件
│   └── ...               # 业务组件
├── lib/                  # 工具函数
│   ├── clipboard.ts      # 剪贴板工具
│   ├── json-utils.ts     # 安全JSON处理
│   ├── store.ts          # 状态管理
│   └── types.ts          # 类型定义
└── hooks/                # 自定义 Hooks
```

## 浏览器兼容性

- **现代浏览器**: 完全支持 (Chrome 63+, Firefox 53+, Safari 13.1+)
- **旧版浏览器**: 降级支持，核心功能正常使用

## 开发注意事项

1. **最小改动原则**: 遵循最小改动原则，避免影响原有功能
2. **错误处理**: 所有新功能都包含完善的错误处理
3. **类型安全**: 使用 TypeScript 确保类型安全
4. **响应式设计**: 所有组件都考虑移动端适配
5. **Hydration安全**: 使用 HydrationSafe 组件包装客户端状态
6. **构建优化**: 已修复 Next.js 配置警告，优化构建性能

## 部署

项目已配置适用于 Vercel 部署，推送到主分支即可自动部署。

## 许可证

本项目遵循 MIT 许可证。

---

如有问题或建议，请创建 Issue 或 Pull Request。 