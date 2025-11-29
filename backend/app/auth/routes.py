from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.models import Auth
from app.auth.schemas import AuthCreate, AuthRead, AuthLogin
from app.auth.hash import hash_password, verify_password

router = APIRouter()


@router.post("/register", response_model=AuthRead, status_code=status.HTTP_201_CREATED)
async def register(auth_data: AuthCreate, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    # Валидация роли
    if auth_data.role not in ["Студент", "Организатор"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Роль должна быть 'Студент' или 'Организатор'"
        )
    
    # Проверяем, существует ли пользователь с таким login
    existing_user = db.query(Auth).filter(Auth.login == auth_data.login).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким логином уже существует"
        )
    
    # Проверяем, существует ли пользователь с таким email
    existing_email = db.query(Auth).filter(Auth.email == auth_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует"
        )
    
    hashed_password = hash_password(auth_data.password)
    new_user = Auth(
        login=auth_data.login,
        email=auth_data.email,
        password_hash=hashed_password,
        role=auth_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=AuthRead)
async def login(auth_data: AuthLogin, db: Session = Depends(get_db)):
    """Авторизация пользователя"""
    # Проверяем, что хотя бы одно поле заполнено
    if not auth_data.login and not auth_data.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Необходимо указать логин или email"
        )
    
    # Валидация роли
    if not auth_data.role or auth_data.role not in ["Студент", "Организатор"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Роль должна быть 'Студент' или 'Организатор'"
        )
    
    # Ищем пользователя по login или email с учетом роли
    query = db.query(Auth).filter(Auth.role == auth_data.role)
    
    if auth_data.login and auth_data.email:
        user = query.filter(
            (Auth.login == auth_data.login) | (Auth.email == auth_data.email)
        ).first()
    elif auth_data.login:
        user = query.filter(Auth.login == auth_data.login).first()
    else:
        user = query.filter(Auth.email == auth_data.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин/email, пароль или роль"
        )
    
    # Проверяем пароль
    if not verify_password(auth_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин/email или пароль"
        )
    
    # Проверяем, активен ли пользователь
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт деактивирован"
        )
    
    return user



@router.get("/me", response_model=AuthRead)
async def get_current_user(user_id: int, db: Session = Depends(get_db)):
    """Получить информацию о текущем пользователе"""
    user = db.query(Auth).filter(Auth.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    return user

