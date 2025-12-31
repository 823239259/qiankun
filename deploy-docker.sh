#!/bin/bash

# ============================================
# Qiankun Docker 一键部署脚本
# ============================================

set -e  # 遇到错误立即退出

# ========== 配置区域（根据你的服务器修改）==========
SERVER_IP="47.109.85.54"
SERVER_USER="root"
SERVER_PATH="/www/wwwroot/qiankun-docker"
ZIP_NAME="qiankun-source.zip"
# ==================================================

echo ""
echo "🚀 ========================================"
echo "   Qiankun Docker 一键部署"
echo "========================================"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# 第 1 步：打包源码
echo "📦 步骤 1/4: 打包源码..."
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" . \
    -x "node_modules/*" \
    -x "vue-sub-app/node_modules/*" \
    -x "react-sub-app/node_modules/*" \
    -x ".git/*" \
    -x "dist/*" \
    -x "vue-sub-app/dist/*" \
    -x "react-sub-app/dist/*" \
    -x "*.zip" \
    -x ".DS_Store" \
    -x "**/.DS_Store"
echo "✅ 打包完成: $ZIP_NAME"
echo ""

# 第 2 步：上传到服务器
echo "📤 步骤 2/4: 上传到服务器..."
scp "$ZIP_NAME" "${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/"
echo "✅ 上传完成"
echo ""

# 第 3 步：远程执行部署
echo "🔧 步骤 3/4: 远程部署中..."
ssh "${SERVER_USER}@${SERVER_IP}" << 'REMOTE_SCRIPT'
cd /www/wwwroot/qiankun-docker

echo "  → 解压文件..."
unzip -o qiankun-source.zip -d temp_extract
cp -rf temp_extract/* .
rm -rf temp_extract qiankun-source.zip

echo "  → 停止旧容器..."
docker-compose down 2>/dev/null || true

echo "  → 构建新镜像..."
docker-compose build --no-cache

echo "  → 启动容器..."
docker-compose up -d

echo "  → 清理旧镜像..."
docker image prune -f 2>/dev/null || true
REMOTE_SCRIPT
echo "✅ 部署完成"
echo ""

# 第 4 步：清理本地打包文件
echo "🧹 步骤 4/4: 清理本地临时文件..."
rm -f "$ZIP_NAME"
echo "✅ 清理完成"
echo ""

# 完成
echo "🎉 ========================================"
echo "   部署成功！"
echo "========================================"
echo ""
echo "📌 访问地址："
echo "   主应用: http://${SERVER_IP}/frame/"
echo "   Vue:    http://${SERVER_IP}/vue/"
echo "   React:  http://${SERVER_IP}/react/"
echo ""

