<template>
  <section class="space-y-8">
    <div class="space-y-4">
      <h2 class="text-3xl font-semibold leading-tight">Welcome to the playground</h2>
      <p class="text-sm text-slate-600 dark:text-slate-200">
        Browse ready-to-use scenarios to see Pantanal Grid in action.
        Tweak filters, persist preferences, blend cards with tables and experiment with REST and GraphQL data sources.
      </p>
    </div>

    <div class="grid gap-4 lg:grid-cols-3">
      <article
        class="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:from-slate-900/85 dark:to-slate-800/80 dark:hover:border-slate-600">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Components ready to ship</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
          Built-in pagination, per-column filters, single/multi selection and virtual scrolling for large datasets.
        </p>
      </article>

      <article
        class="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:from-slate-900/85 dark:to-slate-800/80 dark:hover:border-slate-600">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Real integrations</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
          Learn how to connect local arrays, REST endpoints, GraphQL queries or server-side pagination with the same component.
        </p>
      </article>

      <article
        class="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:from-slate-900/85 dark:to-slate-800/80 dark:hover:border-slate-600">
        <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100">Extreme customization</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-200">
          Slots, responsive layouts, pinned columns, persisted state and multi-theme support — all ready to reuse.
        </p>
      </article>
    </div>

    <div
      class="rounded-3xl border border-dashed border-cyan-300/60 bg-cyan-50/70 p-6 text-sm text-cyan-900 shadow-sm dark:border-cyan-400/50 dark:bg-cyan-600/10 dark:text-cyan-100">
      <h3 class="text-base font-semibold">Quick tip</h3>
      <p class="mt-2 leading-relaxed">
        Every page uses only the public API of <code>@pantanal/grid</code>.
        Copy the snippet you like into your project or open the source file to adapt it in seconds.
      </p>
    </div>
  </section>
</template>
