<template>
  <div class="home-view">
    <h3>子应用首页</h3>
    <div class="content-card">
      <p>这是 Vue 子应用的首页内容</p>
      <div class="feature-list">
        <div class="feature-item">
          <h4>✅ 已接入 qiankun</h4>
          <p>子应用已成功接入主应用</p>
        </div>
        <div class="feature-item">
          <h4>🌙 支持暗色模式</h4>
          <p>可以通过主应用切换暗色模式</p>
        </div>
        <div class="feature-item">
          <h4>📡 全局状态同步</h4>
          <p>与主应用共享全局状态</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-view {
  color: inherit;
}

.home-view h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #667eea;
}

.content-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

:deep(.dark-mode) .content-card {
  background: #333;
  border-left-color: #8b9aff;
}

.content-card p {
  margin-bottom: 1.5rem;
  color: #666;
}

:deep(.dark-mode) .content-card p {
  color: #aaa;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  padding: 1rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:deep(.dark-mode) .feature-item {
  background: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.feature-item h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

:deep(.dark-mode) .feature-item h4 {
  color: #e0e0e0;
}

.feature-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

:deep(.dark-mode) .feature-item p {
  color: #aaa;
}
</style>

