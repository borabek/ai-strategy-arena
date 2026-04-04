import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SectionTitle from "../components/SectionTitle";
import { apiRequest } from "../lib/api";

export default function LeaderboardPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/leaderboard")
      .then(setRows)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Layout>
      <SectionTitle
        title="Leaderboard"
        subtitle="Top players ranked by wins, then total matches."
      />

      {error ? <p className="rounded-xl border border-rose-700 bg-rose-950/40 p-4 text-rose-300">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-sm text-slate-400">
            <tr>
              <th className="px-4 py-4">Rank</th>
              <th className="px-4 py-4">Player</th>
              <th className="px-4 py-4">Wins</th>
              <th className="px-4 py-4">Draws</th>
              <th className="px-4 py-4">Matches</th>
              <th className="px-4 py-4">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.user_id} className="border-t border-slate-800">
                <td className="px-4 py-4">{row.rank}</td>
                <td className="px-4 py-4 font-medium">{row.name}</td>
                <td className="px-4 py-4">{row.wins}</td>
                <td className="px-4 py-4">{row.draws}</td>
                <td className="px-4 py-4">{row.total_matches}</td>
                <td className="px-4 py-4">{row.win_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="p-4 text-slate-400">No leaderboard data yet.</p> : null}
      </div>
    </Layout>
  );
}
