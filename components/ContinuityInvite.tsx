"use client";

import { useRouter } from "next/navigation";
import type { PricingInput } from "@/types/pricing";
import { stashForCompletao } from "@/lib/continuity";

export function ContinuityInvite({
  input,
  parentId,
}: {
  input: PricingInput;
  parentId?: string;
}) {
  const router = useRouter();

  const go = () => {
    stashForCompletao(input, parentId);
    router.push("/completao");
  };

  return (
    <section className="surface animate-rise rounded-[2rem] border-2 border-green-200 bg-gradient-to-b from-[var(--green-soft)] to-white p-6 sm:p-8">
      <p className="text-3xl" aria-hidden>
        🎉
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-[-.03em] sm:text-3xl">
        Seu preço já está pronto!
      </h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">
        Você já tem um preço calculado com base nas informações que informou. Mas ainda podemos
        deixá-lo mais preciso.
      </p>
      <p className="mt-2 leading-7 text-[var(--muted)]">
        O <strong>Completão</strong> analisa mais detalhes do seu negócio para entregar um preço
        ainda mais ajustado à sua realidade.
      </p>

      <ul className="mt-5 space-y-2 text-sm font-bold text-[var(--green-deep)]">
        <li>✅ Análise completa</li>
        <li>✅ Custos esquecidos</li>
        <li>✅ Embalagens detalhadas</li>
        <li>✅ Diagnóstico personalizado</li>
        <li>✅ Relatório muito mais completo</li>
      </ul>

      <div className="mt-6 rounded-2xl border border-green-200 bg-white p-4">
        <p className="text-sm font-black text-[var(--green)]">❤️ E a melhor parte</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
          É totalmente gratuito. Sem cobrança para desbloquear o resultado. Sem esconder o
          relatório. Sem assinatura. Sem taxas ocultas.
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Tudo o que você informou no Rapidin será aproveitado automaticamente — você não precisa
          preencher tudo de novo.
        </p>
      </div>

      <button
        type="button"
        onClick={go}
        className="mt-6 w-full rounded-2xl bg-[var(--green)] px-6 py-4 text-center text-lg font-black text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-[var(--green-dark)]"
      >
        Continuar no Completão →
      </button>
    </section>
  );
}
