<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Custom Cells with Templates
const templateRows = ref([
  { id: 1, name: 'Product A', price: 29.99, status: 'active', rating: 4.5 },
  { id: 2, name: 'Product B', price: 49.99, status: 'inactive', rating: 3.8 },
  { id: 3, name: 'Product C', price: 19.99, status: 'active', rating: 4.2 },
])

const templateColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  {
    field: 'price',
    title: 'Price',
    width: 120,
    template: ({ value }: any) => `<strong style="color: #2563eb;">$${value.toFixed(2)}</strong>`
  },
  {
    field: 'status',
    title: 'Status',
    width: 120,
    template: ({ value }: any) => {
      const color = value === 'active' ? '#10b981' : '#ef4444'
      return `<span style="color: ${color}; font-weight: 600;">${value}</span>`
    }
  },
  {
    field: 'rating',
    title: 'Rating',
    width: 150,
    template: ({ value }: any) => {
      const stars = '⭐'.repeat(Math.floor(value))
      return `<div>${stars} ${value}/5</div>`
    }
  }
]

// Custom Cells with Slots
const slotRows = computed(() => [
  { id: 1, title: 'Landing page redesign', status: 'In progress', owner: 'Livia Santos', priority: 'High', progress: 62 },
  { id: 2, title: 'CRM integration', status: 'Completed', owner: 'Paulo Oliveira', priority: 'Medium', progress: 100 },
  { id: 3, title: 'Winter Sale campaign', status: 'Awaiting approval', owner: 'Fernanda Costa', priority: 'High', progress: 35 },
])

const slotColumns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'title', title: 'Title', width: 250 },
  { field: 'status', title: 'Status', width: 150 },
  { field: 'owner', title: 'Owner', width: 180 },
  { field: 'priority', title: 'Priority', width: 120 },
  { field: 'progress', title: 'Progress', width: 150 },
]

function statusChip(value: string) {
  const classes: Record<string, string> = {
    'In progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    'Awaiting approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  }
  return classes[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

function priorityChip(value: string) {
  const classes: Record<string, string> = {
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    'Low': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  }
  return classes[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
}

function avatarColor(name: string) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Custom Templates -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Templates</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use the <code>template</code> property to customize cell rendering with HTML strings.
      </p>
      <PantanalGrid
        :rows="templateRows"
        :columns="templateColumns"
        key-field="id"
        :height="250"
        locale="en"
        responsive="table"
      />
    </div>

    <!-- Custom Cells with Slots -->
    <div>
      <h3 class="text-lg font-semibold mb-2">Custom Cells with Slots</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Use the <code>#cell</code> slot to render Vue components, badges, buttons, or any custom content.
      </p>
      <PantanalGrid
        :rows="slotRows"
        :columns="slotColumns"
        key-field="id"
        :height="300"
        locale="en"
        responsive="table"
      >
        <template #cell="{ column, value, row }">
          <template v-if="column.field === 'status'">
            <span
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              :class="statusChip(value)"
            >
              {{ value }}
            </span>
          </template>
          <template v-else-if="column.field === 'owner'">
            <span class="flex items-center gap-2">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                :style="{ background: avatarColor(row.owner) }"
              >
                {{ initials(row.owner) }}
              </span>
              <span class="text-sm">{{ row.owner }}</span>
            </span>
          </template>
          <template v-else-if="column.field === 'priority'">
            <span
              class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold"
              :class="priorityChip(value)"
            >
              {{ value }}
            </span>
          </template>
          <template v-else-if="column.field === 'progress'">
            <div class="w-32">
              <div class="flex items-center justify-between text-xs font-medium mb-1">
                <span>{{ value }}%</span>
              </div>
              <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-800">
                <div class="h-2 rounded-full bg-blue-500"
                  :style="{ width: Math.min(value, 100) + '%' }"></div>
              </div>
            </div>
          </template>
          <template v-else>
            {{ value }}
          </template>
        </template>
      </PantanalGrid>
    </div>
  </div>
</template>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-semibold {
  font-weight: 600;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
.dark .text-gray-400 {
  color: #9ca3af;
}
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
.inline-flex {
  display: inline-flex;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 0.5rem;
}
.rounded-full {
  border-radius: 9999px;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.text-xs {
  font-size: 0.75rem;
}
.font-medium {
  font-weight: 500;
}
.flex {
  display: flex;
}
.h-8 {
  height: 2rem;
}
.w-8 {
  width: 2rem;
}
.justify-center {
  justify-content: center;
}
.text-white {
  color: #fff;
}
.rounded-md {
  border-radius: 0.375rem;
}
.font-semibold {
  font-weight: 600;
}
.w-32 {
  width: 8rem;
}
.justify-between {
  justify-content: space-between;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.h-2 {
  height: 0.5rem;
}
.rounded-full {
  border-radius: 9999px;
}
.bg-gray-200 {
  background-color: #e5e7eb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.bg-blue-500 {
  background-color: #3b82f6;
}
</style>









