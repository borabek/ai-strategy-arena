import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import SectionTitle from "../../components/SectionTitle";
import { apiRequest } from "../../lib/api";

export default function ReplayPage() {
  const router = useRouter();
  const { id } = router.query;
  const [replay, setReplay] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    apiRequest(`/matches/${id}/replay`)
      .then(setReplay)
      .catch((err) => setError(err.message));
  }, [id]);

  function playReplay() {
    if (!replay) return;
    setCurrentStep(0);

    replay.moves.forEach((_: any, index: number) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, (index + 1) * 750);
    });
  }

  return (
    <Layout>
      <SectionTitle
        title={`Replay ${id ? `#${id}` : ""}`}
        subtitle="Review each move and inspect the reasoning behind it."
      />

      {error ? <p className="rounded-xl border border-rose-700 bg-rose-950/40 p-4 text-rose-300">{error}</p> : null}

      {!replay ? (
        <p className="text-slate-400">Loading replay...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Game</p>
            <p className="mt-1 text-2xl font-bold">{replay.game}</p>
            <p className="mt-4 text-sm text-slate-400">Result</p>
            <p className="mt-1 text-xl font-semibold capitalize">{replay.result}</p>

            <button onClick={playReplay} className="mt-6 rounded-lg bg-indigo-600 px-4 py-3 font-semibold">
              Play replay
            </button>

            <p className="mt-4 text-sm text-slate-400">
              Current step: {currentStep} / {replay.moves.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Move timeline</h2>
            <div className="mt-4 space-y-3">
              {replay.moves.map((move: any, index: number) => {
                const active = index < currentStep;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border p-3 text-sm ${
                      active
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <p className="font-semibold">
                      Turn {move.turn_number} — {move.player}
                    </p>
                    <p>Move: {move.move_data}</p>
                    <p className="text-slate-400">{move.explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
