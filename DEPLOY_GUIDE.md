# 🚀 Qiankun 微前端项目部署教程（新手向）

> 本教程假设你使用的是 **Ubuntu 22.04** 系统的云服务器（阿里云/腾讯云/AWS 等）

---

## 📋 目录

1. [准备工作](#1-准备工作)
2. [连接服务器](#2-连接服务器)
3. [安装必要软件](#3-安装必要软件)
4. [上传项目代码](#4-上传项目代码)
5. [构建项目](#5-构建项目)
6. [配置 Nginx](#6-配置-nginx)
7. [配置域名（可选）](#7-配置域名可选)
8. [常见问题](#8-常见问题)

---

## 1. 准备工作

### 你需要准备：
- ✅ 一台云服务器（推荐 2核4G 以上）
- ✅ 服务器的 **公网 IP 地址**
- ✅ 服务器的 **登录密码** 或 **SSH 密钥**
- ✅ （可选）一个域名

### 购买服务器后要做的：
1. 在云服务商控制台，找到 **安全组/防火墙** 设置
2. 开放以下端口：
   - **22** (SSH 登录)
   - **80** (HTTP)
   - **443** (HTTPS)

---

## 2. 连接服务器

### Mac/Linux 用户：
打开终端，输入：
```bash
ssh root@你的服务器IP
```
然后输入密码即可。

### Windows 用户：
1. 下载并安装 [MobaXterm](https://mobaxterm.mobatek.net/) 或 [Termius](https://termius.com/)
2. 新建 SSH 连接，填入 IP 和密码

### 连接成功后你会看到：
```
Welcome to Ubuntu 22.04.3 LTS
root@server:~#
```

---

## 3. 安装必要软件

复制以下命令，逐个执行：

### 3.1 更新系统
```bash
apt update && apt upgrade -y
```

### 3.2 安装 Node.js 18
```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# 安装 Node.js
apt install -y nodejs

# 验证安装
node -v    # 应该显示 v18.x.x
npm -v     # 应该显示 9.x.x 或 10.x.x
```

### 3.3 安装 Nginx
```bash
# 安装 Nginx
apt install -y nginx

# 启动 Nginx
systemctl start nginx
systemctl enable nginx

# 验证 Nginx 运行状态
systemctl status nginx
```

此时访问 `http://你的服务器IP`，应该能看到 Nginx 默认页面！

### 3.4 安装 Git（用于拉取代码）
```bash
apt install -y git
```

---

## 4. 上传项目代码

有两种方式：

### 方式 A：通过 Git（推荐）

如果你的代码在 GitHub/GitLab：
```bash
# 创建项目目录
mkdir -p /var/www
cd /var/www

# 克隆项目（替换为你的仓库地址）
git clone https://github.com/你的用户名/qiankun.git
cd qiankun
```

### 方式 B：直接上传文件

在你的 **本地电脑** 打开终端，执行：
```bash
# 在本地项目目录执行（替换 IP 地址）
scp -r ./* root@你的服务器IP:/var/www/qiankun/
```

或者使用 **FTP 工具**（如 FileZilla）上传。

---

## 5. 构建项目

### 5.1 进入项目目录
```bash
cd /var/www/qiankun
```

### 5.2 安装依赖
```bash
# 安装主应用依赖
npm install

# 安装 Vue 子应用依赖
cd vue-sub-app && npm install && cd ..

# 安装 React 子应用依赖
cd react-sub-app && npm install && cd ..
```

### 5.3 构建生产版本
```bash
npm run build:all:prod
```

等待构建完成，你会看到：
```
✓ built in x.xxs
```

### 5.4 部署到 Nginx 目录
```bash
# 创建部署目录
mkdir -p /var/www/html/main
mkdir -p /var/www/html/vue
mkdir -p /var/www/html/react

# 复制构建产物
cp -r dist/* /var/www/html/main/
cp -r vue-sub-app/dist/* /var/www/html/vue/
cp -r react-sub-app/dist/* /var/www/html/react/
```

---

## 6. 配置 Nginx

### 6.1 创建 Nginx 配置文件
```bash
nano /etc/nginx/sites-available/qiankun
```

### 6.2 粘贴以下配置
按 `Ctrl+Shift+V` 粘贴：

```nginx
server {
    listen 80;
    server_name _;  # 如果有域名，替换为你的域名

    root /var/www/html/main;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Vue 子应用
    location /vue/ {
        alias /var/www/html/vue/;
        try_files $uri $uri/ /vue/index.html;
        add_header Access-Control-Allow-Origin *;
    }

    # React 子应用
    location /react/ {
        alias /var/www/html/react/;
        try_files $uri $uri/ /react/index.html;
        add_header Access-Control-Allow-Origin *;
    }

    # 主应用
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 6.3 保存并退出
按 `Ctrl+O` 保存，按 `Enter` 确认，按 `Ctrl+X` 退出

### 6.4 启用配置
```bash
# 创建软链接
ln -s /etc/nginx/sites-available/qiankun /etc/nginx/sites-enabled/

# 删除默认配置
rm /etc/nginx/sites-enabled/default

# 测试配置是否正确
nginx -t
```

如果看到 `syntax is ok` 和 `test is successful`，说明配置正确！

### 6.5 重启 Nginx
```bash
systemctl restart nginx
```

---

## 🎉 完成！

现在访问 `http://你的服务器IP`，应该能看到你的 Qiankun 应用了！

- 主应用：`http://你的服务器IP/`
- Vue 子应用：`http://你的服务器IP/vue`
- React 子应用：`http://你的服务器IP/react`

---

## 7. 配置域名（可选）

### 7.1 购买域名
在阿里云/腾讯云/Cloudflare 等购买域名

### 7.2 添加 DNS 解析
添加一条 **A 记录**：
- 主机记录：`@` 或 `www`
- 记录值：你的服务器 IP

### 7.3 修改 Nginx 配置
```bash
nano /etc/nginx/sites-available/qiankun
```
将 `server_name _;` 改为 `server_name your-domain.com www.your-domain.com;`

### 7.4 配置 HTTPS（推荐）
```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 自动获取并配置 SSL 证书
certbot --nginx -d your-domain.com -d www.your-domain.com

# 按提示操作即可
```

---

## 8. 常见问题

### Q: 访问页面显示 403 Forbidden
```bash
# 检查文件权限
chmod -R 755 /var/www/html
chown -R www-data:www-data /var/www/html
```

### Q: 子应用加载失败
```bash
# 检查子应用目录是否存在
ls -la /var/www/html/vue
ls -la /var/www/html/react

# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log
```

### Q: 如何更新部署？
```bash
cd /var/www/qiankun
git pull                      # 拉取最新代码
npm run build:all:prod        # 重新构建
cp -r dist/* /var/www/html/main/
cp -r vue-sub-app/dist/* /var/www/html/vue/
cp -r react-sub-app/dist/* /var/www/html/react/
```

### Q: 如何查看 Nginx 日志？
```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

---

## 📞 快速命令参考

```bash
# Nginx 相关
systemctl start nginx     # 启动
systemctl stop nginx      # 停止
systemctl restart nginx   # 重启
systemctl status nginx    # 查看状态
nginx -t                  # 测试配置

# 查看端口占用
netstat -tlnp | grep 80

# 查看磁盘空间
df -h

# 查看内存使用
free -h
```

---

祝你部署顺利！🎉 如有问题随时问我。

