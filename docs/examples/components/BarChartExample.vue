<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

const rows = ref([
  { id: 1, product: 'Product A', sales: 850 },
  { id: 2, product: 'Product B', sales: 620 },
  { id: 3, product: 'Product C', sales: 450 },
  { id: 4, product: 'Product D', sales: 920 },
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

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'sales', 
    title: 'Sales (Bar Chart)', 
    width: 220,
    template: barChartTemplate
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

