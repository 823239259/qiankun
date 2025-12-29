/**
 * 预览模式微应用配置
 *
 * 在预览模式下使用此配置
 * 预览模式下，子应用运行在独立的预览服务器上
 */

export const microApps = [
    {
        name: 'vue-sub-app',
        // 预览模式下使用预览服务器地址
        entry: 'http://localhost:5555',
        container: '#subapp-viewport',
        activeRule: '/vue',
        props: {
            routerBase: '/vue'
        }
    },
    {
        name: 'react-sub-app',
        // 预览模式下使用预览服务器地址
        entry: 'http://localhost:8082',
        container: '#subapp-viewport',
        activeRule: '/react',
        props: {
            routerBase: '/react'
        }
    }
]

