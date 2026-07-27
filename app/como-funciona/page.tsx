import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { HomeFeatureCards } from "@/components/HomeFeatureCards";

export default function ComoFuncionaPage() {
  return (
    <AppShell compact>
      <div className="animate-rise space-y-6">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
            Como funciona
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-[-.04em] sm:text-4xl">
            O preço não pode ser mais um peso
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[var(--muted)] leading-7">
            O Bota ajuda a enxergar o que o chute esconde — custos, tempo e margem —
            para você cobrar com segurança.
          </p>
        </div>

        <div className="surface rounded-[2rem] p-5 sm:p-7">
          <HomeFeatureCards />
        </div>

        <div className="surface rounded-[2rem] p-5 sm:p-7 space-y-4">
          <h2 className="text-xl font-black">Rapidin e Completão</h2>
          <p className="text-[var(--muted)] leading-7">
            <strong className="text-[var(--foreground)]">Rapidin</strong> é a conta rápida:
            perguntas essenciais e uma boa referência de preço em poucos minutos.
          </p>
          <p className="text-[var(--muted)] leading-7">
            <strong className="text-[var(--foreground)]">Completão</strong> aprofunda custos,
            perdas e detalhes quando você quer mais precisão.
          </p>
          <p className="text-[var(--muted)] leading-7">
            No final, o Smart Pricing explica o preço, mostra diagnóstico e deixa você
            simular “e se eu vender por X?”.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/rapidin"
            className="rounded-2xl bg-[var(--green)] px-6 py-4 text-center font-black text-white"
          >
            ⚡ Começar com Rapidin
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-[var(--border)] bg-white px-6 py-4 text-center font-black"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
