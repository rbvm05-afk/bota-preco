import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { texts } from "@/data/texts";
import { HomeFeatureCards } from "@/components/HomeFeatureCards";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  return (
    <AppShell>
      <section className="home-hero animate-rise">
        <div className="home-copy">
          <span className="eyebrow-pill"><span aria-hidden="true">🫶</span>{texts.home.eyebrow}</span>
          <h1>{texts.home.title}</h1>
          <p>{texts.home.description}</p>
        </div>

        <div className="flow-grid" aria-label="Escolha como quer calcular">
          <Link href="/rapidin" className="flow-card flow-card-primary group">
            <div className="flow-card-top"><span className="flow-emoji" aria-hidden="true">⚡</span><span className="flow-arrow" aria-hidden="true">→</span></div>
            <span className="flow-kicker">Mais rápido</span>
            <strong>{texts.home.rapidin}</strong>
            <span className="flow-help">{texts.home.rapidinHelp}</span>
            <span className="flow-cta">Bora calcular</span>
          </Link>

          <Link href="/completao" className="flow-card flow-card-secondary group">
            <div className="flow-card-top"><span className="flow-emoji" aria-hidden="true">🎯</span><span className="flow-arrow" aria-hidden="true">→</span></div>
            <span className="flow-kicker">Mais detalhado</span>
            <strong>{texts.home.completao}</strong>
            <span className="flow-help">{texts.home.completaoHelp}</span>
            <span className="flow-cta">Quero um preço mais preciso</span>
            <span className="flow-free-note">Grátis até o resultado final. Só leva alguns minutos a mais.</span>
          </Link>
        </div>

        <p className="home-proof"><span aria-hidden="true">✅</span> Sem cadastro para começar. Sem planilha. Sem falar difícil.</p>
      </section>

      <AdSlot placement="home-after-flows" className="mt-7" />

      <section className="home-support-grid">
        <div className="surface pain-panel">
          <p className="section-kicker">O preço não pode ser mais um peso</p>
          <h2>O Bota ajuda a enxergar o que o chute esconde.</h2>
          <p className="section-copy">Toque ou passe o mouse nos cards para ver onde a conta costuma escapar e como a gente resolve isso junto.</p>
          <div className="mt-6"><HomeFeatureCards /></div>
        </div>

        <aside className="maker-note" aria-label="Para quem é o Bota Preço">
          <div className="maker-doodles" aria-hidden="true"><span>🧁</span><span>🧶</span><span>🕯️</span></div>
          <p className="section-kicker">Tem cara de trabalho feito em casa</p>
          <h2>Do primeiro pedido à renda que começa a crescer.</h2>
          <p>Para quem vende comida, costura, artesanato, presentes, beleza ou qualquer coisa feita com cuidado.</p>
          <div className="maker-benefits">
            <span>💬 Perguntas simples</span>
            <span>🧾 Conta explicada</span>
            <span>🌱 Espaço para crescer</span>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
