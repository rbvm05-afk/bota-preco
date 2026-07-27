# Migração 2.0 — Bota Preço

## Arquitetura atual (1.9.3)

```
UI (components/, app/)
        │
        ▼
engine/profiles.ts     → perguntas do wizard + kit sugerido por produto
src/knowledge/*        → catálogo de ingredientes, produtos, unidades, embalagens
lib/calculator.ts      → regras de custo (materiais, embalagem, margem)
lib/storage.ts         → histórico local
knowledge-base/*.json  → experimental, NÃO alimenta o runtime
```

Três lugares falam de "produto":
1. `engine/profiles.ts` (matches + suggestedMaterials/Packaging)
2. `src/knowledge/products.ts` (autocomplete)
3. `knowledge-base/products.json` (morto)

## Arquitetura alvo (2.0)

```
UI
  │
  ▼
src/domain/            → única fachada pública
  │
  ├── products.ts      → catálogo + perfil (merge de profiles + productCatalog)
  ├── packaging.ts     → regras + kits
  ├── materials.ts     → ingredientes/materiais
  └── units.ts         → conversão
  │
  ▼
lib/calculator.ts      → motor puro (sem UI)
```

`knowledge-base/*.json` deixa de existir no runtime; vira seed/import opcional no futuro.

## Ordem segura de migração

| Passo | O quê | Risco | Critério de pronto |
|-------|--------|-------|---------------------|
| 0 | Fachada `src/domain` (reexport) | Zero | Build igual à 1.9.3 |
| 1 | Unificar nomes de produto (catalog + profiles) num módulo | Baixo | Autocomplete + kit iguais |
| 2 | Embalagens só via domain | Baixo | Toggle/kit/rendimento iguais |
| 3 | Materiais só via domain | Médio | Sugestões e unidades iguais |
| 4 | Calculator só importa domain/types | Médio | Preços idênticos |
| 5 | Remover imports diretos de engine/ e knowledge/ nos components | Médio | Grep limpo |
| 6 | Arquivar knowledge-base/ | Baixo | App sobe sem a pasta |

**Regra:** um passo por build (`2.0.0.a`, `.b`, …). Nunca misturar unificação de dados com feature nova.

## Riscos

- **Duplicidade de dados** → kits diferentes entre autocomplete e profile se unificar mal.
- **Quebra de SavedCalculation** → tipos de `PricingInput` não podem mudar sem migração de storage.
- **Rapidin vs Completão** → mesmos `baseQuestions` hoje; não separar fluxos no meio da migração.
- **Referência de preço (API)** → fora do escopo da migração de catálogo; não expandir.

## O que NÃO fazer nesta fase

- Open Prices / marketplace / IA de preços
- Novos tipos de produto na UI
- Refatorar calculator "por esporte"
- Apagar `engine/profiles.ts` antes do passo 5

## Build atual

Infra passo 0: `src/domain/index.ts` (só reexports).
Versão: ver `lib/version.ts`.
