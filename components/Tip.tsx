export function Tip({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-2xl border border-[#ead9a4] bg-[#fff7dc] p-4 text-sm leading-6">
      <strong className="mb-1 block">Dica do Bota</strong>
      {children}
    </aside>
  );
}
