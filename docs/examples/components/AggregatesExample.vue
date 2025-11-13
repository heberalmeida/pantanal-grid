<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor, type AggregateName } from '@pantanal/grid'

const rows = ref([
  { id: 1, name: 'Product A', category: 'Electronics', price: 99.99, stock: 50 },
  { id: 2, name: 'Product B', category: 'Electronics', price: 49.99, stock: 100 },
  { id: 3, name: 'Product C', category: 'Clothing', price: 19.99, stock: 25 },
  { id: 4, name: 'Product D', category: 'Clothing', price: 39.99, stock: 75 }
])

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { 
    field: 'price', 
    title: 'Price',
    aggregates: ['sum', 'avg'],
    format: (v: number) => `$${v.toFixed(2)}`,
    groupFooterTemplate: (group) => {
      const priceAgg = group.aggregates?.price
      if (priceAgg) {
        return `Sum: $${(priceAgg.sum ?? 0).toFixed(2)} | Avg: $${(priceAgg.avg ?? 0).toFixed(2)}`
      }
      return ''
    }
  },
  { 
    field: 'stock', 
    title: 'Stock',
    aggregates: ['sum', 'min', 'max'],
    groupFooterTemplate: (group) => {
      const stockAgg = group.aggregates?.stock
      if (stockAgg) {
        return `Sum: ${stockAgg.sum} | Min: ${stockAgg.min} | Max: ${stockAgg.max}`
      }
      return ''
    }
  }
]

const group = ref<GroupDescriptor[]>([
  { field: 'category', dir: 'asc' }
])

const aggregates: Record<string, AggregateName[]> = {
  price: ['sum', 'avg'],
  stock: ['sum', 'min', 'max'],
  id: ['count']
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :group="group"
    :aggregates="aggregates"
    :show-group-footers="true"
    locale="en"
    responsive="table"
  />
</template>

