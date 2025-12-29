// 设置 public path（Vite 环境）
console.log('[vue-sub-app] Public path:', window.__POWERED_BY_QIANKUN__, window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)
if (window.__POWERED_BY_QIANKUN__) {
    const publicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/'
    console.log('[vue-sub-app] Public path:', publicPath, '__INJECTED_PUBLIC_PATH_BY_QIANKUN__:', window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)

    // 对于 webpack 项目（兼容性处理）
    if (typeof __webpack_public_path__ !== 'undefined') {
        __webpack_public_path__ = publicPath
    }

    // 对于 Vite，需要设置 import.meta.url 的 base
    // vite-plugin-qiankun 会自动处理，但这里确保变量被正确设置
    if (publicPath && publicPath !== '/') {
        // 在预览模式下，publicPath 应该是完整的 URL（如 http://localhost:5555/）
        // 这会被 vite-plugin-qiankun 使用
        console.log('[vue-sub-app] 使用自定义 public path:', publicPath)
    }
}

