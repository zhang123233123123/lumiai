# LumiAI IELTS 部署指南

## 服务器信息

| 项目 | 值 |
|------|-----|
| 主机名 | ubuntu-s-1vcpu-1gb-sgp1-01 |
| 公网 IP | 152.42.172.247 |
| 内网 IP | 10.15.0.5、10.104.0.2 |
| 云服务商 | DigitalOcean (新加坡) |

---

## 方式一：自动部署（推荐）

### 步骤 1：本地上传项目

在你的 Mac 上运行：

```bash
cd "/Users/zhangzhanghongjian/Downloads/lumina-ielts (1)/deploy"
chmod +x upload.sh
./upload.sh
```

### 步骤 2：服务器上运行部署脚本

```bash
# SSH 登录服务器
ssh root@152.42.172.247

# 运行部署脚本
cd /var/www/lumina-ielts/deploy
chmod +x deploy.sh
./deploy.sh
```

### 步骤 3：配置 API Keys

```bash
# 编辑后端环境变量
nano /var/www/lumina-ielts/backend/.env
# 填入 DEEPSEEK_API_KEY=sk-xxx

# 编辑前端环境变量
nano /var/www/lumina-ielts/frontend/.env.production
# 填入 GEMINI_API_KEY=xxx

# 重新构建前端
cd /var/www/lumina-ielts/frontend
npm run build

# 重启后端服务
sudo systemctl restart lumina-backend
```

---

## 方式二：手动部署

### 1. 登录服务器

```bash
ssh root@152.42.172.247
```

### 2. 安装依赖

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git curl

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3. 创建项目目录并上传文件

```bash
sudo mkdir -p /var/www/lumina-ielts
sudo chown -R $USER:$USER /var/www/lumina-ielts

# 在本地使用 rsync 或 scp 上传
# rsync -avz --exclude 'node_modules' --exclude 'venv' ./ root@152.42.172.247:/var/www/lumina-ielts/
```

### 4. 配置后端

```bash
cd /var/www/lumina-ielts/backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# 创建环境变量文件
cat > .env << 'EOF'
DEEPSEEK_API_KEY=your_key_here
DATABASE_URL=sqlite:///./lumiai.db
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=["http://152.42.172.247","https://your-domain.com"]
EOF

deactivate
```

### 5. 配置前端

```bash
cd /var/www/lumina-ielts/frontend

# 创建生产环境配置
cat > .env.production << 'EOF'
VITE_API_URL=http://152.42.172.247:8000
GEMINI_API_KEY=your_gemini_key_here
EOF

# 安装依赖并构建
npm install
npm run build
```

### 6. 创建 Systemd 服务

```bash
sudo tee /etc/systemd/system/lumina-backend.service > /dev/null << 'EOF'
[Unit]
Description=LumiAI IELTS Backend
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/var/www/lumina-ielts/backend
Environment="PATH=/var/www/lumina-ielts/backend/venv/bin"
ExecStart=/var/www/lumina-ielts/backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable lumina-backend
sudo systemctl start lumina-backend
```

### 7. 配置 Nginx

```bash
sudo tee /etc/nginx/sites-available/lumina-ielts > /dev/null << 'EOF'
server {
    listen 80;
    server_name 152.42.172.247;
    
    root /var/www/lumina-ielts/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
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
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/lumina-ielts /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 8. 配置防火墙

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

## 配置 HTTPS（可选但推荐）

如果你有域名，可以配置免费的 Let's Encrypt SSL 证书：

```bash
# 1. 将域名 DNS 指向 152.42.172.247

# 2. 修改 Nginx 配置中的 server_name
sudo nano /etc/nginx/sites-available/lumina-ielts
# 将 server_name 152.42.172.247; 改为 server_name your-domain.com;

# 3. 申请 SSL 证书
sudo certbot --nginx -d your-domain.com

# 4. 自动续期测试
sudo certbot renew --dry-run
```

---

## 常用管理命令

```bash
# 查看后端状态
sudo systemctl status lumina-backend

# 查看后端日志
sudo journalctl -u lumina-backend -f

# 重启后端
sudo systemctl restart lumina-backend

# 停止后端
sudo systemctl stop lumina-backend

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 更新部署

当代码有更新时：

```bash
# 1. 在本地重新上传
./deploy/upload.sh

# 2. 在服务器上更新
ssh root@152.42.172.247

# 更新后端
cd /var/www/lumina-ielts/backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
sudo systemctl restart lumina-backend

# 更新前端
cd /var/www/lumina-ielts/frontend
npm install
npm run build
```

---

## 故障排查

### 后端无法启动

```bash
# 查看详细错误
sudo journalctl -u lumina-backend -n 50

# 手动测试启动
cd /var/www/lumina-ielts/backend
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 前端页面空白

```bash
# 检查构建是否成功
ls -la /var/www/lumina-ielts/frontend/dist

# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### API 调用失败

```bash
# 测试后端是否运行
curl http://localhost:8000/api/health

# 检查 CORS 配置
cat /var/www/lumina-ielts/backend/.env
```

---

## 访问地址

部署完成后：

- **前端**: http://152.42.172.247
- **后端 API**: http://152.42.172.247/api
- **API 文档**: http://152.42.172.247/api/docs
