"""
LumiAI - 学情报告模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from app.database import Base


class LearningReport(Base):
    """学情报告表"""
    __tablename__ = "learning_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # 报告周期
    report_type = Column(String(20), default="weekly")  # daily/weekly/monthly
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # 报告数据（JSON 格式存储详细统计）
    report_data = Column(Text, nullable=True)  # JSON 字符串
    
    # 学习时长统计（分钟）
    listening_minutes = Column(Integer, default=0)
    reading_minutes = Column(Integer, default=0)
    writing_minutes = Column(Integer, default=0)
    speaking_minutes = Column(Integer, default=0)
    
    # 正确率统计
    listening_accuracy = Column(Integer, default=0)     # 百分比
    reading_accuracy = Column(Integer, default=0)
    writing_score = Column(Integer, default=0)
    speaking_score = Column(Integer, default=0)
    
    # AI 建议
    ai_suggestions = Column(Text, nullable=True)
    
    generated_at = Column(DateTime, default=datetime.utcnow)


class ChatHistory(Base):
    """AI 对话历史表"""
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    role = Column(String(10), nullable=False)           # user/model
    content = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
