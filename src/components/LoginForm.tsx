"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
      } else {
        setError("Pas de session créée. Vérifie tes identifiants.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("Erreur inattendue : " + (err.message || String(err)));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1a1816] dark:via-[#1e1b18] dark:to-[#1a1816] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 shadow-lg mb-4">
            <span className="text-2xl">日本語</span>
          </div>
          <h1 className="text-2xl font-bold">
            N5 <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Sensei</span>
          </h1>
        </div>
        <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-6">Connexion</h2>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-red-400 outline-none transition-colors bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-red-400 outline-none transition-colors bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Pas de compte ?{" "}
            <Link href="/auth/register" className="text-red-500 font-semibold hover:text-red-600">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
