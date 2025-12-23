import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
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
        }
    },
    base: './'
})

