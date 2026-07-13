"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

type Lang = "fr" | "en";

const translations = {
  fr: {
    app_name: "N5 Sensei",
    dashboard: "Tableau",
    learn: "Apprendre",
    quiz: "Quiz",
    listening: "Écoute",
    exercises: "Exercices",
    logout: "Déconnexion",
    welcome: "Bienvenue",
    reviewed: "revus",
    mastered: "maîtrisés",
    streak: "jours",
    start_learning: "Commencer à apprendre",
    take_quiz: "Faire un quiz",
    listening_practice: "Pratiquer l'écoute",
    jlpt_exercises: "Exercices JLPT",
    flashcards: "Flashcards",
    flashcards_desc: "Vocabulaire, kanji et grammaire",
    quiz_desc: "Teste tes connaissances",
    listening_desc: "Phrases et dialogues N5",
    exercises_desc: "Exercices type examen",
    vocabulaire: "Vocabulaire",
    kanji: "Kanji",
    grammaire: "Grammaire",
    mixte: "Mixte",
    phrases: "Phrases",
    dialogues: "Dialogues",
    hard: "Dur",
    ok: "OK",
    easy: "Facile",
    restart: "Recommencer",
    session_done: "Session terminée !",
    question: "Question",
    correct_answers: "bonnes réponses",
    answer: "Réponse",
    listen: "Écouter",
    listening_status: "Écoute en cours...",
    press_listen: "Appuie sur Écouter",
    slow: "Lent",
    normal: "Normal",
    fast: "Rapide",
    login: "Connexion",
    register: "S'inscrire",
    email: "Email",
    password: "Mot de passe",
    no_account: "Pas de compte ?",
    has_account: "Déjà un compte ?",
    create_account: "Créer mon compte",
    creating: "Création...",
    logging_in: "Connexion...",
    check_email: "Vérifie ta boîte mail",
    check_email_desc: "On t'a envoyé un lien de confirmation.",
    back_login: "Retour à la connexion",
    which_meaning: "Quelle est la signification ?",
    sentence_completion: "Complète la phrase",
    reading: "Lecture",
    fill_blank: "Remplace le mot manquant",
    which_reading: "Quelle est la bonne lecture ?",
    score: "Score",
    progress: "Progression",
    home: "Accueil",
    choose_answer: "Choisis la réponse",
    module: "Module",
    all: "Tout",
  },
  en: {
    app_name: "N5 Sensei",
    dashboard: "Dashboard",
    learn: "Learn",
    quiz: "Quiz",
    listening: "Listening",
    exercises: "Exercises",
    logout: "Logout",
    welcome: "Welcome",
    reviewed: "reviewed",
    mastered: "mastered",
    streak: "days",
    start_learning: "Start learning",
    take_quiz: "Take a quiz",
    listening_practice: "Practice listening",
    jlpt_exercises: "JLPT Exercises",
    flashcards: "Flashcards",
    flashcards_desc: "Vocabulary, kanji and grammar",
    quiz_desc: "Test your knowledge",
    listening_desc: "N5 phrases and dialogues",
    exercises_desc: "Exam-style exercises",
    vocabulaire: "Vocabulary",
    kanji: "Kanji",
    grammaire: "Grammar",
    mixte: "Mixed",
    phrases: "Phrases",
    dialogues: "Dialogues",
    hard: "Hard",
    ok: "OK",
    easy: "Easy",
    restart: "Restart",
    session_done: "Session done!",
    question: "Question",
    correct_answers: "correct answers",
    answer: "Answer",
    listen: "Listen",
    listening_status: "Listening...",
    press_listen: "Press Listen",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
    login: "Login",
    register: "Sign up",
    email: "Email",
    password: "Password",
    no_account: "No account?",
    has_account: "Already have an account?",
    create_account: "Create account",
    creating: "Creating...",
    logging_in: "Logging in...",
    check_email: "Check your email",
    check_email_desc: "We sent you a confirmation link.",
    back_login: "Back to login",
    which_meaning: "What is the meaning?",
    sentence_completion: "Complete the sentence",
    reading: "Reading",
    fill_blank: "Replace the missing word",
    which_reading: "What is the correct reading?",
    score: "Score",
    progress: "Progress",
    home: "Home",
    choose_answer: "Choose the answer",
    module: "Module",
    all: "All",
  },
} as const;

interface I18nContextType {
  lang: Lang;
  t: (key: keyof typeof translations.fr) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: "fr",
  t: (key) => key,
  toggleLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("n5sensei_lang") as Lang | null;
    if (saved === "fr" || saved === "en") setLang(saved);
    setReady(true);
  }, []);

  const t = useCallback(
    (key: keyof typeof translations.fr): string => {
      return translations[lang][key] || translations.fr[key] || key;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    setLang((l) => {
      const next = l === "fr" ? "en" : "fr";
      localStorage.setItem("n5sensei_lang", next);
      return next;
    });
  }, []);

  if (!ready) return null;

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
