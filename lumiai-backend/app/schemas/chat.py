"""
LumiAI - 聊天相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ChatMessage(BaseModel):
    """聊天消息"""
    role: str  # user/model
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    """聊天请求"""
    message: str


class ChatResponse(BaseModel):
    """聊天响应"""
    response: str
    timestamp: datetime


class ChatHistoryResponse(BaseModel):
    """聊天历史响应"""
    messages: List[ChatMessage]
