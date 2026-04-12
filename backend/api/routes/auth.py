from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, PublicUser
from app.services.auth_service import register_user, login_user

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    _, token = register_user(db, payload.full_name, payload.email, payload.password)
    return TokenResponse(access_token=token)

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, payload.email, payload.password)
    return TokenResponse(access_token=token)

@router.get("/me", response_model=PublicUser)
def me(current_user = Depends(get_current_user)):
    return current_user
