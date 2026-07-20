"use client";

import Flashcards from "@/components/Flashcards";
import Mascot from "@/components/Mascot";
import { getGamification } from "@/lib/gamification";
import { useEffect, useState } from "react";

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);
  const [gam, setGam] = useState(getGamification());

  useEffect(() => {
    setMounted(true);
    setGam(getGamification());
  }, []);

  return (
    <div>
      {mounted && (
        <Mascot gam={gam} compact className="mb-4" />
      )}
      <Flashcards />
    </div>
  );
}
