<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="pages"
    :maxPages="7"
    :showTotal="true"
    :showText="true"
    :showIcons="true"
    :showPageSize="true"
    :pageSizeOptions="[5, 10, 20, 50]"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(10)
const total = ref(150)
</script>

