from pydantic import BaseModel
from typing import List

class CreateMoveIn(BaseModel):
    turn_number: int
    player: str
    move_data: str
    explanation: str | None = None

class CreateMatchRequest(BaseModel):
    game_slug: str
    result: str
    difficulty: str = "medium"
    opponent: str = "ai"
    summary: str | None = None
    moves: List[CreateMoveIn] = []

class ReplayMoveOut(BaseModel):
    turn_number: int
    player: str
    move_data: str
    explanation: str | None = None

    class Config:
        from_attributes = True

class MatchOut(BaseModel):
    id: int
    game: str
    result: str
    difficulty: str
    opponent: str
    summary: str | None = None
    created_at: str

class ReplayOut(BaseModel):
    id: int
    game: str
    result: str
    moves: List[ReplayMoveOut]
