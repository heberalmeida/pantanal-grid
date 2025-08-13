<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GridProps, ColumnDef, SortDescriptor } from '../types'

const props = defineProps<GridProps>()
const emit = defineEmits(['update:sort','update:page'])

const sortState = ref<SortDescriptor[]>(props.sort ?? [])

function toggleSort(col: ColumnDef) {
  if (!col.sortable) return
  const cur = sortState.value.find(s => s.field === String(col.field))
  if (!cur) sortState.value = [{ field: String(col.field), dir: 'asc' }]
  else if (cur.dir === 'asc') cur.dir = 'desc'
  else sortState.value = sortState.value.filter(s => s.field !== cur.field)
  emit('update:sort', [...sortState.value])
}

const columns = computed(() => (props.columns ?? []) as ColumnDef[])
function gridTemplate(columns: ColumnDef[]) {
  return columns.map(c => (c.width ? `${c.width}px` : 'minmax(0,1fr)')).join(' ')
}

function sortIcon(c: ColumnDef) {
  const s = sortState.value.find(s => s.field === String(c.field))
  if (!s) return ''
  return s.dir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="v3grid" :dir="props.rtl ? 'rtl' : undefined">
    <div class="v3grid__head" :style="{ display:'grid', gridTemplateColumns: gridTemplate(columns) }">
      <div v-for="(c,i) in columns" :key="i" class="v3grid__cell font-medium cursor-pointer"
           @click="toggleSort(c)">
        {{ c.title ?? String(c.field) }} <span>{{ sortIcon(c) }}</span>
      </div>
    </div>

    <div>
      <div v-for="(row,r) in props.rows" :key="r" class="v3grid__row" :style="{ gridTemplateColumns: gridTemplate(columns) }">
        <div v-for="(c,i) in columns" :key="i" class="v3grid__cell">
          <slot name="cell" :column="c" :row="row" :value="(row as any)[c.field as any]">
            {{ (row as any)[c.field as any] }}
          </slot>
        </div>
      </div>
    </div>

    <div class="v3grid__cell" style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;">
      <div class="text-sm">Linhas: {{ props.rows.length }}</div>
      <div class="flex items-center gap-2">
        <button @click="$emit('update:page', (props.page ?? 1) - 1)" :disabled="!props.page || props.page <= 1">Anterior</button>
        <div class="text-sm">Página {{ props.page ?? 1 }}</div>
        <button @click="$emit('update:page', (props.page ?? 1) + 1)">Próxima</button>
      </div>
    </div>
  </div>
</template>
