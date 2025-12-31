import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    // 子应用路由由 qiankun 处理，这里只需要定义占位路由避免警告
    {
        path: '/vue/:pathMatch(.*)*',
        name: 'VueSubApp',
        component: { render: () => null }
    },
    {
        path: '/react/:pathMatch(.*)*',
        name: 'ReactSubApp',
        component: { render: () => null }
    }
]

const router = createRouter({
    history: createWebHistory('/frame'),
    routes
})

export default router

