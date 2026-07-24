"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { money } from "@/lib/calculator";
import { clearCalculations, getCalculations, type SavedCalculation } from "@/lib/storage";

export default function HistoricoPage() {
  const [items, setItems] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    setItems(getCalculations());
  }, []);

  const clear = () => {
    clearCalculations();
    setItems([]);
  };

  return (
    <AppShell compact>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-bold text-[var(--green)]">Seus produtos</p>
          <h1 className="text-4xl font-black tracking-tight">Meus cálculos</h1>
        </div>
        {items.length > 0 ? (
          <button onClick={clear} className="text-sm font-black text-[var(--red)]">
            Limpar tudo
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-white p-8 text-center">
          <h2 className="text-2xl font-black">Ainda não há nada guardado.</h2>
          <p className="mt-3 text-[var(--muted)]">
            Quando você terminar uma conta, ela aparece aqui.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-2xl bg-[var(--green)] px-6 py-4 font-black text-white"
          >
            Fazer meu primeiro cálculo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-[var(--border)] bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-xs font-black uppercase text-[var(--green)]">
                    {item.mode}
                  </span>
                  <h2 className="mt-3 text-xl font-black">{item.input.productName}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {new Date(item.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm text-[var(--muted)]">Preço verde</span>
                  <strong className="text-2xl">{money(item.result.healthyPrice)}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
