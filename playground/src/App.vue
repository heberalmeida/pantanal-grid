<script setup lang="ts"></script>

<template>
  <main class="p-6 space-y-6" data-theme="light">
    <h1 class="text-2xl font-bold">Pantanal Grid — Playground</h1>
    <nav class="flex flex-wrap gap-2 text-sm">
      <RouterLink to="/" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Home</RouterLink>
      <RouterLink to="/basic" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Básico</RouterLink>
      <RouterLink to="/i18n/en" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">i18n EN</RouterLink>
      <RouterLink to="/i18n/es" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">i18n ES</RouterLink>
      <RouterLink to="/i18n/custom" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">i18n Custom</RouterLink>
      <RouterLink to="/virtual" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Virtual</RouterLink>
      <RouterLink to="/server" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Server-side</RouterLink>
      <RouterLink to="/grouping" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Grouping</RouterLink>
      <RouterLink to="/table-only" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Table only</RouterLink>
      <RouterLink to="/pagination" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Pagination</RouterLink>
      <RouterLink to="/locked" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Pinned/Locked</RouterLink>
      <RouterLink to="/data/local" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Data (Local)</RouterLink>
      <RouterLink to="/data/rest" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Data (REST)</RouterLink>
      <RouterLink to="/data/graphql" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300">Data (GraphQL)
      </RouterLink>
    </nav>
    <RouterView />
  </main>
</template>
