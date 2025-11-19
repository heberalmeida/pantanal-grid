<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Row Height with Images</h1>
    <p class="text-gray-600 mb-6">
      The <code class="bg-gray-100 px-2 py-1 rounded">rowHeight</code> option allows you to customize the row height
      when displaying images in the grid. This ensures images are not cropped and have adequate space.
    </p>

    <!-- Example 1: Basic Row Height -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Row Height</h2>
      <p class="text-gray-600 mb-4">
        Set a custom row height using the <code class="bg-gray-100 px-2 py-1 rounded">rowHeight</code> property in image options.
        The grid will use the maximum row height specified across all image columns.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="basicRowHeightColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="basicRowHeightCode" />
    </div>

    <!-- Example 2: Different Row Heights -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Different Row Heights</h2>
      <p class="text-gray-600 mb-4">
        When multiple image columns specify different row heights, the grid uses the maximum value.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="differentRowHeightColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="differentRowHeightCode" />
    </div>

    <!-- Example 3: Row Height with Large Images -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Row Height with Large Images</h2>
      <p class="text-gray-600 mb-4">
        For larger images, increase the row height proportionally to prevent cropping.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="largeImageColumns"
          key-field="id"
          :height="500"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="largeImageCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

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

// Example 1: Basic row height
const basicRowHeightColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      rowHeight: 70,
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
    field: 'role',
    title: 'Role',
    width: 100
  }
]

// Example 2: Different row heights
const differentRowHeightColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      rowHeight: 70,  // Smaller row height
      placeholder: 'https://via.placeholder.com/50',
      alt: (row) => `${row.name} avatar`
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 150,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover',
      rowHeight: 100,  // Larger row height - this will be used
      placeholder: 'https://via.placeholder.com/80'
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

// Example 3: Large images
const largeImageColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 120,
    image: {
      shape: 'round',
      size: 80,
      objectFit: 'cover',
      rowHeight: 110,
      placeholder: 'https://via.placeholder.com/80',
      alt: (row) => `${row.name} avatar`
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 200,
    image: {
      shape: 'rounded',
      size: 150,
      objectFit: 'cover',
      rowHeight: 170,
      placeholder: 'https://via.placeholder.com/150'
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
    field: 'role',
    title: 'Role',
    width: 100
  }
]

const basicRowHeightCode = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      rowHeight: 70,  // Set row height to 70px
      placeholder: 'https://via.placeholder.com/50',
      alt: (row) => \`\${row.name} avatar\`
    }
  }
]
`

const differentRowHeightCode = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      rowHeight: 70  // Smaller row height
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 150,
    image: {
      shape: 'rounded',
      size: 80,
      rowHeight: 100  // Larger row height - grid uses maximum (100px)
    }
  }
]
`

const largeImageCode = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 120,
    image: {
      shape: 'round',
      size: 80,
      rowHeight: 110  // Row height for 80px image
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 200,
    image: {
      shape: 'rounded',
      size: 150,
      rowHeight: 170  // Row height for 150px image (maximum used)
    }
  }
]
`
</script>

<style scoped>
.row-height-page {
  padding: 1rem;
}
</style>



