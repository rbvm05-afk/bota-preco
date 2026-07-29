import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function CookiesPage() {
  return (
    <AppShell compact>
      <article className="surface animate-rise rounded-[2rem] p-8 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">
          Legal
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-.03em]">Política de Cookies</h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          O Bota Preço usa armazenamento local do navegador (localStorage e sessionStorage) para
          guardar rascunhos e histórico de cálculos no seu dispositivo. Isso não é um cookie de
          rastreamento de terceiros.
        </p>
        <h2 className="mt-8 text-xl font-black">O que guardamos localmente</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--muted)]">
          <li>Rascunhos do Rapidin e do Completão (para não perder o preenchimento)</li>
          <li>Histórico dos últimos cálculos no seu aparelho</li>
          <li>Preferências simples de interface, quando existirem</li>
        </ul>
        <h2 className="mt-8 text-xl font-black">Anúncios</h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Quando o Google AdSense estiver ativo, o Google poderá definir cookies conforme a política
          dele. Você pode gerenciar preferências de anúncios nas configurações do Google.
        </p>
        <h2 className="mt-8 text-xl font-black">Controle</h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Você pode limpar o histórico e os rascunhos a qualquer momento pela própria ferramenta ou
          apagando os dados do site nas configurações do navegador.
        </p>
        <Link href="/" className="mt-8 inline-block font-black text-[var(--green)]">
          ← Voltar ao início
        </Link>
      </article>
    </AppShell>
  );
}
