"use client";

const PHASES = [
  "Começando",
  "Montando sua conta",
  "Organizando os custos",
  "Botando preço",
  "Quase lá",
  "Pronto",
] as const;

function phaseFor(progress01: number): string {
  if (progress01 >= 1) return PHASES[5];
  if (progress01 >= 0.85) return PHASES[4];
  if (progress01 >= 0.65) return PHASES[3];
  if (progress01 >= 0.45) return PHASES[2];
  if (progress01 >= 0.2) return PHASES[1];
  return PHASES[0];
}

/**
 * Progresso lúdico: 🥾 caminha na trilha.
 * Sem porcentagem — baseado nas etapas ativas do domínio.
 */
export function Progress({
  current,
  total,
  labels,
}: {
  current: number;
  total: number;
  labels: string[];
  showTotal?: boolean;
  percent?: number;
}) {
  const safeTotal = Math.max(1, total);
  const completed = Math.max(0, Math.min(current, safeTotal));
  const progress01 = completed / safeTotal;
  const bootLeft = Math.min(96, Math.max(2, progress01 * 94));
  const phase = phaseFor(progress01);
  const stepLabel =
    labels[Math.min(Math.max(current - 1, 0), Math.max(labels.length - 1, 0))] ?? "";

  return (
    <div className="trail-progress mb-5" aria-label={`Progresso: ${phase}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0 text-left">
          <span className="text-[11px] font-black uppercase tracking-[.16em] text-[var(--green)]">
            {phase}
          </span>
          {stepLabel ? (
            <strong className="mt-0.5 block truncate text-sm text-[var(--foreground)]">
              {stepLabel}
            </strong>
          ) : null}
        </div>
        <span className="shrink-0 text-xs font-bold text-[var(--muted)]">
          {completed}/{safeTotal}
        </span>
      </div>

      <div className="trail-track" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={safeTotal}>
        <div className="trail-path" />
        <div className="trail-dots" aria-hidden="true">
          {Array.from({ length: safeTotal }, (_, i) => (
            <span
              key={i}
              className={`trail-dot ${i < completed ? "trail-dot-done" : ""} ${i === completed - 1 ? "trail-dot-current" : ""}`}
            />
          ))}
        </div>
        <span className="trail-boot" style={{ left: `${bootLeft}%` }} aria-hidden="true">
          🥾
        </span>
      </div>
    </div>
  );
}
