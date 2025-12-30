#!/bin/bash

# Qiankun 微前端生产部署脚本
# 用法: ./deploy-prod.sh [目标目录]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认部署目录
DEPLOY_DIR="${1:-/var/www/qiankun}"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Qiankun 微前端生产部署${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# 1. 构建主应用
echo -e "${GREEN}[1/4] 构建主应用...${NC}"
npm run build:prod
echo -e "${GREEN}✓ 主应用构建完成${NC}"
echo ""

# 2. 构建 Vue 子应用
echo -e "${GREEN}[2/4] 构建 Vue 子应用...${NC}"
cd vue-sub-app
npm run build:prod
cd ..
echo -e "${GREEN}✓ Vue 子应用构建完成${NC}"
echo ""

# 3. 构建 React 子应用
echo -e "${GREEN}[3/4] 构建 React 子应用...${NC}"
cd react-sub-app
npm run build:prod
cd ..
echo -e "${GREEN}✓ React 子应用构建完成${NC}"
echo ""

# 4. 部署文件
echo -e "${GREEN}[4/4] 部署文件到 ${DEPLOY_DIR}...${NC}"

# 创建目标目录
mkdir -p "${DEPLOY_DIR}/main"
mkdir -p "${DEPLOY_DIR}/vue"
mkdir -p "${DEPLOY_DIR}/react"

# 复制文件
cp -r dist/* "${DEPLOY_DIR}/main/"
cp -r vue-sub-app/dist/* "${DEPLOY_DIR}/vue/"
cp -r react-sub-app/dist/* "${DEPLOY_DIR}/react/"

echo -e "${GREEN}✓ 文件部署完成${NC}"
echo ""

# 显示部署信息
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "部署目录结构："
echo "  ${DEPLOY_DIR}/"
echo "  ├── main/    # 主应用"
echo "  ├── vue/     # Vue 子应用"
echo "  └── react/   # React 子应用"
echo ""
echo "Nginx 配置参考: nginx.conf"
echo ""
echo -e "${YELLOW}下一步：${NC}"
echo "1. 配置 Nginx（参考 nginx.conf）"
echo "2. 重启 Nginx: sudo nginx -s reload"
echo "3. 访问你的域名测试"

