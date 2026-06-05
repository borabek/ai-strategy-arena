from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.game import Game

DEFAULT_GAMES = [
    {
        "slug": "tictactoe",
        "title": "Tic Tac Toe",
        "description": "Classic 3x3 strategy game with minimax AI."
    },
    {
        "slug": "connect4",
        "title": "Connect 4",
        "description": "Vertical strategy game with alpha-beta pruning AI."
    }
]

def seed_games():
    db: Session = SessionLocal()
    try:
        existing = db.query(Game).count()
        if existing == 0:
            for item in DEFAULT_GAMES:
                db.add(Game(**item))
            db.commit()
    finally:
        db.close()