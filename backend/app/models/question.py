"""
LumiAI - 题目模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from app.database import Base
import enum


class QuestionCategory(str, enum.Enum):
    """题目类型枚举"""
    LISTENING = "listening"
    READING = "reading"
    WRITING = "writing"
    SPEAKING = "speaking"


class QuestionDifficulty(str, enum.Enum):
    """难度枚举"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionType(str, enum.Enum):
    """题目子类型"""
    FILL_IN_BLANK = "fill_in_blank"        # 填空题
    MULTIPLE_CHOICE = "multiple_choice"     # 选择题
    TRUE_FALSE_NG = "true_false_ng"        # 判断题
    MATCHING = "matching"                   # 匹配题
    SHORT_ANSWER = "short_answer"          # 简答题
    ESSAY = "essay"                         # 作文


class Question(Base):
    """题目表"""
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # 分类信息
    category = Column(String(20), nullable=False, index=True)  # listening/reading/writing/speaking
    question_type = Column(String(30), nullable=False)  # 题目类型
    difficulty = Column(String(10), default="medium")   # easy/medium/hard
    
    # 题目内容
    title = Column(String(200), nullable=False)         # 题目标题
    passage = Column(Text, nullable=True)               # 阅读文章/听力原文
    content = Column(Text, nullable=False)              # 题目内容/问题
    options = Column(Text, nullable=True)               # 选项（JSON 格式）
    answer = Column(Text, nullable=False)               # 正确答案
    explanation = Column(Text, nullable=True)           # 答案解析
    
    # 来源信息
    source = Column(String(100), nullable=True)         # 来源（如 Cambridge 18）
    
    # 技能标签
    skill_tags = Column(Text, nullable=True)            # 技能标签（JSON 格式）
    
    created_at = Column(DateTime, default=datetime.utcnow)
