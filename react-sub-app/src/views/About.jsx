import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-view">
      <h3>关于子应用</h3>
      <div className="info-section">
        <h4>技术栈</h4>
        <ul>
          <li>React 18</li>
          <li>Vite</li>
          <li>React Router</li>
          <li>Qiankun</li>
        </ul>
      </div>
      <div className="info-section">
        <h4>功能特性</h4>
        <ul>
          <li>✅ 独立运行和集成运行双模式</li>
          <li>✅ 支持暗色模式切换</li>
          <li>✅ 全局状态同步</li>
          <li>✅ 路由隔离</li>
        </ul>
      </div>
    </div>
  )
}

export default About

