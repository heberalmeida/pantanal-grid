<template>
  <section class="space-y-6">
    <header class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Styled Sales Snapshot
          </h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
            A modern sales dashboard combining gradients, avatars, and progress indicators. All visuals are controlled via
            scoped CSS and the <code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">#cell</code> slot.
          </p>
        </div>
      </div>
    </header>

    <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-[2px] shadow-2xl ring-1 ring-slate-800/50">
      <div class="rounded-[calc(theme(borderRadius.3xl)-2px)] bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 p-8 backdrop-blur-xl">
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
              <span class="status-chip" :class="statusClass(value as string)">
                <span class="status-dot"></span>
                {{ value }}
              </span>
            </template>
            <template v-else-if="column.field === 'owner'">
              <div class="flex items-center gap-3 group">
                <span class="owner-avatar group-hover:scale-110 transition-transform duration-200" :style="{ background: avatarColor(row.owner) }">
                  {{ initials(row.owner) }}
                </span>
                <div class="flex flex-col">
                  <p class="owner-name">{{ row.owner }}</p>
                  <p class="owner-role">{{ row.region }}</p>
                </div>
              </div>
            </template>
            <template v-else-if="column.field === 'monthly'">
              <div class="flex flex-col gap-2 min-w-[180px]">
                <div class="flex items-center justify-between">
                  <span 
                    class="progress-percentage" 
                    :class="{ 'progress-exceeded': (row.monthly / row.goal) * 100 > 100 }"
                  >
                    {{ ((row.monthly / row.goal) * 100).toFixed(0) }}%
                  </span>
                  <span 
                    class="progress-amount"
                    :class="{ 'progress-exceeded': (row.monthly / row.goal) * 100 > 100 }"
                  >
                    {{ formatCurrency(row.monthly) }}
                  </span>
                </div>
                <div class="progress-bar-container">
                  <div
                    class="progress-bar-fill"
                    :class="{ 'exceeded': (row.monthly / row.goal) * 100 > 100 }"
                    :style="{ width: Math.min(100, Math.round((row.monthly / row.goal) * 100)) + '%' }"
                  >
                    <span class="progress-bar-glow"></span>
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="column.field === 'goal'">
              <span class="goal-text">{{ formatCurrency(value as number) }}</span>
            </template>
            <template v-else-if="column.field === 'ytd'">
              <div class="flex flex-col gap-1">
                <span class="ytd-amount">{{ formatCurrency(value as number) }}</span>
                <span class="change-badge" :class="{ 'up': row.ytdChange >= 0, 'down': row.ytdChange < 0 }">
                  <span class="change-icon">{{ row.ytdChange >= 0 ? '↗' : '↘' }}</span>
                  {{ row.ytdChange >= 0 ? '+' : '' }}{{ row.ytdChange.toFixed(1) }}%
                </span>
              </div>
            </template>
            <template v-else>
              {{ value }}
            </template>
          </template>
        </PantanalGrid>
        <ExampleCode :source="codeSnippet" class="mt-8" />
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
  const palette = [
    'linear-gradient(135deg, #fbbf24, #f59e0b)',
    'linear-gradient(135deg, #06b6d4, #0891b2)',
    'linear-gradient(135deg, #a78bfa, #8b5cf6)',
    'linear-gradient(135deg, #34d399, #10b981)',
    'linear-gradient(135deg, #f472b6, #ec4899)',
    'linear-gradient(135deg, #60a5fa, #3b82f6)',
  ]
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
/* Grid Base Styles */
.styled-board :deep(.v3grid) {
  background: transparent !important;
  color: #f8fafc;
  --tw-shadow: none;
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
  table-layout: auto;
}

/* Ensure dark background is maintained */
.styled-board :deep(.v3grid__body) {
  background: transparent !important;
}

.styled-board :deep(.v3grid__scroll) {
  background: transparent !important;
}

/* Disable default keyboard focus styles */
.styled-board :deep(.v3grid__cell:focus) {
  outline: none !important;
}

.styled-board :deep(.v3grid__cell:focus-visible) {
  outline: none !important;
}

.styled-board :deep(.v3grid__head),
.styled-board :deep(.v3grid__filters) {
  background: transparent;
}

/* Row Styles - Better spacing */
.styled-board :deep(.v3grid__row) {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.03), rgba(148, 163, 184, 0)) !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25) !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 72px;
  margin-bottom: 0;
}

/* Add spacing between rows visually */
.styled-board :deep(.v3grid__row:not(:last-child)) {
  margin-bottom: 4px;
}

.styled-board :deep(.v3grid__row) .v3grid__cell {
  padding-top: 1.25rem !important;
  padding-bottom: 1.25rem !important;
  vertical-align: middle;
}

.styled-board :deep(.v3grid__row:hover) {
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.12), rgba(139, 92, 246, 0.06));
  border-bottom-color: rgba(56, 189, 248, 0.25);
}

.styled-board :deep(.v3grid__row:hover .v3grid__cell) {
  color: #ffffff;
}

.styled-board :deep(.v3grid__row:hover .owner-name),
.styled-board :deep(.v3grid__row:hover .goal-text),
.styled-board :deep(.v3grid__row:hover .ytd-amount),
.styled-board :deep(.v3grid__row:hover .progress-amount) {
  color: #ffffff;
}

.styled-board :deep(.v3grid__row:last-child) {
  border-bottom: none;
}

/* Cell Styles - Better spacing and readability */
.styled-board :deep(.v3grid__cell),
.styled-board :deep(.v3grid__headercell) {
  border: 0;
  padding: 1.25rem 1.5rem !important;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: transparent !important;
  vertical-align: middle;
}

.styled-board :deep(.v3grid__cell) {
  white-space: nowrap;
  overflow: visible;
  text-overflow: ellipsis;
  color: #f1f5f9 !important;
  background: transparent !important;
}

/* Force dark background - override any white backgrounds from default styles */
.styled-board :deep(.v3grid),
.styled-board :deep(.v3grid__table),
.styled-board :deep(.v3grid__body),
.styled-board :deep(.v3grid__row),
.styled-board :deep(.v3grid__cell),
.styled-board :deep(.v3grid__head),
.styled-board :deep(.v3grid__scroll),
.styled-board :deep(table) {
  background-color: transparent !important;
  background: transparent !important;
}

/* Override any inline styles or CSS variables that might set white background */
.styled-board {
  --grid-bg: transparent !important;
}

.styled-board :deep(.v3grid__headercell) {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(226, 232, 240, 0.9) !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  border-bottom: 2px solid rgba(148, 163, 184, 0.25) !important;
  background: transparent !important;
}

/* Clean focus style - subtle and readable */
.styled-board :deep(.v3grid__cell[data-focus="true"]) {
  outline: none !important;
  background: rgba(56, 189, 248, 0.06) !important;
  border-radius: 6px;
  position: relative;
  z-index: 1;
}

/* Subtle border indicator for focus */
.styled-board :deep(.v3grid__cell[data-focus="true"])::after {
  content: '';
  position: absolute;
  inset: 2px;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.25);
  pointer-events: none;
  z-index: -1;
}

/* Ensure text remains readable when focused - but preserve specific element colors */
.styled-board :deep(.v3grid__cell[data-focus="true"]) {
  color: #ffffff !important;
}

.styled-board :deep(.v3grid__cell[data-focus="true"] .owner-name),
.styled-board :deep(.v3grid__cell[data-focus="true"] .goal-text),
.styled-board :deep(.v3grid__cell[data-focus="true"] .ytd-amount),
.styled-board :deep(.v3grid__cell[data-focus="true"] .progress-amount) {
  color: #ffffff !important;
}

.styled-board :deep(.v3grid__cell[data-focus="true"] .status-chip),
.styled-board :deep(.v3grid__cell[data-focus="true"] .change-badge),
.styled-board :deep(.v3grid__cell[data-focus="true"] .progress-percentage) {
  /* Let these keep their own colors */
  opacity: 1 !important;
}

/* Status Chip */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.375rem 0.875rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.status-chip::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.status-chip:hover::before {
  transform: translateX(100%);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.status-active { 
  color: #22c55e; 
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.12));
  border: 1px solid rgba(34, 197, 94, 0.3);
  font-weight: 700;
}

.status-at-risk { 
  color: #ef4444; 
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.12));
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-weight: 700;
}

.status-growing { 
  color: #3b82f6; 
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-weight: 700;
}

.status-follow-up { 
  color: #eab308; 
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.12));
  border: 1px solid rgba(234, 179, 8, 0.3);
  font-weight: 700;
}

/* Owner Avatar */
.owner-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.875rem;
  color: #ffffff;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.owner-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #ffffff;
  line-height: 1.4;
}

.owner-role {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.85);
  margin-top: 0.125rem;
  font-weight: 500;
}

/* Progress Bar */
.progress-bar-container {
  height: 0.5rem;
  border-radius: 9999px;
  background: rgba(30, 41, 59, 0.6);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);
  position: relative;
  overflow: hidden;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.progress-bar-fill.exceeded {
  background: linear-gradient(90deg, #10b981, #22c55e, #34d399);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
}

/* When progress exceeds 100%, change text color to green */
.progress-exceeded {
  color: #22c55e !important;
}

.progress-bar-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.progress-percentage {
  font-size: 0.75rem;
  font-weight: 700;
  color: #60a5fa;
  letter-spacing: 0.05em;
}

.progress-amount {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f8fafc;
  font-feature-settings: 'tnum';
}

/* Goal Text */
.goal-text {
  font-feature-settings: 'tnum';
  font-weight: 600;
  font-size: 0.875rem;
  color: #ffffff;
  letter-spacing: 0.02em;
}

/* YTD Amount */
.ytd-amount {
  font-feature-settings: 'tnum';
  font-weight: 600;
  font-size: 0.9375rem;
  color: #ffffff;
  letter-spacing: 0.02em;
}

.change-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 9999px;
  padding: 0.2rem 0.6rem;
  transition: all 0.2s ease;
  width: fit-content;
}

.change-badge.up {
  color: #34d399;
  background: linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(52, 211, 153, 0.08));
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.change-badge.down {
  color: #f87171;
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.15), rgba(248, 113, 113, 0.08));
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.change-icon {
  font-size: 0.875rem;
  display: inline-block;
  transition: transform 0.2s ease;
}

.change-badge:hover .change-icon {
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .styled-board :deep(.v3grid__row) {
    font-size: 0.8125rem;
  }
  
  .styled-board :deep(.v3grid__cell),
  .styled-board :deep(.v3grid__headercell) {
    padding: 0.75rem 1rem;
  }
  
  .owner-avatar {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.75rem;
  }
  
  .owner-name {
    font-size: 0.875rem;
  }
  
  .owner-role {
    font-size: 0.65rem;
  }
  
  .status-chip {
    font-size: 0.6875rem;
    padding: 0.3rem 0.7rem;
  }
  
  .progress-percentage,
  .progress-amount {
    font-size: 0.6875rem;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .styled-board :deep(.v3grid__row:hover) {
    box-shadow: inset 2px 0 0 rgba(56, 189, 248, 0.4);
  }
}
</style>
