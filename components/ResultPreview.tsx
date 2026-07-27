/** Mock visual do resultado — não funcional, só identidade e valor. */
export function ResultPreview() {
  return (
    <div className="result-preview" aria-hidden="true">
      <div className="result-preview-inner">
        <div className="result-preview-badge">🟢 Lucro saudável</div>
        <p className="result-preview-label">Preço recomendado</p>
        <p className="result-preview-price">R$ 18,90</p>
        <p className="result-preview-sub">para bolo de pote · 12 unidades</p>
        <div className="result-preview-rows">
          <div>
            <span>Ingredientes</span>
            <strong>R$ 6,45</strong>
          </div>
          <div>
            <span>Embalagem</span>
            <strong>R$ 1,10</strong>
          </div>
          <div>
            <span>Seu lucro</span>
            <strong className="text-[var(--green)]">R$ 4,32</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
