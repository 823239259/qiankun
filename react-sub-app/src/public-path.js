/**
 * 设置 public path（Vite + qiankun 环境）
 *
 * 在 qiankun 环境中，qiankun 会自动注入 public path
 * vite-plugin-qiankun 会自动处理资源路径，这里主要是为了兼容性
 */
if (window.__POWERED_BY_QIANKUN__) {
  // qiankun 会自动注入 public path
  const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/'
  console.log('[react-sub-app] Public path:', publicPath, '__INJECTED_PUBLIC_PATH_BY_QIANKUN__:', window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)

  // 对于 webpack 项目（兼容性处理）
  if (typeof __webpack_public_path__ !== 'undefined') {
    __webpack_public_path__ = publicPath
  }

  // Vite 使用 import.meta.url，vite-plugin-qiankun 会自动处理
  // 这里只需要确保在 qiankun 环境中正确设置
  if (publicPath && publicPath !== '/') {
    // 在预览模式下，publicPath 应该是完整的 URL（如 http://localhost:8082/）
    // 这会被 vite-plugin-qiankun 使用
    console.log('[react-sub-app] 使用自定义 public path:', publicPath)
  }
}

