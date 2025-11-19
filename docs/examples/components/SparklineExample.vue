<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

interface RowData {
  id: number
  product: string
  trend: number[]
}

const rows = ref<RowData[]>([
  { id: 1, product: 'Product A', trend: [100, 150, 200, 250, 300, 350, 400] },
  { id: 2, product: 'Product B', trend: [80, 120, 160, 200, 240, 280, 320] },
  { id: 3, product: 'Product C', trend: [60, 90, 120, 150, 180, 210, 240] },
  { id: 4, product: 'Product D', trend: [120, 180, 240, 300, 360, 420, 480] },
])

const sparklineTemplate: ColumnTemplateFn = (ctx) => {
  const row = ctx?.row as unknown as RowData
  const data = row?.trend || []
  if (data.length === 0) return h('span', 'No data')
  
  const width = 100
  const height = 30
  const padding = 4
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth
    const y = padding + chartHeight - ((val - min) / range) * chartHeight
    return `${x},${y}`
  }).join(' ')
  
  const changePercent = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1)
  
  return h('div', { 
    style: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    } 
  }, [
    h('div', {
      style: {
        flexShrink: 0
      }
    }, [
      h('svg', {
        width: width,
        height: height,
        style: { 
          border: '1px solid #e5e7eb', 
          borderRadius: '4px', 
          backgroundColor: '#f9fafb',
          display: 'block'
        }
      }, [
        h('polyline', {
          points,
          fill: 'none',
          stroke: '#3b82f6',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        }),
        h('circle', {
          cx: points.split(' ')[points.split(' ').length - 1]?.split(',')[0],
          cy: points.split(' ')[points.split(' ').length - 1]?.split(',')[1],
          r: 3,
          fill: '#3b82f6'
        })
      ])
    ]),
    h('span', { 
      style: { 
        fontSize: '0.75rem', 
        color: '#6b7280',
        flexShrink: 0,
        whiteSpace: 'nowrap'
      } 
    }, `↑ ${changePercent}%`)
  ])
}

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'trend', 
    title: 'Trend (7 days)', 
    width: 200,
    template: sparklineTemplate
  },
]
</script>

<template>
  <div>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      responsive="table"
    />
  </div>
</template>

