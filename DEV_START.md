# 开发环境启动指南

## 快速启动（推荐）

### 方式一：使用 npm 脚本（推荐）

```bash
# 同时启动所有应用
npm run dev:all

# 或使用简写
npm start
```

### 方式二：使用启动脚本

```bash
bash start-dev.sh
```

## 单独启动

如果需要单独启动某个应用：

```bash
# 只启动主应用
npm run dev

# 只启动 Vue 子应用
npm run dev:vue

# 只启动 React 子应用
npm run dev:react
```

## 应用地址

启动成功后，访问以下地址：

- **主应用**: http://localhost:7777
- **Vue 子应用**: http://localhost:5555
- **React 子应用**: http://localhost:8082

## 访问子应用

在主应用中访问以下路由来加载子应用：

- **Vue 子应用**: http://localhost:7777/vue
- **React 子应用**: http://localhost:7777/react

## 注意事项

1. **确保所有应用都已启动**：主应用需要子应用运行才能正常加载
2. **端口冲突**：如果端口被占用，请修改对应的 `vite.config.js` 中的端口配置
3. **依赖安装**：首次运行前，确保所有应用的依赖都已安装：
   ```bash
   npm install
   cd vue-sub-app && npm install
   cd ../react-sub-app && npm install
   ```

## 停止服务

按 `Ctrl+C` 可以停止所有服务。

## 故障排除

### 子应用无法加载

1. 检查子应用是否正在运行
2. 检查浏览器控制台是否有错误
3. 检查 `src/microApps.js` 中的 `entry` 地址是否正确

### 端口被占用

修改对应应用的 `vite.config.js` 中的端口配置：

```javascript
server: {
  port: 7777,  // 修改为你想要的端口
  // ...
}
```

### 依赖问题

如果遇到依赖问题，尝试：

```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

