"""
LumiAI - 生词本相关 Schema
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VocabularyBase(BaseModel):
    """生词基础信息"""
    word: str
    definition: Optional[str] = None
    part_of_speech: Optional[str] = None
    phonetic: Optional[str] = None
    example_sentence: Optional[str] = None
    source_context: Optional[str] = None


class VocabularyCreate(VocabularyBase):
    """添加生词请求"""
    source_question_id: Optional[int] = None


class VocabularyResponse(VocabularyBase):
    """生词响应"""
    id: int
    user_id: int
    mastery_level: int
    review_count: int
    created_at: datetime
    last_reviewed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class VocabularyUpdate(BaseModel):
    """更新生词请求"""
    definition: Optional[str] = None
    mastery_level: Optional[int] = None
