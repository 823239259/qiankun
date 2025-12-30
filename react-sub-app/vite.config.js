import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'


export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        qiankun('react-sub-app', {
            useDevMode: true
        })
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
    // base 路径配置：
    // - development: 完整 URL（开发服务器）
    // - preview: 完整 URL（vite-plugin-qiankun 需要完整的部署地址）
    // - production: 相对路径（生产部署）
    base: mode === 'preview'
        ? 'http://localhost:8082/'
        : (mode === 'production' ? '/react/' : 'http://localhost:8082/'),
    build: {
        // 输出目录
        outDir: 'dist',
        // 资源内联阈值（小于此大小的资源会被内联为 base64）
        assetsInlineLimit: 4096,
        // CSS 代码分割：false 表示所有 CSS 打包到一个文件中
        cssCodeSplit: false,
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
                    // 将 React 相关库单独打包
                    'react-vendor': ['react', 'react-dom'],
                    // 将 React Router 单独打包
                    'router-vendor': ['react-router-dom']
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
}))

