<template>
  <PantanalPagination
    :page="page"
    :pageSize="pageSize"
    :total="total"
    variant="pages"
    :maxPages="5"
    :showTotal="true"
    :showText="false"
    :showIcons="true"
    dense
    @update:page="page = $event"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination as PantanalPagination } from '@pantanal/grid'

const page = ref(1)
const pageSize = ref(20)
const total = ref(200)
</script>

