# LumiAI Backend

雅思学习辅助产品后端 API 服务

## 技术栈

- **框架**: FastAPI
- **数据库**: SQLite + SQLAlchemy
- **AI**: DeepSeek API
- **验证**: Pydantic

## 快速开始

### 1. 安装依赖

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并填入你的 DeepSeek API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
DEEPSEEK_API_KEY=你的API密钥
```

### 3. 启动服务

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

服务启动后访问：
- API 文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/api/health

## API 概览

| 模块 | 路径 | 说明 |
|-----|-----|-----|
| 认证 | `/api/auth/*` | 用户登录/注册（Demo 模式） |
| 题库 | `/api/questions/*` | 获取/筛选题目 |
| 练习 | `/api/practice/*` | 练习会话管理 |
| 分析 | `/api/analysis/*` | 错题分析/技能评估 |
| 生词 | `/api/vocabulary/*` | 生词本管理 |
| 对话 | `/api/chat/*` | AI 导师对话 |
| 前端聚合 | `/api/ui/*` | 新前端页面所需的聚合数据 |

## 项目结构

```
backend/
├── app/
│   ├── main.py           # 应用入口
│   ├── config.py         # 配置管理
│   ├── database.py       # 数据库配置
│   ├── seed_data.py      # 示例数据
│   ├── models/           # 数据模型
│   ├── schemas/          # API 数据验证
│   ├── routers/          # API 路由
│   └── services/         # 业务逻辑
├── requirements.txt
├── .env.example
└── README.md
```

## 前端对接

### 更新前端 API 调用

将前端的 `services/geminiService.ts` 中的直接 API 调用改为调用后端接口：

```typescript
// 原来：直接调用第三方 AI API
// 现在：调用后端 /api/chat 接口

const BACKEND_URL = 'http://localhost:8000';

export const sendMessage = async (message: string): Promise<string> => {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  return data.response;
};
```

## 注意事项

1. **API Key 安全**：请勿将 `.env` 文件提交到版本控制
2. **Demo 模式**：当前使用简化的用户认证，生产环境需加强
3. **数据库**：SQLite 文件会在首次启动时自动创建
