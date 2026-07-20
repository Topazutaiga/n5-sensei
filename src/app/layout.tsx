import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "N5 Sensei - Apprends le japonais JLPT N5",
  description:
    "Apprends le japonais niveau JLPT N5 avec des flashcards SRS, quiz, exercices d'écoute et exercices type examen. Vocabulaire, kanji et grammaire pour réussir le JLPT N5.",
  keywords: ["japonais", "JLPT", "N5", "apprendre japonais", "flashcards", "kanji", "vocabulaire japonais"],
  openGraph: {
    title: "N5 Sensei - Apprends le japonais JLPT N5",
    description: "Flashcards, quiz et exercices pour réussir le JLPT N5.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "N5 Sensei",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icon-192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "N5 Sensei",
    "msapplication-tilecolor": "#ef4444",
    "msapplication-tileimage": "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
