import { useState } from "react";
import Layout from "../../components/Layout";
import SectionTitle from "../../components/SectionTitle";
import { apiRequest } from "../../lib/api";

const ROWS = 6;
const COLS = 7;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function dropPiece(board: number[][], col: number, piece: number) {
  const copy = board.map((row) => [...row]);
  for (let row = ROWS - 1; row >= 0; row--) {
    if (copy[row][col] === 0) {
      copy[row][col] = piece;
      return copy;
    }
  }
  return null;
}

function validMoves(board: number[][]) {
  const moves: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === 0) {
      moves.push(col);
    }
  }
  return moves;
}

function hasWinner(board: number[][], piece: number) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if ([0,1,2,3].every((i) => board[row][col + i] === piece)) return true;
    }
  }
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS; col++) {
      if ([0,1,2,3].every((i) => board[row + i][col] === piece)) return true;
    }
  }
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if ([0,1,2,3].every((i) => board[row + i][col + i] === piece)) return true;
    }
  }
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if ([0,1,2,3].every((i) => board[row - i][col + i] === piece)) return true;
    }
  }
  return false;
}

function isDraw(board: number[][]) {
  return validMoves(board).length === 0;
}

function aiMove(board: number[][]) {
  const legal = validMoves(board);

  for (const col of legal) {
    const next = dropPiece(board, col, 2);
    if (next && hasWinner(next, 2)) {
      return { col, explanation: `AI chose column ${col} to complete a four-in-a-row.` };
    }
  }

  for (const col of legal) {
    const next = dropPiece(board, col, 1);
    if (next && hasWinner(next, 1)) {
      return { col, explanation: `AI chose column ${col} to block your immediate threat.` };
    }
  }

  const centerFirst = [3, 2, 4, 1, 5, 0, 6];
  const col = centerFirst.find((candidate) => legal.includes(candidate)) ?? legal[0];
  return { col, explanation: `AI chose column ${col} to keep central control and future options open.` };
}

export default function Connect4Page() {
  const [board, setBoard] = useState<number[][]>(createBoard());
  const [message, setMessage] = useState("Your turn");
  const [moves, setMoves] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function saveMatch(result: string, finalMoves: any[]) {
    setSaving(true);
    try {
      await apiRequest("/matches", {
        method: "POST",
        body: JSON.stringify({
          game_slug: "connect4",
          result,
          difficulty: "medium",
          opponent: "ai",
          summary: `Finished Connect 4 match with result: ${result}`,
          moves: finalMoves
        })
      });
      setMessage((prev) => `${prev} — match saved`);
    } catch (err: any) {
      setMessage((prev) => `${prev} — save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function handleColumn(col: number) {
    const humanBoard = dropPiece(board, col, 1);
    if (!humanBoard) return;

    const humanMoves = [
      ...moves,
      {
        turn_number: moves.length + 1,
        player: "human",
        move_data: String(col),
        explanation: `Player dropped a piece into column ${col}.`
      }
    ];

    if (hasWinner(humanBoard, 1)) {
      setBoard(humanBoard);
      setMoves(humanMoves);
      setMessage("You win");
      saveMatch("win", humanMoves);
      return;
    }

    if (isDraw(humanBoard)) {
      setBoard(humanBoard);
      setMoves(humanMoves);
      setMessage("Draw game");
      saveMatch("draw", humanMoves);
      return;
    }

    const ai = aiMove(humanBoard);
    const aiBoard = dropPiece(humanBoard, ai.col, 2)!;
    const finalMoves = [
      ...humanMoves,
      {
        turn_number: humanMoves.length + 1,
        player: "ai",
        move_data: String(ai.col),
        explanation: ai.explanation
      }
    ];

    setBoard(aiBoard);
    setMoves(finalMoves);

    if (hasWinner(aiBoard, 2)) {
      setMessage("AI wins");
      saveMatch("loss", finalMoves);
      return;
    }

    if (isDraw(aiBoard)) {
      setMessage("Draw game");
      saveMatch("draw", finalMoves);
      return;
    }

    setMessage(ai.explanation);
  }

  function resetGame() {
    setBoard(createBoard());
    setMoves([]);
    setMessage("Your turn");
  }

  return (
    <Layout>
      <SectionTitle
        title="Connect 4"
        subtitle="Playable version with move saving, match history, and board-aware AI decisions."
      />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, col) => (
              <button key={col} onClick={() => handleColumn(col)} className="rounded-lg bg-indigo-600 px-2 py-3 text-sm font-semibold">
                Drop {col}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 rounded-2xl bg-sky-900 p-4">
            {board.flatMap((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="flex h-14 items-center justify-center rounded-full bg-slate-950">
                  <div className={`h-10 w-10 rounded-full ${
                    cell === 0 ? "bg-slate-700" : cell === 1 ? "bg-amber-400" : "bg-rose-500"
                  }`} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Game feed</h2>
          <p className="mt-3 text-slate-300">{message}</p>
          <button onClick={resetGame} className="mt-4 rounded-lg bg-indigo-600 px-4 py-3 font-semibold">
            New game
          </button>
          <p className="mt-4 text-sm text-slate-500">{saving ? "Saving match..." : "Each move is stored for replay."}</p>

          <div className="mt-6 max-h-[420px] space-y-3 overflow-auto pr-1">
            {moves.map((move, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm">
                <p className="font-semibold capitalize">{move.player}</p>
                <p>Column: {move.move_data}</p>
                <p className="text-slate-400">{move.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
