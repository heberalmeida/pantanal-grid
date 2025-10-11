# Pantanal Grid — Playground

Vue 3 + Vite playground that showcases the main capabilities of **@pantanal/grid**. The UI ships with four themes
(Light Breeze, Carbon Night, Emerald Forest, Midnight Aurora), a curated navigation and copy-pasteable demos grouped by
scenario (data sources, UX visuals, i18n, etc.).

## Install & start

```bash
yarn             # install root dependencies
yarn workspace @pantanal/grid build              # optional: build the library
yarn workspace pantanal-grid-playground dev      # open http://localhost:5173
```

You can also run it directly from the playground folder:

```bash
cd playground
yarn
yarn dev
```

## What's inside

- **Getting started** — Basic grid, table-only layout, responsive cards and the new setup guide.
- **Data sources** — Static data, REST, GraphQL and server-side pagination demos.
- **UX & Visuals** — Styled table, image gallery, grouping, locked columns, virtual scroll, pagination variants and
  custom cell slots.
- **Internationalization** — Built-in locales (en/es) plus a fully custom locale example.

Every page uses the public API of the component. Toggle between themes using the header picker, inspect the source code
with the “View code” expanders and combine the snippets to build your own grid experiences.