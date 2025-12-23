import React from 'react'
import './Home.css'

function Home() {
  console.log('[react-sub-app] Home 组件渲染')

  return (
    <div className="home-view">
      <h3>子应用首页</h3>
      <div className="content-card">
        <p>这是 React 子应用的首页内容</p>
        <div className="feature-list">
          <div className="feature-item">
            <h4>✅ 已接入 qiankun</h4>
            <p>子应用已成功接入主应用</p>
          </div>
          <div className="feature-item">
            <h4>🌙 支持暗色模式</h4>
            <p>可以通过主应用切换暗色模式</p>
          </div>
          <div className="feature-item">
            <h4>📡 全局状态同步</h4>
            <p>与主应用共享全局状态</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

