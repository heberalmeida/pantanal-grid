<template>
  <div
    ref="rootEl"
    class="pantanal-listview"
    :class="{
      'pantanal-listview--navigatable': props.navigatable,
      'pantanal-listview--selectable': props.selectable,
      'pantanal-listview--editing': editingItem !== null,
    }"
  >
    <!-- Loading indicator -->
    <div v-if="loading" class="pantanal-listview__loading">
      <div class="pantanal-listview__spinner"></div>
    </div>

    <!-- List items -->
    <div v-if="!loading && items.length > 0" class="pantanal-listview__items">
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        ref="itemEls"
        class="pantanal-listview__item"
        :class="{
          'pantanal-listview__item--selected': isSelected(item),
          'pantanal-listview__item--editing': isEditing(item),
          'pantanal-listview__item--alternate': index % 2 === 1 && props.altTemplate,
        }"
        :tabindex="props.navigatable ? (focusedIndex === index ? 0 : -1) : undefined"
        @click="handleItemClick(item, index, $event)"
        @dblclick="handleItemDoubleClick(item)"
        @keydown="props.navigatable && handleKeydown($event, item, index)"
      >
        <!-- Edit template -->
        <div v-if="isEditing(item)" class="pantanal-listview__item-edit" v-html="renderEditTemplate(item, index)"></div>
        <!-- Normal template -->
        <div v-else class="pantanal-listview__item-content" v-html="renderTemplate(item, index)"></div>
        <!-- Selection checkbox -->
        <div v-if="props.selectable" class="pantanal-listview__item-select">
          <input
            type="checkbox"
            :checked="isSelected(item)"
            @change="handleSelectionChange(item, $event)"
            @click.stop
          />
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && items.length === 0" class="pantanal-listview__empty">
      <slot name="empty">
        <div class="pantanal-listview__empty-message">No items to display</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Row = Row">
import { ref, computed, watch, onMounted } from 'vue'
import type { ListViewProps, ListViewEmits, Row, DataSourceInstance, DataSourceProps } from '../types'

const props = withDefaults(defineProps<ListViewProps<T>>(), {
  autoBind: true,
  navigatable: false,
  selectable: false,
})

const emit = defineEmits<ListViewEmits<T>>()

const rootEl = ref<HTMLElement>()
const itemEls = ref<HTMLElement[]>([])
const items = ref<T[]>([])
const selectedItems = ref<Set<T>>(new Set())
const editingItem = ref<T | null>(null)
const focusedIndex = ref<number>(-1)
const loading = ref(false)
const dataSourceInstance = ref<DataSourceInstance | null>(null)

// Computed
const isMultipleSelection = computed(() => props.selectable === 'multiple' || props.selectable === true)

// Methods
function getItemKey(item: any, index: number): string | number {
  return ((item as any).id ?? (item as any).key ?? index) as string | number
}

function isSelected(item: any): boolean {
  return selectedItems.value.has(item as any)
}

function isEditing(item: any): boolean {
  return editingItem.value === (item as any)
}

function renderTemplate(item: any, index: number): string {
  if (!props.template) {
    return JSON.stringify(item)
  }
  if (typeof props.template === 'function') {
    return (props.template as (dataItem: any, index: number) => string)(item, index)
  }
  // Simple template replacement
  let template = props.template
  Object.keys(item as Record<string, any>).forEach(key => {
    const value = (item as Record<string, any>)[key]
    template = template.replace(new RegExp(`#:${key}#`, 'g'), String(value ?? ''))
    template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value ?? ''))
  })
  return template
}

function renderEditTemplate(item: any, index: number): string {
  if (!props.editTemplate) {
    return renderTemplate(item, index)
  }
  if (typeof props.editTemplate === 'function') {
    return (props.editTemplate as (dataItem: any, index: number) => string)(item, index)
  }
  // Simple template replacement
  let template = props.editTemplate
  Object.keys(item as Record<string, any>).forEach(key => {
    const value = (item as Record<string, any>)[key]
    template = template.replace(new RegExp(`#:${key}#`, 'g'), String(value ?? ''))
    template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value ?? ''))
  })
  return template
}

function handleItemClick(item: any, index: number, event: MouseEvent) {
  if (props.navigatable) {
    focusedIndex.value = index
  }
  
  if (props.selectable) {
    if (isMultipleSelection.value && event.ctrlKey) {
      toggleSelection(item)
    } else if (isMultipleSelection.value && event.shiftKey) {
      selectRange(index)
    } else {
      if (props.selectable === 'single') {
        selectedItems.value.clear()
        selectedItems.value.add(item as any)
      } else {
        toggleSelection(item)
      }
      emitChange()
    }
  }
}

function handleItemDoubleClick(item: any) {
  if (props.editTemplate) {
    startEdit(item as any)
  }
}

function handleSelectionChange(item: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  if (checked) {
    selectedItems.value.add(item as any)
  } else {
    selectedItems.value.delete(item as any)
  }
  emitChange()
}

function toggleSelection(item: T | any) {
  const itemAsAny = item as any
  if (selectedItems.value.has(itemAsAny)) {
    selectedItems.value.delete(itemAsAny)
  } else {
    selectedItems.value.add(itemAsAny)
  }
}

function selectRange(toIndex: number) {
  if (focusedIndex.value === -1) {
    focusedIndex.value = 0
  }
  const start = Math.min(focusedIndex.value, toIndex)
  const end = Math.max(focusedIndex.value, toIndex)
  for (let i = start; i <= end; i++) {
    const item = items.value[i]
    if (item) {
      selectedItems.value.add(item as any)
    }
  }
  focusedIndex.value = toIndex
  emitChange()
}

function startEdit(item: T | any) {
  editingItem.value = item as T
  emit('edit', item as T)
}

function cancelEdit() {
  editingItem.value = null
  emit('cancel')
}

function saveEdit() {
  if (editingItem.value) {
    emit('save', editingItem.value as T)
    editingItem.value = null
  }
}

function removeItem(item: T) {
  emit('remove', item)
}

function handleKeydown(event: KeyboardEvent, item: any, index: number) {
  if (!props.navigatable) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (index < items.value.length - 1) {
        focusedIndex.value = index + 1
        itemEls.value[index + 1]?.focus()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (index > 0) {
        focusedIndex.value = index - 1
        itemEls.value[index - 1]?.focus()
      }
      break
    case 'Enter':
      event.preventDefault()
      if (props.editTemplate) {
        startEdit(item as T)
      }
      break
    case 'Escape':
      event.preventDefault()
      if (editingItem.value) {
        cancelEdit()
      }
      break
    case 'Delete':
      event.preventDefault()
      if (props.editTemplate) {
        removeItem(item as T)
      }
      break
    case ' ':
      event.preventDefault()
      if (props.selectable) {
        toggleSelection(item as T)
        emitChange()
      }
      break
  }
}

function emitChange() {
  emit('change', Array.from(selectedItems.value) as T[])
}

async function loadData() {
  if (!props.dataSource) {
    items.value = []
    return
  }

  loading.value = true
  emit('databinding')

  try {
    // Handle array
    if (Array.isArray(props.dataSource)) {
      items.value = [...(props.dataSource as T[])]
      emit('databound', items.value as T[])
      return
    }

    // Handle DataSource instance
    if (typeof (props.dataSource as any).data === 'function') {
      dataSourceInstance.value = props.dataSource as DataSourceInstance
      items.value = dataSourceInstance.value.data() as T[]
      emit('databound', items.value as T[])
      return
    }

    // Handle DataSource props - create instance
    const dsProps = props.dataSource as DataSourceProps<T>
    // For now, we'll use a simple implementation
    // In a full implementation, you'd create a DataSource instance
    if (dsProps && dsProps.data && Array.isArray(dsProps.data)) {
      items.value = [...(dsProps.data as T[])]
      emit('databound', items.value as T[])
    } else {
      items.value = []
      emit('databound', [] as T[])
    }
  } catch (error) {
    console.error('ListView data loading error:', error)
  } finally {
    loading.value = false
  }
}

// Watch dataSource changes
watch(() => props.dataSource, async () => {
  if (props.autoBind) {
    await loadData()
  }
}, { deep: true, immediate: false })

// Lifecycle
onMounted(async () => {
  if (props.autoBind) {
    await loadData()
  }
})

// Expose methods
function widget() {
  return {
    widget: () => widget(),
    dataItem: (element: HTMLElement) => {
      const index = itemEls.value.indexOf(element as HTMLElement)
      return index >= 0 ? (items.value[index] as Row) : null
    },
    refresh: () => {
      loadData()
    },
    setDataSource: (ds: DataSourceInstance) => {
      // Implementation for setting data source
      dataSourceInstance.value = ds
      loadData()
    },
  }
}

defineExpose({
  widget,
  refresh: loadData,
  items: () => items.value,
  selectedItems: () => Array.from(selectedItems.value),
  clearSelection: () => {
    selectedItems.value.clear()
    emitChange()
  },
  selectItem: (item: T) => {
    selectedItems.value.add(item as any)
    emitChange()
  },
  deselectItem: (item: T) => {
    selectedItems.value.delete(item as any)
    emitChange()
  },
  startEdit,
  cancelEdit,
  saveEdit,
  removeItem,
})
</script>

<style scoped>
.pantanal-listview {
  position: relative;
  width: 100%;
}

.pantanal-listview__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.pantanal-listview__spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pantanal-listview__items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pantanal-listview__item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  transition: all 0.2s;
  cursor: pointer;
}

.pantanal-listview__item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.pantanal-listview__item--selected {
  background: #eff6ff;
  border-color: #3b82f6;
}

.pantanal-listview__item--editing {
  background: #fef3c7;
  border-color: #f59e0b;
}

.pantanal-listview__item--alternate {
  background: #f9fafb;
}

.pantanal-listview__item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.pantanal-listview__item-content,
.pantanal-listview__item-edit {
  flex: 1;
}

.pantanal-listview__item-select {
  margin-left: 0.5rem;
}

.pantanal-listview__empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.pantanal-listview__empty-message {
  font-size: 0.875rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .pantanal-listview__item {
    background: #1f2937;
    border-color: #374151;
    color: #f9fafb;
  }

  .pantanal-listview__item:hover {
    background: #111827;
    border-color: #4b5563;
  }

  .pantanal-listview__item--selected {
    background: #1e3a8a;
    border-color: #3b82f6;
  }

  .pantanal-listview__item--editing {
    background: #78350f;
    border-color: #f59e0b;
  }

  .pantanal-listview__item--alternate {
    background: #111827;
  }

  .pantanal-listview__empty {
    color: #9ca3af;
  }
}
</style>

