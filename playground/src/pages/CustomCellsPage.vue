<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Custom cells &amp; slots</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Use the <code class="rounded bg-slate-200 px-1 py-0.5 text-xs dark:bg-slate-700">#cell</code> slot to render
        badges, buttons, tooltips or any Vue component inside the grid without losing keyboard accessibility.
      </p>
    </header>

    <div class="rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/40">
      <div class="overflow-x-auto">
        <PantanalGrid
          :rows="rows"
          :columns="columns"
          key-field="id"
          :striped="true"
          :responsive="'table'"
          locale="en"
        >
      <template #cell="{ column, value, row }">
        <template v-if="column.field === 'status'">
          <span
            class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
            :class="statusChip(value)"
          >
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
                :class="statusPing(value)"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full" :class="statusDot(value)"></span>
            </span>
            {{ value }}
          </span>
        </template>
        <template v-else-if="column.field === 'owner'">
          <span class="flex items-center gap-3">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
              :style="{ background: avatarColor(row.owner) }"
            >
              {{ initials(row.owner) }}
            </span>
            <span class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ row.owner }}</span>
          </span>
        </template>
        <template v-else-if="column.field === 'priority'">
          <span
            class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold"
            :class="priorityChip(value)"
          >
            <span class="h-1.5 w-3 rounded-full" :class="priorityBar(value)"></span>
            {{ value }}
          </span>
        </template>
        <template v-else-if="column.field === 'actions'">
          <div class="flex items-center gap-2">
            <button class="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              View
            </button>
            <button class="rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-cyan-600">
              Approve
            </button>
          </div>
        </template>
        <template v-else-if="column.field === 'progress'">
          <div class="w-36">
            <div class="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-300">
              <span>{{ value }}%</span>
            </div>
            <div class="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div class="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PantanalGrid } from '@pantanal/grid'

const rows = computed(() => [
  { id: 1, title: 'Landing page redesign', status: 'In progress', owner: 'Livia Santos', priority: 'High', progress: 62 },
  { id: 2, title: 'CRM integration', status: 'Completed', owner: 'Paulo Oliveira', priority: 'Medium', progress: 100 },
  { id: 3, title: 'Winter Sale campaign', status: 'Awaiting approval', owner: 'Fernanda Costa', priority: 'High', progress: 35 },
  { id: 4, title: 'Data migration', status: 'Under review', owner: 'João Martins', priority: 'Critical', progress: 80 },
  { id: 5, title: 'Partner portal', status: 'In progress', owner: 'Patrícia Lima', priority: 'Low', progress: 48 },
  { id: 6, title: 'Onboarding 2.0', status: 'Completed', owner: 'Marcos Lopes', priority: 'Medium', progress: 100 },
])

const columns = [
  { field: 'id', title: '#', width: 60 },
  { field: 'title', title: 'Project', width: 200, filterable: true },
  { field: 'status', title: 'Status', width: 180, filterable: true },
  { field: 'owner', title: 'Owner', width: 200, filterable: true },
  { field: 'priority', title: 'Priority', width: 140, filterable: true },
  { field: 'progress', title: 'Progress', width: 160 },
  { field: 'actions', title: 'Actions', width: 160 }
]

function statusChip(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
    case 'In progress':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-300'
    case 'Awaiting approval':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
    case 'Under review':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
    default:
      return 'bg-slate-200/60 text-slate-600 dark:bg-slate-700/60 dark:text-slate-200'
  }
}

function statusPing(status: string) {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-400'
    case 'In progress':
      return 'bg-sky-400'
    case 'Awaiting approval':
      return 'bg-amber-400'
    case 'Under review':
      return 'bg-purple-400'
    default:
      return 'bg-slate-400'
  }
}

function statusDot(status: string) {
  return statusPing(status)
}

function avatarColor(name: string) {
  const palette = ['#0ea5e9', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e']
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function priorityChip(priority: string) {
  switch (priority) {
    case 'Critical':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
    case 'High':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-300'
    case 'Medium':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-300'
    case 'Low':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
    default:
      return 'bg-slate-200/60 text-slate-600 dark:bg-slate-700/60 dark:text-slate-200'
  }
}

function priorityBar(priority: string) {
  switch (priority) {
    case 'Critical':
      return 'bg-rose-500'
    case 'High':
      return 'bg-orange-500'
    case 'Medium':
      return 'bg-sky-500'
    case 'Low':
      return 'bg-emerald-500'
    default:
      return 'bg-slate-400'
  }
}
</script>
