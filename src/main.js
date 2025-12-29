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

    return enhancedApp
})


// 注册微应用
registerMicroApps(enhancedMicroApps, {
    beforeLoad: (app) => {
        console.log('开始加载微应用:', app.name, 'entry:', app.entry, 'hasGetTemplate:', typeof app.getTemplate === 'function')
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


// 检查是否是预览模式
const isPreviewMode = typeof window !== 'undefined' &&
    window.location.hostname === 'localhost' &&
    !import.meta.env.DEV

// 在预览模式下，拦截 window.fetch 来修改 HTML（在 registerMicroApps 之后设置）
if (isPreviewMode && typeof window !== 'undefined') {
    const originalFetch = window.fetch
    // window.fetch = function(url, ...args) {
    //     const urlString = typeof url === 'string' ? url : (url instanceof Request ? url.url : url.toString())

    //     // 检查是否是子应用的 entry URL
    //     const appConfig = enhancedMicroApps.find(app => {
    //         const entryUrl = typeof app.entry === 'string' ? app.entry : app.entry.url || ''
    //         // 匹配 entry URL（可能有或没有末尾斜杠）
    //         return urlString === entryUrl ||
    //             urlString === entryUrl.replace(/\/$/, '') ||
    //             urlString === entryUrl + '/' ||
    //             (entryUrl.endsWith('/') && urlString === entryUrl.slice(0, -1))
    //     })

    //     if (appConfig && appConfig.getTemplate && typeof appConfig.getTemplate === 'function') {
    //         console.log(`[window.fetch 拦截] 拦截 ${appConfig.name} 的请求:`, urlString)
    //         return originalFetch.apply(this, arguments).then(async (response) => {
    //             // 只处理 HTML 响应
    //             const contentType = response.headers.get('content-type') || ''
    //             if (contentType.includes('text/html')) {
    //                 const html = await response.clone().text()
    //                 console.log(`[window.fetch 拦截] 获取到 ${appConfig.name} 的 HTML，长度:`, html.length)

    //                 // 使用 getTemplate 修改 HTML
    //                 const modifiedHtml = appConfig.getTemplate(html)
    //                 console.log(`[window.fetch 拦截] getTemplate 修改后的 HTML 长度:`, modifiedHtml.length)

    //                 // 返回修改后的响应
    //                 return new Response(modifiedHtml, {
    //                     status: response.status,
    //                     statusText: response.statusText,
    //                     headers: response.headers
    //                 })
    //             }
    //             return response
    //         }).catch(err => {
    //             console.error('[window.fetch 拦截] 处理失败:', err)
    //             throw err
    //         })
    //     }

    //     // 其他请求正常处理
    //     return originalFetch.apply(this, arguments)
    // }
    console.log('[main.js] 已设置 window.fetch 拦截器（预览模式）')
}

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
    }
})

app.mount('#app')
