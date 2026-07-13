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

        {/* Stats */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">800+</div>
            <div className="text-xs text-gray-400">Vocabulaire</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">100+</div>
            <div className="text-xs text-gray-400">Kanji</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">80+</div>
            <div className="text-xs text-gray-400">Points de grammaire</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold mb-1">Flashcards SRS</h3>
            <p className="text-sm text-gray-400">Répétition espacée pour mémoriser durablement</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold mb-1">Quiz</h3>
            <p className="text-sm text-gray-400">Teste tes connaissances en vocabulaire et grammaire</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">🔊</div>
            <h3 className="font-semibold mb-1">Écoute</h3>
            <p className="text-sm text-gray-400">Phrases et dialogues avec synthèse vocale</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 text-left">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-1">Exercices JLPT</h3>
            <p className="text-sm text-gray-400">Entraîne-toi comme le jour de l&apos;examen</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-12 text-left">
          <h2 className="text-lg font-bold mb-4 text-center">Comment ça marche ?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-sm">Choisis ta catégorie</div>
                <div className="text-xs text-gray-400">Vocabulaire, kanji ou grammaire</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-sm">Évalue ta maîtrise</div>
                <div className="text-xs text-gray-400">Dur, OK ou facile — le système adapte les révisions</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-sm">Progresse chaque jour</div>
                <div className="text-xs text-gray-400">Suis ta progression et garde ta série d&apos;étude</div>
              </div>
            </div>
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

        {/* Footer */}
        <p className="text-xs text-gray-300 mt-12">
          Prépare-toi au JLPT N5 avec N5 Sensei
        </p>
      </div>
    </div>
  );
}
