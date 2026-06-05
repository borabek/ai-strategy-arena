from pydantic import BaseModel

class UserStatsOut(BaseModel):
    total_matches: int
    wins: int
    losses: int
    draws: int
    win_rate: float
    favorite_game: str | None = None
