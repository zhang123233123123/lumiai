"""
LumiAI - 认证路由（简化版，无密码）
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin

router = APIRouter()

# 模拟当前用户（Demo 用途）
DEMO_USER_ID = 1


def get_current_user(db: Session = Depends(get_db)) -> User:
    """获取当前用户（简化版：返回 Demo 用户）"""
    user = db.query(User).filter(User.id == DEMO_USER_ID).first()
    if not user:
        # 自动创建 Demo 用户
        user = User(id=DEMO_USER_ID, username="Sarah", email="sarah@demo.com", target_score="7.5")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册（简化版）"""
    # 检查用户名是否已存在
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")
    
    user = User(**user_data.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=UserResponse)
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """用户登录（简化版：只验证用户名存在）"""
    user = db.query(User).filter(User.username == login_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """获取当前用户信息"""
    return current_user
