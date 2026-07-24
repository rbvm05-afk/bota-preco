# Bota Preço — MVP

Projeto completo em Next.js para o MVP inicial do Bota Preço.

## O que já funciona

- Home
- Fluxo Rapidin
- Fluxo Completin
- Ingredientes e materiais
- Rendimento
- Tempo e valor da hora
- Embalagem
- Outros gastos
- Margem
- Motor de cálculo separado
- Resultado com faixas vermelho, amarelo e verde
- Histórico salvo no navegador
- Layout responsivo

## Como instalar

Abra o Terminal dentro da pasta do projeto e rode:

```bash
npm install
npm run dev
```

Depois abra:

```text
http://localhost:3000
```

## Como substituir o projeto antigo

1. Pare o servidor antigo com `Control + C`.
2. Renomeie a pasta antiga para `bota-preco-antigo`.
3. Descompacte este ZIP.
4. Entre na nova pasta.
5. Rode `npm install`.
6. Rode `npm run dev`.

## Observação

O histórico usa `localStorage`, então ainda não existe login nem banco de dados. Isso é proposital para manter o MVP simples.
