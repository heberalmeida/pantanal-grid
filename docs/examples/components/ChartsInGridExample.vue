<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

interface SalesData {
  id: number
  product: string
  sales: number
  target: number
  progress: number
  trend: number[]
  revenue: number
}

const rows = ref<SalesData[]>([
  { id: 1, product: 'Product A', sales: 850, target: 1000, progress: 85, trend: [100, 150, 200, 250, 300, 350, 400], revenue: 12500 },
  { id: 2, product: 'Product B', sales: 620, target: 800, progress: 77, trend: [80, 120, 160, 200, 240, 280, 320], revenue: 9300 },
  { id: 3, product: 'Product C', sales: 450, target: 600, progress: 75, trend: [60, 90, 120, 150, 180, 210, 240], revenue: 6750 },
  { id: 4, product: 'Product D', sales: 920, target: 1000, progress: 92, trend: [120, 180, 240, 300, 360, 420, 480], revenue: 13800 },
])

const barChartTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  const maxValue = Math.max(...rows.value.map(r => r.sales), 1000)
  const percentage = Math.min((value / maxValue) * 100, 100)
  const width = 100
  const height = 20
  
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
    h('span', { style: { minWidth: '45px', fontSize: '0.875rem', flexShrink: 0 } }, `${value}`),
    h('div', { 
      style: { 
        flex: '1 1 auto',
        minWidth: 0,
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center'
      } 
    }, [
      h('svg', { 
        width: width, 
        height: height, 
        style: { 
          border: '1px solid #e5e7eb', 
          borderRadius: '4px',
          display: 'block',
          flexShrink: 0
        }
      }, [
        h('rect', {
          x: 0,
          y: 0,
          width: `${percentage}%`,
          height: height,
          fill: '#3b82f6',
          rx: 4
        }),
        percentage >= 15 ? h('text', {
          x: '50%',
          y: '50%',
          dominantBaseline: 'middle',
          textAnchor: 'middle',
          fontSize: '10px',
          fill: '#fff',
          fontWeight: 'bold'
        }, `${Math.round(percentage)}%`) : null
      ])
    ])
  ])
}

const progressTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  const height = 24
  
  const getColor = (val: number) => {
    if (val >= 90) return '#10b981'
    if (val >= 70) return '#3b82f6'
    if (val >= 50) return '#f59e0b'
    return '#ef4444'
  }
  
  return h('div', { 
    style: { 
      display: 'flex', 
      alignItems: 'center',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    } 
  }, [
    h('div', {
      style: {
        width: '100%',
        maxWidth: '100%',
        height: `${height}px`,
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }
    }, [
      h('div', {
        style: {
          width: `${value}%`,
          height: '100%',
          backgroundColor: getColor(value),
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: value > 0 ? '30px' : '0'
        }
      }, [
        h('span', {
          style: {
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }
        }, `${value}%`)
      ])
    ])
  ])
}

const sparklineTemplate: ColumnTemplateFn = (ctx) => {
  const row = ctx?.row as SalesData
  const data = row.trend || []
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
    field: 'sales', 
    title: 'Sales (Bar)', 
    width: 180,
    template: barChartTemplate
  },
  { 
    field: 'progress', 
    title: 'Progress', 
    width: 180,
    template: progressTemplate
  },
  { 
    field: 'trend', 
    title: 'Trend', 
    width: 180,
    template: sparklineTemplate
  },
  { field: 'revenue', title: 'Revenue', width: 120, format: (v: number) => `$${v.toLocaleString()}` },
]
</script>

<template>
  <div>
    <p class="mb-4 text-sm text-gray-600">
      Example combining different types of charts in the same grid: bars, progress, and sparklines.
    </p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      responsive="table"
      :height="400"
    />
  </div>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-600 {
  color: #4b5563;
}
</style>

