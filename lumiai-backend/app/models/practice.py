"""
LumiAI - 练习记录模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base


class PracticeSession(Base):
    """练习会话表"""
    __tablename__ = "practice_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # 会话信息
    category = Column(String(20), nullable=False)       # listening/reading/writing/speaking
    title = Column(String(200), nullable=True)          # 会话标题
    
    # 统计信息
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    time_spent_seconds = Column(Integer, default=0)     # 用时（秒）
    score = Column(Float, nullable=True)                # 预估分数
    
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # 关联
    answers = relationship("PracticeAnswer", back_populates="session")


class PracticeAnswer(Base):
    """练习答案记录表"""
    __tablename__ = "practice_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("practice_sessions.id"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # 答题信息
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    
    # 错误分析（由 AI 生成）
    error_type = Column(String(50), nullable=True)      # 错误类型：grammar/logic/vocabulary
    ai_analysis = Column(Text, nullable=True)           # AI 分析结果
    ai_correction = Column(Text, nullable=True)         # AI 纠正建议
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关联
    session = relationship("PracticeSession", back_populates="answers")
