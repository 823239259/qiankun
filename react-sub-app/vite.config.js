import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

// 自定义插件：标记样式标签，防止被 qiankun 清理
const styleMarkerPlugin = () => {
    return {
        name: 'style-marker',
        enforce: 'post',
        transformIndexHtml (html) {
            // 确保样式标签有标记
            return html.replace(
                /<style([^>]*)>/g,
                `<style$1 data-qiankun="react-sub-app">`
            )
        },
        // 在开发模式下，通过客户端代码拦截样式注入
        buildStart () {
            // 在开发模式下，通过全局变量注入代码来标记样式
            if (process.env.NODE_ENV === 'development') {
                // 这个逻辑会在浏览器端执行
            }
        }
    }
}

// 在开发模式下，通过客户端注入代码来标记样式标签
const clientStyleMarker = () => {
    return {
        name: 'client-style-marker',
        enforce: 'post',
        transformIndexHtml (html, ctx) {
            // 注入客户端代码，自动标记所有样式标签
            const clientScript = `
          <script>
            (function() {
              // 标记现有的样式标签
              function markStyles() {
                const styles = document.querySelectorAll('style:not([data-qiankun])')
                styles.forEach(style => {
                  // 检查是否是 Vite 注入的样式
                  if (style.getAttribute('data-vite-dev-id') ||
                      style.textContent.includes('react-sub-app') ||
                      style.getAttribute('id')?.includes('vite')) {
                    style.setAttribute('data-qiankun', 'react-sub-app')
                  }
                })
              }

              // 立即执行一次
              markStyles()

              // 监听 DOM 变化，自动标记新注入的样式
              const observer = new MutationObserver(() => {
                markStyles()
              })

              observer.observe(document.head, {
                childList: true,
                subtree: true
              })

              // 保存 observer，以便在需要时清理
              window.__STYLE_MARKER_OBSERVER__ = observer
            })()
          </script>
        `
            return html.replace('</head>', clientScript + '</head>')
        }
    }
}

export default defineConfig({
    plugins: [
        react(),
        qiankun('react-sub-app', {
            useDevMode: true
        }),
        // styleMarkerPlugin(),
        // clientStyleMarker()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 8082,
        cors: true,
        origin: 'http://localhost:8082',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hmr: false // 禁用 HMR，避免与 qiankun 冲突
    },
    base: './',
    build: {
        cssCodeSplit: false // 确保 CSS 被正确打包
    },
    css: {
        devSourcemap: true
        // .module.css 文件会自动启用 CSS Modules
        // 不需要额外配置，Vite 会自动处理
    }
})

