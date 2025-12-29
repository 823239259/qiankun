# React Router 在 qiankun 严格沙箱下的解决方案

## 问题说明
当 `sandbox: true` 时，qiankun 会启用严格 JS 沙箱，代理 `window.history` 和 `window.location`，导致 React Router 的 `BrowserRouter` 无法正常工作。

## 解决方案

### 方案一：使用 HashRouter（推荐）⭐
**优点：**
- 不依赖 `window.history` API，在严格沙箱下也能正常工作
- 改动最小，只需修改 React 子应用
- 不影响其他子应用
- URL 会显示为 `#/home` 格式

**实现：**
在 `react-sub-app/src/App.jsx` 中将 `BrowserRouter` 改为 `HashRouter`：

```jsx
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

// ... 其他代码保持不变

<HashRouter basename={basename}>
  <NavContent />
</HashRouter>
```

### 方案二：使用宽松模式沙箱（主应用配置）
**优点：**
- 保持 `BrowserRouter` 不变
- 所有子应用都能正常使用 history API

**缺点：**
- 沙箱隔离性降低
- 需要修改主应用配置

**实现：**
在 `src/main.js` 中配置：

```javascript
start({
    sandbox: {
        loose: true,  // 启用宽松模式，允许访问 window.history
        strictStyleIsolation: false,
        experimentalStyleIsolation: false
    },
    // ... 其他配置
})
```

### 方案三：为特定子应用配置沙箱（推荐用于混合场景）⭐
**优点：**
- 只对需要 history API 的子应用使用宽松模式
- 其他子应用仍可使用严格沙箱
- 更精细的控制

**缺点：**
- 需要修改主应用配置
- qiankun 可能不支持为单个子应用配置沙箱（需要验证）

**实现：**
在 `src/main.js` 中为 React 子应用添加特殊配置：

```javascript
const enhancedMicroApps = microApps.map(app => {
    const enhancedApp = {
        ...app,
        props: {
            ...app.props,
            onGlobalStateChange: actions.onGlobalStateChange.bind(actions),
            setGlobalState: actions.setGlobalState.bind(actions),
            getGlobalState: getGlobalState
        }
    }

    // 为 React 子应用添加沙箱配置提示
    if (app.name === 'react-sub-app') {
        // 注意：qiankun 的沙箱配置是全局的，不能为单个子应用配置
        // 如果必须使用 BrowserRouter，建议使用方案二
        console.log('[主应用] React 子应用建议使用 HashRouter 以兼容严格沙箱')
    }

    return enhancedApp
})
```

## 推荐方案对比

| 方案 | 沙箱隔离性 | 改动范围 | URL 格式 | 推荐度 |
|------|-----------|---------|---------|--------|
| 方案一：HashRouter | 高（严格沙箱） | 仅 React 子应用 | `#/home` | ⭐⭐⭐⭐⭐ |
| 方案二：宽松沙箱 | 中（宽松模式） | 主应用 | `/react/home` | ⭐⭐⭐ |
| 方案三：混合配置 | 高（严格沙箱） | 主应用+子应用 | `/react/home` | ⭐⭐⭐⭐ |

## 最终推荐
**推荐使用方案一（HashRouter）**，因为：
1. 保持严格的沙箱隔离，安全性更高
2. 改动最小，只需修改 React 子应用
3. 不影响其他子应用
4. HashRouter 在微前端场景下是常见做法

