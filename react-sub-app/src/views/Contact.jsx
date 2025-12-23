import React, { useState } from 'react'
import './Contact.css'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('表单提交成功！（这是演示）')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="contact-view">
      <h3>联系我们</h3>
      <div className="contact-content">
        <div className="contact-info">
          <h4>联系方式</h4>
          <div className="info-item">
            <strong>邮箱：</strong>
            <span>contact@example.com</span>
          </div>
          <div className="info-item">
            <strong>电话：</strong>
            <span>400-123-4567</span>
          </div>
          <div className="info-item">
            <strong>地址：</strong>
            <span>北京市朝阳区xxx街道xxx号</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">留言</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
          <button type="submit" className="submit-button">提交</button>
        </form>
      </div>
    </div>
  )
}

export default Contact

