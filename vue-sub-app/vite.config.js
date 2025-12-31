import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'

    return {
        plugins: [
            vue(),
            qiankun('vue-sub-app', {
                useDevMode: isDev  // 只在开发模式下启用
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            port: 5555,
            cors: true,
            origin: 'http://localhost:5555',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            hmr: false // 禁用 HMR，避免与 qiankun 冲突
        },
        // base 路径配置：统一使用 /vue/ 前缀
        // 开发环境和生产环境保持一致的路由前缀
        base: mode === 'production' ? `/vue` : '',
        // base: 'http://localhost:5555/',
        // base: '/vue/',
        // css: {
        //     // 确保 CSS 被正确处理
        //     devSourcemap: true,
        //     // 确保 CSS 被正确处理，不进行代码分割
        //     modules: false
        // },

        build: {
            // 输出目录
            outDir: 'dist',
            // CSS 代码分割：true 表示按需加载 CSS
            cssCodeSplit: false, // 改为 false，确保所有 CSS 打包到一个文件
            // 生成 sourcemap（生产环境建议关闭）
            sourcemap: false,
            // 目标浏览器版本
            target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
            // chunk 大小警告限制
            chunkSizeWarningLimit: 2048,
            // 资源内联阈值（小于此大小的资源会被内联为 base64）
            assetsInlineLimit: 4096,
            // 是否生成 manifest.json
            manifest: false,
            // 压缩方式
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true, // 生产环境移除 console
                    drop_debugger: true
                }
            },
            // Rollup 配置
            rollupOptions: {
                output: {
                    // 手动分包策略
                    manualChunks: {
                        // 将 Vue 相关库单独打包
                        'vue-vendor': ['vue', 'vue-router']
                    },
                    // 资源文件命名
                    assetFileNames: 'assets/[name].[hash].[ext]',
                    // JS 文件命名
                    chunkFileNames: 'js/[name].[hash].js',
                    // 入口文件命名
                    entryFileNames: 'js/[name].[hash].js'
                }
            },
            // Tree shaking 配置
            treeshake: {
                preset: 'recommended'
            }
        }
    }
})

