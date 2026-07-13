"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SakuraPetals from "./SakuraPetals";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Si email confirmation OFF, la session est créée directement
    if (data.session) {
      router.push("/dashboard");
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <>
        <SakuraPetals />
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <div className="bg-white/80 dark:bg-[#252220]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-lg font-semibold mb-2">Vérifie ta boîte mail</h2>
              <p className="text-sm text-gray-500 mb-4">On t&apos;a envoyé un lien de confirmation.</p>
              <Link href="/auth/login" className="text-sm text-red-500 font-semibold">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SakuraPetals />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 shadow-lg mb-4">
              <span className="text-2xl">🌸</span>
            </div>
            <h1 className="text-2xl font-bold">
              N5 <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Sensei</span>
            </h1>
          </div>
          <div className="bg-white/80 dark:bg-[#252220]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-6">Créer un compte</h2>
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
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-red-400 outline-none transition-colors bg-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Déjà un compte ?{" "}
              <Link href="/auth/login" className="text-red-500 font-semibold hover:text-red-600">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
