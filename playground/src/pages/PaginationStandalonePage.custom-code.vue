<template>
  <div>
    <!-- Your custom content -->
    <div class="grid gap-3 md:grid-cols-3">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="p-4 border rounded-lg">
        <h4>{{ product.name }}</h4>
        <p>Price: ${{ product.price.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <PantanalPagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      variant="pages"
      :maxPages="5"
      :showTotal="true"
      :showText="true"
      :showIcons="true"
      :showPageSize="true"
      @update:page="page = $event"
      @update:pageSize="pageSize = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const products = ref([
  { id: 1, name: 'Product 1', price: 99.99 },
  { id: 2, name: 'Product 2', price: 49.99 },
  // ... more products
])

const page = ref(1)
const pageSize = ref(9)
const total = computed(() => products.value.length)

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return products.value.slice(start, start + pageSize.value)
})
</script>

