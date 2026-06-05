from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from app.api.deps import get_db
from app.models.user import User
from app.models.match import Match

router = APIRouter()

@router.get("")
def get_leaderboard(db: Session = Depends(get_db)):
    rows = (
        db.query(
            User.id.label("user_id"),
            User.full_name.label("name"),
            func.count(Match.id).label("total_matches"),
            func.sum(case((Match.result == "win", 1), else_=0)).label("wins"),
            func.sum(case((Match.result == "draw", 1), else_=0)).label("draws"),
        )
        .join(Match, Match.user_id == User.id)
        .group_by(User.id, User.full_name)
        .order_by(func.sum(case((Match.result == "win", 1), else_=0)).desc(), func.count(Match.id).desc())
        .limit(20)
        .all()
    )

    result = []
    for index, row in enumerate(rows, start=1):
        total = int(row.total_matches or 0)
        wins = int(row.wins or 0)
        win_rate = round((wins / total) * 100, 2) if total else 0.0
        result.append({
            "rank": index,
            "user_id": row.user_id,
            "name": row.name,
            "wins": wins,
            "draws": int(row.draws or 0),
            "total_matches": total,
            "win_rate": win_rate
        })
    return result
