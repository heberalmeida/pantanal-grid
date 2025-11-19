<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'john@example.com'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    email: 'jane@example.com'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'bob@example.com'
  },
  {
    id: 4,
    name: 'Alice Williams',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'alice@example.com'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'charlie@example.com'
  }
])

const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 120,
    image: {
      shape: 'round',
      size: 60,
      objectFit: 'cover',
      rowHeight: 90,
      placeholder: 'https://via.placeholder.com/60',
      alt: (row) => `${row.name} avatar`
    }
  },
  {
    field: 'name',
    title: 'Name',
    width: 150
  },
  {
    field: 'email',
    title: 'Email',
    width: 200
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :height="400"
    locale="en"
    responsive="table"
  />
</template>


