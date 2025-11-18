<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    thumbnail: 'https://picsum.photos/100/100?random=1',
    photo: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    thumbnail: 'https://picsum.photos/100/100?random=2',
    photo: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    thumbnail: 'https://picsum.photos/100/100?random=3',
    photo: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    thumbnail: 'https://picsum.photos/100/100?random=4',
    photo: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    thumbnail: 'https://picsum.photos/100/100?random=5',
    photo: 'https://picsum.photos/200/200?random=5'
  }
])

const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar (Round)',
    width: 120,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/50',
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
  },
  {
    field: 'thumbnail',
    title: 'Thumbnail (Square)',
    width: 120,
    image: {
      shape: 'square',
      size: 60,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/60'
    }
  },
  {
    field: 'photo',
    title: 'Photo (Rounded)',
    width: 150,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/80'
    }
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

