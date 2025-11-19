<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

const rows = ref([
  { id: 1, product: 'Product A', progress: 85 },
  { id: 2, product: 'Product B', progress: 77 },
  { id: 3, product: 'Product C', progress: 75 },
  { id: 4, product: 'Product D', progress: 92 },
])

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

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'progress', 
    title: 'Progress', 
    width: 180,
    template: progressTemplate
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

