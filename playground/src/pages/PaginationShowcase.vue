<!-- playground/src/pages/PaginationShowcase.vue -->
<template>
  <div class="page">
    <h2>Pagination — Showcase (todas as variações)</h2>

    <!-- ========== INTERNAS (footer do Grid) ========== -->

    <!-- 1) Interna — simple (texto + ícones) -->
    <section class="demo">
      <h3>1) Interna — Simple (texto + ícones)</h3>
      <PantanalGrid
        :rows="data"
        :columns="columns"
        :page="page1"
        :pageSize="size1"
        :paginationVariant="'simple'"
        :paginationShowText="true"
        :paginationShowIcons="true"
        :responsive="'table'"
        :cardBreakpoint="0"
        @update:page="page1 = $event"
        @update:pageSize="size1 = $event"
      />
    </section>

    <!-- 2) Interna — Pages (ícones apenas) -->
    <section class="demo">
      <h3>2) Interna — Pages (ícones apenas)</h3>
      <PantanalGrid
        :rows="data"
        :columns="columns"
        :page="page2"
        :pageSize="size2"
        :paginationVariant="'pages'"
        :paginationShowText="false"
        :paginationShowIcons="true"
        :responsive="'table'"
        :cardBreakpoint="0"
        @update:page="page2 = $event"
        @update:pageSize="size2 = $event"
      />
    </section>

    <!-- 3) Interna — Edges (compacta/densa) -->
    <section class="demo">
      <h3>3) Interna — Edges (compacta/densa)</h3>
      <PantanalGrid
        :rows="data"
        :columns="columns"
        :page="page3"
        :pageSize="size3"
        :paginationVariant="'edges'"
        :paginationShowText="true"
        :paginationShowIcons="true"
        :responsive="'table'"
        :cardBreakpoint="0"
        @update:page="page3 = $event"
        @update:pageSize="size3 = $event"
      />
    </section>

    <!-- ========== EXTERNAS (Grid sem footer; paginadas de fora) ========== -->

    <!-- 4) Externa — Simple (total + anterior/próxima) -->
    <section class="demo hide-grid-footer">
      <h3>4) Externa — Simple (total + anterior/próxima)</h3>
      <PantanalGrid
        :rows="rows4"
        :columns="columns"
        :responsive="'table'"
        :cardBreakpoint="0"
      />
      <GridPagination
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
    </section>

    <!-- 5) Externa — Pages (numerada) + seletor de page-size -->
    <section class="demo hide-grid-footer">
      <h3>5) Externa — Pages (numerada) + seletor de tamanho</h3>
      <PantanalGrid
        :rows="rows5"
        :columns="columns"
        :responsive="'table'"
        :cardBreakpoint="0"
      />
      <GridPagination
        :page="page5"
        :pageSize="size5"
        :total="total5"
        variant="pages"
        :maxPages="7"
        :showTotal="true"
        :showText="true"
        :showIcons="true"
        :showPageSize="true"
        :pageSizeOptions="[5,10,20,50]"
        @update:page="page5 = $event"
        @update:pageSize="size5 = $event"
      />
    </section>

    <!-- 6) Externa — Edges (≪ ‹ 1 2 3 › ≫) — densa + ícones apenas -->
    <section class="demo hide-grid-footer">
      <h3>6) Externa — Edges (densa, ícones somente)</h3>
      <PantanalGrid
        :rows="rows6"
        :columns="columns"
        :responsive="'table'"
        :cardBreakpoint="0"
        :showFooter="false"
      />
      <GridPagination
        :page="page6"
        :pageSize="size6"
        :total="total6"
        variant="edges"
        :maxPages="9"
        :showTotal="true"
        :showText="false"
        :showIcons="true"
        :showPageSize="true"
        :pageSizeOptions="[10,20,50,100]"
        :dense="true"
        @update:page="page6 = $event"
        @update:pageSize="size6 = $event"
      />
    </section>

    <!-- 7) Externa — Pages (janela pequena) + RTL + locale ES -->
    <section class="demo hide-grid-footer">
      <h3>7) Externa — Pages (janela 5) + RTL + locale ES</h3>
      <PantanalGrid
        :rows="rows7"
        :columns="columns"
        :rtl="true"
        :responsive="'table'"
        :cardBreakpoint="0"
        :showFooter="false"
      />
      <GridPagination
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
    </section>

    <!-- 8) Externa — Simple (somente texto, sem total) -->
    <section class="demo hide-grid-footer">
      <h3>8) Externa — Simple (texto apenas, sem total)</h3>
      <PantanalGrid
        :rows="rows8"
        :columns="columns"
        :responsive="'table'"
        :cardBreakpoint="0"
        :showFooter="false"
      />
      <GridPagination
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { PantanalGrid, GridPagination } from '@pantanal/grid'
import '@pantanal/grid/styles.css'

type Row = Record<string, any>

const data = ref<Row[]>([])
onMounted(async () => {
  const res = await fetch('https://dummyjson.com/products?limit=100')
  const json = await res.json()
  data.value = json.products
})

/* ===== INTERNAS ===== */
const page1 = ref(1); const size1 = ref(10)
const page2 = ref(1); const size2 = ref(10)
const page3 = ref(1); const size3 = ref(20)

/* ===== EXTERNAS ===== */
/* 4 */
const page4 = ref(1); const size4 = ref(10)
const total4 = computed(() => data.value.length)
const rows4 = computed(() => data.value.slice((page4.value-1)*size4.value, (page4.value-1)*size4.value + size4.value))
/* 5 */
const page5 = ref(1); const size5 = ref(10)
const total5 = computed(() => data.value.length)
const rows5 = computed(() => data.value.slice((page5.value-1)*size5.value, (page5.value-1)*size5.value + size5.value))
/* 6 */
const page6 = ref(1); const size6 = ref(20)
const total6 = computed(() => data.value.length)
const rows6 = computed(() => data.value.slice((page6.value-1)*size6.value, (page6.value-1)*size6.value + size6.value))
/* 7 */
const page7 = ref(1); const size7 = ref(10)
const total7 = computed(() => data.value.length)
const rows7 = computed(() => data.value.slice((page7.value-1)*size7.value, (page7.value-1)*size7.value + size7.value))
/* 8 */
const page8 = ref(1); const size8 = ref(15)
const total8 = computed(() => data.value.length)
const rows8 = computed(() => data.value.slice((page8.value-1)*size8.value, (page8.value-1)*size8.value + size8.value))

/* Colunas compartilhadas */
const columns = [
  { field:'id', title:'ID', width:80 },
  { field:'title', title:'Title', filterable:true },
  { field:'brand', title:'Brand', filterable:true },
  { field:'category', title:'Category', filterable:true },
  { field:'price', title:'Price', sortable:true, format:(v:number)=>`$ ${Number(v).toFixed(2)}` }
]
</script>

<style scoped>
.page{display:grid;gap:2rem;padding:1rem}
.demo{display:grid;gap:.75rem}
h2{font-size:1.5rem;font-weight:700}
h3{font-size:1.1rem;font-weight:600}

/* Oculta o footer padrão da Grid APENAS nas seções com paginação externa */
.hide-grid-footer :deep(.v3grid > .v3grid__cell:last-child){
  display: none;
}
</style>
