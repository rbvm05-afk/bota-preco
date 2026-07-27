import {
  APP_VERSION,
  BUILD_DATE,
  BUILD_TIME,
  BUILD_SUMMARY,
} from "@/lib/version";
import Link from "next/link";
import { MakerTicker } from "@/components/MakerTicker";

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
        <div className="mt-12">
          <MakerTicker />
        </div>
        <footer className="mt-5 space-y-1.5 pb-3 text-center text-xs font-bold text-[var(--muted)]">
          <div>🫶 Bota Preço · feito para quem cria com as próprias mãos</div>
          <div className="opacity-80">Versão: {APP_VERSION}</div>
          <div className="opacity-70">
            Atualizado: {BUILD_DATE} {BUILD_TIME}
          </div>
          <div className="mx-auto max-w-md opacity-70">
            Última alteração: {BUILD_SUMMARY}
          </div>
        </footer>
      </div>
    </main>
  );
}
