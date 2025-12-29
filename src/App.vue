<template>
  <div class="main-app" :class="{ 'dark-mode': isDark }">
    <header class="main-header">
      <div class="header-content">
        <h1>Qiankun 主应用</h1>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>
      <nav class="main-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/vue/home" class="nav-link">Vue 子应用</router-link>
        <router-link to="/react/home" class="nav-link">React 子应用</router-link>
        <router-link to="/react/contact" class="nav-link">React 子应用 contact</router-link>

      </nav>
    </header>
    <main class="main-content">
      <div v-if="!isMicroApp" class="home-page">
        <h2>欢迎使用 Qiankun 微前端框架</h2>
        <p>这是一个基于 Vue 3 + Vite 构建的主应用</p>
        <div class="info-card">
          <h3>功能特性</h3>
          <ul>
            <li>✅ 支持多个微应用同时运行</li>
            <li>✅ 样式隔离和 JS 沙箱</li>
            <li>✅ 全局状态管理</li>
            <li>✅ 应用间通信</li>
          </ul>
        </div>
      </div>
      <!-- 微应用挂载容器 -->
      <div id="subapp-viewport" class="subapp-container"></div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isDark = ref(false)

// 判断当前是否在微应用路由下
const isMicroApp = computed(() => {
  return route.path.startsWith('/vue') || route.path.startsWith('/react')
})

// 切换主题
const toggleTheme = () => {
  const newTheme = isDark.value ? 'light' : 'dark'
  isDark.value = !isDark.value

  // 更新全局状态
  if (window.__QIANKUN_ACTIONS__) {
    window.__QIANKUN_ACTIONS__.setGlobalState({ theme: newTheme })
  }

  // 保存到本地存储
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
}

// 检查主题
const checkTheme = () => {
  const theme = document.documentElement.getAttribute('data-theme')
  isDark.value = theme === 'dark'
}

// 监听主题变化
const observer = new MutationObserver(() => {
  checkTheme()
})

onMounted(() => {
  checkTheme()
  // 监听 data-theme 属性变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
})
</script>

<style scoped>
.main-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.main-app.dark-mode .main-header {
  background: linear-gradient(135deg, #2a2a3a 0%, #1a1a2a 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.main-header h1 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}

.main-app.dark-mode .main-content {
  background-color: #1a1a1a;
}

.home-page {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.main-app.dark-mode .home-page {
  background: #2a2a2a;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.home-page h2 {
  color: #333;
  margin-bottom: 1rem;
  transition: color 0.3s;
}

.main-app.dark-mode .home-page h2 {
  color: #e0e0e0;
}

.home-page p {
  color: #666;
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.main-app.dark-mode .home-page p {
  color: #aaa;
}

.info-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #667eea;
  transition: all 0.3s;
}

.main-app.dark-mode .info-card {
  background: #333;
  border-left-color: #8b9aff;
}

.info-card h3 {
  margin-top: 0;
  color: #333;
  transition: color 0.3s;
}

.main-app.dark-mode .info-card h3 {
  color: #e0e0e0;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 0.5rem 0;
  color: #555;
  transition: color 0.3s;
}

.main-app.dark-mode .info-card li {
  color: #aaa;
}

.subapp-container {
  min-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.main-app.dark-mode .subapp-container {
  background: #2a2a2a;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

[data-theme="dark"] body {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

#app {
  min-height: 100vh;
}
</style>

