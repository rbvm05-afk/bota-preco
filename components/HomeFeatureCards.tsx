"use client";

import { useState } from "react";

const items = [
  { icon: "😵‍💫", title: "Preço no chute", summary: "Vender bastante e ainda não ver o dinheiro sobrar.", detail: "Quando o preço nasce no achismo, fica fácil cobrar menos do que deveria. O Bota Preço organiza a conta para você decidir com mais segurança." },
  { icon: "🕵️", title: "Custos escondidos", summary: "Taxa, perda, embalagem e gasto extra também comem lucro.", detail: "A conta não para nos ingredientes. Rapidin inclui os principais custos e o Completão pode aprofundar tudo o que fizer sentido para o seu produto." },
  { icon: "⏱️", title: "Trabalho de graça", summary: "Seu tempo precisa entrar no preço — não virar favor.", detail: "Você informa quanto tempo leva e quanto quer receber pelo seu trabalho. A ferramenta transforma isso em parte real do custo." },
  { icon: "✅", title: "Uma conta que fecha", summary: "Perguntas simples, conta organizada e preço explicado.", detail: "Você responde do seu jeito. O Bota Preço junta custos, perdas, taxas, tempo e margem para mostrar um preço que você consegue entender e defender." },
];

export function HomeFeatureCards() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="Como o Bota Preço ajuda">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <button key={item.title} type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : index)} className={`feature-card group text-left ${isOpen ? "feature-card-open" : ""}`}>
            <span className="feature-icon" aria-hidden="true">{item.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-3">
                <strong className="text-base font-black leading-tight">{item.title}</strong>
                <span className="feature-plus" aria-hidden="true">+</span>
              </span>
              <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{item.summary}</span>
              <span className="feature-detail">{item.detail}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
