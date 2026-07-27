/**
 * Slot de publicidade (Google AdSense).
 * Em produção, substituir o placeholder pelo script/ad unit do AdSense.
 * Em dev / sem inventário: só o rótulo discreto "Publicidade".
 */
export function AdSlot({
  placement,
  className = "",
}: {
  placement: string;
  className?: string;
}) {
  return (
    <aside
      className={`ad-slot ${className}`}
      data-ad-placement={placement}
      aria-label="Publicidade"
    >
      <span className="ad-label">Publicidade</span>
      <div className="ad-placeholder" aria-hidden="true" />
    </aside>
  );
}
