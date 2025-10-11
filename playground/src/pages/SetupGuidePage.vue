<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Setup & usage</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Quick guide to install <code>@pantanal/grid</code>, import the styles and render your first grid in a Vue 3
        project.
      </p>
    </header>

    <article class="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100">
      <h3 class="text-lg font-semibold">1. Install the package</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Use Yarn or npm to add the library and ensure Vue 3 is available as a peer dependency.
      </p>
      <pre class="code-block"><code>yarn add @pantanal/grid
# or
npm install @pantanal/grid</code></pre>

      <h3 class="text-lg font-semibold mt-6">2. Import the styles</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Include the default CSS once in your application entry point (e.g., <code>main.ts</code>).
      </p>
      <pre class="code-block"><code>import { createApp } from 'vue'
import App from './App.vue'
import '@pantanal/grid/styles.css'

createApp(App).mount('#app')</code></pre>

      <h3 class="text-lg font-semibold mt-6">3. Render your first grid</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Drop the component into a page and pass <code>rows</code> and <code>columns</code>. Columns accept the same
        options you see across the playground demos.
      </p>
      <pre class="code-block"><code>&lt;script setup lang="ts"&gt;
import { PantanalGrid } from '@pantanal/grid'

const rows = [
  { id: 1, name: 'Wireless Headphones', price: 199 },
  { id: 2, name: 'Neon Desk Lamp', price: 89 },
]

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', format: (v:number) => `$ ${v.toFixed(2)}` },
]
&lt;/script&gt;

&lt;template&gt;
  &lt;PantanalGrid :rows="rows" :columns="columns" key-field="id" locale="en" /&gt;
&lt;/template&gt;</code></pre>

      <h3 class="text-lg font-semibold mt-6">4. Explore advanced topics</h3>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Check the navigation menu on the left to see more examples: responsive cards, persisted state, custom cells,
        image galleries and server-side pagination. Each page references the same public API.
      </p>
    </article>
  </section>
</template>

<style scoped>
.code-block {
  margin-top: 0.75rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.85);
  color: #e2e8f0;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.55;
}
[data-theme='light'] .code-block {
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
}
</style>
