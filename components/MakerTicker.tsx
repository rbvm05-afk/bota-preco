"use client";

import { useEffect, useState } from "react";

const creations = [
  { label: "brigadeiro", emoji: "🍫" },
  { label: "marmita", emoji: "🍱" },
  { label: "bolo", emoji: "🎂" },
  { label: "crochê", emoji: "🧶" },
  { label: "vela", emoji: "🕯️" },
  { label: "sabonete", emoji: "🧼" },
  { label: "doce", emoji: "🍬" },
  { label: "costura", emoji: "🪡" },
];

export function MakerTicker() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % creations.length);
    }, 1450);
    return () => window.clearInterval(timer);
  }, []);
  const current = creations[index];
  return (
    <div className="maker-ticker" aria-live="polite">
      <span>Feito para você que faz</span>
      <span className="maker-ticker-word" key={current.label}>
        <span aria-hidden="true">{current.emoji}</span> {current.label}
      </span>
    </div>
  );
}
