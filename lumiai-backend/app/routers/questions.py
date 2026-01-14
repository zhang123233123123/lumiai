"""
LumiAI - 题库路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
import random

from app.database import get_db
from app.models.question import Question
from app.schemas.question import QuestionResponse, QuestionBrief

router = APIRouter()


@router.get("", response_model=List[QuestionResponse])
async def get_questions(
    category: Optional[str] = Query(None, description="题目类别: listening/reading/writing/speaking"),
    difficulty: Optional[str] = Query(None, description="难度: easy/medium/hard"),
    question_type: Optional[str] = Query(None, description="题目类型"),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """获取题目列表（包含完整内容）"""
    query = db.query(Question)
    
    if category:
        query = query.filter(Question.category == category)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    if question_type:
        query = query.filter(Question.question_type == question_type)
    
    questions = query.offset(offset).limit(limit).all()
    return questions


@router.get("/count")
async def get_question_count(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取题目数量统计"""
    if category:
        count = db.query(Question).filter(Question.category == category).count()
        return {"category": category, "count": count}
    
    # 返回各类别统计
    stats = {}
    for cat in ["listening", "reading", "writing", "speaking"]:
        stats[cat] = db.query(Question).filter(Question.category == cat).count()
    stats["total"] = sum(stats.values())
    return stats


@router.get("/random", response_model=QuestionResponse)
async def get_random_question(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """随机获取一道题目"""
    query = db.query(Question)
    
    if category:
        query = query.filter(Question.category == category)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    
    # 获取所有符合条件的题目 ID
    question_ids = [q.id for q in query.all()]
    
    if not question_ids:
        raise HTTPException(status_code=404, detail="没有找到符合条件的题目")
    
    # 随机选择一个
    random_id = random.choice(question_ids)
    question = db.query(Question).filter(Question.id == random_id).first()
    return question


@router.get("/{question_id}", response_model=QuestionResponse)
async def get_question(question_id: int, db: Session = Depends(get_db)):
    """获取单个题目详情"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="题目不存在")
    return question
