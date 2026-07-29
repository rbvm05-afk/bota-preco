# Changelog

## 2.6.0 — Rapidin UX (usabilidade)
- Etapas reorganizadas: ingredientes → rendimento+tempo → embalagens → outros gastos+hora → perdas → taxas → concorrência.
- Campo Marca nos ingredientes (padrão "Genérica"), MoneyField com R$ e 2 casas.
- Perdas sem porcentagem: planejado vs pronto para vender.
- Taxas e concorrência com pergunta Sim/Não antes do formulário.
- Concorrência só como referência (não altera cálculo).
- Outros gastos em lista dinâmica (Gás, Energia, etc.).
- Resultado com sinaleiro 🔴🟡🟢 e accordion "Entenda estes valores".
- Arquitetura SEO Aprenda: rotas de artigos e categorias (conteúdo em preparação).
- Infra de preço de referência: nunca inventa valores quando API indisponível.

## 1.9.3
- Validação completa da Embalagem Inteligente (tester aprovou).
- Kit de embalagens começa desmarcado; toggle e “Adicionar todos”.
- Mesmo padrão de seleção nos ingredientes.
- LiveSummary alinhado com `packagingItems`.
- Regras de quantidade/custo centralizadas em `lib/calculator.ts`.
- Rodapé com build stamp (versão, data, hora, resumo).
- Convenção de revisões 1.9.2.a → … → 1.9.3.

## 1.9.2
- Embalagens inteligentes por produto com kit recomendado.
- Regras por unidade, a cada X unidades e por lote.
- Quantidades recalculadas automaticamente quando o rendimento muda.
- Preços informados são preservados durante o recálculo.
- Compatibilidade mantida com cálculos salvos em versões anteriores.

## 1.9.1
- Restaura exports centralizados de versão.
- Corrige erros de build em layout e AppShell.

## 1.9.0
- Motor de referências de preço (Open Prices / Mercado Livre).
- Histórico local de preços informados.
