export function Progress({ current, total, labels, showTotal = true }: { current: number; total: number; labels: string[]; showTotal?: boolean }) {
  const value = Math.round((current / total) * 100);
  return (
    <div className="mb-5 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[.18em] text-[var(--green)]">{showTotal ? `Pergunta ${current} de ${total}` : "Vamos por partes"}</span>
          <strong className="mt-1 block text-sm sm:text-base">{labels[Math.min(current - 1, labels.length - 1)]}</strong>
        </div>
        <span className="grid size-11 place-items-center rounded-full bg-[var(--green-soft)] text-lg font-black text-[var(--green)]">{showTotal ? `${value}%` : "✨"}</span>
      </div>
      {showTotal ? (
        <div className="h-2.5 overflow-hidden rounded-full bg-[#e9e4da]"><div className="h-full rounded-full bg-[var(--green)] transition-all duration-500" style={{ width: `${value}%` }} /></div>
      ) : (
        <div className="flex gap-2" aria-hidden="true"><span className="h-2 flex-1 rounded-full bg-[var(--green)]"/><span className="h-2 flex-1 rounded-full bg-[var(--green-soft)]"/><span className="h-2 flex-1 rounded-full bg-[var(--green-soft)]"/></div>
      )}
    </div>
  );
}
