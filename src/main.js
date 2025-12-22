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
const enhancedMicroApps = microApps.map(app => ({
    ...app,
    props: {
        ...app.props,
        onGlobalStateChange: actions.onGlobalStateChange.bind(actions),
        setGlobalState: actions.setGlobalState.bind(actions),
        getGlobalState: getGlobalState
    }
}))

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
        return Promise.resolve()
    },
    afterUnmount: (app) => {
        console.log('微应用卸载完成:', app.name)
        return Promise.resolve()
    }
})

// 启动 qiankun
start({
    sandbox: {
        strictStyleIsolation: false, // 关闭严格样式隔离，允许样式正常加载
        experimentalStyleIsolation: false // 关闭实验性样式隔离
    },
    prefetch: false, // 关闭预加载，避免提前加载导致问题
    singular: false, // 是否单实例模式
    // 自定义 fetch，处理跨域和错误
    fetch: (url, ...args) => {
        return window.fetch(url, ...args).catch(err => {
            console.error('[qiankun] 加载资源失败:', url, err)
            throw err
        })
    }
})

// 监听路由变化，确保子应用路由正确激活
router.beforeEach((to, from, next) => {
    console.log('[主应用] 路由变化:', to.path)
    next()
})

app.mount('#app')
