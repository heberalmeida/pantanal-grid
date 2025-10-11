<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h2 class="text-2xl font-semibold leading-tight">Product gallery</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">
        Render thumbnails directly inside the grid using the <code>#cell</code> slot. The images are lazy loaded and
        keep keyboard/focus support intact.
      </p>
    </header>

    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      :striped="true"
      :responsive="'table'"
      locale="en"
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
    >
      <template #cell="{ column, value, row }">
        <template v-if="column.field === 'image'">
          <figure class="flex items-center gap-3">
            <img
              :src="value"
              :alt="`Photo of ${row.name}`"
              loading="lazy"
              class="h-16 w-16 rounded-xl object-cover shadow"
            />
            <figcaption class="text-sm font-medium text-slate-700 dark:text-slate-200">
              {{ row.name }}
            </figcaption>
          </figure>
        </template>
        <template v-else-if="column.field === 'price'">
          $ {{ Number(value).toFixed(2) }}
        </template>
        <template v-else>
          {{ value }}
        </template>
      </template>
    </PantanalGrid>
    <ExampleCode :source="codeSnippet" />
  </section>
</template>

<script setup lang="ts">
import { PantanalGrid } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'
import exampleSource from './ImageGalleryPage.vue?raw'

interface ImageRow {
  id: number
  name: string
  category: string
  image: string
  price: number
  status: 'Available' | 'Sold out'
  [key: string]: string | number
}

const rows: ImageRow[] = [
  {
    id: 1,
    name: 'Neon Desk Lamp',
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=200&q=80',
    price: 89,
    status: 'Available'
  },
  {
    id: 2,
    name: 'Pulse Mechanical Keyboard',
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80',
    price: 149,
    status: 'Sold out'
  },
  {
    id: 3,
    name: 'North Travel Backpack',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80',
    price: 129,
    status: 'Available'
  }
]

const columns = [
  { field: 'id', title: '#', width: 60 },
  { field: 'image', title: 'Product', width: 260 },
  { field: 'category', title: 'Category', width: 160 },
  { field: 'status', title: 'Status', width: 140, filterable: true },
  { field: 'price', title: 'Price', width: 120 }
]

const codeSnippet = exampleSource
</script>
