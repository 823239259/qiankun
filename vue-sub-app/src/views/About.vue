<template>
  <div class="about-view">
    <h3>关于子应用</h3>
    <div class="info-section">
      <h4>技术栈</h4>
      <ul>
        <li>Vue 3</li>
        <li>Vite</li>
        <li>Vue Router</li>
        <li>Qiankun</li>
      </ul>
    </div>
    <div class="info-section">
      <h4>功能特性</h4>
      <ul>
        <li>✅ 独立运行和集成运行双模式</li>
        <li>✅ 支持暗色模式切换</li>
        <li>✅ 全局状态同步</li>
        <li>✅ 路由隔离</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-view {
  color: inherit;
}

.about-view h3 {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #667eea;
}

:deep(.dark-mode) .about-view h3 {
  color: #8b9aff;
}

.info-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

:deep(.dark-mode) .info-section {
  background: #333;
}

.info-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

:deep(.dark-mode) .info-section h4 {
  color: #e0e0e0;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
}

:deep(.dark-mode) .info-section ul {
  color: #aaa;
}

.info-section li {
  margin-bottom: 0.5rem;
}
</style>

