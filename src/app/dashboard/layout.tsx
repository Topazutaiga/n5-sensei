"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Tableau", icon: "📊" },
  { href: "/dashboard/learn", label: "Apprendre", icon: "⚡" },
  { href: "/dashboard/quiz", label: "Quiz", icon: "📝" },
  { href: "/dashboard/listening", label: "Écoute", icon: "🔊" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth/login");
      else setLoading(false);
    });
  }, [supabase, router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] dark:bg-[#1a1816]">
        <div className="text-lg text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-[#1a1816]">
      <header className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <Link href="/dashboard" className="text-xl font-bold">
          N5 <span className="text-[#c0392b]">Sensei</span>
        </Link>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
          Déconnexion
        </button>
      </header>

      <nav className="flex gap-1 p-1 bg-white dark:bg-[#252220] rounded-xl shadow-sm mx-4 max-w-lg">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-lg transition-colors ${
              pathname === item.href ? "bg-[#c0392b] text-white" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
