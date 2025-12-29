import { createApp } from 'vue'
import App from './App.vue'
import { createRouterInstance } from './router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import './public-path'
// 在 main.js 中导入 CSS，确保在每次挂载时都能重新加载样式
// 如果在组件中导入 CSS，卸载后重新挂载时样式可能不会重新注入
// import './css/common.css'

let instance = null
let router = null

function render (props = {}) {
    const { container, routerBase } = props

    // 如果已有实例，先卸载并清理路由
    if (instance) {
        instance.unmount()
        instance = null
    }

    // 清理旧的路由实例
    if (router) {
        // Vue Router 没有直接的销毁方法，但卸载实例后路由会自动停止监听
        router = null
    }

    // 创建或获取 router 实例，设置正确的 base
    // 确保 base 始终是有效的字符串
    let base = '/'
    if (routerBase && typeof routerBase === 'string' && routerBase.trim() !== '') {
        base = routerBase
    } else if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        base = '/vue'
    }

    console.log('[vue-sub-app] 路由 base:', base, 'routerBase:', routerBase, '当前路径:', window.location.pathname)

    router = createRouterInstance(base)

    instance = createApp(App)
    instance.use(router)

    const mountElement = container ? container.querySelector('#sub-app') : '#sub-app'
    instance.mount(mountElement)
}



// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
    render()
} else {
    // 使用 vite-plugin-qiankun 的辅助函数
    renderWithQiankun({
        bootstrap () {
            console.log('[vue-sub-app] 子应用启动')
        },
        mount (props) {
            console.log('[vue-sub-app] 子应用挂载', props)

            // 确保样式在每次挂载时都被重新加载
            // 在开发模式下，Vite 会通过 JS 动态注入样式，需要确保样式被重新加载
            // 使用动态导入确保每次挂载时都重新加载样式
            // import('./css/common.css').then(() => {
            //     console.log('[vue-sub-app] common.css 已重新加载')
            // }).catch(err => {
            //     console.warn('[vue-sub-app] 重新加载 common.css 失败:', err)
            // })

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
            // 清理路由实例，防止路由监听器继续工作
            if (router) {
                // 移除路由监听器
                try {
                    // Vue Router 会自动清理监听器，但我们需要确保实例被清理
                    router = null
                } catch (e) {
                    console.warn('[vue-sub-app] 清理路由时出错:', e)
                }
            }
        }
    })
}

