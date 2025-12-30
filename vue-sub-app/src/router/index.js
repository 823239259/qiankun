import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')
    },
    {
        path: '/',
        redirect: '/home'
    }
]

// 创建 router 实例（base 将在 mount 时动态设置）
let router = null

export function createRouterInstance (base = '/') {
    // 确保 base 是有效的字符串，不能是 undefined 或 null
    let validBase = '/'
    if (base && typeof base === 'string' && base.trim() !== '') {
        validBase = base
    }

    // 确保 base 以 / 开头，但不以 / 结尾（除非是根路径）
    const normalizedBase = validBase === '/' ? '/' : validBase.replace(/\/$/, '')

    console.log('[vue-sub-app] 创建路由实例，base:', normalizedBase, '原始 base:', base)

    // 每次都创建新的 router 实例，确保 base 正确
    router = createRouter({
        history: createWebHistory(normalizedBase),
        routes
    })

    // // 添加错误处理，防止路由错误
    // router.onError((error) => {
    //     // 忽略不在当前 base 范围内的路由错误
    //     const currentPath = window.location.pathname
    //     if (!currentPath.startsWith(normalizedBase)) {
    //         // 如果当前路径不在 base 范围内，忽略错误（可能是其他子应用的路由）
    //         console.log('[vue-sub-app] 忽略不在当前 base 范围内的路由错误:', currentPath, 'base:', normalizedBase)
    //         return
    //     }
    //     console.error('[vue-sub-app] 路由错误:', error)
    // })

    // // 添加路由守卫，防止处理不在 base 范围内的路由
    // router.beforeEach((to, from, next) => {
    //     const currentPath = window.location.pathname
    //     // 如果当前路径不在 base 范围内，阻止路由导航
    //     if (!currentPath.startsWith(normalizedBase)) {
    //         console.log('[vue-sub-app] 跳过不在 base 范围内的路由:', currentPath, 'base:', normalizedBase)
    //         // 阻止路由导航，但不报错
    //         next(false)
    //         return
    //     }
    //     next()
    // })

    return router
}

// 获取当前 router 实例
export function getRouter () {
    return router
}

// 默认导出（用于独立运行）
export default router;
