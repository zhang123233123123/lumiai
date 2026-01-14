"""
LumiAI - 生词本模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database import Base


class Vocabulary(Base):
    """生词本表"""
    __tablename__ = "vocabulary"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # 单词信息
    word = Column(String(100), nullable=False, index=True)
    definition = Column(Text, nullable=True)            # 释义
    part_of_speech = Column(String(20), nullable=True)  # 词性
    phonetic = Column(String(100), nullable=True)       # 音标
    
    # 上下文
    example_sentence = Column(Text, nullable=True)      # 例句
    source_context = Column(Text, nullable=True)        # 来源上下文
    source_question_id = Column(Integer, ForeignKey("questions.id"), nullable=True)
    
    # 学习状态
    mastery_level = Column(Integer, default=0)          # 掌握程度 0-5
    review_count = Column(Integer, default=0)           # 复习次数
    
    created_at = Column(DateTime, default=datetime.utcnow)
    last_reviewed_at = Column(DateTime, nullable=True)
