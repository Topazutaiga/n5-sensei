"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { I18nProvider, useI18n } from "@/lib/i18n";
import SakuraPetals from "@/components/SakuraPetals";
import HeartsDisplay from "@/components/HeartsDisplay";
import type { VocabItem, KanjiItem, GrammarItem } from "@/data";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "dashboard" as const, icon: "📊" },
  { href: "/dashboard/learn", labelKey: "learn" as const, icon: "⚡" },
  { href: "/dashboard/quiz", labelKey: "quiz" as const, icon: "📝" },
  { href: "/dashboard/listening", labelKey: "listening" as const, icon: "🔊" },
  { href: "/dashboard/exercises", labelKey: "exercises" as const, icon: "🎯" },
];

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useI18n();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ type: string; jp: string; mean: string; read: string }[]>([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    import("@/data").then((data) => {
      const out: typeof results = [];
      const searchIn = (arr: (VocabItem | KanjiItem | GrammarItem)[], type: string) => {
        if (!arr) return;
        arr.forEach((item) => {
          if (item.jp?.toLowerCase().includes(q) || item.mean?.toLowerCase().includes(q) || item.meanEn?.toLowerCase().includes(q) || item.read?.toLowerCase().includes(q)) {
            out.push({ type, jp: item.jp, mean: item.mean || item.meanEn, read: item.read || "" });
          }
        });
      };
      searchIn(data.VOCAB, lang === "en" ? "vocab" : "vocab");
      searchIn(data.KANJI, "kanji");
      searchIn(data.GRAMMAR, "grammar");
      setResults(out.slice(0, 20));
    });
  }, [query, lang]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) { window.addEventListener("keydown", handler); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="bg-white dark:bg-[#1a1816] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === "en" ? "Search vocabulary, kanji, grammar..." : "Cherche vocabulaire, kanji, grammaire..."}
            className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          />
          {query && <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && query.trim() && (
            <p className="text-center text-gray-400 py-8 text-sm">{lang === "en" ? "No results" : "Aucun résultat"}</p>
          )}
          {results.map((r, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                r.type === "kanji" ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                r.type === "grammar" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                "bg-green-100 dark:bg-green-900/30 text-green-600"
              }`}>
                {r.type === "kanji" ? "漢字" : r.type === "grammar" ? "文法" : "単語"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{r.jp}</div>
                {r.read && <div className="text-xs text-gray-400">{r.read}</div>}
              </div>
              <div className="text-sm text-gray-500 text-right flex-shrink-0 max-w-[40%] truncate">{r.mean}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseClient();
  const { t, lang, toggleLang } = useI18n();
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/auth/login");
      else setLoading(false);
    });
  }, [supabase, router]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/");
  }, [supabase, router]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#1a1816] dark:to-[#1e1b18]">
      <SakuraPetals />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-[#1a1816]/80 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <Link href="/dashboard" className="text-xl font-bold">
            N5 <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Sensei</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <HeartsDisplay compact />
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={lang === "en" ? "Search" : "Rechercher"}
            >
              🔍
            </button>
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-red-300 transition-colors flex-shrink-0"
            >
              {lang === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ⚙️
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-[#252220] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 w-36">
                    <button onClick={() => { setMenuOpen(false); logout(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
                      🚪 {t("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-5 pb-24">{children}</main>

      {/* Bottom Navigation Bar (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1a1816]/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe">
        <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all min-w-0 ${
                  isActive
                    ? "text-red-500"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <span className={`text-xl transition-transform ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
                <span className={`text-[10px] font-semibold leading-tight ${isActive ? "opacity-100" : "opacity-70"}`}>
                  {t(item.labelKey)}
                </span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-400 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
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
