<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="simple"
    :showTotal="true"
    :showText="true"
    :showIcons="true"
    @update:page="page = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(10)
const total = ref(100)
</script>

