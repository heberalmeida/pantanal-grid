<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Sample data with images
const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    photo: 'https://picsum.photos/200/200?random=1',
    thumbnail: 'https://picsum.photos/100/100?random=1',
    email: 'john@example.com',
    role: 'Admin'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    photo: 'https://picsum.photos/200/200?random=2',
    thumbnail: 'https://picsum.photos/100/100?random=2',
    email: 'jane@example.com',
    role: 'User'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    photo: 'https://picsum.photos/200/200?random=3',
    thumbnail: 'https://picsum.photos/100/100?random=3',
    email: 'bob@example.com',
    role: 'User'
  },
  {
    id: 4,
    name: 'Alice Williams',
    avatar: 'https://i.pravatar.cc/150?img=4',
    photo: 'https://picsum.photos/200/200?random=4',
    thumbnail: 'https://picsum.photos/100/100?random=4',
    email: 'alice@example.com',
    role: 'Admin'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=5',
    photo: 'https://picsum.photos/200/200?random=5',
    thumbnail: 'https://picsum.photos/100/100?random=5',
    email: 'charlie@example.com',
    role: 'User'
  }
])

const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar (Round)',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/50',
      errorPlaceholder: 'https://via.placeholder.com/50',
      alt: (row) => `${row.name} avatar`
    }
  },
  {
    field: 'name',
    title: 'Name',
    width: 150
  },
  {
    field: 'thumbnail',
    title: 'Thumbnail (Square)',
    width: 100,
    image: {
      shape: 'square',
      size: 60,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/60',
      errorPlaceholder: 'https://via.placeholder.com/60'
    }
  },
  {
    field: 'photo',
    title: 'Photo (Rounded)',
    width: 120,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover',
      placeholder: 'https://via.placeholder.com/80',
      errorPlaceholder: 'https://via.placeholder.com/80'
    }
  },
  {
    field: 'email',
    title: 'Email',
    width: 200
  },
  {
    field: 'role',
    title: 'Role',
    width: 100
  }
]
</script>

<template>
  <div class="images-page">
    <h1>Image Columns</h1>
    <p>This example demonstrates different image column configurations:</p>
    <ul>
      <li><strong>Round:</strong> Circular images (avatars)</li>
      <li><strong>Square:</strong> Square images with sharp corners</li>
      <li><strong>Rounded:</strong> Square images with rounded corners</li>
    </ul>
    
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :height="400"
      locale="en"
    />
  </div>
</template>

<style scoped>
.images-page {
  padding: 1rem;
}

.images-page h1 {
  margin-bottom: 1rem;
}

.images-page ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.images-page li {
  margin-bottom: 0.5rem;
}
</style>

