<template>
  <section class="space-y-10">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Pagination showcase</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Explore internal (footer-driven) and external pagination widgets, including compact, dense and mobile-first layouts.
      </p>
    </header>

    <div class="grid gap-6">
      <article class="feature-card">
        <h3 class="feature-title">Internal — Simple (text + icons)</h3>
        <PantanalGrid
          :rows="data"
          :columns="columns"
          :page="page1"
          :pageSize="size1"
          pagination-variant="simple"
          :paginationShowText="true"
          :paginationShowIcons="true"
          :responsive="'table'"
          :cardBreakpoint="0"
          striped
          locale="en"
          @update:page="page1 = $event"
          @update:pageSize="size1 = $event"
        />
      </article>

      <article class="feature-card">
        <h3 class="feature-title">Internal — Pages (icons only)</h3>
        <PantanalGrid
          :rows="data"
          :columns="columns"
          :page="page2"
          :pageSize="size2"
          pagination-variant="pages"
          :paginationShowText="false"
          :paginationShowIcons="true"
          :responsive="'table'"
          :cardBreakpoint="0"
          striped
          locale="en"
          @update:page="page2 = $event"
          @update:pageSize="size2 = $event"
        />
      </article>

      <article class="feature-card">
        <h3 class="feature-title">Internal — Edges (compact)</h3>
        <PantanalGrid
          :rows="data"
          :columns="columns"
          :page="page3"
          :pageSize="size3"
          pagination-variant="edges"
          :paginationShowText="true"
          :paginationShowIcons="true"
          :responsive="'table'"
          :cardBreakpoint="0"
          striped
          locale="en"
          @update:page="page3 = $event"
          @update:pageSize="size3 = $event"
        />
      </article>

      <article class="feature-card">
        <h3 class="feature-title">External — Simple (total + previous/next)</h3>
        <PantanalGrid
          :rows="rows4"
          :columns="columns"
          :responsive="'table'"
          :cardBreakpoint="0"
          :showFooter="false"
          locale="en"
        />
        <div class="pagination-shell">
          <GridPagination
            class="pagination-widget"
            :page="page4"
            :pageSize="size4"
            :total="total4"
            variant="simple"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            @update:page="page4 = $event"
            @update:pageSize="size4 = $event"
          />
        </div>
      </article>

      <article class="feature-card">
        <h3 class="feature-title">External — Pages (with page-size selector)</h3>
        <PantanalGrid
          :rows="rows5"
          :columns="columns"
          :responsive="'table'"
          :cardBreakpoint="0"
          :showFooter="false"
          locale="en"
        />
        <div class="pagination-shell">
          <GridPagination
            class="pagination-widget"
            :page="page5"
            :pageSize="size5"
            :total="total5"
            variant="pages"
            :maxPages="7"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            :showPageSize="true"
            :pageSizeOptions="[5, 10, 20, 50]"
            @update:page="page5 = $event"
            @update:pageSize="size5 = $event"
          />
        </div>
      </article>

      <article class="feature-card">
        <h3 class="feature-title">External — Edges (dense + icons)</h3>
        <PantanalGrid
          :rows="rows6"
          :columns="columns"
          :responsive="'table'"
          :cardBreakpoint="0"
          :showFooter="false"
          locale="en"
        />
        <div class="pagination-shell">
          <GridPagination
            class="pagination-widget"
            :page="page6"
            :pageSize="size6"
            :total="total6"
            variant="edges"
            :maxPages="9"
            :showTotal="true"
            :showText="false"
            :showIcons="true"
            :showPageSize="true"
            :pageSizeOptions="[10, 20, 50, 100]"
            dense
            @update:page="page6 = $event"
            @update:pageSize="size6 = $event"
          />
        </div>
      </article>

      <article class="feature-card">
        <h3 class="feature-title">External — Pages (RTL + locale ES)</h3>
        <PantanalGrid
          :rows="rows7"
          :columns="columns"
          :rtl="true"
          :responsive="'table'"
          :cardBreakpoint="0"
          :showFooter="false"
          locale="en"
        />
        <div class="pagination-shell">
          <GridPagination
            class="pagination-widget"
            :page="page7"
            :pageSize="size7"
            :total="total7"
            variant="pages"
            :maxPages="5"
            :showTotal="true"
            :showText="true"
            :showIcons="true"
            locale="es"
            @update:page="page7 = $event"
            @update:pageSize="size7 = $event"
          />
        </div>
      </article>

      <article class="feature-card">
        <h3 class="feature-title">External — Simple (text only)</h3>
        <PantanalGrid
          :rows="rows8"
          :columns="columns"
          :responsive="'table'"
          :cardBreakpoint="0"
          :showFooter="false"
          locale="en"
        />
        <div class="pagination-shell">
          <GridPagination
            class="pagination-widget"
            :page="page8"
            :pageSize="size8"
            :total="total8"
            variant="simple"
            :showTotal="false"
            :showText="true"
            :showIcons="false"
            @update:page="page8 = $event"
            @update:pageSize="size8 = $event"
          />
        </div>
      </article>
    </div>
  </section>
  <ExampleCode :source="codeSnippet" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PantanalGrid, GridPagination } from '@pantanal/grid'
import '@pantanal/grid/styles.css'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './PaginationShowcase.vue?raw'

type Row = Record<string, any>

const data = ref<Row[]>([])

onMounted(async () => {
  const res = await fetch('https://dummyjson.com/products?limit=100')
  const json = await res.json()
  data.value = json.products
})

const page1 = ref(1); const size1 = ref(10)
const page2 = ref(1); const size2 = ref(10)
const page3 = ref(1); const size3 = ref(20)

const page4 = ref(1); const size4 = ref(10)
const total4 = computed(() => data.value.length)
const rows4 = computed(() => sliceRows(data.value, page4.value, size4.value))

const page5 = ref(1); const size5 = ref(10)
const total5 = computed(() => data.value.length)
const rows5 = computed(() => sliceRows(data.value, page5.value, size5.value))

const page6 = ref(1); const size6 = ref(20)
const total6 = computed(() => data.value.length)
const rows6 = computed(() => sliceRows(data.value, page6.value, size6.value))

const page7 = ref(1); const size7 = ref(10)
const total7 = computed(() => data.value.length)
const rows7 = computed(() => sliceRows(data.value, page7.value, size7.value))

const page8 = ref(1); const size8 = ref(15)
const total8 = computed(() => data.value.length)
const rows8 = computed(() => sliceRows(data.value, page8.value, size8.value))

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', filterable: true },
  { field: 'brand', title: 'Brand', filterable: true },
  { field: 'category', title: 'Category', filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$ ${Number(v).toFixed(2)}` },
]

function sliceRows(source: Row[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return source.slice(start, start + pageSize)
}

const codeSnippet = exampleSource
</script>

<style scoped>
.feature-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.85);
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 18px 45px -24px rgba(15, 23, 42, 0.45);
}
.feature-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: rgba(15, 23, 42, 0.9);
}
.pagination-shell {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
}
.pagination-widget {
  width: 100%;
  max-width: 100%;
}
@media (min-width: 640px) {
  .pagination-shell {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .pagination-widget {
    width: auto;
  }
}

@media (prefers-color-scheme: dark) {
  .feature-card {
    background: rgba(15, 23, 42, 0.75);
    border-color: rgba(148, 163, 184, 0.25);
    box-shadow: 0 18px 45px -28px rgba(15, 23, 42, 0.9);
  }
  .feature-title {
    color: rgba(226, 232, 240, 0.92);
  }
}
</style>
