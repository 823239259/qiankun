<template>
  <div class="sub-app" :class="{ 'dark-mode': isDark }">
    <div class="sub-app-header">
      <h2>Vue 子应用</h2>
      <p>这是一个可以123接入 qiankun 主应333用的子应用</p>
      <div class="demo">demo是对方身份</div>
      <img :src="assetListDetailBgN" alt="">
    </div>
    <div class="sub-app-content">
      <nav class="sub-nav">
        <router-link to="/home" class="nav-item">首页</router-link>
        <router-link to="/about" class="nav-item">关于</router-link>
      </nav>
      <div class="sub-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import assetListDetailBgN from '@/assets/imgs/asset-list-detail-bg-n.png'

const route = useRoute()
const isDark = ref(false)

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

.sub-app {
  min-height: 100vh;
  padding: 2rem;
  background-color: #ffffff;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

.sub-app.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.sub-app-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.sub-app.dark-mode .sub-app-header {
  border-bottom-color: #444;
}

.sub-app-header h2 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
}

.sub-app.dark-mode .sub-app-header h2 {
  color: #8b9aff;
}

.sub-app-content {
  display: flex;
  gap: 2rem;
}

.sub-nav {
  min-width: 200px;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  height: fit-content;
}

.sub-app.dark-mode .sub-nav {
  background: #2a2a2a;
}

.nav-item {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.sub-app.dark-mode .nav-item {
  color: #e0e0e0;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.sub-app.dark-mode .nav-item:hover {
  background-color: #3a3a3a;
}

.nav-item.router-link-active {
  background-color: #667eea;
  color: white;
}

.sub-app.dark-mode .nav-item.router-link-active {
  background-color: #8b9aff;
  color: #1a1a1a;
}

.sub-content {
  flex: 1;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sub-app.dark-mode .sub-content {
  background: #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>

