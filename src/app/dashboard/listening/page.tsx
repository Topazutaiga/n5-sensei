"use client";

import ListeningExercise from "@/components/ListeningExercise";
import Mascot from "@/components/Mascot";
import { getGamification } from "@/lib/gamification";
import { useEffect, useState } from "react";

export default function ListeningPage() {
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
      <ListeningExercise />
    </div>
  );
}
