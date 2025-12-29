# 快速构建指南

## 一键构建所有应用

```bash
# 方式一：使用 npm 脚本
npm run build:all

# 方式二：使用部署脚本（推荐）
npm run deploy
# 或
bash deploy.sh
```

## 单独构建

```bash
# 主应用
npm run build

# Vue 子应用
cd vue-sub-app && npm run build

# React 子应用
cd react-sub-app && npm run build
```

## 构建输出

```
qiankun/
├── dist/                    # 主应用
├── vue-sub-app/dist/        # Vue 子应用
└── react-sub-app/dist/      # React 子应用
```

## 生产环境配置

### 更新 microApps.js

根据部署方案更新 `src/microApps.js`：

**同域部署**：
```javascript
{
  name: 'vue-sub-app',
  entry: '/vue-sub-app/',    // 相对路径
  // ...
},
{
  name: 'react-sub-app',
  entry: '/react-sub-app/',  // 相对路径
  // ...
}
```

**独立部署**：
```javascript
{
  name: 'vue-sub-app',
  entry: 'https://vue-app.example.com/',  // 完整 URL
  // ...
},
{
  name: 'react-sub-app',
  entry: 'https://react-app.example.com/', // 完整 URL
  // ...
}
```

### 使用环境变量（可选）

参考 `src/microApps.prod.js` 示例，根据环境自动切换入口地址。

## 部署步骤

### 1. 构建

```bash
npm run deploy
```

### 2. 部署

**同域部署**：
```bash
# 复制到服务器
cp -r dist/* /path/to/server/
cp -r vue-sub-app/dist/* /path/to/server/vue-sub-app/
cp -r react-sub-app/dist/* /path/to/server/react-sub-app/
```

**独立部署**：
```bash
# 分别部署到不同服务器
scp -r dist/* main-server:/path/to/main-app/
scp -r vue-sub-app/dist/* vue-server:/path/to/vue-app/
scp -r react-sub-app/dist/* react-server:/path/to/react-app/
```

### 3. 配置服务器

参考 `BUILD.md` 中的 Nginx 配置示例。

## 验证清单

- [ ] 所有应用构建成功
- [ ] `dist` 目录包含必要文件
- [ ] `microApps.js` 配置正确
- [ ] 子应用可以正常加载
- [ ] 路由功能正常
- [ ] 样式正常显示

## 常见问题

### 子应用加载失败

- 检查 `entry` 地址
- 检查服务器可访问性
- 检查 CORS 配置

### 资源 404

- 检查 `base` 配置（应为 `'./'`）
- 检查服务器路径配置

### 路由不工作

- 检查服务器路由重定向配置
- 检查 `basename` 和 `activeRule` 配置

## 更多信息

详细配置请参考 `BUILD.md` 文件。

