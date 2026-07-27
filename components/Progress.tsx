export function Progress({
  current,
  total,
  labels,
  showTotal = true,
  percent,
}: {
  current: number;
  total: number;
  labels: string[];
  showTotal?: boolean;
  percent?: number;
}) {
  const value = percent ?? Math.round((current / Math.max(1, total)) * 100);
  const label = labels[Math.min(Math.max(current - 1, 0), Math.max(labels.length - 1, 0))] ?? "";

  return (
    <div className="mb-5 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[.18em] text-[var(--green)]">
            {showTotal ? `${value}% concluído` : "Vamos por partes"}
          </span>
          <strong className="mt-1 block text-sm sm:text-base">{label}</strong>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-[var(--green-soft)] text-lg font-black text-[var(--green)]">
          {showTotal ? `${value}%` : "✨"}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#e9e4da]">
        <div
          className="h-full rounded-full bg-[var(--green)] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
