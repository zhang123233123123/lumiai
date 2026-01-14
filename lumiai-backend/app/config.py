"""
LumiAI Backend - 配置管理
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """应用配置"""
    
    # Gemini API
    gemini_api_key: str = ""
    
    # 数据库
    database_url: str = "sqlite:///./lumiai.db"
    
    # 服务器
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS - 允许的前端地址
    cors_origins: list[str] = [
        "http://localhost:5173",  # Vite 默认端口
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """获取缓存的配置实例"""
    return Settings()
