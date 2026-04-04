import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import { apiRequest } from "../lib/api";

export default function ProfilePage() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiRequest("/auth/me"), apiRequest("/users/me/stats")])
      .then(([userData, statsData]) => {
        setUser(userData);
        setStats(statsData);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Layout>
      <SectionTitle
        title="Profile"
        subtitle="Your account details and performance across the arena."
      />

      {error ? <p className="rounded-xl border border-rose-700 bg-rose-950/40 p-4 text-rose-300">{error}</p> : null}

      {user ? (
        <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Name</p>
          <p className="mt-1 text-xl font-semibold">{user.full_name}</p>
          <p className="mt-4 text-sm text-slate-400">Email</p>
          <p className="mt-1 text-lg">{user.email}</p>
        </div>
      ) : null}

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Matches" value={stats.total_matches} />
          <StatCard title="Wins" value={stats.wins} />
          <StatCard title="Losses" value={stats.losses} />
          <StatCard title="Draws" value={stats.draws} />
          <StatCard title="Win Rate" value={`${stats.win_rate}%`} />
        </div>
      ) : (
        <p className="text-slate-400">Loading profile analytics...</p>
      )}

      {stats ? (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>• Favorite game: {stats.favorite_game || "Not enough data yet"}</li>
            <li>• Your current win rate: {stats.win_rate}%</li>
            <li>• Use replay pages to review AI and player decisions move by move.</li>
          </ul>
        </div>
      ) : null}
    </Layout>
  );
}
