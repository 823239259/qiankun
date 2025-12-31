#!/bin/bash

# ============================================
# Qiankun Docker 一键部署脚本
# ============================================

set -e  # 遇到错误立即退出

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/deploy.config"

# 检查配置文件是否存在
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ 错误: 配置文件不存在: $CONFIG_FILE"
    echo ""
    echo "请创建配置文件，内容如下："
    echo "----------------------------------------"
    echo "SERVER_IP=你的服务器IP"
    echo "SERVER_USER=root"
    echo "SERVER_PATH=/www/wwwroot/qiankun-docker"
    echo "----------------------------------------"
    exit 1
fi

# 读取配置文件
source "$CONFIG_FILE"

# 验证必要配置
if [ -z "$SERVER_IP" ] || [ -z "$SERVER_USER" ] || [ -z "$SERVER_PATH" ]; then
    echo "❌ 错误: 配置文件缺少必要参数"
    exit 1
fi

ZIP_NAME="qiankun-source.zip"

echo ""
echo "🚀 ========================================"
echo "   Qiankun Docker 一键部署"
echo "========================================"
echo ""

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

