import React from 'react'
import './Products.css'

function Products() {
  const products = [
    { id: 1, name: '产品 A', price: '¥99', description: '这是一个优秀的产品' },
    { id: 2, name: '产品 B', price: '¥199', description: '功能强大的产品' },
    { id: 3, name: '产品 C', price: '¥299', description: '高端产品选择' }
  ]

  return (
    <div className="products-view">
      <h3>产品列表</h3>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
            <button className="product-button">查看详情</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products

