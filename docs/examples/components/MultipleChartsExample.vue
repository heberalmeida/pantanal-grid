<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

interface SalesData {
  id: number
  product: string
  sales: number
  progress: number
  trend: number[]
}

const rows = ref<SalesData[]>([
  { id: 1, product: 'Product A', sales: 850, progress: 85, trend: [100, 150, 200, 250, 300, 350, 400] },
  { id: 2, product: 'Product B', sales: 620, progress: 77, trend: [80, 120, 160, 200, 240, 280, 320] },
  { id: 3, product: 'Product C', sales: 450, progress: 75, trend: [60, 90, 120, 150, 180, 210, 240] },
  { id: 4, product: 'Product D', sales: 920, progress: 92, trend: [120, 180, 240, 300, 360, 420, 480] },
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
  const width = 150
  const height = 24
  
  const getColor = (val: number) => {
    if (val >= 90) return '#10b981'
    if (val >= 70) return '#3b82f6'
    if (val >= 50) return '#f59e0b'
    return '#ef4444'
  }
  
  return h('div', {
    style: {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: '#e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
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
        justifyContent: 'center'
      }
    }, [
      h('span', {
        style: {
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }
      }, `${value}%`)
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
  
  return h('svg', {
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
    })
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

