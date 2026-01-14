#!/bin/bash
# ============================================
# 本地上传脚本 - 在你的 Mac 上运行
# ============================================

SERVER_IP="152.42.172.247"
SERVER_USER="root"  # 或你的用户名
PROJECT_DIR="/var/www/lumina-ielts"

echo "🚀 上传项目到服务器..."

# 获取脚本所在目录的上级目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "本地项目目录: $LOCAL_PROJECT_DIR"

# 创建服务器目录
ssh $SERVER_USER@$SERVER_IP "sudo mkdir -p $PROJECT_DIR && sudo chown -R \$USER:\$USER $PROJECT_DIR"

# 上传项目文件（排除 node_modules, venv, __pycache__ 等）
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude 'venv' \
    --exclude '__pycache__' \
    --exclude '.git' \
    --exclude '*.pyc' \
    --exclude '.env' \
    --exclude 'dist' \
    --exclude '*.db' \
    "$LOCAL_PROJECT_DIR/" \
    "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/"

echo "✅ 上传完成！"
echo ""
echo "下一步："
echo "1. SSH 登录服务器: ssh $SERVER_USER@$SERVER_IP"
echo "2. 运行部署脚本: cd $PROJECT_DIR/deploy && chmod +x deploy.sh && ./deploy.sh"
