import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#1a1816] dark:via-[#1e1b18] dark:to-[#1a1816]">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 shadow-lg mb-6">
            <span className="text-4xl">日本語</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            N5 <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Sensei</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Apprends le japonais niveau JLPT N5 avec des flashcards, quiz et exercices d&apos;écoute.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-1">Flashcards</h3>
            <p className="text-sm text-gray-400">Vocabulaire, kanji et grammaire</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold mb-1">Quiz</h3>
            <p className="text-sm text-gray-400">Teste tes connaissances</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">🔊</div>
            <h3 className="font-semibold mb-1">Écoute</h3>
            <p className="text-sm text-gray-400">Phrases et dialogues N5</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-1">Exercices</h3>
            <p className="text-sm text-gray-400">Type examen JLPT N5</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-400 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg hover:border-red-300 transition-colors"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
