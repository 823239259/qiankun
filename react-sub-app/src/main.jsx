import React from 'react'
import ReactDOM from 'react-dom/client'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App'
import './index.css'

let root = null

function render(props = {}) {
  const { container, routerBase } = props
  const mountElement = container ? container.querySelector('#root') : document.querySelector('#root')

  root = ReactDOM.createRoot(mountElement)
  root.render(
    <React.StrictMode>
      <App routerBase={routerBase} />
    </React.StrictMode>
  )
}

// 使用 vite-plugin-qiankun 的辅助函数
renderWithQiankun({
  mount(props) {
    console.log('[react-sub-app] 子应用挂载', props)
    render(props)

    // 监听全局状态变化（暗色模式）
    if (props.onGlobalStateChange) {
      props.onGlobalStateChange((state, prev) => {
        console.log('[react-sub-app] 全局状态变更:', state, prev)
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
  bootstrap() {
    console.log('[react-sub-app] 子应用启动')
  },
  unmount() {
    console.log('[react-sub-app] 子应用卸载')
    if (root) {
      root.unmount()
      root = null
    }
  }
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({ routerBase: '/' })
}

