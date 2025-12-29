#!/bin/bash

# qiankun 微前端一键构建和部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始构建 qiankun 微前端应用..."

# 检查 Node 版本
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
  echo "❌ 错误: 需要 Node.js 16 或更高版本"
  exit 1
fi

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 构建主应用
echo -e "${BLUE}📦 构建主应用...${NC}"
if [ ! -d "node_modules" ]; then
  echo "安装主应用依赖..."
  npm install
fi

if [ -d "dist" ]; then
  echo "清理旧的构建文件..."
  rm -rf dist
fi

npm run build
echo -e "${GREEN}✅ 主应用构建完成${NC}"

# 2. 构建 Vue 子应用
echo -e "${BLUE}📦 构建 Vue 子应用...${NC}"
cd vue-sub-app

if [ ! -d "node_modules" ]; then
  echo "安装 Vue 子应用依赖..."
  npm install
fi

if [ -d "dist" ]; then
  echo "清理旧的构建文件..."
  rm -rf dist
fi

npm run build
echo -e "${GREEN}✅ Vue 子应用构建完成${NC}"

cd ..

# 3. 构建 React 子应用
echo -e "${BLUE}📦 构建 React 子应用...${NC}"
cd react-sub-app

if [ ! -d "node_modules" ]; then
  echo "安装 React 子应用依赖..."
  npm install
fi

if [ -d "dist" ]; then
  echo "清理旧的构建文件..."
  rm -rf dist
fi

npm run build
echo -e "${GREEN}✅ React 子应用构建完成${NC}"

cd ..

# 4. 构建总结
echo ""
echo -e "${GREEN}🎉 所有应用构建完成！${NC}"
echo ""
echo "📁 构建输出："
echo "  - 主应用: ./dist/"
echo "  - Vue 子应用: ./vue-sub-app/dist/"
echo "  - React 子应用: ./react-sub-app/dist/"
echo ""
echo -e "${YELLOW}📋 下一步：${NC}"
echo "1. 检查构建输出目录"
echo "2. 根据部署方案更新 src/microApps.js 配置"
echo "3. 如果修改了配置，重新构建主应用: npm run build"
echo "4. 部署到服务器（参考 BUILD.md）"
echo ""

# 可选：预览
read -p "是否启动预览服务器？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${BLUE}🌐 启动预览服务器...${NC}"
  echo ""
  echo "应用地址："
  echo "  - 主应用:    http://localhost:7777"
  echo "  - Vue 子应用:  http://localhost:5555"
  echo "  - React 子应用: http://localhost:8082"
  echo ""
  echo -e "${YELLOW}按 Ctrl+C 停止所有预览服务器${NC}"
  echo ""

  # 使用 concurrently 同时启动所有预览服务器
  npx concurrently \
    --names "主应用,Vue子应用,React子应用" \
    --prefix-colors "blue,green,yellow" \
    --prefix "{name}" \
    --kill-others-on-fail \
    "npm run preview" \
    "cd vue-sub-app && npm run preview" \
    "cd react-sub-app && npm run preview"
fi

