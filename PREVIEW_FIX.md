# 预览模式资源路径修复说明

## 问题描述

在预览模式下，子应用的资源路径无法正确加载，出现 404 错误：
```
GET http://localhost:7777/react/js/react-vendor.DE8Qg83h.js net::ERR_ABORTED 404 (Not Found)
```

## 问题原因

在预览模式下：
1. 主应用运行在 `http://localhost:7777`
2. 子应用运行在独立的端口（`http://localhost:8082`, `http://localhost:5555`）
3. 子应用 HTML 中的资源路径是相对路径（`./js/react-vendor.DE8Qg83h.js`）
4. qiankun 加载子应用时，相对路径会被解析为相对于主应用的路径
5. 导致尝试从 `http://localhost:7777/react/js/...` 加载资源，而不是从子应用的服务器加载

## 解决方案

已更新 `src/microApps.js`，根据环境自动切换入口地址：

- **开发环境**：使用协议相对路径 `//localhost:8082`（自动适配 http/https）
- **预览环境**：使用完整 URL `http://localhost:8082`（确保资源路径正确）
- **生产环境**：根据实际部署情况配置

## 使用方法

### 预览模式

1. 构建所有应用：
```bash
npm run build:all
```

2. 启动预览服务器：
```bash
npm run deploy
# 选择 y 启动预览
```

或者手动启动：
```bash
npm run preview                    # 主应用
cd vue-sub-app && npm run preview  # Vue 子应用
cd ../react-sub-app && npm run preview  # React 子应用
```

### 验证

访问主应用：http://localhost:7777

- 访问 `/vue` 路由应该能正确加载 Vue 子应用
- 访问 `/react` 路由应该能正确加载 React 子应用
- 浏览器控制台不应该有资源加载错误

## 配置说明

`src/microApps.js` 中的 `getEntry` 函数会根据环境自动选择正确的入口地址：

```javascript
const getEntry = (port) => {
  if (isDevelopment) {
    // 开发环境
    return `//localhost:${port}`
  } else if (isPreview) {
    // 预览环境：使用完整 URL
    return `${protocol}//localhost:${port}`
  } else {
    // 生产环境：需要根据实际部署调整
    return `/sub-app-${port}/`
  }
}
```

## 生产环境配置

在生产环境中，需要根据实际部署情况修改 `getEntry` 函数：

### 同域部署
```javascript
return `/vue-sub-app/`  // Vue 子应用
return `/react-sub-app/`  // React 子应用
```

### 独立部署/CDN
```javascript
return 'https://vue-app.example.com/'  // Vue 子应用
return 'https://react-app.example.com/'  // React 子应用
```

## 故障排除

### 仍然出现 404 错误

1. **检查子应用预览服务器是否运行**
   ```bash
   # 确保所有预览服务器都在运行
   lsof -i :7777  # 主应用
   lsof -i :5555  # Vue 子应用
   lsof -i :8082  # React 子应用
   ```

2. **检查浏览器控制台**
   - 查看实际的资源请求 URL
   - 确认是否指向正确的服务器

3. **检查 CORS 配置**
   - 确保子应用服务器允许跨域请求

4. **清除浏览器缓存**
   - 强制刷新（Ctrl+Shift+R 或 Cmd+Shift+R）

### 资源路径仍然错误

如果问题仍然存在，可以手动修改 `src/microApps.js`，在预览模式下硬编码完整 URL：

```javascript
export const microApps = [
    {
        name: 'vue-sub-app',
        entry: 'http://localhost:5555',  // 硬编码完整 URL
        // ...
    },
    {
        name: 'react-sub-app',
        entry: 'http://localhost:8082',  // 硬编码完整 URL
        // ...
    }
]
```

