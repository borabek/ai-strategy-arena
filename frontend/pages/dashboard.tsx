import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import { apiRequest } from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiRequest("/auth/me"),
      apiRequest("/users/me/stats"),
      apiRequest("/matches/history")
    ])
      .then(([me, statsData, history]) => {
        setUser(me);
        setStats(statsData);
        setMatches(history);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Layout>
      <SectionTitle
        title={user ? `Welcome back, ${user.full_name}` : "Dashboard"}
        subtitle="Track your performance, review old matches, and jump into your next game."
      />

      {error ? (
        <div className="rounded-xl border border-rose-700 bg-rose-950/40 p-4 text-rose-300">
          {error}
        </div>
      ) : null}

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Matches" value={stats.total_matches} />
          <StatCard title="Wins" value={stats.wins} />
          <StatCard title="Losses" value={stats.losses} />
          <StatCard title="Win Rate" value={`${stats.win_rate}%`} />
          <StatCard title="Favorite Game" value={stats.favorite_game || "—"} />
        </div>
      ) : (
        <p className="text-slate-400">Loading stats...</p>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent matches</h2>
            <Link href="/games" className="text-sm text-indigo-300">Play now</Link>
          </div>

          {matches.length === 0 ? (
            <p className="text-slate-400">No matches yet. Play a game and your history will appear here.</p>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 8).map((match) => (
                <div key={match.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{match.game}</p>
                      <p className="text-sm text-slate-400">{match.summary || "No summary"}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="capitalize text-slate-200">{match.result}</p>
                      <p className="text-slate-500">{new Date(match.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href={`/replay/${match.id}`} className="text-sm text-indigo-300">Open replay</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link href="/games/tictactoe" className="block rounded-xl border border-slate-800 bg-slate-950 p-4">
              Play Tic Tac Toe
            </Link>
            <Link href="/games/connect4" className="block rounded-xl border border-slate-800 bg-slate-950 p-4">
              Play Connect 4
            </Link>
            <Link href="/simulations" className="block rounded-xl border border-slate-800 bg-slate-950 p-4">
              Watch AI vs AI
            </Link>
            <Link href="/leaderboard" className="block rounded-xl border border-slate-800 bg-slate-950 p-4">
              View Leaderboard
            </Link>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
