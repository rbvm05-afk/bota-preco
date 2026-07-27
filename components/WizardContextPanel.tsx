"use client";

import type { WizardContextItem } from "@/src/domain/wizard";

/**
 * Painel de contexto do assistente.
 * Hoje: dicas/nudges do domínio.
 * Futuro: imagens, vídeo, IA, checklist — sem mudar a API do componente.
 */
export function WizardContextPanel({ items }: { items: WizardContextItem[] }) {
  if (!items.length) return null;

  return (
    <aside className="wizard-context" aria-label="Dica do assistente">
      {items.map((item) => (
        <p key={item.id} className={`wizard-context-item wizard-context-${item.kind}`}>
          <span className="wizard-context-mark" aria-hidden="true">
            {item.kind === "tip" ? "💡" : item.kind === "warning" ? "⚠️" : "🤝"}
          </span>
          <span>{item.text}</span>
        </p>
      ))}
    </aside>
  );
}
