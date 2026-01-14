"""
LumiAI - 生词本路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.vocabulary import Vocabulary
from app.routers.auth import get_current_user
from app.schemas.vocabulary import VocabularyCreate, VocabularyResponse, VocabularyUpdate

router = APIRouter()


@router.get("", response_model=List[VocabularyResponse])
async def get_vocabulary(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取生词本"""
    words = db.query(Vocabulary).filter(
        Vocabulary.user_id == current_user.id
    ).order_by(Vocabulary.created_at.desc()).offset(offset).limit(limit).all()
    
    return words


@router.post("", response_model=VocabularyResponse)
async def add_vocabulary(
    word_data: VocabularyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """添加生词"""
    # 检查是否已存在
    existing = db.query(Vocabulary).filter(
        Vocabulary.user_id == current_user.id,
        Vocabulary.word == word_data.word
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="该单词已在生词本中")
    
    word = Vocabulary(
        user_id=current_user.id,
        **word_data.model_dump()
    )
    db.add(word)
    db.commit()
    db.refresh(word)
    return word


@router.get("/{word_id}", response_model=VocabularyResponse)
async def get_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取单个生词详情"""
    word = db.query(Vocabulary).filter(
        Vocabulary.id == word_id,
        Vocabulary.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="生词不存在")
    return word


@router.put("/{word_id}", response_model=VocabularyResponse)
async def update_word(
    word_id: int,
    update_data: VocabularyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新生词"""
    word = db.query(Vocabulary).filter(
        Vocabulary.id == word_id,
        Vocabulary.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="生词不存在")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(word, key, value)
    
    db.commit()
    db.refresh(word)
    return word


@router.post("/{word_id}/review", response_model=VocabularyResponse)
async def review_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """标记已复习"""
    word = db.query(Vocabulary).filter(
        Vocabulary.id == word_id,
        Vocabulary.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="生词不存在")
    
    word.review_count += 1
    word.last_reviewed_at = datetime.utcnow()
    
    # 提升掌握程度
    if word.mastery_level < 5:
        word.mastery_level += 1
    
    db.commit()
    db.refresh(word)
    return word


@router.delete("/{word_id}")
async def delete_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除生词"""
    word = db.query(Vocabulary).filter(
        Vocabulary.id == word_id,
        Vocabulary.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="生词不存在")
    
    db.delete(word)
    db.commit()
    return {"message": "删除成功"}
