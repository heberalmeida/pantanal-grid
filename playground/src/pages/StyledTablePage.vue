<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Styled sales snapshot</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        A sales dashboard style that combines gradients, avatars and progress pills. All visuals are controlled via
        scoped CSS and the <code>#cell</code> slot.
      </p>
    </header>

    <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[1px] shadow-2xl">
      <div class="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-950/70 p-6 backdrop-blur">
        <PantanalGrid
          class="styled-board"
          :rows="rows"
          :columns="columns"
          key-field="id"
          :striped="false"
          :responsive="'table'"
          :show-filter-row="false"
          :show-footer="false"
          locale="en"
        >
          <template #cell="{ column, value, row }">
            <template v-if="column.field === 'status'">
              <span class="status-chip" :class="statusClass(value as string)">{{ value }}</span>
            </template>
            <template v-else-if="column.field === 'owner'">
              <span class="flex items-center gap-3">
                <span class="owner-avatar" :style="{ background: avatarColor(row.owner) }">
                  {{ initials(row.owner) }}
                </span>
                <div>
                  <p class="owner-name">{{ row.owner }}</p>
                  <p class="owner-role">{{ row.region }}</p>
                </div>
              </span>
            </template>
            <template v-else-if="column.field === 'monthly'">
              <div class="flex w-32 flex-col gap-1">
                <div class="flex items-center justify-between text-[11px] uppercase tracking-widest text-slate-400">
                  <span>{{ ((row.monthly / row.goal) * 100).toFixed(0) }}%</span>
                  <span>{{ formatCurrency(row.monthly) }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-slate-800">
                  <div
                    class="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                    :style="{ width: Math.min(100, Math.round((row.monthly / row.goal) * 100)) + '%' }"
                  />
                </div>
              </div>
            </template>
            <template v-else-if="column.field === 'goal'">
              <span class="goal">{{ formatCurrency(value as number) }}</span>
            </template>
            <template v-else-if="column.field === 'ytd'">
              <span class="ytd" :class="{ 'text-emerald-300': row.ytdChange >= 0, 'text-rose-300': row.ytdChange < 0 }">
                {{ formatCurrency(value as number) }}
                <span class="change" :class="{ up: row.ytdChange >= 0, down: row.ytdChange < 0 }">
                  {{ row.ytdChange >= 0 ? '+' : '' }}{{ row.ytdChange.toFixed(1) }}%
                </span>
              </span>
            </template>
            <template v-else>
              {{ value }}
            </template>
          </template>
        </PantanalGrid>
        <ExampleCode :source="codeSnippet" class="mt-6" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PantanalGrid } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './StyledTablePage.vue?raw'

const rows = computed(() => [
  { id: 1, owner: 'Laura Campos', region: 'South', status: 'Active', goal: 120000, monthly: 94000, ytd: 560000, ytdChange: 8.4 },
  { id: 2, owner: 'John Nogueira', region: 'Southeast', status: 'At risk', goal: 150000, monthly: 72000, ytd: 401000, ytdChange: -3.2 },
  { id: 3, owner: 'Mariana Prado', region: 'Northeast', status: 'Growing', goal: 98000, monthly: 105000, ytd: 498000, ytdChange: 11.7 },
  { id: 4, owner: 'Rafael Teles', region: 'Central', status: 'Active', goal: 88000, monthly: 83000, ytd: 352000, ytdChange: 4.3 },
  { id: 5, owner: 'Sofia Mizuno', region: 'International', status: 'Growing', goal: 165000, monthly: 152000, ytd: 688000, ytdChange: 15.9 },
  { id: 6, owner: 'Peter Costa', region: 'North', status: 'Follow-up', goal: 76000, monthly: 54000, ytd: 274000, ytdChange: -1.8 },
])

const columns = [
  { field: 'owner', title: 'Account executive', width: 220 },
  { field: 'status', title: 'Status', width: 160 },
  { field: 'monthly', title: 'Monthly progress', width: 200 },
  { field: 'goal', title: 'Quarter goal', width: 140 },
  { field: 'ytd', title: 'YTD revenue', width: 160 },
]

const codeSnippet = exampleSource

function avatarColor(name: string) {
  const palette = ['#38bdf8', '#818cf8', '#f472b6', '#22d3ee', '#facc15', '#34d399']
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return palette[hash % palette.length]
}

function initials(name: string) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
}

function formatCurrency(v: number) {
  return v.toLocaleString('en-US', { currency: 'USD', style: 'currency', maximumFractionDigits: 0 })
}

function statusClass(status: string) {
  return `status-${status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`
}
</script>

<style scoped>
.styled-board :deep(.v3grid) {
  background: transparent;
  color: #cbd5f5;
  --tw-shadow: none;
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
  table-layout: auto;
}
.styled-board :deep(.v3grid__head),
.styled-board :deep(.v3grid__filters) {
  background: transparent;
}
.styled-board :deep(.v3grid__row) {
  background: linear-gradient(90deg, rgba(148, 163, 255, 0.08), rgba(148, 163, 255, 0));
  border-bottom: 1px solid rgba(148, 163, 255, 0.12);
}
.styled-board :deep(.v3grid__row:hover) {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.25), rgba(91, 33, 182, 0.1));
}
.styled-board :deep(.v3grid__cell),
.styled-board :deep(.v3grid__headercell) {
  border: 0;
  padding-block: 0.9rem;
  font-size: 0.84rem;
}
.styled-board :deep(.v3grid__headercell),
.styled-board :deep(.v3grid__cell) {
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
}
.styled-board :deep(.v3grid__cell[data-focus="true"]) {
    outline: 0 solid var(--grid-accent, #18a058);
    outline-offset: -2px;
}
.owner-name { font-size: 0.95rem; }
.owner-role { font-size: 0.75rem; }
.status-chip { font-size: 0.75rem; padding: 0.3rem 0.8rem; }

.styled-board :deep(.v3grid__cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styled-board :deep(.v3grid__headercell) {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.68rem;
  color: rgba(148, 163, 255, 0.75);
}
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(148, 163, 255, 0.12);
  color: #bfdbfe;
}
.status-chip::before {
  content: '';
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 999px;
  background: currentColor;
}
.status-active { color: #4ade80; background: rgba(74, 222, 128, 0.12); }
.status-at-risk { color: #f87171; background: rgba(248, 113, 113, 0.12); }
.status-growing { color: #38bdf8; background: rgba(56, 189, 248, 0.12); }
.status-follow-up { color: #facc15; background: rgba(250, 204, 21, 0.12); }

.owner-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
}
.owner-name {
  font-weight: 600;
  color: #e2e8f0;
}
.owner-role {
  font-size: 0.7rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: rgba(148, 163, 255, 0.6);
}
.goal {
  font-feature-settings: 'tnum';
  font-weight: 600;
  color: #f9fafb;
}
.ytd {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-feature-settings: 'tnum';
}
.change {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.1rem 0.6rem;
  background: rgba(15, 23, 42, 0.5);
}
.change.up {
  color: #34d399;
}
.change.down {
  color: #f87171;
}

@media (max-width: 768px) {
  .styled-board :deep(.v3grid__row) {
    font-size: 0.78rem;
  }
  .owner-role {
    font-size: 0.65rem;
  }
  .status-chip {
    font-size: 0.68rem;
  }
}
</style>
