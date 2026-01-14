"""
LumiAI - 练习相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class AnswerSubmit(BaseModel):
    """提交答案请求"""
    question_id: int
    user_answer: str


class PracticeSessionCreate(BaseModel):
    """创建练习会话请求"""
    category: str
    title: Optional[str] = None


class PracticeSessionResponse(BaseModel):
    """练习会话响应"""
    id: int
    user_id: int
    category: str
    title: Optional[str] = None
    total_questions: int
    correct_count: int
    time_spent_seconds: int
    score: Optional[float] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PracticeAnswerResponse(BaseModel):
    """练习答案响应"""
    id: int
    question_id: int
    user_answer: str
    is_correct: bool
    error_type: Optional[str] = None
    ai_analysis: Optional[str] = None
    ai_correction: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SubmitAnswerRequest(BaseModel):
    """提交答案请求"""
    question_id: int
    user_answer: str


class SubmitAnswerResponse(BaseModel):
    """提交答案响应"""
    is_correct: bool
    correct_answer: str
    ai_analysis: Optional[str] = None
    ai_correction: Optional[str] = None
    error_type: Optional[str] = None


class PracticeHistoryItem(BaseModel):
    """练习历史项目"""
    id: int
    category: str
    title: Optional[str] = None
    total_questions: int
    correct_count: int
    score: Optional[float] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
