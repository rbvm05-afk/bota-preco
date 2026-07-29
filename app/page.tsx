import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { texts } from "@/data/texts";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  return (
    <AppShell>
      <section className="home-hero animate-rise">
        <div className="home-copy">
          <span className="eyebrow-pill">
            <span aria-hidden="true">🫶</span>
            {texts.home.eyebrow}
          </span>
          <h1>{texts.home.title}</h1>
        </div>

        <p className="home-proof">
          <span aria-hidden="true">✅</span>
          Sem cadastro, sem planilha, sem complicação.
        </p>

        <div className="flow-grid" aria-label="Escolha como quer calcular">
          <Link href="/rapidin" className="flow-card flow-card-primary group">
            <div className="flow-card-top">
              <span className="flow-title-row">
                <span className="flow-emoji" aria-hidden="true">
                  ⚡
                </span>
                <span className="flow-kicker">Disponível agora</span>
              </span>
              <span className="flow-arrow" aria-hidden="true">
                →
              </span>
            </div>
            <strong>{texts.home.rapidin}</strong>
            <span className="flow-help">{texts.home.rapidinHelp}</span>
            <span className="flow-cta">Bora calcular</span>
          </Link>

          {/* Completão congelado — arquitetura preservada, sem acesso ativo */}
          <div
            className="flow-card flow-card-secondary opacity-90"
            aria-disabled="true"
            role="group"
            aria-label="Completão em desenvolvimento"
          >
            <div className="flow-card-top">
              <span className="flow-title-row">
                <span className="flow-emoji" aria-hidden="true">
                  📋
                </span>
                <span className="flow-kicker">🚧 Em desenvolvimento</span>
              </span>
            </div>
            <strong>Completão</strong>
            <span className="flow-help">
              Estamos criando uma versão muito mais completa do Bota Preço. Ela fará uma análise
              detalhada do seu negócio, encontrará oportunidades de melhoria e entregará um
              diagnóstico personalizado.
            </span>
            <span className="flow-help mt-2 block">
              Queremos lançar essa experiência apenas quando ela realmente estiver pronta. Enquanto
              isso, o Rapidin continua evoluindo e já está disponível gratuitamente.
            </span>
            <span
              className="flow-cta mt-3 inline-block cursor-default rounded-2xl border border-[var(--border)] bg-[#f7f4ee] px-4 py-2 text-sm font-black text-[var(--muted)]"
              aria-hidden="true"
            >
              Em breve
            </span>
          </div>
        </div>

        <p className="home-value">{texts.home.tagline}</p>

        <AdSlot placement="home-after-value" className="mt-6" />
      </section>
    </AppShell>
  );
}
