# Bota Preço — Schema 2.7 (preparação)

Arquitetura de entidades para futura persistência (Supabase / Postgres).
**Nesta versão não há banco real** — apenas o contrato.

## users
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| email | text unique | |
| display_name | text | |
| provider | text | google \| email |
| created_at | timestamptz | |

## calculations
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK nullable | null = anônimo local |
| parent_id | uuid FK nullable | Rapidin → Completão |
| mode | text | rapidin \| completao |
| product_name | text | denormalizado p/ listagem |
| input | jsonb | PricingInput |
| chapters | jsonb | CompletaoChapterAnswers |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## drafts
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK nullable | |
| mode | text | |
| step_index | int | |
| input | jsonb | |
| chapters | jsonb | |
| updated_at | timestamptz | |

## Regra de histórico
- Rapidin e Completão **nunca** misturados na mesma lista visual.
- `parent_id` permite "Continuar este Rapidin no Completão".
- Resultado **não** é persistido — sempre recalculado pelo Pricing Engine.
