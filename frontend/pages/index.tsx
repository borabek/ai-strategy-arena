import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-indigo-300">
            Full-stack AI game platform
          </p>
          <h1 className="text-5xl font-black leading-tight">
            Strategy games, explainable AI, real stats, and replayable matches.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-400">
            AI Strategy Arena is a portfolio-grade game platform where users can battle AI, watch AI-vs-AI simulations,
            track match history, and study move-by-move reasoning.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/register" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
              Get Started
            </Link>
            <Link href="/games" className="rounded-xl border border-slate-700 px-5 py-3 font-semibold">
              Explore Games
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">What makes it strong?</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>• Next.js frontend + FastAPI backend</li>
              <li>• JWT authentication and user accounts</li>
              <li>• Persistent match history and replay</li>
              <li>• Minimax and alpha-beta pruning AI</li>
              <li>• Leaderboard and performance analytics</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 p-6">
            <p className="text-sm text-slate-400">Portfolio angle</p>
            <p className="mt-2 text-2xl font-bold">Shows full-stack + AI + system design in one project.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
