<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="edges"
    :maxPages="5"
    :showTotal="true"
    :showText="false"
    :showIcons="true"
    :showPageSize="true"
    @update:page="page = $event"
    @update:pageSize="pageSize = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(12)
const total = ref(120)
</script>

