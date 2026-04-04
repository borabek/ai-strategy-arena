import Link from "next/link";
import Layout from "../../components/Layout";
import SectionTitle from "../../components/SectionTitle";

const games = [
  {
    title: "Tic Tac Toe",
    slug: "tictactoe",
    description: "Small board, perfect information, minimax-driven AI."
  },
  {
    title: "Connect 4",
    slug: "connect4",
    description: "Larger board, alpha-beta pruning, board evaluation, and deeper tactics."
  }
];

export default function GamesPage() {
  return (
    <Layout>
      <SectionTitle
        title="Games"
        subtitle="Pick a game and challenge the AI. Every finished match can be stored with replay data."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {games.map((game) => (
          <div key={game.slug} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">{game.title}</h2>
            <p className="mt-3 text-slate-400">{game.description}</p>
            <Link href={`/games/${game.slug}`} className="mt-6 inline-block rounded-xl bg-indigo-600 px-4 py-3 font-semibold">
              Open game
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
}
