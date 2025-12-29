# Node.js 版本管理指南

## 当前配置

- **当前版本**: v20.19.5
- **默认版本**: v20.19.5
- **版本管理工具**: nvm

## 常用命令

### 查看已安装的版本
```bash
nvm list
# 或
nvm ls
```

### 查看所有可用版本
```bash
nvm ls-remote
```

### 安装 Node.js 20（如果未安装）
```bash
nvm install 20
# 或安装最新 LTS 版本
nvm install --lts
```

### 切换到 Node.js 20
```bash
nvm use 20
```

### 设置 Node.js 20 为默认版本
```bash
nvm alias default 20
```

### 查看当前使用的版本
```bash
node -v
nvm current
```

## 确保新终端窗口使用 Node.js 20

如果新打开的终端窗口没有自动使用 Node.js 20，请检查你的 shell 配置文件：

### 对于 zsh（macOS 默认）
编辑 `~/.zshrc`，确保包含：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 对于 bash
编辑 `~/.bashrc` 或 `~/.bash_profile`，确保包含：
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

然后重新加载配置：
```bash
source ~/.zshrc  # 对于 zsh
# 或
source ~/.bashrc  # 对于 bash
```

## 项目特定版本

如果项目需要特定版本，可以在项目根目录创建 `.nvmrc` 文件：

```bash
echo "20" > .nvmrc
```

然后在项目目录中运行：
```bash
nvm use
```

## 验证

运行以下命令验证配置：
```bash
node -v    # 应该显示 v20.x.x
npm -v     # 应该显示对应的 npm 版本
nvm current # 应该显示 v20.19.5
```

## 故障排除

### 问题：新终端窗口仍使用旧版本

**解决**：
1. 检查 shell 配置文件是否正确加载了 nvm
2. 运行 `source ~/.zshrc` 或 `source ~/.bashrc`
3. 确认 `nvm alias default 20` 已执行

### 问题：找不到 nvm 命令

**解决**：
1. 检查 `~/.nvm` 目录是否存在
2. 检查 shell 配置文件是否正确配置
3. 重新安装 nvm（如果需要）

## 其他版本管理工具

如果你使用的是其他版本管理工具：

### fnm (Fast Node Manager)
```bash
fnm use 20
fnm default 20
```

### n (Node.js 版本管理)
```bash
n 20
```

### volta
```bash
volta install node@20
volta pin node@20
```

