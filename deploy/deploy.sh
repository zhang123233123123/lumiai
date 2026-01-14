#!/bin/bash
# ============================================
# LumiAI IELTS 一键部署脚本
# 服务器: 152.42.172.247 (DigitalOcean SGP1)
# ============================================

set -e

echo "🚀 开始部署 LumiAI IELTS..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ============================================
# 1. 系统更新和依赖安装
# ============================================
echo -e "${GREEN}[1/7] 更新系统并安装依赖...${NC}"

sudo apt update && sudo apt upgrade -y
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    curl

# 安装更新版本的 Node.js (如需要)
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | sed 's/v//') -lt 18 ]; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# ============================================
# 2. 创建项目目录
# ============================================
echo -e "${GREEN}[2/7] 创建项目目录...${NC}"

PROJECT_DIR="/var/www/lumina-ielts"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# ============================================
# 3. 部署后端
# ============================================
echo -e "${GREEN}[3/7] 部署后端...${NC}"

cd $PROJECT_DIR

# 如果是从本地上传，跳过 git clone
if [ -d "backend" ]; then
    echo "后端目录已存在"
else
    echo "请先上传项目文件到 $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR/backend

# 创建 Python 虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# 创建 .env 文件（如果不存在）
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}创建 .env 配置文件...${NC}"
    cat > .env << 'EOF'
# DeepSeek API Key
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 数据库
DATABASE_URL=sqlite:///./lumiai.db

# 服务器配置
HOST=0.0.0.0
PORT=8000

# CORS 配置 - 添加你的域名
CORS_ORIGINS=["http://localhost:3000","http://152.42.172.247","http://152.42.172.247:3000","https://your-domain.com"]
EOF
    echo -e "${YELLOW}⚠️ 请编辑 $PROJECT_DIR/backend/.env 文件，填入真实的 API Key${NC}"
fi

deactivate

# ============================================
# 4. 部署前端
# ============================================
echo -e "${GREEN}[4/7] 部署前端...${NC}"

cd $PROJECT_DIR/frontend

# 创建生产环境配置
cat > .env.production << 'EOF'
VITE_API_URL=http://152.42.172.247:8000
GEMINI_API_KEY=your_gemini_api_key_here
EOF

# 安装依赖并构建
npm install
npm run build

# ============================================
# 5. 配置 Systemd 服务
# ============================================
echo -e "${GREEN}[5/7] 配置 Systemd 服务...${NC}"

# 后端服务
sudo tee /etc/systemd/system/lumina-backend.service > /dev/null << EOF
[Unit]
Description=LumiAI IELTS Backend
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=$PROJECT_DIR/backend
Environment="PATH=$PROJECT_DIR/backend/venv/bin"
ExecStart=$PROJECT_DIR/backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable lumina-backend
sudo systemctl start lumina-backend

# ============================================
# 6. 配置 Nginx
# ============================================
echo -e "${GREEN}[6/7] 配置 Nginx...${NC}"

sudo tee /etc/nginx/sites-available/lumina-ielts > /dev/null << 'EOF'
server {
    listen 80;
    server_name 152.42.172.247;
    
    # 前端静态文件
    root /var/www/lumina-ielts/frontend/dist;
    index index.html;
    
    # 前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 启用站点
sudo ln -sf /etc/nginx/sites-available/lumina-ielts /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 测试并重启 Nginx
sudo nginx -t
sudo systemctl restart nginx

# ============================================
# 7. 配置防火墙
# ============================================
echo -e "${GREEN}[7/7] 配置防火墙...${NC}"

sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# ============================================
# 完成
# ============================================
echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📋 访问地址:"
echo "   前端: http://152.42.172.247"
echo "   后端 API: http://152.42.172.247/api"
echo ""
echo "📋 管理命令:"
echo "   查看后端状态: sudo systemctl status lumina-backend"
echo "   查看后端日志: sudo journalctl -u lumina-backend -f"
echo "   重启后端: sudo systemctl restart lumina-backend"
echo "   重启 Nginx: sudo systemctl restart nginx"
echo ""
echo -e "${YELLOW}⚠️ 重要提醒:${NC}"
echo "   1. 编辑 $PROJECT_DIR/backend/.env 填入 DEEPSEEK_API_KEY"
echo "   2. 编辑 $PROJECT_DIR/frontend/.env.production 填入 GEMINI_API_KEY"
echo "   3. 修改后重新构建前端: cd $PROJECT_DIR/frontend && npm run build"
echo "   4. 重启后端服务: sudo systemctl restart lumina-backend"
