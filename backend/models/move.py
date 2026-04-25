from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Move(Base):
    __tablename__ = "moves"

    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=False)
    turn_number = Column(Integer, nullable=False)
    player = Column(String(20), nullable=False)
    move_data = Column(String(100), nullable=False)
    explanation = Column(String(255), nullable=True)

    match = relationship("Match", back_populates="moves")
