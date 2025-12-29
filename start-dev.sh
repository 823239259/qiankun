#!/bin/bash

# 开发环境启动脚本 - 同时启动主应用和所有子应用

set -e  # 遇到错误立即退出

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 启动 qiankun 微前端开发环境...${NC}"
echo ""

# 检查 Node 版本
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 16 ]; then
  echo -e "${RED}❌ 错误: 需要 Node.js 16 或更高版本${NC}"
  exit 1
fi

# 检查依赖是否已安装
check_dependencies() {
  local dir=$1
  local name=$2

  if [ ! -d "$dir/node_modules" ]; then
    echo -e "${YELLOW}📦 安装 $name 依赖...${NC}"
    cd "$dir"
    npm install
    cd ..
  fi
}

# 检查并安装依赖
check_dependencies "." "主应用"
check_dependencies "vue-sub-app" "Vue 子应用"
check_dependencies "react-sub-app" "React 子应用"

echo ""
echo -e "${GREEN}✅ 依赖检查完成${NC}"
echo ""
echo -e "${BLUE}🌐 启动开发服务器...${NC}"
echo ""
echo "应用地址："
echo "  - 主应用:    http://localhost:7777"
echo "  - Vue 子应用:  http://localhost:5555"
echo "  - React 子应用: http://localhost:8082"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
echo ""

# 使用 concurrently 同时启动所有应用
npx concurrently \
  --names "主应用,Vue子应用,React子应用" \
  --prefix-colors "blue,green,yellow" \
  --prefix "{name}" \
  --kill-others-on-fail \
  "npm run dev" \
  "cd vue-sub-app && npm run dev" \
  "cd react-sub-app && npm run dev"

