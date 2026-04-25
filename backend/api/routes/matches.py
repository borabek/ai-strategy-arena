from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.match import Match
from app.schemas.matches import CreateMatchRequest
from app.services.match_service import create_match_with_moves

router = APIRouter()

@router.post("")
def create_match(payload: CreateMatchRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        match = create_match_with_moves(db, current_user.id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    return {"message": "Match saved", "match_id": match.id}

@router.get("/history")
def get_history(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    matches = (
        db.query(Match)
        .filter(Match.user_id == current_user.id)
        .order_by(Match.created_at.desc())
        .all()
    )

    return [
        {
            "id": match.id,
            "game": match.game.title,
            "result": match.result,
            "difficulty": match.difficulty,
            "opponent": match.opponent,
            "summary": match.summary,
            "created_at": match.created_at.isoformat()
        }
        for match in matches
    ]

@router.get("/{match_id}/replay")
def replay(match_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    match = (
        db.query(Match)
        .filter(Match.id == match_id, Match.user_id == current_user.id)
        .first()
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    ordered_moves = sorted(match.moves, key=lambda item: item.turn_number)
    return {
        "id": match.id,
        "game": match.game.title,
        "result": match.result,
        "moves": [
            {
                "turn_number": move.turn_number,
                "player": move.player,
                "move_data": move.move_data,
                "explanation": move.explanation,
            }
            for move in ordered_moves
        ]
    }
