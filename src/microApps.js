/**
 * 微应用配置
 * 在这里配置需要加载的子应用
 */
export const microApps = [
    {
        name: 'vue-sub-app', // 微应用名称，必须唯一
        entry: '//localhost:5555', // 微应用的入口地址（使用协议相对路径）
        container: '#subapp-viewport', // 微应用挂载的容器
        activeRule: '/vue', // 激活路由规则
        props: {
            // 传递给微应用的数据
            routerBase: '/vue'
        }
    },
    {
        name: 'react-sub-app',
        entry: '//localhost:8082',
        container: '#subapp-viewport',
        activeRule: '/react',
        props: {
            routerBase: '/react'
        }
    }
    // 可以继续添加更多微应用
]

