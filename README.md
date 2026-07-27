# Bota Preço 1.9.3

Aplicativo de precificação simples para pequenos produtores.

## Rodar a partir do GitHub

```bash
git clone https://github.com/rbvm05-afk/bota-preco.git
cd bota-preco
npm install
npm run dev
```

Abra http://localhost:3000

## Build de produção

```bash
npm run build
npm start
```

## Versão

O rodapé mostra versão, data, hora e resumo da build (fonte: `lib/version.ts`).

## Referências externas de preço (opcional)

Crie `.env.local` a partir de `.env.example` se for usar Mercado Livre / Open Food Facts.

Sem token, o restante do app continua funcionando.
