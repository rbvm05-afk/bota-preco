"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { money } from "@/src/domain/pricing";
import { stashForCompletao } from "@/lib/continuity";
import {
  clearCalculations,
  getCalculations,
  resolveCalculation,
  type SavedCalculation,
} from "@/lib/storage";

export default function HistoricoPage() {
  const [items, setItems] = useState<SavedCalculation[]>([]);
  const [tab, setTab] = useState<"rapidin" | "completao">("rapidin");

  useEffect(() => setItems(getCalculations()), []);

  const rapidin = useMemo(
    () => items.filter((i) => i.mode === "rapidin" || i.mode === "completin"),
    [items],
  );
  const completao = useMemo(
    () => items.filter((i) => i.mode === "completao"),
    [items],
  );

  const visible = tab === "rapidin" ? rapidin : completao;

  const clear = () => {
    clearCalculations();
    setItems([]);
  };

  const continueToCompletao = (item: SavedCalculation) => {
    stashForCompletao(item.input, item.id);
    window.location.href = "/completao";
  };

  return (
    <AppShell compact>
      <div className="animate-rise">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
              Seus produtos
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Meus cálculos</h1>
            <p className="mt-2 text-[var(--muted)]">
              Rapidin e Completão ficam separados — cada um no seu lugar.
            </p>
          </div>
          {items.length > 0 ? (
            <button
              onClick={clear}
              className="rounded-xl px-3 py-2 text-sm font-black text-[var(--red)] hover:bg-red-50"
            >
              Limpar tudo
            </button>
          ) : null}
        </div>

        <div className="mb-6 flex gap-2">
          <TabButton active={tab === "rapidin"} onClick={() => setTab("rapidin")} count={rapidin.length}>
            🥾 Rapidin
          </TabButton>
          <TabButton active={tab === "completao"} onClick={() => setTab("completao")} count={completao.length}>
            📋 Completão
          </TabButton>
        </div>

        {visible.length === 0 ? (
          <div className="surface rounded-[2rem] p-9 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--green-soft)] text-2xl">
              {tab === "rapidin" ? "🥾" : "📋"}
            </span>
            <h2 className="mt-5 text-2xl font-black">
              {tab === "rapidin"
                ? "Nenhum Rapidin guardado ainda."
                : "Nenhum Completão guardado ainda."}
            </h2>
            <p className="mt-3 text-[var(--muted)]">
              {tab === "rapidin"
                ? "Quando você terminar um cálculo rápido, ele aparece aqui."
                : "Diagnósticos completos ficam nesta lista."}
            </p>
            <Link
              href={tab === "rapidin" ? "/rapidin" : "/completao"}
              className="mt-6 inline-block rounded-2xl bg-[var(--green)] px-6 py-4 font-black text-white"
            >
              Começar →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((item) => {
              const resolved = resolveCalculation(item);
              return (
                <article
                  key={item.id}
                  className="surface rounded-3xl p-5 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[.14em] text-[var(--green)]">
                        {item.mode === "rapidin" || item.mode === "completin"
                          ? "Rapidin"
                          : "Completão"}
                      </span>
                      <h2 className="mt-3 text-xl font-black">{item.input.productName}</h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </p>
                      {(item.mode === "rapidin" || item.mode === "completin") && (
                        <button
                          type="button"
                          onClick={() => continueToCompletao(item)}
                          className="mt-3 text-sm font-black text-[var(--green)] underline"
                        >
                          Continuar no Completão →
                        </button>
                      )}
                    </div>
                    <div className="rounded-2xl bg-[var(--green-deep)] px-4 py-3 text-right text-white">
                      <span className="block text-xs text-white/65">Recomendado</span>
                      <strong className="mt-1 block text-xl">
                        {money(resolved.result.healthyPrice)}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
        active
          ? "bg-[var(--green)] text-white"
          : "border border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--green)]"
      }`}
    >
      {children}{" "}
      <span className={active ? "text-white/80" : "text-[var(--muted)]"}>({count})</span>
    </button>
  );
}
