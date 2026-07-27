export function Tip({ children }: { children: React.ReactNode }) {
  return <aside className="flex gap-3 rounded-2xl border border-[#ead9a4] bg-[#fff8df] p-4 text-sm leading-6"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white text-base shadow-sm">💡</span><div><strong className="mb-0.5 block text-[var(--green-deep)]">Dica do Bota</strong><span className="text-[var(--muted)]">{children}</span></div></aside>;
}
