"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "dashboard" as const, icon: "📊" },
  { href: "/dashboard/learn", labelKey: "learn" as const, icon: "⚡" },
  { href: "/dashboard/quiz", labelKey: "quiz" as const, icon: "📝" },
  { href: "/dashboard/listening", labelKey: "listening" as const, icon: "🔊" },
  { href: "/dashboard/exercises", labelKey: "exercises" as const, icon: "🎯" },
];

function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClient();
  const { t, lang, toggleLang } = useI18n();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/auth/login");
      else setLoading(false);
    });
  }, [supabase, router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a1816] dark:to-[#1e1b18]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1a1816] dark:via-[#1e1b18] dark:to-[#1a1816]">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#1a1816]/80 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Link href="/dashboard" className="text-xl font-bold">
            N5 <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Sensei</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 transition-colors"
            >
              {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
            <button onClick={logout} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      <nav className="sticky top-[52px] z-40 bg-white/80 dark:bg-[#1a1816]/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-0.5 p-1 mx-4 max-w-lg overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                pathname === item.href
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-md"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{t(item.labelKey)}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <DashboardNav>{children}</DashboardNav>
    </I18nProvider>
  );
}
