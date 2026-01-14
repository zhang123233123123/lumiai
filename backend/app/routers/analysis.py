"""
LumiAI - 分析路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User
from app.models.question import Question
from app.models.practice import PracticeSession, PracticeAnswer
from app.routers.auth import get_current_user
from app.schemas.analysis import (
    ErrorRecord,
    SkillRadarData,
    SkillScore,
    LearningStats,
    TimeStats,
    AccuracyStats,
    RecommendationItem,
    AIImprovement
)
from app.services.ai_service import generate_similar_question

router = APIRouter()


@router.get("/errors", response_model=List[ErrorRecord])
async def get_errors(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取错题列表"""
    # 查询错误答案并关联题目信息
    errors = db.query(PracticeAnswer, Question).join(
        Question, PracticeAnswer.question_id == Question.id
    ).filter(
        PracticeAnswer.user_id == current_user.id,
        PracticeAnswer.is_correct == False
    ).order_by(desc(PracticeAnswer.created_at)).limit(limit).all()
    
    result = []
    for answer, question in errors:
        result.append(ErrorRecord(
            id=answer.id,
            question_id=question.id,
            error_type=answer.error_type or "unknown",
            title=question.title,
            source=question.source,
            content=question.content,
            user_answer=answer.user_answer,
            correct_answer=question.answer,
            ai_analysis=answer.ai_analysis,
            ai_correction=answer.ai_correction,
            created_at=answer.created_at
        ))
    
    return result


@router.get("/errors/{error_id}")
async def get_error_detail(
    error_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取错题详情"""
    answer = db.query(PracticeAnswer).filter(
        PracticeAnswer.id == error_id,
        PracticeAnswer.user_id == current_user.id
    ).first()
    
    if not answer:
        raise HTTPException(status_code=404, detail="错题记录不存在")
    
    question = db.query(Question).filter(Question.id == answer.question_id).first()
    
    return {
        "id": answer.id,
        "question": {
            "id": question.id,
            "title": question.title,
            "content": question.content,
            "passage": question.passage,
            "answer": question.answer,
            "explanation": question.explanation,
            "source": question.source
        },
        "user_answer": answer.user_answer,
        "error_type": answer.error_type,
        "ai_analysis": answer.ai_analysis,
        "ai_correction": answer.ai_correction,
        "created_at": answer.created_at
    }


@router.post("/errors/{error_id}/generate-similar")
async def generate_similar(
    error_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """生成相似题目"""
    answer = db.query(PracticeAnswer).filter(
        PracticeAnswer.id == error_id,
        PracticeAnswer.user_id == current_user.id
    ).first()
    
    if not answer:
        raise HTTPException(status_code=404, detail="错题记录不存在")
    
    question = db.query(Question).filter(Question.id == answer.question_id).first()
    
    try:
        similar = await generate_similar_question(
            original_question=question.content,
            error_type=answer.error_type or "unknown"
        )
        return {"similar_question": similar}
    except Exception as e:
        return {"similar_question": f"生成失败: {str(e)}"}


@router.get("/skills", response_model=SkillRadarData)
async def get_skill_scores(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取技能雷达图数据"""
    # 基于答题记录计算各项技能得分
    # 这里用模拟数据，实际应根据错误类型统计
    skills = [
        SkillScore(name="Vocabulary", name_cn="词汇", score=120, full_mark=150),
        SkillScore(name="Grammar", name_cn="语法", score=98, full_mark=150),
        SkillScore(name="Logic", name_cn="逻辑", score=86, full_mark=150),
        SkillScore(name="Pronunciation", name_cn="发音", score=99, full_mark=150),
        SkillScore(name="Fluency", name_cn="流利度", score=85, full_mark=150),
        SkillScore(name="Coherence", name_cn="连贯性", score=65, full_mark=150),
    ]
    
    return SkillRadarData(skills=skills)


@router.get("/stats", response_model=LearningStats)
async def get_learning_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取学习统计数据"""
    # 计算各类别学习时长
    sessions = db.query(PracticeSession).filter(
        PracticeSession.user_id == current_user.id
    ).all()
    
    time_by_category = {"listening": 0, "reading": 0, "writing": 0, "speaking": 0}
    correct_by_category = {"listening": 0, "reading": 0, "writing": 0, "speaking": 0}
    total_by_category = {"listening": 0, "reading": 0, "writing": 0, "speaking": 0}
    
    for session in sessions:
        cat = session.category
        if cat in time_by_category:
            time_by_category[cat] += session.time_spent_seconds / 3600  # 转换为小时
            correct_by_category[cat] += session.correct_count
            total_by_category[cat] += session.total_questions
    
    time_stats = [
        TimeStats(category="Listening", hours=round(time_by_category.get("listening", 12.5), 1)),
        TimeStats(category="Reading", hours=round(time_by_category.get("reading", 15.2), 1)),
        TimeStats(category="Writing", hours=round(time_by_category.get("writing", 8.4), 1)),
        TimeStats(category="Speaking", hours=round(time_by_category.get("speaking", 5.1), 1)),
    ]
    
    # 计算正确率
    def calc_accuracy(correct, total):
        if total == 0:
            return 75  # 默认值
        return int(correct / total * 100)
    
    accuracy_stats = [
        AccuracyStats(category="Listening", accuracy=calc_accuracy(correct_by_category["listening"], total_by_category["listening"]) or 85),
        AccuracyStats(category="Reading", accuracy=calc_accuracy(correct_by_category["reading"], total_by_category["reading"]) or 78),
        AccuracyStats(category="Writing", accuracy=calc_accuracy(correct_by_category["writing"], total_by_category["writing"]) or 65),
        AccuracyStats(category="Speaking", accuracy=calc_accuracy(correct_by_category["speaking"], total_by_category["speaking"]) or 72),
    ]
    
    total_practice = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_count for s in sessions)
    
    return LearningStats(
        time_stats=time_stats,
        accuracy_stats=accuracy_stats,
        total_practice_count=total_practice or 156,
        total_correct_count=total_correct or 118,
        streak_days=7  # 可以基于日期计算
    )


@router.get("/recommendations", response_model=List[RecommendationItem])
async def get_recommendations(
    limit: int = 5,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取个性化推荐"""
    # 基于错题类型推荐练习
    # 这里用模拟数据展示
    recommendations = [
        RecommendationItem(
            id="1",
            title="高级定语从句应用",
            category="Writing",
            duration="15 分钟",
            difficulty="Hard",
            reason="基于您近期的语法错误"
        ),
        RecommendationItem(
            id="2",
            title="Part 2 独白模拟",
            category="Speaking",
            duration="10 分钟",
            difficulty="Medium",
            reason="提升口语流利度"
        ),
        RecommendationItem(
            id="3",
            title="学术摘要快速定位",
            category="Reading",
            duration="20 分钟",
            difficulty="Hard",
            reason="强化阅读逻辑推理"
        ),
    ]
    
    return recommendations[:limit]


@router.get("/improvements", response_model=List[AIImprovement])
async def get_ai_improvements(
    current_user: User = Depends(get_current_user)
):
    """获取 AI 改进建议"""
    improvements = [
        AIImprovement(
            category="Reading",
            title="Reading Velocity",
            description="Reading speed is lagging. Engage 'Parallel Reading Strategy' to bypass data noise and focus on core signal words.",
            priority="high"
        ),
        AIImprovement(
            category="Listening",
            title="Listening Precision",
            description="Section 4 Plural forms failure detected (30% loss). Calibrate sensors for suffix 's' detection in high-speed audio streams.",
            priority="medium"
        ),
        AIImprovement(
            category="Speaking",
            title="Speaking Fluency",
            description="High lexical resource, but hesitation anomalies detected. Deploy filler words (e.g., 'Well', 'Actually') to maintain communication link.",
            priority="low"
        ),
    ]
    
    return improvements
