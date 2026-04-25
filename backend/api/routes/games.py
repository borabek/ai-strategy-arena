from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.game import Game
from app.schemas.games import GameOut

router = APIRouter()

@router.get("", response_model=list[GameOut])
def list_games(db: Session = Depends(get_db)):
    return db.query(Game).order_by(Game.title.asc()).all()
