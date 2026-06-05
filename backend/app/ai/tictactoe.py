from typing import List, Optional, Tuple

Board = List[str]

WIN_LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]

def winner(board: Board) -> Optional[str]:
    for a, b, c in WIN_LINES:
        if board[a] != "" and board[a] == board[b] == board[c]:
            return board[a]
    if "" not in board:
        return "draw"
    return None

def available_moves(board: Board) -> List[int]:
    return [index for index, value in enumerate(board) if value == ""]

def minimax(board: Board, is_maximizing: bool) -> int:
    state = winner(board)
    if state == "O":
        return 1
    if state == "X":
        return -1
    if state == "draw":
        return 0

    if is_maximizing:
        best = -999
        for move in available_moves(board):
            board[move] = "O"
            score = minimax(board, False)
            board[move] = ""
            best = max(best, score)
        return best

    best = 999
    for move in available_moves(board):
        board[move] = "X"
        score = minimax(board, True)
        board[move] = ""
        best = min(best, score)
    return best

def best_move(board: Board, ai_symbol: str = "O") -> Tuple[int, str]:
    # AI assumes O. This keeps code simpler and readable for the portfolio.
    best_score = -999
    chosen_move = -1

    for move in available_moves(board):
        board[move] = ai_symbol
        score = minimax(board, False)
        board[move] = ""
        if score > best_score:
            best_score = score
            chosen_move = move

    explanation = (
        f"AI chose tile {chosen_move} because it produced the best minimax score "
        f"of {best_score} among {len(available_moves(board))} available moves."
    )
    return chosen_move, explanation

def simulate_ai_vs_ai():
    board = [""] * 9
    moves = []
    current = "X"

    turn = 1
    while winner(board) is None:
        if current == "O":
            move, explanation = best_move(board, "O")
        else:
            # simple mirrored logic so both sides can move
            available = available_moves(board)
            scores = []
            for move in available:
                board[move] = current
                score = minimax(board, current == "X")
                board[move] = ""
                scores.append((score, move))
            move = scores[0][1]
            explanation = f"AI ({current}) selected tile {move} after scanning legal moves."

        board[move] = current
        moves.append({
            "turn_number": turn,
            "player": current,
            "move_data": str(move),
            "explanation": explanation
        })
        current = "O" if current == "X" else "X"
        turn += 1

    return {
        "game": "tictactoe",
        "winner": winner(board),
        "final_board": board,
        "moves": moves
    }
