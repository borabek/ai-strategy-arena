import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import SectionTitle from "../components/SectionTitle";
import { apiRequest } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      localStorage.setItem("asa_token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg">
        <SectionTitle title="Create account" subtitle="Start building your match history and stats." />
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Full name"
            value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" placeholder="Password" type="password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button disabled={loading} className="w-full rounded-lg bg-indigo-600 p-3 font-semibold">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
