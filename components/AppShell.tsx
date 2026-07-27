import {
  APP_VERSION,
  BUILD_DATE,
  BUILD_TIME,
  BUILD_SUMMARY,
} from "@/lib/version";
import Link from "next/link";
import { MakerTicker } from "@/components/MakerTicker";

const footerLinks = [
  { href: "/sobre", label: "Sobre" },
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/faq", label: "Perguntas frequentes" },
  { href: "/contato", label: "Contato" },
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/termos", label: "Termos de Uso" },
];

export function AppShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-7 sm:py-7">
      <div className={`mx-auto w-full ${compact ? "max-w-3xl" : "max-w-6xl"}`}>
        <header className="app-header">
          <Link href="/" className="brand-link">
            <span className="brand-mark" aria-hidden="true">
              🏷️
            </span>
            <span>
              <span className="brand-name">Bota Preço</span>
              <span className="brand-tagline">Preço sem chute</span>
            </span>
          </Link>
          <Link href="/historico" className="history-link">
            🗂️ <span className="hidden sm:inline">Meus cálculos</span>
            <span className="sm:hidden">Histórico</span>
          </Link>
        </header>

        {children}

        <div className="mt-10">
          <MakerTicker />
        </div>

        <footer className="site-footer">
          <nav className="footer-nav" aria-label="Rodapé">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="footer-meta">
            <div>🫶 Bota Preço · feito para quem cria com as próprias mãos</div>
            <div className="opacity-80">Versão: {APP_VERSION}</div>
            <div className="opacity-70">
              Atualizado: {BUILD_DATE} {BUILD_TIME}
            </div>
            <div className="mx-auto max-w-md opacity-70">
              Última alteração: {BUILD_SUMMARY}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
