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
    // 每次都创建新的 router 实例，确保 base 正确
    router = createRouter({
        history: createWebHistory(base),
        routes
    })

    return router
}

// 获取当前 router 实例
export function getRouter () {
    return router
}

// 默认导出（用于独立运行）
export default createRouterInstance()

