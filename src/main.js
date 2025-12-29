import { createApp } from 'vue'
import { registerMicroApps, start, initGlobalState } from 'qiankun'
import App from './App.vue'
import router from './router'
import { microApps } from './microApps'

const app = createApp(App)
app.use(router)

// 初始化全局状态
const initialState = {
    user: {
        name: '主应用用户'
    },
    theme: 'light' // 主题：light 或 dark
}

// 维护当前全局状态
let currentGlobalState = { ...initialState }

const actions = initGlobalState(initialState)

actions.onGlobalStateChange((state, prev) => {
    console.log('全局状态变更:', state, prev)
    // 更新当前状态
    currentGlobalState = { ...currentGlobalState, ...state }
    // 同步主题到 DOM
    if (state.theme !== undefined) {
        document.documentElement.setAttribute('data-theme', state.theme)
    }
})

// 创建 getGlobalState 方法
const getGlobalState = () => {
    return { ...currentGlobalState }
}

// 初始化主题
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    currentGlobalState.theme = savedTheme
    actions.setGlobalState({ theme: savedTheme })
    document.documentElement.setAttribute('data-theme', savedTheme)
}

initTheme()

// 导出 actions 供组件使用
window.__QIANKUN_ACTIONS__ = actions

// 为微应用添加全局状态管理方法
const enhancedMicroApps = microApps.map(app => {
    const enhancedApp = {
        ...app,
        props: {
            ...app.props,
            onGlobalStateChange: actions.onGlobalStateChange.bind(actions),
            setGlobalState: actions.setGlobalState.bind(actions),
            getGlobalState: getGlobalState
        }
    }

    // 对于 React 子应用，使用 getTemplate 移除 type="module" 的脚本标签
    // vite-plugin-qiankun 会自动处理入口脚本
    // if (app.name === 'react-sub-app') {
    //     enhancedApp.getTemplate = (tpl) => {
    //         // 移除 type="module" 的脚本标签，让 vite-plugin-qiankun 处理
    //         return tpl.replace(
    //             /<script\s+type=["']module["'][^>]*src=["'][^"']*main\.jsx["'][^>]*>[\s\S]*?<\/script>/gi,
    //             ''
    //         )
    //     }
    // }

    return enhancedApp
})

// 注册微应用
registerMicroApps(enhancedMicroApps, {
    beforeLoad: (app) => {
        console.log('开始加载微应用:', app.name)
        return Promise.resolve()
    },
    beforeMount: (app) => {
        console.log('开始挂载微应用:', app.name)
        return Promise.resolve()
    },
    afterMount: (app) => {
        console.log('微应用挂载完成:', app.name)
        return Promise.resolve()
    },
    beforeUnmount: (app) => {
        console.log('开始卸载微应用:', app.name)
        // 对于 React 子应用，在卸载前标记样式，防止被清理
        if (app.name === 'react-sub-app') {
            console.log('[主应用] React 子应用卸载，保留样式标签')
            // 标记所有属于 React 子应用的样式标签，防止被 qiankun 清理
            const styleTags = document.querySelectorAll('style[data-qiankun="react-sub-app"], style[data-vite-dev-id*="react-sub-app"]')
            styleTags.forEach(style => {
                style.setAttribute('data-keep-style', 'true')
            })
        }
        return Promise.resolve()
    },
    afterUnmount: (app) => {
        console.log('微应用卸载完成:', app.name)
        return Promise.resolve()
    }
})

router.afterEach((to, from) => {
    history.replaceState({ ...history.state, current: to.path }, to.name, '')
})

// 监听路由变化，确保子应用路由正确激活
// router.beforeEach((to, from, next) => {
//     console.log('[主应用] 路由变化:', to.path, 'from:', from.path)

//     // 如果从子应用路由切换到主应用路由，确保子应用被卸载
//     const isFromSubApp = from.path.startsWith('/vue') || from.path.startsWith('/react')
//     const isToSubApp = to.path.startsWith('/vue') || to.path.startsWith('/react')

//     if (isFromSubApp && !isToSubApp) {
//         console.log('[主应用] 从子应用路由切换到主应用路由，qiankun 会自动卸载子应用')
//     }

//     // 如果从一个子应用切换到另一个子应用，确保前一个被卸载
//     if (isFromSubApp && isToSubApp) {
//         const fromApp = from.path.startsWith('/vue') ? 'vue' : 'react'
//         const toApp = to.path.startsWith('/vue') ? 'vue' : 'react'
//         if (fromApp !== toApp) {
//             console.log('[主应用] 从一个子应用切换到另一个子应用:', fromApp, '->', toApp)
//         }
//     }

//     next()
// })

// 启动 qiankun
start({
    // sandbox: {
    //     // 启用宽松模式的沙箱，允许子应用访问 window.history 和 window.location
    //     // 这对于 React Router 的 BrowserRouter 是必需的
    //     loose: true,
    //     // 关闭严格样式隔离，允许样式正常加载
    //     strictStyleIsolation: false,
    //     // 关闭实验性样式隔离
    //     experimentalStyleIsolation: false
    // },
    sandbox: true,
    prefetch: false, // 关闭预加载，避免提前加载导致问题
    singular: false, // 是否单实例模式
    // 自定义资源过滤，防止样式被清理
    excludeAssetFilter: (assetUrl) => {
        // 对于 React 子应用的样式，不要过滤掉，确保样式被保留
        // 这样可以避免卸载后重新加载时样式丢失
        if (assetUrl.includes('react-sub-app') || assetUrl.includes('localhost:8082')) {
            // 允许样式资源通过，不被清理
            return false
        }
        return false
    },
    // 自定义 fetch，处理跨域和错误，忽略 Vite 客户端脚本
    // fetch: (url, ...args) => {
    //     const urlString = typeof url === 'string' ? url : (url instanceof Request ? url.url : url.toString())
    //     // 忽略 Vite 的客户端脚本和 HMR 相关请求
    //     if (urlString.includes('/@vite/client') ||
    //         urlString.includes('/@vite/env') ||
    //         urlString.includes('/@vite/')) {
    //         console.log('[qiankun] 拦截 Vite 客户端请求:', urlString)
    //         return Promise.resolve(new Response('', {
    //             status: 200,
    //             headers: { 'Content-Type': 'application/javascript' }
    //         }))
    //     }
    //     // 拦截直接请求 main.jsx 的请求（qiankun 不应该直接执行 JSX 文件）
    //     // 但允许通过 ?import 参数加载（这是 Vite 的模块导入）
    //     if (urlString.includes('/src/main.jsx') &&
    //         !urlString.includes('?import') &&
    //         !urlString.includes('&import') &&
    //         !urlString.includes('?t=')) {
    //         console.log('[qiankun] 拦截 JSX 文件直接请求:', urlString)
    //         return Promise.resolve(new Response('', {
    //             status: 200,
    //             headers: { 'Content-Type': 'application/javascript' }
    //         }))
    //     }
    //     return window.fetch(url, ...args).catch(err => {
    //         console.error('[qiankun] 加载资源失败:', url, err)
    //         throw err
    //     })
    // }
})

app.mount('#app')
