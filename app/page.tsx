import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { texts } from "@/data/texts";

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
                <span className="flow-emoji" aria-hidden="true">⚡</span>
                <span className="flow-kicker">Mais rápido</span>
              </span>
              <span className="flow-arrow" aria-hidden="true">→</span>
            </div>
            <strong>{texts.home.rapidin}</strong>
            <span className="flow-help">{texts.home.rapidinHelp}</span>
            <span className="flow-cta">Bora calcular</span>
          </Link>

          <Link href="/completao" className="flow-card flow-card-secondary group">
            <div className="flow-card-top">
              <span className="flow-title-row">
                <span className="flow-emoji" aria-hidden="true">🎯</span>
                <span className="flow-kicker">Mais detalhado</span>
              </span>
              <span className="flow-arrow" aria-hidden="true">→</span>
            </div>
            <strong>{texts.home.completao}</strong>
            <span className="flow-help">{texts.home.completaoHelp}</span>
            <span className="flow-cta">Quero um preço mais preciso</span>
            <span className="flow-free-note">Grátis até o resultado final. Só leva alguns minutos a mais.</span>
          </Link>
        </div>

        <p className="home-value">{texts.home.description}</p>
      </section>
    </AppShell>
  );
}
