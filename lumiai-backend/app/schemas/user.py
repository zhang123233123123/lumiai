"""
LumiAI - 用户相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """用户基础信息"""
    username: str
    email: Optional[str] = None
    target_score: Optional[str] = "7.0"


class UserCreate(UserBase):
    """创建用户请求"""
    pass


class UserResponse(UserBase):
    """用户响应"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """用户登录请求（简化版）"""
    username: str
