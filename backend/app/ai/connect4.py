from typing import List, Tuple
import copy

ROWS = 6
COLS = 7
EMPTY = 0
HUMAN = 1
AI = 2

def create_board() -> List[List[int]]:
    return [[0 for _ in range(COLS)] for _ in range(ROWS)]

def valid_moves(board: List[List[int]]) -> List[int]:
    return [col for col in range(COLS) if board[0][col] == EMPTY]

def next_open_row(board: List[List[int]], col: int) -> int:
    for row in range(ROWS - 1, -1, -1):
        if board[row][col] == EMPTY:
            return row
    return -1

def apply_move(board: List[List[int]], col: int, piece: int) -> bool:
    row = next_open_row(board, col)
    if row == -1:
        return False
    board[row][col] = piece
    return True

def winning_move(board: List[List[int]], piece: int) -> bool:
    for r in range(ROWS):
        for c in range(COLS - 3):
            if all(board[r][c + i] == piece for i in range(4)):
                return True
    for r in range(ROWS - 3):
        for c in range(COLS):
            if all(board[r + i][c] == piece for i in range(4)):
                return True
    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            if all(board[r + i][c + i] == piece for i in range(4)):
                return True
    for r in range(3, ROWS):
        for c in range(COLS - 3):
            if all(board[r - i][c + i] == piece for i in range(4)):
                return True
    return False

def is_terminal(board: List[List[int]]) -> bool:
    return winning_move(board, HUMAN) or winning_move(board, AI) or len(valid_moves(board)) == 0

def evaluate_window(window: List[int], piece: int) -> int:
    score = 0
    opponent = HUMAN if piece == AI else AI

    if window.count(piece) == 4:
        score += 100
    elif window.count(piece) == 3 and window.count(EMPTY) == 1:
        score += 5
    elif window.count(piece) == 2 and window.count(EMPTY) == 2:
        score += 2

    if window.count(opponent) == 3 and window.count(EMPTY) == 1:
        score -= 4

    return score

def score_position(board: List[List[int]], piece: int) -> int:
    score = 0

    center_column = [board[r][COLS // 2] for r in range(ROWS)]
    score += center_column.count(piece) * 3

    for r in range(ROWS):
        row = board[r]
        for c in range(COLS - 3):
            score += evaluate_window(row[c:c + 4], piece)

    for c in range(COLS):
        column = [board[r][c] for r in range(ROWS)]
        for r in range(ROWS - 3):
            score += evaluate_window(column[r:r + 4], piece)

    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            window = [board[r + i][c + i] for i in range(4)]
            score += evaluate_window(window, piece)

    for r in range(ROWS - 3):
        for c in range(COLS - 3):
            window = [board[r + 3 - i][c + i] for i in range(4)]
            score += evaluate_window(window, piece)

    return score

def minimax(board: List[List[int]], depth: int, alpha: int, beta: int, maximizing: bool) -> Tuple[int, int | None]:
    moves = valid_moves(board)
    terminal = is_terminal(board)

    if depth == 0 or terminal:
        if terminal:
            if winning_move(board, AI):
                return 1_000_000, None
            if winning_move(board, HUMAN):
                return -1_000_000, None
            return 0, None
        return score_position(board, AI), None

    if maximizing:
        best_score = -10**9
        best_col = moves[0]
        for col in moves:
            temp = copy.deepcopy(board)
            apply_move(temp, col, AI)
            score, _ = minimax(temp, depth - 1, alpha, beta, False)
            if score > best_score:
                best_score = score
                best_col = col
            alpha = max(alpha, best_score)
            if alpha >= beta:
                break
        return best_score, best_col

    best_score = 10**9
    best_col = moves[0]
    for col in moves:
        temp = copy.deepcopy(board)
        apply_move(temp, col, HUMAN)
        score, _ = minimax(temp, depth - 1, alpha, beta, True)
        if score < best_score:
            best_score = score
            best_col = col
        beta = min(beta, best_score)
        if alpha >= beta:
            break
    return best_score, best_col

def get_ai_move(board: List[List[int]], depth: int = 4) -> Tuple[int, str]:
    score, col = minimax(board, depth, -10**9, 10**9, True)
    explanation = (
        f"AI selected column {col} after alpha-beta search at depth {depth}. "
        f"Estimated board score: {score}."
    )
    return int(col), explanation

def board_winner(board: List[List[int]]) -> str:
    if winning_move(board, HUMAN):
        return "human"
    if winning_move(board, AI):
        return "ai"
    if len(valid_moves(board)) == 0:
        return "draw"
    return "ongoing"

def simulate_ai_vs_ai(depth: int = 3):
    board = create_board()
    moves = []
    turn_piece = HUMAN
    turn_number = 1

    while not is_terminal(board):
        # use same engine, but swap perspective by temporarily remapping pieces when needed
        if turn_piece == AI:
            col, explanation = get_ai_move(board, depth)
        else:
            # lighter heuristic for player 1 so simulation feels less robotic-perfect
            legal = valid_moves(board)
            scored = []
            for col in legal:
                temp = copy.deepcopy(board)
                apply_move(temp, col, HUMAN)
                scored.append((score_position(temp, HUMAN), col))
            scored.sort(reverse=True)
            col = scored[0][1]
            explanation = f"AI (player 1) picked column {col} to improve shape and center control."

        apply_move(board, col, turn_piece)

        moves.append({
            "turn_number": turn_number,
            "player": "P1" if turn_piece == HUMAN else "P2",
            "move_data": str(col),
            "explanation": explanation
        })
        turn_piece = AI if turn_piece == HUMAN else HUMAN
        turn_number += 1

    return {
        "game": "connect4",
        "winner": board_winner(board),
        "final_board": board,
        "moves": moves
    }
