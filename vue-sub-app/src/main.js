import { createApp } from 'vue'
import App from './App.vue'
import { createRouterInstance } from './router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import './public-path'

let instance = null
let router = null

function render (props = {}) {
    const { container, routerBase } = props

    // 如果已有实例，先卸载
    if (instance) {
        instance.unmount()
        instance = null
    }

    // 创建或获取 router 实例，设置正确的 base
    const base = routerBase || (qiankunWindow.__POWERED_BY_QIANKUN__ ? '/vue' : '/')
    router = createRouterInstance(base)

    console.log('[vue-sub-app] 路由 base:', base, '当前路径:', window.location.pathname)

    instance = createApp(App)
    instance.use(router)

    const mountElement = container ? container.querySelector('#sub-app') : '#sub-app'
    instance.mount(mountElement)
}

// 使用 vite-plugin-qiankun 的辅助函数
renderWithQiankun({
    bootstrap () {
        console.log('[vue-sub-app] 子应用启动')
    },
    mount (props) {
        console.log('[vue-sub-app] 子应用挂载', props)
        render(props)

        // 监听全局状态变化（暗色模式）
        if (props.onGlobalStateChange) {
            props.onGlobalStateChange((state, prev) => {
                console.log('[vue-sub-app] 全局状态变更:', state, prev)
                // 同步暗色模式状态
                if (state.theme !== undefined) {
                    document.documentElement.setAttribute('data-theme', state.theme)
                }
            }, true)
        }

        // 初始化时同步主题
        if (props.getGlobalState) {
            const globalState = props.getGlobalState()
            if (globalState.theme) {
                document.documentElement.setAttribute('data-theme', globalState.theme)
            }
        }
    },
    unmount () {
        console.log('[vue-sub-app] 子应用卸载')
        if (instance) {
            instance.unmount()
            instance = null
        }
    }
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
}

