# React 子应用路由问题解决方案

## 问题分析

在 qiankun 微前端环境中，React 子应用的路由可能遇到以下问题：

1. **basename 配置问题**：路由路径与主应用路由不匹配
2. **路由同步问题**：子应用路由变化未同步到主应用
3. **BrowserRouter 兼容性问题**：在 qiankun 沙箱中可能无法正常工作
4. **路由跳转问题**：导航链接路径不正确

## 解决方案

### 方案一：使用 HashRouter（推荐，最简单）

**优点**：
- 兼容性最好，不依赖浏览器历史 API
- 在 qiankun 环境中最稳定
- 实现简单，无需额外配置

**缺点**：
- URL 中会有 `#` 符号
- 不利于 SEO

**实现步骤**：

1. 修改 `App.jsx`，将 `BrowserRouter` 改为 `HashRouter`
2. 调整 basename 配置
3. 更新导航链接路径

### 方案二：改进 BrowserRouter 配置（推荐，URL 更友好）

**优点**：
- URL 更友好，没有 `#` 符号
- 支持浏览器前进后退
- 更好的用户体验

**缺点**：
- 需要正确配置 basename
- 需要处理路由同步

**实现步骤**：

1. 正确设置 basename（从 props 获取）
2. 监听路由变化，同步到主应用
3. 处理路由初始化

### 方案三：使用 MemoryRouter（适合复杂场景）

**优点**：
- 完全隔离，不影响主应用路由
- 适合复杂的路由场景

**缺点**：
- URL 不会变化，无法分享链接
- 浏览器前进后退不工作

**实现步骤**：

1. 使用 `MemoryRouter` 替代 `BrowserRouter`
2. 通过 props 传递初始路由
3. 通过回调函数同步路由变化

### 方案四：自定义路由同步机制（最灵活）

**优点**：
- 完全控制路由行为
- 可以自定义路由同步逻辑
- 适合特殊需求

**缺点**：
- 实现复杂
- 需要维护更多代码

## 推荐方案

**优先推荐方案二**（改进 BrowserRouter 配置），因为：
- URL 友好，用户体验好
- 实现相对简单
- 功能完整

如果遇到兼容性问题，可以降级到**方案一**（HashRouter）。

## 实施步骤

### 方案一：HashRouter（快速解决）

1. 备份当前的 `App.jsx` 文件
2. 将 `src/App.solution1.jsx` 重命名为 `App.jsx`，或复制其内容到 `App.jsx`
3. 测试路由功能

**关键变化**：
- `BrowserRouter` → `HashRouter`
- 移除 `basename` 配置
- 导航链接路径保持不变

### 方案二：改进 BrowserRouter（推荐）

1. 备份当前的 `App.jsx` 文件
2. 将 `src/App.solution2.jsx` 重命名为 `App.jsx`，或复制其内容到 `App.jsx`
3. 测试路由功能

**关键变化**：
- 保持 `BrowserRouter`
- 正确设置 `basename`（从 props 获取）
- 添加路由同步逻辑
- 处理路由初始化

### 方案三：MemoryRouter

1. 备份当前的 `App.jsx` 文件
2. 将 `src/App.solution3.jsx` 重命名为 `App.jsx`，或复制其内容到 `App.jsx`
3. 在 `main.jsx` 中传递 `initialRoute` prop（如果需要）

**关键变化**：
- `BrowserRouter` → `MemoryRouter`
- 通过 props 传递初始路由
- URL 不会变化

### 方案四：自定义路由同步

1. 备份当前的 `App.jsx` 文件
2. 将 `src/App.solution4.jsx` 重命名为 `App.jsx`，或复制其内容到 `App.jsx`
3. 根据实际需求调整路由同步逻辑

**关键变化**：
- 添加自定义 `useRouteSync` Hook
- 实现双向路由同步
- 处理路由变化事件

## 常见问题排查

### 1. 路由不匹配

**症状**：点击导航链接后，页面不跳转或显示 404

**解决方法**：
- 检查 `basename` 是否正确设置
- 检查路由路径是否与导航链接匹配
- 查看浏览器控制台的路由日志

### 2. 路由重复

**症状**：URL 中出现重复路径，如 `/react/react/home`

**解决方法**：
- 确保 `basename` 不包含在路由路径中
- 检查导航链接的 `to` 属性

### 3. 浏览器前进后退不工作

**症状**：点击浏览器前进后退按钮无效

**解决方法**：
- 如果使用 HashRouter，这是正常现象
- 如果使用 BrowserRouter，检查 qiankun 沙箱配置

### 4. 路由状态丢失

**症状**：刷新页面后路由状态丢失

**解决方法**：
- 使用 BrowserRouter 或 HashRouter
- 确保主应用路由配置正确

## 调试技巧

1. **添加路由日志**：
```javascript
useEffect(() => {
  console.log('[路由调试]', {
    basename,
    pathname: location.pathname,
    fullPath: window.location.pathname,
    hash: window.location.hash
  })
}, [location.pathname, basename])
```

2. **检查 qiankun 配置**：
- 确认 `activeRule` 配置正确
- 检查 `routerBase` prop 是否正确传递

3. **测试独立运行**：
- 先确保子应用独立运行时路由正常
- 再测试在 qiankun 环境中的表现

