<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">Documentation</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Complete API reference, guides, and examples for Pantanal Grid.
      </p>
    </header>

    <!-- Quick Links -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Quick Links</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/getting-started"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Getting Started</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
            Installation, quick start guide, and basic usage examples.
          </p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/grid"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">API Reference</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
            Complete API documentation for all components and props.
          </p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/examples/basic"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Examples</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
            Interactive examples and code snippets for common use cases.
          </p>
        </a>
      </div>
    </section>

    <!-- Guides -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Guides</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/installation"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Installation</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Setup and installation instructions</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/sorting"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Sorting</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Configure column sorting</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/filtering"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Filtering</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Add filters to columns</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/pagination"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Pagination</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Client and server-side pagination</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/grouping"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Grouping</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Group rows by columns</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/selection"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Selection</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Single and multiple row selection</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/virtual-scrolling"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Virtual Scrolling</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Handle large datasets efficiently</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/server-side"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Server-Side Mode</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Server-side operations</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/editing"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Editing</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Inline cell editing</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/i18n"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Internationalization</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Multi-language support</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/export"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Export</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Export to Excel and PDF</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/guide/templates"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Templates</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Custom cell and row templates</p>
        </a>
      </div>
    </section>

    <!-- API Reference -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">API Reference</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/grid"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Grid Component</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Main grid component props and events</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/column"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Column Definition</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Column configuration options</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/pagination"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Pagination</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Pagination component API</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/messages"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">Messages</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Internationalization messages</p>
        </a>

        <a
          href="https://heberalmeida.github.io/pantanal-grid/api/types"
          target="_blank"
          class="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/75"
        >
          <h3 class="font-semibold text-slate-800 dark:text-slate-100">TypeScript Types</h3>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-200">Type definitions</p>
        </a>
      </div>
    </section>

    <!-- External Links -->
    <section class="space-y-4">
      <h2 class="text-2xl font-semibold">Resources</h2>
      <div class="rounded-xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/75">
        <div class="space-y-3">
          <a
            href="https://github.com/heberalmeida/pantanal-grid"
            target="_blank"
            class="flex items-center gap-3 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
            <span class="font-medium">GitHub Repository</span>
          </a>
          <a
            href="https://www.npmjs.com/package/@pantanal/grid"
            target="_blank"
            class="flex items-center gap-3 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zm.545 2.109h19.386v19.272H2.308V2.109zm1.363 1.363v16.546h1.636V3.472H3.671zm2.726 0v16.546h1.636V3.472H6.397zm2.726 0v16.546h.818c.904 0 1.637-.733 1.637-1.636v-.818c0-.904-.733-1.637-1.637-1.637h-.818V8.762h.818c.904 0 1.637-.733 1.637-1.637v-.818c0-.904-.733-1.637-1.637-1.637h-.818V3.472zm2.726 0v.818c0 .904.733 1.637 1.637 1.637h.818v1.636h-.818c-.904 0-1.637.733-1.637 1.637v.818c0 .904.733 1.637 1.637 1.637h.818v1.636h-.818c-.904 0-1.637.733-1.637 1.637v.818c0 .904.733 1.637 1.637 1.637h.818v1.636h-.818c-.904 0-1.637.733-1.637 1.637v.818c0 .904.733 1.637 1.637 1.637h.818V3.472h-.818c-.904 0-1.637.733-1.637 1.637zm2.726 3.273h1.636v13.09h-1.636V6.745zm2.726 0h1.636v13.09h-1.636V6.745z"
              />
            </svg>
            <span class="font-medium">NPM Package</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static page
</script>

