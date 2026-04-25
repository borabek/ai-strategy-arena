from fastapi import APIRouter
from app.ai.tictactoe import simulate_ai_vs_ai as ttt_sim
from app.ai.connect4 import simulate_ai_vs_ai as c4_sim

router = APIRouter()

@router.post("/tictactoe")
def simulate_tictactoe():
    return ttt_sim()

@router.post("/connect4")
def simulate_connect4():
    return c4_sim()
