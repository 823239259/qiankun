# 快速构建指南

## 一键构建

```bash
# 方式一：使用 npm 脚本
npm run build

# 方式二：使用部署脚本（推荐）
npm run deploy
# 或
bash deploy.sh
```

## 构建输出

构建完成后，在 `dist` 目录生成：

```
dist/
├── index.html
├── assets/
│   └── index.[hash].css
└── js/
    ├── index.[hash].js
    ├── react-vendor.[hash].js
    └── router-vendor.[hash].js
```

## 主应用配置

### 开发环境

```javascript
// src/microApps.js
{
  name: 'react-sub-app',
  entry: '//localhost:8082',  // 开发服务器
  container: '#subapp-viewport',
  activeRule: '/react',
  props: { routerBase: '/react' }
}
```

### 生产环境

#### 选项 1：同域部署（推荐）

```javascript
// src/microApps.js
{
  name: 'react-sub-app',
  entry: '/react-sub-app/',  // 相对路径
  container: '#subapp-viewport',
  activeRule: '/react',
  props: { routerBase: '/react' }
}
```

**目录结构**：
```
/
├── index.html              # 主应用
└── react-sub-app/          # 子应用
    ├── index.html
    ├── assets/
    └── js/
```

#### 选项 2：独立服务器/CDN

```javascript
// src/microApps.js
{
  name: 'react-sub-app',
  entry: 'https://cdn.example.com/react-sub-app/',  // 完整 URL
  container: '#subapp-viewport',
  activeRule: '/react',
  props: { routerBase: '/react' }
}
```

## 部署步骤

### 1. 构建

```bash
cd react-sub-app
npm run build
```

### 2. 部署

**同域部署**：
```bash
# 将 dist 目录内容复制到主应用的 react-sub-app 目录
cp -r dist/* /path/to/main-app/react-sub-app/
```

**独立服务器**：
```bash
# 上传 dist 目录内容到服务器
scp -r dist/* user@server:/path/to/react-sub-app/
```

### 3. 更新主应用配置

修改 `src/microApps.js` 中的 `entry` 为生产环境地址。

### 4. 测试

访问主应用，测试子应用是否正常加载。

## 验证清单

- [ ] 构建成功，无错误
- [ ] `dist` 目录存在且包含文件
- [ ] 主应用配置正确
- [ ] 子应用可以正常加载
- [ ] 路由功能正常
- [ ] 样式正常显示
- [ ] 控制台无错误

## 常见问题

### 资源 404

- 检查 `base` 配置（应为 `'./'`）
- 检查服务器路径配置
- 检查主应用 `entry` 配置

### 路由不工作

- 确保使用正确的 Router（HashRouter 或 BrowserRouter）
- 检查 `basename` 配置
- 检查服务器路由重定向配置

### 样式丢失

- 检查 `cssCodeSplit` 配置（应为 `false`）
- 检查 qiankun 样式隔离配置

## 更多信息

详细配置请参考 `BUILD.md` 文件。

