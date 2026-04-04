import { useState } from "react";
import Layout from "../../components/Layout";
import SectionTitle from "../../components/SectionTitle";
import { apiRequest } from "../../lib/api";

function checkWinner(board: string[]) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  if (board.every(Boolean)) {
    return "draw";
  }
  return null;
}

function findBestMove(board: string[]) {
  const available = board.map((value, index) => value === "" ? index : -1).filter((value) => value !== -1);
  for (const move of available) {
    const next = [...board];
    next[move] = "O";
    if (checkWinner(next) === "O") {
      return { move, explanation: `AI placed on tile ${move} to finish an immediate win.` };
    }
  }
  for (const move of available) {
    const next = [...board];
    next[move] = "X";
    if (checkWinner(next) === "X") {
      return { move, explanation: `AI blocked tile ${move} to stop your next winning line.` };
    }
  }
  const priority = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  const move = priority.find((index) => board[index] === "") ?? available[0];
  return { move, explanation: `AI selected tile ${move} to improve future board control.` };
}

export default function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [message, setMessage] = useState("Your turn");
  const [moves, setMoves] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  async function saveMatch(result: string) {
    setSaving(true);
    try {
      await apiRequest("/matches", {
        method: "POST",
        body: JSON.stringify({
          game_slug: "tictactoe",
          result,
          difficulty: "medium",
          opponent: "ai",
          summary: `Finished Tic Tac Toe match with result: ${result}`,
          moves
        })
      });
      setMessage((prev) => `${prev} — match saved`);
    } catch (err: any) {
      setMessage((prev) => `${prev} — save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function handleClick(index: number) {
    if (board[index] || checkWinner(board)) {
      return;
    }

    const humanBoard = [...board];
    humanBoard[index] = "X";

    const updatedMoves = [
      ...moves,
      {
        turn_number: moves.length + 1,
        player: "human",
        move_data: String(index),
        explanation: `Player chose tile ${index}.`
      }
    ];

    const humanWinner = checkWinner(humanBoard);
    if (humanWinner) {
      setBoard(humanBoard);
      setMoves(updatedMoves);
      const result = humanWinner === "draw" ? "draw" : "win";
      setMessage(humanWinner === "draw" ? "Draw game" : "You win");
      saveMatch(result);
      return;
    }

    const ai = findBestMove(humanBoard);
    const aiBoard = [...humanBoard];
    aiBoard[ai.move] = "O";

    const finalMoves = [
      ...updatedMoves,
      {
        turn_number: updatedMoves.length + 1,
        player: "ai",
        move_data: String(ai.move),
        explanation: ai.explanation
      }
    ];

    setBoard(aiBoard);
    setMoves(finalMoves);

    const aiWinner = checkWinner(aiBoard);
    if (aiWinner) {
      const result = aiWinner === "draw" ? "draw" : "loss";
      setMessage(aiWinner === "draw" ? "Draw game" : "AI wins");
      saveMatch(result);
    } else {
      setMessage(ai.explanation);
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(""));
    setMoves([]);
    setMessage("Your turn");
  }

  return (
    <Layout>
      <SectionTitle
        title="Tic Tac Toe"
        subtitle="Playable version with simple AI reasoning and persistent match saving."
      />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="board-cell h-28 text-4xl font-bold"
            >
              {cell}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Match feed</h2>
          <p className="mt-3 text-slate-300">{message}</p>
          <button onClick={resetGame} className="mt-4 rounded-lg bg-indigo-600 px-4 py-3 font-semibold">
            New game
          </button>
          <p className="mt-4 text-sm text-slate-500">{saving ? "Saving match..." : "Finished games are stored in history."}</p>

          <div className="mt-6 space-y-3">
            {moves.map((move, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm">
                <p className="font-semibold capitalize">{move.player}</p>
                <p>Move: {move.move_data}</p>
                <p className="text-slate-400">{move.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
