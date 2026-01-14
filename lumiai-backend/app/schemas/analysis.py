"""
LumiAI - 分析相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ErrorRecord(BaseModel):
    """错题记录"""
    id: int
    question_id: int
    error_type: str
    title: str
    source: Optional[str] = None
    content: str
    user_answer: str
    correct_answer: str
    ai_analysis: Optional[str] = None
    ai_correction: Optional[str] = None
    created_at: datetime


class SkillScore(BaseModel):
    """技能得分"""
    name: str           # 技能名称
    name_cn: str        # 中文名称
    score: int          # 得分 (0-150)
    full_mark: int = 150


class SkillRadarData(BaseModel):
    """技能雷达图数据"""
    skills: List[SkillScore]


class TimeStats(BaseModel):
    """学习时长统计"""
    category: str
    hours: float


class AccuracyStats(BaseModel):
    """正确率统计"""
    category: str
    accuracy: int  # 百分比


class LearningStats(BaseModel):
    """学习统计数据"""
    time_stats: List[TimeStats]
    accuracy_stats: List[AccuracyStats]
    total_practice_count: int
    total_correct_count: int
    streak_days: int  # 连续学习天数


class RecommendationItem(BaseModel):
    """推荐项目"""
    id: str
    title: str
    category: str
    duration: str
    difficulty: str
    reason: Optional[str] = None  # 推荐理由


class AIImprovement(BaseModel):
    """AI 改进建议"""
    category: str
    title: str
    description: str
    priority: str  # high/medium/low
