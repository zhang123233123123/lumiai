"""
LumiAI Backend - FastAPI 应用入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.database import init_db
from app.routers import auth, questions, practice, analysis, vocabulary, chat
from app.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时：初始化数据库并填充示例数据
    init_db()
    seed_database()
    yield
    # 关闭时：清理资源（如需要）


# 创建 FastAPI 应用
app = FastAPI(
    title="LumiAI Backend",
    description="雅思学习辅助产品后端 API",
    version="1.0.0",
    lifespan=lifespan
)

# 配置 CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(questions.router, prefix="/api/questions", tags=["题库"])
app.include_router(practice.router, prefix="/api/practice", tags=["练习"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["分析"])
app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["生词本"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI对话"])


@app.get("/api/health")
async def health_check():
    """健康检查接口"""
    return {"status": "ok", "message": "LumiAI Backend is running"}


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": "LumiAI Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }
