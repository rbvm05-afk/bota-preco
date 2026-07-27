import type { PricingInput, PricingResult } from "@/types/pricing";
import type { PriceBand, PricingDiagnosis } from "./types";

const safe = (n: number) => (Number.isFinite(n) ? n : 0);

export function diagnoseRecommended(
  input: PricingInput,
  result: PricingResult,
): PricingDiagnosis {
  const fee = Math.min(40, Math.max(0, safe(input.salesFeePercent ?? 0))) / 100;
  const net = result.healthyPrice * (1 - fee);
  const profit = net - result.costPerUnit;
  const marginPct = net > 0 ? (profit / net) * 100 : 0;
  const hours = Math.max(0.01, safe(input.workHours) || 0.01);
  const profitPerHour = (profit * Math.max(1, input.yieldAmount)) / hours;
  const laborPerUnit = result.laborBatch / Math.max(1, input.yieldAmount);

  if (profit <= 0) {
    return {
      tone: "red",
      emoji: "🔴",
      title: "Sem lucro real",
      message: "Com os custos informados, o preço recomendado ainda não gera lucro líquido depois das taxas.",
    };
  }

  if (marginPct < 15) {
    return {
      tone: "red",
      emoji: "🔴",
      title: "Margem muito baixa",
      message: `Sua margem efetiva fica em cerca de ${marginPct.toFixed(0)}%. Qualquer imprevisto come o lucro.`,
    };
  }

  if (profit < laborPerUnit * 0.5) {
    return {
      tone: "orange",
      emoji: "🟠",
      title: "Lucro abaixo do tempo",
      message: "Você está ganhando pouco em relação ao tempo investido. Vale revisar preço ou produtividade.",
    };
  }

  if (profitPerHour < safe(input.hourlyRate) * 0.8) {
    return {
      tone: "yellow",
      emoji: "🟡",
      title: "Lucro baixo para o tempo",
      message: `O lucro por hora fica em torno de R$ ${profitPerHour.toFixed(2).replace(".", ",")} — abaixo do valor da sua hora.`,
    };
  }

  if (marginPct >= 25) {
    return {
      tone: "green",
      emoji: "🟢",
      title: "Margem saudável",
      message: `Com cerca de ${marginPct.toFixed(0)}% de margem efetiva, você cobre custos e ainda sobra para crescer.`,
    };
  }

  return {
    tone: "yellow",
    emoji: "🟡",
    title: "Margem aceitável",
    message: `Margem em torno de ${marginPct.toFixed(0)}%. Funciona, mas há pouco colchão para imprevistos.`,
  };
}

export function diagnoseSellPrice(
  profitPerUnit: number,
  marginPercent: number,
  band: PriceBand,
  _input: PricingInput,
  _result: PricingResult,
): PricingDiagnosis {
  if (band === "loss" || profitPerUnit < 0) {
    return {
      tone: "red",
      emoji: "🔴",
      title: "Prejuízo",
      message: "Esse preço não cobre o custo total por unidade. Cada venda reduz seu capital.",
    };
  }

  if (band === "minimum") {
    return {
      tone: "orange",
      emoji: "🟠",
      title: "Zona apertada",
      message: "Cobre o custo, mas a margem é estreita. Qualquer desperdício vira prejuízo.",
    };
  }

  if (band === "premium") {
    return {
      tone: "green",
      emoji: "🔵",
      title: "Faixa premium",
      message: "Acima do recomendado. Bom se o mercado e a percepção de valor sustentarem esse preço.",
    };
  }

  if (marginPercent >= 25) {
    return {
      tone: "green",
      emoji: "🟢",
      title: "Margem saudável",
      message: `Lucro de cerca de ${marginPercent.toFixed(0)}% sobre a receita líquida. Boa referência de venda.`,
    };
  }

  return {
    tone: "yellow",
    emoji: "🟡",
    title: "Na faixa recomendada",
    message: "Dentro da zona saudável, com margem moderada.",
  };
}
