from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.services.match_service import get_user_stats

router = APIRouter()

@router.get("/me/stats")
def my_stats(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return get_user_stats(db, current_user.id)
