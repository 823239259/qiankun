/**
 * 方案二：改进 BrowserRouter 配置（推荐，URL 更友好）
 *
 * 优点：URL 友好，支持浏览器前进后退
 * 缺点：需要正确配置 basename 和路由同步
 */

import React, { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import './App.css';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

// 异步加载路由组件
const Home = lazy(() => import('./views/Home'))
const About = lazy(() => import('./views/About'))
const Products = lazy(() => import('./views/Products'))
const Contact = lazy(() => import('./views/Contact'))
const Dashboard = lazy(() => import('./views/Dashboard'))

function App({ routerBase }) {
  const [isDark, setIsDark] = useState(false)

  // 根据是否在 qiankun 环境中动态设置 basename
  const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__
  // 正确设置 basename：
  // - qiankun 环境：使用主应用传递的 routerBase（如 /frame/react）
  // - 独立运行：统一使用 /react（开发和生产环境一致）
  const basename = isQiankun
    ? (routerBase || '/react')
    : (routerBase || '/react')

  console.log('isQiankun', isQiankun)
  console.log('basename', basename)
  console.log('routerBase', routerBase)
  // 检查主题
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()

    const observer = new MutationObserver(() => {
      checkTheme()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`sub-app ${isDark ? 'dark-mode' : ''}`}>
      <div className="sub-app-header">
        <h2>React 子应用</h2>
        <p>这是一个使用 vite-plugin-qiankun 接入的 React 子应用</p>
      </div>
      <BrowserRouter basename={basename}>
        <Suspense fallback={<LoadingFallback />}>
          <NavContent routerBase={routerBase} />
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

// 加载中的占位组件
function LoadingFallback() {
  return (
    <div className="sub-app-content">
      <div className="sub-content fullLoadingContainer">
        <div className="loadingContent">
          <div className="fullLoadingSpinner"></div>
          <p className="loadingText">加载中...</p>
        </div>
      </div>
    </div>
  )
}

// 导航内容组件
function NavContent({ routerBase }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isQiankun = qiankunWindow.__POWERED_BY_QIANKUN__

  // 监听路由变化，同步到主应用（可选）
  useEffect(() => {
    if (isQiankun && routerBase) {
      // 获取完整路径（包含 basename）
      const fullPath = `${routerBase}${location.pathname}`

      // 同步路由到主应用（如果需要）
      // 注意：qiankun 会自动处理路由，这里只是示例
      console.log('[react-sub-app] 路由变化:', fullPath)

      // 如果需要手动同步，可以调用主应用的路由方法
      // 例如：window.__QIANKUN_ACTIONS__?.setGlobalState({ currentRoute: fullPath })
    }
  }, [location.pathname, routerBase, isQiankun])

  // 处理初始化路由（如果从主应用跳转过来）
  useEffect(() => {
    if (isQiankun) {
      // 检查当前 URL 是否包含子路由
      const currentPath = qiankunWindow.location.pathname
      const basePath = routerBase || '/react'

      // 如果当前路径是 /react/home，需要导航到 /home
      if (currentPath.startsWith(basePath) && currentPath !== basePath) {
        const subPath = currentPath.replace(basePath, '')
        if (subPath && subPath !== location.pathname) {
          navigate(subPath)
        }
      }
    }
  }, [isQiankun, routerBase, navigate, location.pathname])

  function NavLink({ to, children }) {
    // BrowserRouter 中，路径是相对于 basename 的
    const isActive = location.pathname === to || location.pathname === `${to}/`

    return (
      <Link
        to={to}
        className={`nav-item ${isActive ? 'active' : ''}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <div className="sub-app-content">
      <nav className="sub-nav">
        <NavLink to="/home">首页</NavLink>
        <NavLink to="/dashboard">数据看板</NavLink>
        <NavLink to="/products">产品列表</NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/contact">联系我们</NavLink>
      </nav>
      <div className="sub-content">
        <Suspense fallback={
          <div className="loadingContainer">
            <div className="loadingContent">
              <div className="loadingSpinner"></div>
              <p className="loadingText">加载中...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>404 - 页面未找到</h3>
                <p>当前路径: {location.pathname}</p>
                <p>完整路径: {qiankunWindow.location.pathname}</p>
                <p>请检查路由配置</p>
              </div>
            } />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App

