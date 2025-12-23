import React from 'react'
import './Dashboard.css'

function Dashboard() {
  const stats = [
    { label: '总用户数', value: '1,234', icon: '👥' },
    { label: '今日访问', value: '567', icon: '📊' },
    { label: '销售额', value: '¥89,012', icon: '💰' },
    { label: '订单数', value: '234', icon: '📦' }
  ]

  return (
    <div className="dashboard-view">
      <h3>数据看板</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-section">
        <h4>数据趋势</h4>
        <div className="chart-placeholder">
          <p>📈 图表区域（可集成图表库）</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

