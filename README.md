# Qiankun 主应用

基于 Vue 3 + Vite 构建的 qiankun 微前端主应用。

## 功能特性

- ✅ Vue 3 + Vite 快速开发
- ✅ Qiankun 微前端框架集成
- ✅ 支持多个微应用同时运行
- ✅ 样式隔离和 JS 沙箱
- ✅ 全局状态管理
- ✅ 应用间通信

## 安装依赖

```bash
npm install
```

## 开发

```bash
npm run dev
```

应用将在 `http://localhost:8080` 启动

## 构建

```bash
npm run build
```

## 预览构建结果

```bash
npm run preview
```

## 微应用配置

在 `src/microApps.js` 文件中配置需要加载的子应用：

```javascript
export const microApps = [
  {
    name: 'vue-sub-app',
    entry: '//localhost:8081',
    container: '#subapp-viewport',
    activeRule: '/vue',
    props: {
      routerBase: '/vue'
    }
  }
]
```

## 注意事项

1. 确保子应用已正确配置并运行在对应的端口
2. 子应用需要导出生命周期函数（bootstrap, mount, unmount）
3. 主应用和子应用需要配置 CORS 以支持跨域访问

