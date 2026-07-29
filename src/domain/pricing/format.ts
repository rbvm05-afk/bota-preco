export function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(value) ? value : 0);
}

export function percent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })}%`;
}
