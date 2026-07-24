export function Progress({
  current,
  total,
  labels,
}: {
  current: number;
  total: number;
  labels: string[];
}) {
  const value = Math.round((current / total) * 100);

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-sm font-bold text-[var(--muted)]">
        <span>{labels[Math.min(current - 1, labels.length - 1)]}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#e8e5de]">
        <div
          className="h-full rounded-full bg-[var(--green)] transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
