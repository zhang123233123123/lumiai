"""
LumiAI - 题目相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum


class QuestionCategory(str, Enum):
    LISTENING = "listening"
    READING = "reading"
    WRITING = "writing"
    SPEAKING = "speaking"


class QuestionDifficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionBase(BaseModel):
    """题目基础信息"""
    category: str
    question_type: str
    difficulty: str = "medium"
    title: str
    passage: Optional[str] = None
    content: str
    options: Optional[str] = None  # JSON 字符串
    answer: str
    explanation: Optional[str] = None
    source: Optional[str] = None
    skill_tags: Optional[str] = None


class QuestionCreate(QuestionBase):
    """创建题目请求"""
    pass


class QuestionResponse(QuestionBase):
    """题目响应"""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class QuestionBrief(BaseModel):
    """题目简要信息（列表用）"""
    id: int
    category: str
    question_type: str
    difficulty: str
    title: str
    source: Optional[str] = None
    
    class Config:
        from_attributes = True


class QuestionFilter(BaseModel):
    """题目筛选条件"""
    category: Optional[str] = None
    difficulty: Optional[str] = None
    question_type: Optional[str] = None
    limit: int = 10
    offset: int = 0
