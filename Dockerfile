# Qiankun 微前端 Docker 部署
# 多阶段构建：构建 + 运行

# ========== 构建阶段 ==========
FROM node:18-alpine AS builder

# 设置国内镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

# 复制 package.json 文件
COPY package*.json ./
COPY vue-sub-app/package*.json ./vue-sub-app/
COPY react-sub-app/package*.json ./react-sub-app/

# 安装依赖（使用 npm install 而不是 npm ci，更兼容）
RUN npm install

# 安装子应用依赖
WORKDIR /app/vue-sub-app
RUN npm install

WORKDIR /app/react-sub-app
RUN npm install

# 回到主目录
WORKDIR /app

# 复制源代码
COPY . .

# 构建所有应用（生产模式）
RUN npm run build:all:prod

# ========== 运行阶段 ==========
FROM nginx:alpine AS runner

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制 nginx 配置
COPY nginx.docker.conf /etc/nginx/conf.d/qiankun.conf

# 复制构建产物
# 主应用 -> /frame
COPY --from=builder /app/dist /usr/share/nginx/html/frame
# Vue 子应用 -> /vue
COPY --from=builder /app/vue-sub-app/dist /usr/share/nginx/html/vue
# React 子应用 -> /react
COPY --from=builder /app/react-sub-app/dist /usr/share/nginx/html/react

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
