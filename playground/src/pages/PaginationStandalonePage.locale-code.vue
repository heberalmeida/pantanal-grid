<template>
  <div>
    <!-- English -->
    <PantanalPagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      variant="simple"
      locale="en"
      @update:page="page = $event"
    />
    
    <!-- Spanish -->
    <PantanalPagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      variant="simple"
      locale="es"
      @update:page="page = $event"
    />
    
    <!-- Portuguese -->
    <PantanalPagination
      :page="page"
      :pageSize="pageSize"
      :total="total"
      variant="simple"
      locale="pt"
      @update:page="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(10)
const total = ref(100)
</script>

