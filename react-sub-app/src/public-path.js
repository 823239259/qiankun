// 设置 public path（Vite 环境）
if (window.__POWERED_BY_QIANKUN__) {
  const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/'
  if (typeof __webpack_public_path__ !== 'undefined') {
    __webpack_public_path__ = publicPath
  }
}

