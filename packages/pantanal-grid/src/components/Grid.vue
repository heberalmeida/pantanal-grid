<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ColumnDef, FilterDescriptor, GridEmits, GridProps, SortDescriptor } from '../types'
import { applyFilter, applySort, paginate } from '../composables/data'
import { useColumnResize } from '../composables/resize'
import { useColumnReorder } from '../composables/reorder'
import { useKeyboardNav } from '../composables/keyboard'
import { useVirtual } from '../composables/virtual'
import { usePersist } from '../composables/persist'
import { defaultMsgs } from '../i18n/messages'

const props = withDefaults(defineProps<GridProps>(), {
  keyField: 'id',
  page: 1,
  pageSize: 20,
  selectable: false,
  locale: 'pt',
  virtual: false,
  height: 420,
  rowHeight: 44,
  enableColumnResize: true,
  enableColumnReorder: true,
  serverSide: false
})
const emit = defineEmits<GridEmits>()

/** i18n */
const msgs = computed(() => ({ ...defaultMsgs[props.locale!], ...(props.messages ?? {}) }))

/** STATE */
const sortState = ref<SortDescriptor[]>(props.sort ?? [])
const page = ref(props.page!)
const pageSize = ref(props.pageSize!)
const filters = ref<FilterDescriptor[]>(props.filter ?? [])

/** SELECTION */
const selectedKeys = ref<Set<unknown>>(new Set())
const keyFieldStr = computed(() => String(props.keyField))
function isSelected(row: any) { return selectedKeys.value.has(row[keyFieldStr.value]) }
function toggleRow(row: any) {
  if (!props.selectable) return
  const k = row[keyFieldStr.value]
  if (props.selectable === 'single') selectedKeys.value = new Set([k])
  else {
    const s = new Set(selectedKeys.value)
    s.has(k) ? s.delete(k) : s.add(k)
    selectedKeys.value = s
  }
  emit('selectionChange', Array.from(selectedKeys.value))
}
function toggleAllVisible(current: any[]) {
  if (!props.selectable) return
  const allSelected = current.every(r => selectedKeys.value.has((r as any)[keyFieldStr.value]))
  const s = new Set(selectedKeys.value)
  current.forEach(r => allSelected ? s.delete((r as any)[keyFieldStr.value]) : s.add((r as any)[keyFieldStr.value]))
  selectedKeys.value = s
  emit('selectionChange', Array.from(selectedKeys.value))
}

/** COLUMNS (reorder/resize) */
const columns = computed<ColumnDef[]>(() => (props.columns ?? []) as ColumnDef[])
const { order, onDragStart, onDragOver, onDrop, mapColumns, ensureOrder } = useColumnReorder(() => columns.value)
const { widths, onMouseDown: onResizeDown, ensureWidths } = useColumnResize(() => columns.value)
onMounted(() => { ensureOrder(); ensureWidths() })

/** DATA PIPELINE
 *  - serverSide: usa as linhas como vieram (sem filter/sort/paginação local)
 *  - client: aplica filter/sort/paginação
 */
const filtered = computed(() =>
  props.serverSide ? (props.rows as any[]) : applyFilter(props.rows as any[], filters.value)
)
const sorted = computed(() =>
  props.serverSide ? filtered.value : applySort(filtered.value, sortState.value)
)
const total = computed(() =>
  props.serverSide && typeof props.total === 'number' ? props.total : sorted.value.length
)

/** VIRTUAL vs padrão */
const allRowsRef = () => sorted.value
const { onScroll, slice, topPad, bottomPad } = useVirtual(allRowsRef, props.rowHeight!, props.height!)
const visibleRows = computed(() => {
  if (props.virtual) return slice.value
  // server-side: não paginar no client; rows já vêm fatiadas do servidor
  return props.serverSide ? sorted.value : paginate(sorted.value, page.value, pageSize.value)
})

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
function headerTemplate(cols: ColumnDef[]) {
  ensureOrder(); ensureWidths()
  const ordered = mapColumns(cols)
  return ordered.map((c, idx) => widths.value[idx] ? `${widths.value[idx]}px` : (c.width ? `${c.width}px` : 'minmax(0,1fr)')).join(' ')
}
function bodyTemplate(cols: ColumnDef[]) { return headerTemplate(cols) }
function sortIcon(c: ColumnDef) {
  const s = sortState.value.find(s => s.field === String(c.field))
  if (!s) return ''
  return s.dir === 'asc' ? '▲' : '▼'
}
function toggleSort(col: ColumnDef) {
  if (!col.sortable || props.serverSide) return // server-side: não faz sort local
  const cur = sortState.value.find(s => s.field === String(col.field))
  if (!cur) sortState.value = [{ field: String(col.field), dir: 'asc' }]
  else if (cur.dir === 'asc') cur.dir = 'desc'
  else sortState.value = sortState.value.filter(s => s.field !== cur.field)
}
function setFilterValue(field: string, v: string) {
  // server-side: mantém o model (para o app buscar), mas não filtra localmente
  const others = filters.value.filter(f => f.field !== field)
  if (v === '' || v == null) filters.value = others
  else filters.value = [...others, { field, operator: 'contains', value: v }]
}
function getFilterValue(field: string) { return filters.value.find(f => f.field === field)?.value ?? '' }

function totalPages() {
  if (props.virtual) return 1
  const t = total.value
  const ps = pageSize.value || 1
  return Math.max(1, Math.ceil(t / ps))
}
function prevPage() { page.value = Math.max(1, page.value - 1) }
function nextPage() { page.value = Math.min(totalPages(), page.value + 1) }

/** Keyboard nav */
const { focusRow, focusCol, onKeydown } = useKeyboardNav()

/** Persistência */
const persist = usePersist(props.persistStateKey, {})
onMounted(() => {
  const loaded = persist.load() as any
  if (!loaded) return
  if (!props.serverSide && loaded.sort) sortState.value = loaded.sort
  if (loaded.page) page.value = loaded.page
  if (loaded.pageSize) pageSize.value = loaded.pageSize
  if (!props.serverSide && loaded.filters) filters.value = loaded.filters
  if (loaded.order) order.value = loaded.order
  if (loaded.widths) widths.value = loaded.widths
})
watch([sortState, page, pageSize, filters, order, widths], () => {
  persist.save({
    sort: sortState.value,
    page: page.value,
    pageSize: pageSize.value,
    filters: filters.value,
    order: order.value,
    widths: widths.value
  } as any)
})
</script>

<template>
  <div class="v3grid" :dir="props.rtl ? 'rtl' : undefined">
    <!-- HEADER -->
    <div class="v3grid__head" :style="{ display:'grid', gridTemplateColumns: headerTemplate(columns) }">
      <template v-for="(c,i) in mapColumns(columns)" :key="i">
        <div class="v3grid__cell v3grid__headercell"
             draggable="true"
             @dragstart="props.enableColumnReorder && onDragStart(i, $event)"
             @dragover="props.enableColumnReorder && onDragOver($event)"
             @drop="props.enableColumnReorder && (onDrop(i), $emit('columnReorder',{from: 0, to: i}))"
             @click="toggleSort(c)">
          <span style="flex:1 1 auto">{{ c.title ?? String(c.field) }} <span>{{ sortIcon(c) }}</span></span>
          <span v-if="props.enableColumnResize && (c.resizable ?? true)"
                class="v3grid__resizer" @mousedown="(e:any) => { onResizeDown(e, i); $emit('columnResize',{field:String(c.field), width: widths[i]||c.width||0}) }"></span>
        </div>
      </template>
    </div>

    <!-- FILTER ROW -->
    <div class="v3grid__filters" :style="{ display:'grid', gridTemplateColumns: headerTemplate(columns) }">
      <div v-for="(c,i) in mapColumns(columns)" :key="i" class="v3grid__cell">
        <input v-if="c.filterable" class="v3grid__input" type="text"
               :placeholder="`${msgs.filterPlaceholder} ${c.title ?? c.field}`"
               :value="getFilterValue(String(c.field))"
               @input="setFilterValue(String(c.field), ($event.target as HTMLInputElement).value)" />
      </div>
    </div>

    <!-- BODY (virtual ou normal) -->
    <div v-if="props.virtual" :style="{ height: props.height + 'px', overflow:'auto' }" @scroll="onScroll"
         @keydown="onKeydown($event, sorted.length, columns.length)" tabindex="0">
      <div :style="{ height: topPad + 'px' }"></div>
      <div v-for="(row,r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r"
           class="v3grid__row"
           :style="{ gridTemplateColumns: bodyTemplate(columns) }">
        <div v-for="(c,i) in mapColumns(columns)" :key="i" class="v3grid__cell"
             :tabindex="0"
             :data-focus="focusRow===r && focusCol===i"
             @click="$emit('rowClick', row)">
          <slot name="cell" :column="c" :row="row" :value="(row as any)[c.field as any]">
            {{ c.format ? c.format((row as any)[c.field as any], row as any) : (row as any)[c.field as any] }}
          </slot>
        </div>
      </div>
      <div :style="{ height: bottomPad + 'px' }"></div>
    </div>

    <div v-else>
      <div v-for="(row,r) in visibleRows" :key="(row as any)[keyFieldStr] ?? r"
           class="v3grid__row" :style="{ gridTemplateColumns: bodyTemplate(columns) }"
           @keydown="onKeydown($event, visibleRows.length, columns.length)" tabindex="0">
        <div v-for="(c,i) in mapColumns(columns)" :key="i" class="v3grid__cell"
             :tabindex="0" :data-focus="focusRow===r && focusCol===i"
             @click="$emit('rowClick', row)">
          <slot name="cell" :column="c" :row="row" :value="(row as any)[c.field as any]">
            {{ c.format ? c.format((row as any)[c.field as any], row as any) : (row as any)[c.field as any] }}
          </slot>
        </div>
      </div>
    </div>

    <!-- FOOTER / PAGING -->
    <div class="v3grid__cell" style="display:flex;gap:.75rem;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;">
      <div class="text-sm">{{ msgs.total }}: {{ total }} • {{ msgs.page }} {{ page }}<span v-if="!props.virtual"> / {{ totalPages() }}</span></div>
      <div style="display:flex;align-items:center;gap:.5rem" v-if="!props.virtual">
        <label class="text-sm">{{ msgs.rowsPerPage }}</label>
        <select class="v3grid__input" style="width:auto" :value="pageSize" @change="pageSize = Number(($event.target as HTMLSelectElement).value)">
          <option v-for="n in [10,20,50,100]" :key="n" :value="n">{{ n }}</option>
        </select>
        <button @click="prevPage" :disabled="page<=1">{{ msgs.previous }}</button>
        <button @click="nextPage" :disabled="page>=totalPages()">{{ msgs.next }}</button>
      </div>
    </div>
  </div>
</template>
