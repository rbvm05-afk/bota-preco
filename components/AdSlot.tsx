export function AdSlot({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <aside className={`ad-slot ${className}`} data-ad-placement={placement} aria-label="Espaço reservado para publicidade">
      <span className="ad-label">Publicidade</span>
      <div className="ad-placeholder" aria-hidden="true">
        <span>Espaço preparado para anúncio</span>
      </div>
    </aside>
  );
}
