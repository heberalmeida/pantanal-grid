# Pantanal Grid — Playground

Ambiente Vite + Vue 3 usado para demonstrar os recursos do **@pantanal/grid**. O playground foi redesenhado com múltiplos
temas (Light Breeze, Carbon Night, Emerald Forest e Midnight Aurora), navegação por seções e exemplos agrupados por
objetivo (dados, UX, customização e i18n).

## Rodando localmente

```bash
yarn             # instala dependências na raiz do monorepo
yarn dev         # dentro da pasta playground (ou yarn workspace pantanal-grid-playground dev)
```

## Exemplos principais

- **Getting started** — grid básico, tabela-only e modo cartões responsivo.
- **Data sources** — dados locais, REST, GraphQL e modo server-side com paginação remota.
- **UX & Visuals** — tabela estilizada, agrupamento, colunas fixas, scroll virtual, slots customizados e versões de paginação.
- **Internationalization** — traduções prontas (pt/en/es) + labels customizados.

Cada página usa apenas a API pública da biblioteca e pode ser copiada diretamente para o seu projeto. Use o seletor de
temas no cabeçalho para ver o grid se adaptar às novas paletas e confira os exemplos de paginação responsiva e
persistência de estado.
