"""
LumiAI - 练习路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.question import Question
from app.models.practice import PracticeSession, PracticeAnswer
from app.routers.auth import get_current_user
from app.schemas.practice import (
    PracticeSessionCreate, 
    PracticeSessionResponse,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    PracticeHistoryItem
)
from app.services.ai_service import analyze_error

router = APIRouter()


@router.post("/sessions", response_model=PracticeSessionResponse)
async def create_session(
    session_data: PracticeSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建新的练习会话"""
    session = PracticeSession(
        user_id=current_user.id,
        category=session_data.category,
        title=session_data.title or f"{session_data.category.upper()} 练习"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=PracticeSessionResponse)
async def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取练习会话详情"""
    session = db.query(PracticeSession).filter(
        PracticeSession.id == session_id,
        PracticeSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="练习会话不存在")
    return session


@router.post("/sessions/{session_id}/submit", response_model=SubmitAnswerResponse)
async def submit_answer(
    session_id: int,
    answer_data: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """提交答案"""
    # 验证会话存在
    session = db.query(PracticeSession).filter(
        PracticeSession.id == session_id,
        PracticeSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="练习会话不存在")
    
    # 获取题目
    question = db.query(Question).filter(Question.id == answer_data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="题目不存在")
    
    # 判断答案是否正确（简单的字符串比较，实际可能需要更复杂的逻辑）
    is_correct = answer_data.user_answer.strip().lower() == question.answer.strip().lower()
    
    # AI 分析（仅对错误答案）
    ai_analysis = None
    ai_correction = None
    error_type = None
    
    if not is_correct:
        try:
            analysis_result = await analyze_error(
                question_content=question.content,
                correct_answer=question.answer,
                user_answer=answer_data.user_answer
            )
            ai_analysis = analysis_result.get("analysis", "")
            ai_correction = analysis_result.get("correction", "")
            error_type = analysis_result.get("error_type", "unknown")
        except Exception as e:
            print(f"AI 分析失败: {e}")
            ai_analysis = "暂时无法生成分析"
    
    # 保存答案记录
    practice_answer = PracticeAnswer(
        session_id=session_id,
        question_id=answer_data.question_id,
        user_id=current_user.id,
        user_answer=answer_data.user_answer,
        is_correct=is_correct,
        error_type=error_type,
        ai_analysis=ai_analysis,
        ai_correction=ai_correction
    )
    db.add(practice_answer)
    
    # 更新会话统计
    session.total_questions += 1
    if is_correct:
        session.correct_count += 1
    
    db.commit()
    
    return SubmitAnswerResponse(
        is_correct=is_correct,
        correct_answer=question.answer,
        ai_analysis=ai_analysis,
        ai_correction=ai_correction,
        error_type=error_type
    )


@router.post("/sessions/{session_id}/complete", response_model=PracticeSessionResponse)
async def complete_session(
    session_id: int,
    time_spent: int = 0,  # 用时（秒）
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """完成练习会话"""
    session = db.query(PracticeSession).filter(
        PracticeSession.id == session_id,
        PracticeSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="练习会话不存在")
    
    session.completed_at = datetime.utcnow()
    session.time_spent_seconds = time_spent
    
    # 计算预估分数（简单算法：正确率 * 9）
    if session.total_questions > 0:
        accuracy = session.correct_count / session.total_questions
        session.score = round(accuracy * 9, 1)
    
    db.commit()
    db.refresh(session)
    return session


@router.get("/history", response_model=List[PracticeHistoryItem])
async def get_practice_history(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取练习历史"""
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).order_by(PracticeSession.started_at.desc()).limit(limit).all()
    
    return sessions
