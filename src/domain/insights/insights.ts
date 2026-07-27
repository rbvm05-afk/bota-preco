import type { PricingInput, PricingResult } from "@/types/pricing";
import type { PricingInsight } from "./types";

const safe = (n: number) => (Number.isFinite(n) ? n : 0);

export function buildInsights(input: PricingInput, result: PricingResult): PricingInsight[] {
  const insights: PricingInsight[] = [];
  const yieldAmount = Math.max(1, input.yieldAmount || 1);
  const price = result.healthyPrice;
  const packagingPerUnit = result.packagingBatch / yieldAmount;
  const packagingShare = price > 0 ? packagingPerUnit / price : 0;
  const materialsPerUnit = result.materialsBatch / yieldAmount;
  const materialsShare = price > 0 ? materialsPerUnit / price : 0;
  const laborPerUnit = result.laborBatch / yieldAmount;
  const fee = Math.min(40, Math.max(0, safe(input.salesFeePercent ?? 0))) / 100;
  const profitPerUnit = price * (1 - fee) - result.costPerUnit;
  const hours = safe(input.workHours);
  const minutesPerUnit = hours > 0 ? (hours * 60) / yieldAmount : 0;

  if (packagingShare > 0.2) {
    insights.push({
      id: "packaging-high",
      severity: "warn",
      title: "Embalagem pesada no preço",
      message: `A embalagem representa cerca de ${(packagingShare * 100).toFixed(0)}% do preço final. Vale avaliar alternativas mais econômicas.`,
    });
  }

  if (minutesPerUnit > 45) {
    insights.push({
      id: "time-high",
      severity: "warn",
      title: "Tempo de produção elevado",
      message: `Cerca de ${Math.round(minutesPerUnit)} min por unidade. Pequenos ganhos de produtividade podem aumentar bastante o lucro.`,
    });
  }

  if (profitPerUnit > 0 && profitPerUnit < laborPerUnit) {
    insights.push({
      id: "profit-vs-labor",
      severity: "critical",
      title: "Lucro menor que a mão de obra",
      message: "Você está ganhando menos pelo produto do que o valor do tempo investido na conta.",
    });
  }

  if (materialsShare > 0.55) {
    insights.push({
      id: "materials-heavy",
      severity: "info",
      title: "Custo concentrado em ingredientes",
      message: `Ingredientes pesam cerca de ${(materialsShare * 100).toFixed(0)}% do preço. Negociar fornecedores ou rendimento ajuda mais que cortar embalagem.`,
    });
  }

  if ((input.salesFeePercent ?? 0) >= 15) {
    insights.push({
      id: "fees-high",
      severity: "warn",
      title: "Taxa de venda alta",
      message: `Com ${input.salesFeePercent}% de taxa, o preço precisa subir para preservar a mesma margem líquida.`,
    });
  }

  if (input.desiredMargin >= 50) {
    insights.push({
      id: "margin-aggressive",
      severity: "info",
      title: "Margem ambiciosa",
      message: "Margem alta é ótima se o mercado aceitar. Compare com concorrentes antes de fixar o preço.",
    });
  }

  if (input.wastePercent >= 15) {
    insights.push({
      id: "waste-high",
      severity: "warn",
      title: "Perdas elevadas",
      message: `${input.wastePercent}% de perdas eleva o custo unitário. Revisar processo pode recuperar margem sem subir preço.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "all-good",
      severity: "info",
      title: "Conta equilibrada",
      message: "Não há alertas críticos. Mantenha o registro de custos atualizado conforme os preços mudarem.",
    });
  }

  return insights.slice(0, 5);
}
