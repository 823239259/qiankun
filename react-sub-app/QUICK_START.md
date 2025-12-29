# 路由问题快速解决指南

## 快速选择方案

### 🚀 最快解决：方案一（HashRouter）

**适用场景**：需要快速解决问题，不介意 URL 中有 `#`

**操作步骤**：
```bash
# 1. 备份当前文件
cp src/App.jsx src/App.jsx.backup

# 2. 使用方案一
cp src/App.solution1.jsx src/App.jsx

# 3. 重启开发服务器
npm run dev
```

**优点**：实现最简单，兼容性最好
**缺点**：URL 中有 `#` 符号

---

### ⭐ 推荐方案：方案二（改进 BrowserRouter）

**适用场景**：需要友好的 URL，支持浏览器前进后退

**操作步骤**：
```bash
# 1. 备份当前文件
cp src/App.jsx src/App.jsx.backup

# 2. 使用方案二
cp src/App.solution2.jsx src/App.jsx

# 3. 重启开发服务器
npm run dev
```

**优点**：URL 友好，功能完整
**缺点**：需要正确配置 basename

---

## 方案对比表

| 方案 | 实现难度 | URL 友好度 | 兼容性 | 推荐度 |
|------|---------|-----------|--------|--------|
| 方案一：HashRouter | ⭐ 简单 | ⭐⭐ 一般 | ⭐⭐⭐⭐⭐ 最好 | ⭐⭐⭐⭐ |
| 方案二：BrowserRouter | ⭐⭐ 中等 | ⭐⭐⭐⭐⭐ 最好 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐⭐⭐ |
| 方案三：MemoryRouter | ⭐⭐ 中等 | ⭐ 差 | ⭐⭐⭐ 一般 | ⭐⭐ |
| 方案四：自定义同步 | ⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ 好 | ⭐⭐⭐ 一般 | ⭐⭐⭐ |

---

## 常见路由问题

### 问题 1：路由不跳转

**可能原因**：
- basename 配置错误
- 路由路径不匹配

**解决方法**：
1. 检查 `basename` 是否正确
2. 查看浏览器控制台的路由日志
3. 尝试使用方案一（HashRouter）

### 问题 2：URL 路径重复

**可能原因**：
- basename 包含在路由路径中
- 导航链接路径错误

**解决方法**：
1. 确保导航链接路径不包含 basename
2. 检查路由配置

### 问题 3：刷新后路由丢失

**可能原因**：
- BrowserRouter 配置问题
- qiankun 路由同步问题

**解决方法**：
1. 使用方案二（改进 BrowserRouter）
2. 检查主应用路由配置

---

## 测试检查清单

- [ ] 独立运行时路由正常
- [ ] qiankun 环境中路由正常
- [ ] 导航链接可以正常跳转
- [ ] 浏览器前进后退正常工作（BrowserRouter）
- [ ] 刷新页面后路由状态保持
- [ ] 404 页面正常显示
- [ ] 路由参数传递正常

---

## 需要帮助？

如果以上方案都无法解决问题，请检查：

1. **主应用配置**：`src/microApps.js` 中的 `activeRule` 和 `routerBase`
2. **qiankun 配置**：`src/main.js` 中的 `sandbox` 配置
3. **浏览器控制台**：查看是否有路由相关的错误信息

更多详细信息请参考 `ROUTING_SOLUTIONS.md` 文件。

