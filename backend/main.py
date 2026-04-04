from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, users, matches, leaderboard, simulations, games
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.seed import seed_games

Base.metadata.create_all(bind=engine)
seed_games()

app = FastAPI(title="AI Strategy Arena API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(matches.router, prefix="/matches", tags=["matches"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])
app.include_router(simulations.router, prefix="/simulations", tags=["simulations"])
app.include_router(games.router, prefix="/games", tags=["games"])

@app.get("/")
def root():
    return {"message": "AI Strategy Arena API is running"}
