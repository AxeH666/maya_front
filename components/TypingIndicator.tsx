"use client";

import { useState, useEffect } from "react";

export default function TypingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start mb-4">
      <div className="rounded-2xl bg-black/60 border border-neonPink/40 px-4 py-2.5 text-neonPink text-sm shadow-[0_0_15px_rgba(255,78,205,0.3)]">
        MAYA is thinking{dots}
      </div>
    </div>
  );
}

