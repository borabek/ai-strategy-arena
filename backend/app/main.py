import atexit
import os
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = BACKEND_DIR.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
FRONTEND_URL = "http://localhost:3000"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

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

def _url_is_ready(url: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=1):
            return True
    except Exception:
        return False

def _wait_for_url(url: str, timeout: int = 45) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        if _url_is_ready(url):
            return True
        time.sleep(0.5)
    return False

def _start_frontend():
    if _url_is_ready(FRONTEND_URL):
        return None

    npm = "npm.cmd" if os.name == "nt" else "npm"
    try:
        process = subprocess.Popen([npm, "run", "dev"], cwd=FRONTEND_DIR)
    except FileNotFoundError:
        print("npm bulunamadi. Frontend'i acmak icin Node.js/npm kurulu olmali.")
        return None

    atexit.register(lambda: process.poll() is None and process.terminate())
    return process

def _open_frontend_when_ready():
    if _wait_for_url(FRONTEND_URL):
        webbrowser.open(FRONTEND_URL)
    else:
        print(f"Frontend hazir olmadi. Manuel acmayi dene: {FRONTEND_URL}")

def run_full_stack():
    import uvicorn

    frontend_process = _start_frontend()
    threading.Thread(target=_open_frontend_when_ready, daemon=True).start()

    try:
        uvicorn.run(app, host="127.0.0.1", port=8000)
    finally:
        if frontend_process and frontend_process.poll() is None:
            frontend_process.terminate()

if __name__ == "__main__":
    run_full_stack()
