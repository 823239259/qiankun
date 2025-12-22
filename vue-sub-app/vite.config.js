import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [
        vue(),
        qiankun('vue-sub-app', {
            useDevMode: true
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
    css: {
        // 确保 CSS 被正确处理
        devSourcemap: true
    },
    base: './'
})

