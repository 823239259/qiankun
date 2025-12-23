# React 子应用

这是一个可以接入 qiankun 主应用的 React 子应用。

## 功能特性

- ✅ 支持独立运行和集成运行双模式
- ✅ 支持暗色模式（与主应用同步）
- ✅ 全局状态同步
- ✅ 路由隔离

## 安装依赖

```bash
npm install
```

## 开发

```bash
npm run dev
```

应用将在 `http://localhost:8082` 启动

## 构建

```bash
npm run build
```

## 接入说明

1. 确保主应用已启动在 `http://localhost:8080`
2. 启动子应用在 `http://localhost:8082`
3. 在主应用中访问 `/react` 路由即可加载子应用

## 暗色模式

子应用会自动同步主应用的暗色模式状态，无需额外配置。

