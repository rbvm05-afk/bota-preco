"use client";

import { useEffect, useState } from "react";
import { CompletaoWizard } from "@/components/CompletaoWizard";
import {
  loadCompletaoStash,
  clearCompletaoStash,
  saveCompletaoParent,
} from "@/lib/continuity";
import { saveDraft } from "@/lib/DraftManager";

export default function CompletaoPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stash = loadCompletaoStash();
    if (stash?.input) {
      saveDraft("completao", stash.input, 0);
      saveCompletaoParent({
        parentId: stash.parentId,
        rapidinHealthyPrice: stash.rapidinHealthyPrice,
      });
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

  return <CompletaoWizard />;
}
