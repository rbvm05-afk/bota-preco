import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { texts } from "@/data/texts";
import { HomeFeatureCards } from "@/components/HomeFeatureCards";
import { AdSlot } from "@/components/AdSlot";
import { ResultPreview } from "@/components/ResultPreview";

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
          <p>{texts.home.description}</p>
        </div>

        <div className="home-preview-wrap">
          <ResultPreview />
        </div>

        <div className="flow-grid" aria-label="Escolha como quer calcular">
          <Link href="/rapidin" className="flow-card flow-card-primary group">
            <div className="flow-card-top">
              <span className="flow-emoji" aria-hidden="true">
                ⚡
              </span>
              <span className="flow-arrow" aria-hidden="true">
                →
              </span>
            </div>
            <span className="flow-kicker">Mais rápido</span>
            <strong>{texts.home.rapidin}</strong>
            <span className="flow-help">{texts.home.rapidinHelp}</span>
            <span className="flow-cta">Bora calcular</span>
          </Link>

          <Link href="/completao" className="flow-card flow-card-secondary group">
            <div className="flow-card-top">
              <span className="flow-emoji" aria-hidden="true">
                🎯
              </span>
              <span className="flow-arrow" aria-hidden="true">
                →
              </span>
            </div>
            <span className="flow-kicker">Mais detalhado</span>
            <strong>{texts.home.completao}</strong>
            <span className="flow-help">{texts.home.completaoHelp}</span>
            <span className="flow-cta">Quero um preço mais preciso</span>
            <span className="flow-free-note">Grátis até o resultado final. Só leva alguns minutos a mais.</span>
          </Link>
        </div>

        <p className="home-proof">
          <span aria-hidden="true">✅</span>
          Sem cadastro, sem planilha, sem complicação.
        </p>
      </section>

      <AdSlot placement="home-after-flows" className="mt-7" />

      <section className="home-benefits" aria-label="Benefícios">
        <span className="benefit-chip">💬 Perguntas simples</span>
        <span className="benefit-chip">📄 Conta explicada</span>
        <span className="benefit-chip">🌱 Espaço para crescer</span>
      </section>

      <section className="home-support-grid">
        <div className="surface pain-panel">
          <p className="section-kicker">O preço não pode ser mais um peso</p>
          <h2>O Bota ajuda a enxergar o que o chute esconde.</h2>
          <p className="section-copy">
            Toque nos cards para ver onde a conta costuma escapar e como a gente resolve isso junto.
          </p>
          <div className="mt-5">
            <HomeFeatureCards />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
