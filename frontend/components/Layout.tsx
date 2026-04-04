import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("asa_token");

  const logout = () => {
    localStorage.removeItem("asa_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-wide">
            AI Strategy Arena
          </Link>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/games">Games</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/profile">Profile</Link>
            {!isLoggedIn ? (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register" className="rounded bg-indigo-600 px-3 py-2 text-white">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={logout} className="rounded bg-slate-800 px-3 py-2">
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
