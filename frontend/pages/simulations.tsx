import { useState } from "react";
import Layout from "../components/Layout";
import SectionTitle from "../components/SectionTitle";
import { apiRequest } from "../lib/api";

export default function SimulationsPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState("");

  async function run(game: "tictactoe" | "connect4") {
    setLoading(game);
    setResult(null);
    try {
      const data = await apiRequest(`/simulations/${game}`, { method: "POST" });
      setResult(data);
    } finally {
      setLoading("");
    }
  }

  return (
    <Layout>
      <SectionTitle
        title="AI vs AI Simulations"
        subtitle="Watch the engines play each other and inspect their move-by-move reasoning."
      />

      <div className="mb-6 flex gap-4">
        <button onClick={() => run("tictactoe")} className="rounded-lg bg-indigo-600 px-4 py-3 font-semibold">
          {loading === "tictactoe" ? "Running..." : "Run Tic Tac Toe"}
        </button>
        <button onClick={() => run("connect4")} className="rounded-lg border border-slate-700 px-4 py-3 font-semibold">
          {loading === "connect4" ? "Running..." : "Run Connect 4"}
        </button>
      </div>

      {result ? (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Game</p>
            <p className="mt-1 text-2xl font-bold">{result.game}</p>
            <p className="mt-4 text-sm text-slate-400">Winner</p>
            <p className="mt-1 text-xl font-semibold capitalize">{result.winner}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Move log</h2>
            <div className="mt-4 max-h-[480px] space-y-3 overflow-auto pr-1">
              {result.moves.map((move: any, index: number) => (
                <div key={index} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm">
                  <p className="font-semibold">
                    Turn {move.turn_number} — {move.player}
                  </p>
                  <p>Move: {move.move_data}</p>
                  <p className="text-slate-400">{move.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-slate-400">No simulation yet. Run one above.</p>
      )}
    </Layout>
  );
}
