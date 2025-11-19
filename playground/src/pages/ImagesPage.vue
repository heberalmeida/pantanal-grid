<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './ImagesPage.vue?raw'

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

// Example 1: Basic image columns with different shapes
const basicColumns: ColumnDef[] = [
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
      alt: (row) => `${row.name} avatar`,
      rowHeight: 70  // Increase row height for better image display
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

// Example 2: Images with endpoint prefix
const endpointColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      endpoint: 'https://i.pravatar.cc/150?img=',
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
    field: 'thumbnail',
    title: 'Thumbnail',
    width: 100,
    image: {
      shape: 'square',
      size: 60,
      objectFit: 'cover',
      endpoint: 'https://picsum.photos/100/100?random=',
      placeholder: 'https://via.placeholder.com/60'
    }
  },
  {
    field: 'email',
    title: 'Email',
    width: 200
  }
]

// Example 3: Images with dynamic endpoint function
const dynamicEndpointColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      endpoint: (row) => {
        // Dynamic endpoint based on row data
        return `https://i.pravatar.cc/150?img=${row.id}`
      },
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
    field: 'photo',
    title: 'Photo',
    width: 120,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover',
      endpoint: (row) => `https://picsum.photos/200/200?random=${row.id}`,
      placeholder: 'https://via.placeholder.com/80'
    }
  },
  {
    field: 'email',
    title: 'Email',
    width: 200
  }
]

// Example 4: Simple boolean image (uses defaults)
const simpleImageColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: true  // Simple boolean - uses default options
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

// Example 5: Images with custom row height
const rowHeightColumns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 120,
    image: {
      shape: 'round',
      size: 60,
      objectFit: 'cover',
      rowHeight: 90,  // Set row height to 90px
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
    field: 'photo',
    title: 'Photo',
    width: 150,
    image: {
      shape: 'rounded',
      size: 100,
      objectFit: 'cover',
      rowHeight: 120,  // Larger images need more row height
      placeholder: 'https://via.placeholder.com/100'
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

// Code snippets for examples
const endpointCodeSnippet = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      endpoint: 'https://i.pravatar.cc/150?img=',
      placeholder: 'https://via.placeholder.com/50',
      alt: (row) => \`\${row.name} avatar\`
    }
  },
  {
    field: 'thumbnail',
    title: 'Thumbnail',
    width: 100,
    image: {
      shape: 'square',
      size: 60,
      objectFit: 'cover',
      endpoint: 'https://picsum.photos/100/100?random=',
      placeholder: 'https://via.placeholder.com/60'
    }
  }
]
`

const dynamicEndpointCodeSnippet = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      objectFit: 'cover',
      endpoint: (row) => {
        // Dynamic endpoint based on row data
        return \`https://i.pravatar.cc/150?img=\${row.id}\`
      },
      placeholder: 'https://via.placeholder.com/50',
      alt: (row) => \`\${row.name} avatar\`
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 120,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover',
      endpoint: (row) => \`https://picsum.photos/200/200?random=\${row.id}\`,
      placeholder: 'https://via.placeholder.com/80'
    }
  }
]
`

const simpleImageCodeSnippet = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: true  // Simple boolean - uses default options
  },
  {
    field: 'name',
    title: 'Name',
    width: 150
  }
]
`

const rowHeightCodeSnippet = `
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 120,
    image: {
      shape: 'round',
      size: 60,
      objectFit: 'cover',
      rowHeight: 90,  // Set row height to 90px
      placeholder: 'https://via.placeholder.com/60',
      alt: (row) => \`\${row.name} avatar\`
    }
  },
  {
    field: 'photo',
    title: 'Photo',
    width: 150,
    image: {
      shape: 'rounded',
      size: 100,
      objectFit: 'cover',
      rowHeight: 120,  // Larger images need more row height
      placeholder: 'https://via.placeholder.com/100'
    }
  }
]
`
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-4">Image Columns</h1>
    <p class="text-gray-600 mb-6">
      The Grid supports rendering images in columns with various shapes, sizes, and configurations.
      You can use direct URLs, endpoint prefixes, or dynamic endpoint functions.
    </p>

    <!-- Example 1: Basic Image Shapes -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Basic Image Shapes</h2>
      <p class="text-gray-600 mb-4">
        Configure images with different shapes: <code class="bg-gray-100 px-2 py-1 rounded">round</code> (circular),
        <code class="bg-gray-100 px-2 py-1 rounded">square</code> (sharp corners), or <code class="bg-gray-100 px-2 py-1 rounded">rounded</code> (rounded corners).
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="basicColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        />
      </div>

      <ExampleCode :source="exampleSource" />
    </div>

    <!-- Example 2: Images with Endpoint Prefix -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Images with Endpoint Prefix</h2>
      <p class="text-gray-600 mb-4">
        Use an endpoint prefix to automatically prepend URLs. The field value is appended to the endpoint.
        For example, if the field value is <code class="bg-gray-100 px-2 py-1 rounded">1</code> and the endpoint is 
        <code class="bg-gray-100 px-2 py-1 rounded">https://api.example.com/images/</code>, 
        the final URL will be <code class="bg-gray-100 px-2 py-1 rounded">https://api.example.com/images/1</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="endpointColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        />
      </div>

      <ExampleCode :source="endpointCodeSnippet" />
    </div>

    <!-- Example 3: Dynamic Endpoint Function -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Dynamic Endpoint Function</h2>
      <p class="text-gray-600 mb-4">
        Use a function to dynamically generate the full image URL based on row data.
        This is useful when you need to construct complex URLs or use different endpoints per row.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="dynamicEndpointColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        />
      </div>

      <ExampleCode :source="dynamicEndpointCodeSnippet" />
    </div>

    <!-- Example 4: Simple Boolean Image -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Simple Boolean Image</h2>
      <p class="text-gray-600 mb-4">
        Use <code class="bg-gray-100 px-2 py-1 rounded">image: true</code> for quick setup with default options.
        This will render images as square (40px) with <code class="bg-gray-100 px-2 py-1 rounded">object-fit: cover</code>.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="simpleImageColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
        />
      </div>

      <ExampleCode :source="simpleImageCodeSnippet" />
    </div>

    <!-- Example 5: Images with Row Height -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Images with Custom Row Height</h2>
      <p class="text-gray-600 mb-4">
        Use the <code class="bg-gray-100 px-2 py-1 rounded">rowHeight</code> option to increase the row height when displaying images.
        This is useful when you want to ensure images are not cropped and have enough space.
      </p>
      
      <div class="mb-6">
        <PantanalGrid
          :rows="rows"
          :columns="rowHeightColumns"
          key-field="id"
          :height="400"
          locale="en"
          responsive="table"
          :striped="true"
        />
      </div>

      <ExampleCode :source="rowHeightCodeSnippet" />
    </div>
  </div>
</template>
