# React 子应用生产构建指南

## 构建配置

### 1. 构建命令

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 2. 构建输出

构建完成后，会在 `dist` 目录生成以下文件：

```
dist/
├── index.html          # 入口 HTML 文件
├── assets/             # 静态资源目录
│   ├── index.[hash].css
│   └── ...
└── js/                 # JavaScript 文件目录
    ├── index.[hash].js
    ├── react-vendor.[hash].js
    └── router-vendor.[hash].js
```

## 主应用配置

### 开发环境配置

在 `src/microApps.js` 中配置开发环境入口：

```javascript
{
  name: 'react-sub-app',
  entry: '//localhost:8082',  // 开发服务器地址
  container: '#subapp-viewport',
  activeRule: '/react',
  props: {
    routerBase: '/react'
  }
}
```

### 生产环境配置

在生产环境中，需要将 `entry` 指向构建后的静态资源：

#### 方案一：使用静态服务器（推荐）

如果子应用部署在独立的静态服务器上（如 Nginx、CDN）：

```javascript
{
  name: 'react-sub-app',
  entry: 'https://your-cdn.com/react-sub-app/',  // 生产环境地址
  container: '#subapp-viewport',
  activeRule: '/react',
  props: {
    routerBase: '/react'
  }
}
```

#### 方案二：与主应用同域部署

如果子应用与主应用部署在同一域名下：

```javascript
{
  name: 'react-sub-app',
  entry: '/react-sub-app/',  // 相对路径
  container: '#subapp-viewport',
  activeRule: '/react',
  props: {
    routerBase: '/react'
  }
}
```

**目录结构示例**：
```
/
├── index.html              # 主应用
├── react-sub-app/          # React 子应用
│   ├── index.html
│   ├── assets/
│   └── js/
└── vue-sub-app/            # Vue 子应用
    └── ...
```

## 环境变量配置

### 创建环境配置文件

创建 `.env.production` 文件：

```bash
# .env.production
VITE_APP_TITLE=React Sub App
VITE_APP_BASE_URL=/react-sub-app
```

### 在代码中使用环境变量

```javascript
// 使用 import.meta.env 访问环境变量
const baseUrl = import.meta.env.VITE_APP_BASE_URL
```

## 部署步骤

### 1. 构建子应用

```bash
cd react-sub-app
npm run build
```

### 2. 部署构建产物

将 `dist` 目录的内容部署到服务器：

- **独立服务器**：上传到静态文件服务器（Nginx、Apache、CDN）
- **同域部署**：将 `dist` 目录内容复制到主应用的 `react-sub-app` 目录

### 3. 配置主应用

更新 `src/microApps.js` 中的 `entry` 地址为生产环境地址。

### 4. 配置 Nginx（如果使用）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 主应用
    location / {
        root /path/to/main-app/dist;
        try_files $uri $uri/ /index.html;
    }

    # React 子应用
    location /react-sub-app {
        alias /path/to/react-sub-app/dist;
        try_files $uri $uri/ /react-sub-app/index.html;

        # CORS 配置（如果需要）
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
    }
}
```

## 常见问题

### 1. 资源加载 404

**问题**：打包后资源路径不正确

**解决**：
- 检查 `vite.config.js` 中的 `base` 配置
- 确保主应用的 `entry` 路径正确
- 检查服务器配置

### 2. 路由不工作

**问题**：打包后路由跳转失败

**解决**：
- 确保使用 `HashRouter` 或正确配置 `BrowserRouter` 的 `basename`
- 检查服务器是否配置了 SPA 路由重定向

### 3. 样式丢失

**问题**：打包后样式不生效

**解决**：
- 检查 `cssCodeSplit` 配置
- 确保 CSS 文件被正确打包
- 检查 qiankun 的样式隔离配置

### 4. 跨域问题

**问题**：子应用资源加载被 CORS 阻止

**解决**：
- 配置服务器 CORS 头
- 或使用同域部署

## 构建优化建议

### 1. 代码分割

已配置手动分包：
- `react-vendor`: React 核心库
- `router-vendor`: React Router

### 2. 资源压缩

- CSS 自动压缩
- JS 使用 Terser 压缩
- 小资源自动内联为 base64

### 3. Tree Shaking

已启用 Tree Shaking，自动移除未使用的代码。

### 4. 生产环境优化

- 关闭 sourcemap（减小文件大小）
- 启用代码压缩
- 优化 chunk 大小

## 验证清单

构建完成后，请验证：

- [ ] 构建成功，无错误
- [ ] `dist` 目录包含所有必要文件
- [ ] `index.html` 中的资源路径正确
- [ ] 主应用可以正确加载子应用
- [ ] 路由功能正常
- [ ] 样式正常显示
- [ ] 控制台无错误

## 测试生产构建

### 本地预览

```bash
npm run build
npm run preview
```

### 使用 serve

```bash
npm install -g serve
npm run build
serve -s dist -l 8082
```

然后在主应用中配置 `entry: '//localhost:8082'` 进行测试。

