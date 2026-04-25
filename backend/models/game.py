from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    slug = Column(String(50), unique=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)

    matches = relationship("Match", back_populates="game")
