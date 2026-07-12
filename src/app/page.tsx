import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-[#1a1816]">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">
          N5 <span className="text-[#c0392b]">Sensei</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Apprends le japonais niveau JLPT N5 avec des flashcards, quiz et exercices d&apos;écoute.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Flashcards</h3>
            <p className="text-sm text-gray-500">Vocabulaire, kanji et grammaire</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold mb-1">Quiz</h3>
            <p className="text-sm text-gray-500">Teste tes connaissances</p>
          </div>
          <div className="bg-white dark:bg-[#252220] rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">🔊</div>
            <h3 className="font-semibold mb-1">Écoute</h3>
            <p className="text-sm text-gray-500">Phrases et dialogues N5</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-[#c0392b] text-white rounded-xl font-semibold hover:bg-[#e74c3c] transition-colors"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-[#c0392b] transition-colors"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
