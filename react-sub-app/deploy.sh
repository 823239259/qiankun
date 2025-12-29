#!/bin/bash

# React 子应用构建和部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始构建 React 子应用..."

# 检查 Node 版本
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
  echo "❌ 错误: 需要 Node.js 16 或更高版本"
  exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

# 清理旧的构建
if [ -d "dist" ]; then
  echo "🧹 清理旧的构建文件..."
  rm -rf dist
fi

# 构建
echo "🔨 开始构建..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
  echo "❌ 错误: 构建失败，dist 目录不存在"
  exit 1
fi

echo "✅ 构建完成！"
echo ""
echo "📁 构建输出目录: dist/"
echo ""
echo "📋 下一步："
echo "1. 将 dist 目录内容部署到服务器"
echo "2. 更新主应用的 microApps.js 配置"
echo "3. 确保服务器配置正确（参考 BUILD.md）"
echo ""

# 可选：预览构建结果
read -p "是否启动预览服务器？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌐 启动预览服务器..."
  npm run preview
fi

