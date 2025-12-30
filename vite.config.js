import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        port: 7777,
        cors: true,
        origin: 'http://localhost:7777',
        proxy: {
            // '/vue/': {
            //     target: 'http://localhost:5555',
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/vue/, '/vue')
            // },
            // '/react/': {
            //     target: 'http://localhost:8082',
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/react/, '/react')
            // },
            // "/*": {
            //     target: 'http://localhost:7777',
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\//, '/')
            // }
        },
    },
    // 生产环境基础路径（使用绝对路径，确保在任何路由下都能正确加载资源）
    base: '/',
    build: {
        // 输出目录
        outDir: 'dist',
        // 资源内联阈值
        assetsInlineLimit: 4096,
        // CSS 代码分割
        cssCodeSplit: true,
        // 生成 sourcemap（生产环境建议关闭）
        sourcemap: false,
        // 目标浏览器版本
        target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
        // chunk 大小警告限制
        chunkSizeWarningLimit: 2048,
        // 是否生成 manifest.json
        manifest: false,
        // 压缩方式
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false, // 保留 console，方便调试
                drop_debugger: true
            },
            mangle: {
                keep_classnames: true,
                keep_fnames: true
            }
        },
        // Rollup 配置
        rollupOptions: {
            output: {
                // 手动分包策略
                manualChunks: {
                    // 将 Vue 相关库单独打包
                    'vue-vendor': ['vue', 'vue-router'],
                    // 将 qiankun 单独打包
                    'qiankun-vendor': ['qiankun']
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
    },
    css: {
        devSourcemap: true,
        // 生产环境 CSS 压缩
        minify: true
    }
})

