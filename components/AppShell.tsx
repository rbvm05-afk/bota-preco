import Link from "next/link";

export function AppShell({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 sm:py-8">
      <div className={`mx-auto w-full ${compact ? "max-w-2xl" : "max-w-5xl"}`}>
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid size-11 place-items-center rounded-2xl bg-[var(--green)] text-xl text-white shadow-sm">
              BP
            </span>
            <span className="text-xl">Bota Preço</span>
          </Link>
          <Link
            href="/historico"
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold hover:bg-[var(--green-soft)]"
          >
            Meus cálculos
          </Link>
        </header>
        {children}
      </div>
    </main>
  );
}
