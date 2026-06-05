from collections import Counter
from sqlalchemy.orm import Session

from app.models.game import Game
from app.models.match import Match
from app.models.move import Move

def create_match_with_moves(db: Session, user_id: int, payload):
    game = db.query(Game).filter(Game.slug == payload.game_slug).first()
    if not game:
        raise ValueError("Game not found")

    match = Match(
        user_id=user_id,
        game_id=game.id,
        result=payload.result,
        difficulty=payload.difficulty,
        opponent=payload.opponent,
        summary=payload.summary
    )
    db.add(match)
    db.flush()

    for move in payload.moves:
        db.add(
            Move(
                match_id=match.id,
                turn_number=move.turn_number,
                player=move.player,
                move_data=move.move_data,
                explanation=move.explanation
            )
        )

    db.commit()
    db.refresh(match)
    return match

def get_user_stats(db: Session, user_id: int):
    matches = db.query(Match).filter(Match.user_id == user_id).all()

    total = len(matches)
    wins = sum(1 for match in matches if match.result == "win")
    losses = sum(1 for match in matches if match.result == "loss")
    draws = sum(1 for match in matches if match.result == "draw")
    win_rate = round((wins / total) * 100, 2) if total else 0.0

    favorite_game = None
    if matches:
        counter = Counter(match.game.title for match in matches if match.game)
        favorite_game = counter.most_common(1)[0][0]

    return {
        "total_matches": total,
        "wins": wins,
        "losses": losses,
        "draws": draws,
        "win_rate": win_rate,
        "favorite_game": favorite_game
    }
