# qiankun 微前端生产构建指南

## 项目结构

```
qiankun/
├── dist/                    # 主应用构建输出
├── vue-sub-app/
│   └── dist/               # Vue 子应用构建输出
├── react-sub-app/
│   └── dist/               # React 子应用构建输出
└── src/
    └── microApps.js        # 微应用配置
```

## 构建命令

### 单独构建

```bash
# 构建主应用
npm run build

# 构建 Vue 子应用
cd vue-sub-app && npm run build

# 构建 React 子应用
cd react-sub-app && npm run build
```

### 一键构建所有应用

```bash
# 在项目根目录执行
npm run build:all
```

## 部署方案

### 方案一：同域部署（推荐）

所有应用部署在同一域名下，使用相对路径访问。

#### 目录结构

```
/
├── index.html              # 主应用入口
├── assets/                 # 主应用资源
├── js/                     # 主应用 JS
├── vue-sub-app/            # Vue 子应用
│   ├── index.html
│   ├── assets/
│   └── js/
└── react-sub-app/          # React 子应用
    ├── index.html
    ├── assets/
    └── js/
```

#### 配置

在 `src/microApps.js` 中配置：

```javascript
export const microApps = [
    {
        name: 'vue-sub-app',
        entry: '/vue-sub-app/',      // 相对路径
        container: '#subapp-viewport',
        activeRule: '/vue',
        props: { routerBase: '/vue' }
    },
    {
        name: 'react-sub-app',
        entry: '/react-sub-app/',    // 相对路径
        container: '#subapp-viewport',
        activeRule: '/react',
        props: { routerBase: '/react' }
    }
]
```

#### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;

    # 主应用
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Vue 子应用
    location /vue-sub-app {
        alias /path/to/vue-sub-app/dist;
        try_files $uri $uri/ /vue-sub-app/index.html;
    }

    # React 子应用
    location /react-sub-app {
        alias /path/to/react-sub-app/dist;
        try_files $uri $uri/ /react-sub-app/index.html;
    }
}
```

### 方案二：独立服务器部署

每个应用部署在不同的服务器或 CDN 上。

#### 配置

```javascript
export const microApps = [
    {
        name: 'vue-sub-app',
        entry: 'https://vue-app.example.com/',  // 完整 URL
        container: '#subapp-viewport',
        activeRule: '/vue',
        props: { routerBase: '/vue' }
    },
    {
        name: 'react-sub-app',
        entry: 'https://react-app.example.com/', // 完整 URL
        container: '#subapp-viewport',
        activeRule: '/react',
        props: { routerBase: '/react' }
    }
]
```

#### CORS 配置

子应用服务器需要配置 CORS：

```nginx
# Vue 子应用服务器
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
```

## 构建步骤

### 1. 构建所有应用

```bash
# 方式一：使用一键构建脚本
npm run build:all

# 方式二：分别构建
npm run build                    # 主应用
cd vue-sub-app && npm run build  # Vue 子应用
cd ../react-sub-app && npm run build  # React 子应用
```

### 2. 检查构建输出

确保每个应用的 `dist` 目录都包含：
- `index.html`
- `assets/` 目录（CSS、图片等）
- `js/` 目录（JavaScript 文件）

### 3. 配置生产环境入口

根据部署方案更新 `src/microApps.js` 中的 `entry` 地址。

### 4. 重新构建主应用

如果修改了 `microApps.js`，需要重新构建主应用：

```bash
npm run build
```

### 5. 部署

将构建产物部署到服务器：

**同域部署**：
```bash
# 复制主应用
cp -r dist/* /path/to/server/

# 复制 Vue 子应用
cp -r vue-sub-app/dist/* /path/to/server/vue-sub-app/

# 复制 React 子应用
cp -r react-sub-app/dist/* /path/to/server/react-sub-app/
```

**独立部署**：
```bash
# 主应用
scp -r dist/* user@main-server:/path/to/main-app/

# Vue 子应用
scp -r vue-sub-app/dist/* user@vue-server:/path/to/vue-app/

# React 子应用
scp -r react-sub-app/dist/* user@react-server:/path/to/react-app/
```

## 环境变量配置

### 主应用

创建 `.env.production`：

```bash
VITE_APP_TITLE=qiankun Main App
VITE_APP_ENV=production
```

### Vue 子应用

创建 `vue-sub-app/.env.production`：

```bash
VITE_APP_TITLE=Vue Sub App
VITE_APP_BASE_URL=/vue-sub-app
```

### React 子应用

创建 `react-sub-app/.env.production`：

```bash
VITE_APP_TITLE=React Sub App
VITE_APP_BASE_URL=/react-sub-app
```

## 验证清单

构建完成后，请验证：

- [ ] 所有应用构建成功，无错误
- [ ] `dist` 目录包含所有必要文件
- [ ] `index.html` 中的资源路径正确
- [ ] 主应用可以正确加载子应用
- [ ] 路由功能正常
- [ ] 样式正常显示
- [ ] 控制台无错误
- [ ] 跨域配置正确（如果独立部署）

## 常见问题

### 1. 子应用加载失败

**问题**：主应用无法加载子应用

**解决**：
- 检查 `entry` 地址是否正确
- 检查子应用服务器是否可访问
- 检查 CORS 配置（如果独立部署）
- 查看浏览器控制台错误信息

### 2. 资源路径 404

**问题**：子应用的 CSS、JS 文件加载失败

**解决**：
- 检查 `base` 配置（应为 `'./'`）
- 检查服务器路径配置
- 检查资源文件是否存在于正确位置

### 3. 路由不工作

**问题**：子应用路由跳转失败

**解决**：
- 确保服务器配置了 SPA 路由重定向
- 检查 `basename` 配置
- 检查 `activeRule` 配置

### 4. 样式丢失

**问题**：子应用样式不生效

**解决**：
- 检查 `cssCodeSplit` 配置
- 检查 qiankun 样式隔离配置
- 确保 CSS 文件被正确打包

## 性能优化建议

### 1. 代码分割

已配置手动分包：
- 主应用：Vue、qiankun 单独打包
- Vue 子应用：Vue、Vue Router 单独打包
- React 子应用：React、React Router 单独打包

### 2. 资源压缩

- CSS 自动压缩
- JS 使用 Terser 压缩
- 小资源自动内联为 base64

### 3. Tree Shaking

已启用 Tree Shaking，自动移除未使用的代码。

### 4. CDN 加速

如果使用独立部署，建议使用 CDN 加速子应用资源加载。

## 测试生产构建

### 本地预览

```bash
# 预览主应用
npm run preview

# 预览 Vue 子应用
cd vue-sub-app && npm run preview

# 预览 React 子应用
cd react-sub-app && npm run preview
```

### 使用 serve

```bash
# 安装 serve
npm install -g serve

# 启动主应用
serve -s dist -l 7777

# 启动 Vue 子应用（新终端）
cd vue-sub-app && serve -s dist -l 5555

# 启动 React 子应用（新终端）
cd react-sub-app && serve -s dist -l 8082
```

然后更新 `microApps.js` 中的 `entry` 为本地预览地址进行测试。

