import React from 'react'
import ReactDOM from 'react-dom/client'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App'
import './index.css'

let root = null
// 保存样式内容，防止卸载后丢失
const savedStyles = new Map()

function render(props = {}) {
  const { container, routerBase } = props

  // 在 qiankun 环境中，容器是 #subapp-viewport，需要创建或找到 #root 元素
  let mountElement
  if (container) {
    // 在容器中查找或创建 #root 元素
    mountElement = container.querySelector('#root')
    if (!mountElement) {
      mountElement = document.createElement('div')
      mountElement.id = 'root'
      container.appendChild(mountElement)
    }
  } else {
    mountElement = document.querySelector('#root')
  }

  if (!mountElement) {
    console.error('[react-sub-app] 无法找到挂载元素')
    return
  }

  // 如果已有 root 实例，先卸载
  if (root) {
    root.unmount()
    root = null
  }

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

    // 清理之前的 observer
    // if (window.__REACT_SUB_APP_STYLE_OBSERVER__) {
    //   window.__REACT_SUB_APP_STYLE_OBSERVER__.disconnect()
    //   window.__REACT_SUB_APP_STYLE_OBSERVER__ = null
    // }

    // 确保样式被正确加载
    // 在 qiankun 环境中，需要确保样式标签存在
    // 如果样式被清理了，需要恢复保存的样式
    const ensureStylesLoaded = () => {
      // 检查是否有样式标签
      const existingStyles = document.querySelectorAll('style[data-vite-dev-id], style[data-qiankun="react-sub-app"]')

      if (existingStyles.length === 0 && savedStyles.size > 0) {
        console.log('[react-sub-app] 检测到样式丢失，恢复保存的样式')
        // 恢复保存的样式
        savedStyles.forEach((cssText, id) => {
          // 检查是否已经存在相同的样式
          const existing = document.querySelector(`style[data-vite-dev-id="${id}"]`)
          if (!existing) {
            const style = document.createElement('style')
            style.setAttribute('data-qiankun', 'react-sub-app')
            style.setAttribute('data-restored', 'true')
            style.setAttribute('data-vite-dev-id', id)
            style.textContent = cssText
            document.head.appendChild(style)
            console.log(`[react-sub-app] 已恢复样式: ${id}`)
          }
        })
      } else if (existingStyles.length === 0) {
        // 如果没有保存的样式，等待 Vite 注入样式
        console.log('[react-sub-app] 首次加载，等待 Vite 注入样式')
        // 样式会通过 import 自动注入，这里不需要额外操作
      } else {
        // 样式存在，更新保存的样式内容（以防后续被清理）
        existingStyles.forEach(style => {
          const id = style.getAttribute('data-vite-dev-id') || style.getAttribute('id') || `style-${Date.now()}-${Math.random()}`
          const cssText = style.textContent || style.innerHTML
          if (cssText) {
            savedStyles.set(id, cssText)
          }
        })
      }
    }

    // 先确保样式加载
    // ensureStylesLoaded()

    // 渲染应用
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

    // // 保存所有样式标签的内容，防止被 qiankun 清理后丢失
    // const styleTags = document.querySelectorAll('style[data-vite-dev-id], style[data-qiankun="react-sub-app"]')
    // savedStyles.clear()

    // styleTags.forEach(style => {
    //   const id = style.getAttribute('data-vite-dev-id') || style.getAttribute('id') || `style-${Date.now()}-${Math.random()}`
    //   const cssText = style.textContent || style.innerHTML

    //   if (cssText) {
    //     savedStyles.set(id, cssText)
    //     // 标记样式，尝试防止被清理
    //     style.setAttribute('data-keep-style', 'true')
    //     style.setAttribute('data-qiankun', 'react-sub-app')
    //   }
    // })

    // console.log(`[react-sub-app] 已保存 ${savedStyles.size} 个样式标签的内容`)

    // // 使用 MutationObserver 监听样式标签被移除的情况
    // // 如果样式被移除，在重新挂载时会自动恢复
    // const observer = new MutationObserver((mutations) => {
    //   mutations.forEach((mutation) => {
    //     mutation.removedNodes.forEach((node) => {
    //       if (node.nodeName === 'STYLE' &&
    //           (node.getAttribute('data-vite-dev-id') || node.getAttribute('data-qiankun') === 'react-sub-app')) {
    //         const id = node.getAttribute('data-vite-dev-id') || node.getAttribute('id')
    //         const cssText = node.textContent || node.innerHTML
    //         if (id && cssText && !savedStyles.has(id)) {
    //           savedStyles.set(id, cssText)
    //           console.log('[react-sub-app] 检测到样式被移除，已保存样式内容')
    //         }
    //       }
    //     })
    //   })
    // })

    // // 观察 document.head 的变化
    // observer.observe(document.head, {
    //   childList: true,
    //   subtree: true
    // })

    // // 保存 observer，以便在重新挂载时清理
    // window.__REACT_SUB_APP_STYLE_OBSERVER__ = observer
  }
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({ routerBase: '/' })
}

