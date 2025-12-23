import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './views/Home'
import About from './views/About'
import Products from './views/Products'
import Contact from './views/Contact'
import Dashboard from './views/Dashboard'
import './App.css'

function App({ routerBase }) {
  const [isDark, setIsDark] = useState(false)

  // 根据是否在 qiankun 环境中动态设置 basename
  const isQiankun = window.__POWERED_BY_QIANKUN__
  const basename = isQiankun ? (routerBase || '/react') : '/'

  // 检查主题
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()

    // 监听主题变化
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
        <NavContent />
      </BrowserRouter>
    </div>
  )
}

// 导航内容组件，需要在 BrowserRouter 内部使用 useLocation
function NavContent() {
  const location = useLocation()


  // 导航链接组件，用于高亮当前路由
  function NavLink({ to, children }) {
    const isActive = location.pathname === to || location.pathname === `${to}`

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
              <p>请检查路由配置</p>
            </div>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
