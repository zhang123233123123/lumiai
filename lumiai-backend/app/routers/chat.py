"""
LumiAI - AI 对话路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.report import ChatHistory
from app.routers.auth import get_current_user
from app.schemas.chat import ChatRequest, ChatResponse, ChatMessage, ChatHistoryResponse
from app.services.ai_service import chat_with_ai

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """发送消息给 AI 导师"""
    # 保存用户消息
    user_message = ChatHistory(
        user_id=current_user.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    
    # 获取历史消息作为上下文
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.desc()).limit(10).all()
    
    # 反转以获得正确的时间顺序
    history = list(reversed(history))
    
    # 调用 AI 服务
    try:
        response_text = await chat_with_ai(
            message=request.message,
            history=[{"role": h.role, "content": h.content} for h in history]
        )
    except Exception as e:
        print(f"AI 服务错误: {e}")
        response_text = "很抱歉，我暂时无法连接网络。请检查 API 配置后重试。"
    
    # 保存 AI 响应
    ai_message = ChatHistory(
        user_id=current_user.id,
        role="model",
        content=response_text
    )
    db.add(ai_message)
    db.commit()
    
    return ChatResponse(
        response=response_text,
        timestamp=datetime.utcnow()
    )


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取对话历史"""
    history = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).order_by(ChatHistory.created_at.asc()).limit(limit).all()
    
    messages = [
        ChatMessage(
            role=h.role,
            content=h.content,
            timestamp=h.created_at
        ) for h in history
    ]
    
    return ChatHistoryResponse(messages=messages)


@router.delete("/history")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """清空对话历史"""
    db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user.id
    ).delete()
    db.commit()
    
    return {"message": "对话历史已清空"}
