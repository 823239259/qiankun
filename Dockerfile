# Qiankun 微前端 Docker 部署
# 多阶段构建：构建 + 运行

# ========== 构建阶段 ==========
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 lock 文件
COPY package*.json pnpm-lock.yaml* ./
COPY vue-sub-app/package*.json vue-sub-app/pnpm-lock.yaml* ./vue-sub-app/
COPY react-sub-app/package*.json react-sub-app/pnpm-lock.yaml* ./react-sub-app/

# 安装依赖
RUN pnpm install --frozen-lockfile || npm ci
RUN cd vue-sub-app && (pnpm install --frozen-lockfile || npm ci)
RUN cd react-sub-app && (pnpm install --frozen-lockfile || npm ci)

# 复制源代码
COPY . .

# 构建所有应用
RUN npm run build:all:prod

# ========== 运行阶段 ==========
FROM nginx:alpine AS runner

# 复制 nginx 配置
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/vue-sub-app/dist /usr/share/nginx/html/vue
COPY --from=builder /app/react-sub-app/dist /usr/share/nginx/html/react

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

