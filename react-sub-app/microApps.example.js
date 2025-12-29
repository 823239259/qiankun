/**
 * 微应用配置示例
 *
 * 根据不同环境配置不同的入口地址
 */

// 判断环境
const isDevelopment = process.env.NODE_ENV === 'development'

// React 子应用配置
export const reactSubAppConfig = {
  name: 'react-sub-app',
  container: '#subapp-viewport',
  activeRule: '/react',
  props: {
    routerBase: '/react'
  },
  // 根据环境设置不同的入口地址
  entry: isDevelopment
    ? '//localhost:8082'                    // 开发环境：开发服务器
    : '/react-sub-app/'                      // 生产环境：静态资源路径
    // 或者使用完整 URL：
    // : 'https://cdn.example.com/react-sub-app/'  // 生产环境：CDN 地址
}

// Vue 子应用配置示例
export const vueSubAppConfig = {
  name: 'vue-sub-app',
  container: '#subapp-viewport',
  activeRule: '/vue',
  props: {
    routerBase: '/vue'
  },
  entry: isDevelopment
    ? '//localhost:5555'
    : '/vue-sub-app/'
}

// 导出所有微应用配置
export const microApps = [
  reactSubAppConfig,
  vueSubAppConfig
]

