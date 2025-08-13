<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ColumnDef, FilterDescriptor, GridEmits, GridProps, SortDescriptor } from '../types'
import { applyFilter, applySort, paginate } from '../composables/data'

const props = withDefaults(defineProps<GridProps>(), {
  keyField: 'id',
  page: 1,
  pageSize: 20,
  selectable: false
})
const emit = defineEmits<GridEmits>()

/** STATE */
const sortState = ref<SortDescriptor[]>(props.sort ?? [])
const page = ref(props.page!)
const pageSize = ref(props.pageSize!)
const filters = ref<FilterDescriptor[]>(props.filter ?? [])

/** SELECTION */
const selectedKeys = ref<Set<unknown>>(new Set())
const keyFieldStr = computed(() => String(props.keyField))

function isSelected(row: any) {
  return selectedKeys.value.has(row[keyFieldStr.value])
}
function toggleRow(row: any) {
  if (!props.selectable) return
  const k = row[keyFieldStr.value]
  if (props.selectable === 'single') {
    selectedKeys.value = new Set([k])
  } else {
    const s = new Set(selectedKeys.value)
    s.has(k) ? s.delete(k) : s.add(k)
    selectedKeys.value = s
  }
  emit('selectionChange', Array.from(selectedKeys.value))
}
function toggleAllVisible() {
  if (!props.selectable) return
  const allSelected = visibleRows.value.every(r => selectedKeys.value.has((r as any)[keyFieldStr.value]))
  const s = new Set(selectedKeys.value)
  if (allSelected) {
    visibleRows.value.forEach(r => s.delete((r as any)[keyFieldStr.value]))
  } else {
    visibleRows.value.forEach(r => s.add((r as any)[keyFieldStr.value]))
  }
  selectedKeys.value = s
  emit('selectionChange', Array.from(selectedKeys.value))
}

/** DATA PIPELINE */
const columns = computed(() => (props.columns ?? []) as ColumnDef[])
const filtered = computed(() => applyFilter(props.rows as any[], filters.value))
const sorted = computed(() => applySort(filtered.value, sortState.value))
const total = computed(() => sorted.value.length)
const visibleRows = computed(() => paginate(sorted.value, page.value, pageSize.value))

/** WATCH two-way */
watch(() => props.sort, v => { if (v) sortState.value = v })
watch(sortState, v => emit('update:sort', v))
watch(() => props.page, v => { if (v) page.value = v })
watch(page, v => emit('update:page', v))
watch(() => props.pageSize, v => { if (v) pageSize.value = v })
watch(pageSize, v => emit('update:pageSize', v))
watch(() => props.filter, v => { if (v) filters.value = v })
watch(filters, v => emit('update:filter', v))

/** UI helpers */
function gridTemplate(cols: ColumnDef[]) {
  const extra = props.selectable ? ['52px'] : []
  return [...extra, ...cols.map(c => (c.width ? `${c.width}px` : 'minmax(0,1fr)'))].join(' ')
}

function sortIcon(c: ColumnDef) {
  const s = sortState.value.find(s => s.field === String(c.field))
  if (!s) return ''
  return s.dir === 'asc' ? '▲' : '▼'
}

function toggleSort(col: ColumnDef) {
  if (!col.sortable) return
  const cur = sortState.value.find(s => s.field === String(col.field))
  if (!cur) sortState.value = [{ field: String(col.field), dir: 'asc' }]
  else if (cur.dir === 'asc') cur.dir = 'desc'
  else sortState.value = sortState.value.filter(s => s.field !== cur.field)
}

function setFilterValue(field: string, v: string) {
  // default operator: contains
  const others = filters.value.filter(f => f.field !== field)
  if (v === '' || v == null) {
    filters.value = others
  } else {
    filters.value = [...others, { field, operator: 'contains', value: v }]
  }
}

function getFilterValue(field: string) {
  return filters.value.find(f => f.field === field)?.value ?? ''
}

function totalPages() {
  return Math.max(1, Math.ceil(total.value / pageSize.value))
}
function prevPage() { page.value = Math.max(1, page.value - 1) }
function nextPage() { page.value = Math.min(totalPages(), page.value + 1) }
</script>

<template>
  <div class="v3grid" :dir="props.rtl ? 'rtl' : undefined">
    <!-- HEADER -->
    <div class="v3grid__head" :style="{ display:'grid', gridTemplateColumns: gridTemplate(columns) }">
      <div v-if="props.selectable" class="v3grid__cell">
        <input class="v3grid__checkbox" type="checkbox"
               :checked="visibleRows.length && visibleRows.every(r => selectedKeys.has((r as any)[keyFieldStr]))"
               :indeterminate="visibleRows.some(r => selectedKeys.has((r as any)[keyFieldStr])) && !visibleRows.every(r => selectedKeys.has((r as any)[keyFieldStr]))"
               @change="toggleAllVisible" />
      </div>
      <div v-for="(c,i) in columns" :key="i" class="v3grid__cell font-medium cursor-pointer"
           @click="toggleSort(c)">
        {{ c.title ?? String(c.field) }} <span>{{ sortIcon(c) }}</span>
      </div>
    </div>

    <!-- FILTER ROW -->
    <div class="v3grid__filters" :style="{ display:'grid', gridTemplateColumns: gridTemplate(columns) }">
      <div v-if="props.selectable" class="v3grid__cell"></div>
      <div v-for="(c,i) in columns" :key="i" class="v3grid__cell">
        <input v-if="c.filterable" class="v3grid__input" type="text"
               :placeholder="`Filtrar ${c.title ?? c.field}`"
               :value="getFilterValue(String(c.field))"
               @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
      </div>
    </div>

    <!-- BODY -->
    <div>
      <div v-for="(row,r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r"
           class="v3grid__row" :style="{ gridTemplateColumns: gridTemplate(columns) }">
        <div v-if="props.selectable" class="v3grid__cell" @click.stop>
          <input class="v3grid__checkbox" type="checkbox" :checked="isSelected(row)" @change="toggleRow(row)" />
        </div>
        <div v-for="(c,i) in columns" :key="i" class="v3grid__cell" @click="$emit('rowClick', row)">
          <slot name="cell" :column="c" :row="row" :value="(row as any)[c.field as any]">
            {{ c.format ? c.format((row as any)[c.field as any], row as any) : (row as any)[c.field as any] }}
          </slot>
        </div>
      </div>
    </div>

    <!-- FOOTER / PAGING -->
    <div class="v3grid__cell" style="display:flex;gap:.75rem;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;">
      <div class="text-sm">Total: {{ total }} • Página {{ page }} / {{ totalPages() }}</div>
      <div style="display:flex;align-items:center;gap:.5rem">
        <label class="text-sm">Linhas por página</label>
        <select class="v3grid__input" style="width:auto" :value="pageSize" @change="pageSize = Number(($event.target as HTMLSelectElement).value)">
          <option v-for="n in [10,20,50,100]" :key="n" :value="n">{{ n }}</option>
        </select>
        <button @click="prevPage" :disabled="page<=1">Anterior</button>
        <button @click="nextPage" :disabled="page>=totalPages()">Próxima</button>
      </div>
    </div>
  </div>
</template>
