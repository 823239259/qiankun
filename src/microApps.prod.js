/**
 * 生产环境微应用配置
 *
 * 使用方法：
 * 1. 复制此文件为 microApps.js（或根据环境变量动态导入）
 * 2. 根据实际部署情况修改 entry 地址
 */

// 判断环境（可以通过环境变量或构建时注入）
const isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development'

export const microApps = [
    {
        name: 'vue-sub-app',
        // 根据环境设置不同的入口地址
        entry: isDevelopment
            ? '//localhost:5555'                    // 开发环境：开发服务器
            : '/vue-sub-app/',                         // 生产环境：静态资源路径（同域部署）
            // : 'https://cdn.example.com/vue-sub-app/',  // 生产环境：CDN 地址（独立部署）
        container: '#subapp-viewport',
        activeRule: '/vue',
        props: {
            routerBase: '/vue'
        }
    },
    {
        name: 'react-sub-app',
        entry: isDevelopment
            ? '//localhost:8082'                      // 开发环境：开发服务器
            : '/react-sub-app/',                       // 生产环境：静态资源路径（同域部署）
            // : 'https://cdn.example.com/react-sub-app/', // 生产环境：CDN 地址（独立部署）
        container: '#subapp-viewport',
        activeRule: '/react',
        props: {
            routerBase: '/react'
        }
    }
]

