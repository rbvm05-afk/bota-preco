"use client";

import { useEffect, useState } from "react";
import { PricingWizard } from "@/components/PricingWizard";
import { loadCompletaoStash, clearCompletaoStash } from "@/lib/continuity";
import { saveDraft } from "@/lib/DraftManager";

/**
 * Ao vir do Rapidin, grava o input no draft do Completão
 * para o PricingWizard hidratar automaticamente.
 */
export default function CompletaoPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stash = loadCompletaoStash();
    if (stash?.input) {
      saveDraft("completao", stash.input, 0);
      clearCompletaoStash();
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <p className="font-black text-[var(--muted)]">Preparando o Completão…</p>
      </main>
    );
  }

  return <PricingWizard mode="completao" />;
}
