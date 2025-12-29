/**
 * 微应用配置
 * 在这里配置需要加载的子应用
 */

// 判断当前环境
// 开发环境：import.meta.env.DEV 为 true
// 预览/生产环境：import.meta.env.DEV 为 false
const isDevelopment = import.meta.env.DEV

// 判断是否是预览模式（本地预览生产构建）
// 预览模式下，hostname 是 localhost 且不是开发模式
const isPreview = !isDevelopment &&
    typeof window !== 'undefined' &&
    window.location.hostname === 'localhost'

// 根据环境设置入口地址
const getEntry = (port) => {
    if (isDevelopment) {
        // 开发环境：使用协议相对路径（自动适配 http/https）
        return `//localhost:${port}`
    } else if (isPreview) {
        // 预览环境：使用完整 URL（确保资源路径正确解析）
        // 预览模式通常使用 http://（本地预览服务器）
        console.log('预览模式', `http://localhost:${port}/`)
        return `http://localhost:${port}`

    } else {
        // 生产环境：根据实际部署情况配置
        // 同域部署：使用相对路径，如 '/vue-sub-app/'
        // 独立部署：使用完整 URL，如 'https://vue-app.example.com/'
        // 这里需要根据实际部署情况修改
        return `/sub-app-${port}/` // 示例，需要根据实际部署调整
    }
}

export const microApps = [
    {
        name: 'vue-sub-app', // 微应用名称，必须唯一
        entry: getEntry(5555), // 微应用的入口地址
        container: '#subapp-viewport', // 微应用挂载的容器
        activeRule: '/vue', // 激活路由规则
        props: {
            // 传递给微应用的数据
            routerBase: '/vue'
        }
    },
    {
        name: 'react-sub-app', // 微应用名称，必须唯一
        entry: getEntry(8082), // 微应用的入口地址
        container: '#subapp-viewport', // 微应用挂载的容器
        activeRule: '/react', // 激活路由规则
        props: {
            // 传递给微应用的数据
            routerBase: '/react'
        }
    }
    // 可以继续添加更多微应用
]

