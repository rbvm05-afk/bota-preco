import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function Page() {
  return (
    <AppShell compact>
      <div className="surface rounded-[2rem] p-8 text-center animate-rise">
        <p className="text-xs font-black uppercase tracking-[.16em] text-[var(--green)]">Em breve</p>
        <h1 className="mt-3 text-3xl font-black">Perguntas frequentes</h1>
        <p className="mt-3 text-[var(--muted)]">Esta página ainda está sendo preparada. Volte em breve.</p>
        <Link href="/" className="mt-6 inline-block font-black text-[var(--green)]">← Voltar ao início</Link>
      </div>
    </AppShell>
  );
}
