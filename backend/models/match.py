from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, ForeignKey("games.id"), nullable=False)
    result = Column(String(20), nullable=False)
    difficulty = Column(String(20), nullable=False, default="medium")
    opponent = Column(String(20), nullable=False, default="ai")
    summary = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="matches")
    game = relationship("Game", back_populates="matches")
    moves = relationship("Move", back_populates="match", cascade="all, delete-orphan")
