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
      class="rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 gallery-grid"
    >
      <template #cell="{ column, value, row }">
        <template v-if="column.field === 'image'">
          <figure class="flex items-center gap-3">
            <div class="image-container">
              <!-- Loading skeleton -->
              <div 
                v-if="imageLoadingStates[row.id] !== false"
                class="gallery-thumb gallery-thumb-loading"
              >
                <div class="skeleton-shimmer"></div>
                <svg 
                  class="skeleton-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <!-- Actual image -->
              <img
                :src="value"
                :alt="`Photo of ${row.name}`"
                loading="lazy"
                class="gallery-thumb"
                :class="{ 'gallery-thumb-loaded': imageLoadingStates[row.id] === false }"
                @load="handleImageLoad(row.id)"
                @error="handleImageError(row.id)"
              />
            </div>
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
import { ref, onMounted } from 'vue'
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

// Image loading state management
const imageLoadingStates = ref<Record<number, boolean | undefined>>({})

// Initialize images and check if already loaded (cached)
onMounted(() => {
  rows.forEach(row => {
    const img = new Image()
    img.src = row.image
    
    if (img.complete) {
      // Image already loaded (cached)
      imageLoadingStates.value[row.id] = false
    } else {
      // Image needs to load
      imageLoadingStates.value[row.id] = true
      img.onload = () => {
        imageLoadingStates.value[row.id] = false
      }
      img.onerror = () => {
        imageLoadingStates.value[row.id] = false
      }
    }
  })
})

function handleImageLoad(imageId: number) {
  imageLoadingStates.value[imageId] = false
}

function handleImageError(imageId: number) {
  imageLoadingStates.value[imageId] = false
  // Optionally show error state
}
</script>

<style scoped>
/* Better row spacing */
.gallery-grid :deep(.v3grid__body .v3grid__cell) {
  padding-block: 1.5rem;
}

.gallery-grid :deep(.v3grid__body .v3grid__row) {
  align-items: stretch;
  min-height: 80px;
}

.gallery-grid :deep(.v3grid__body .v3grid__row:not(:last-child)) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  margin-bottom: 4px;
}

.gallery-grid :deep(.v3grid__body figure) {
  min-height: 96px;
  display: flex;
  align-items: center;
}

/* Image container for loading state */
.image-container {
  position: relative;
  display: inline-block;
}

.gallery-thumb {
  height: 96px;
  width: 96px;
  border-radius: 0.75rem;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.18);
  transition: opacity 0.3s ease, transform 0.2s ease;
  background-color: #f8fafc;
}

.gallery-thumb-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  position: relative;
  overflow: hidden;
}

.gallery-thumb-loading .skeleton-icon {
  width: 32px;
  height: 32px;
  color: #cbd5e1;
  opacity: 0.6;
  z-index: 1;
}

.gallery-thumb-loading .skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer-slide 1.5s infinite;
}

.gallery-thumb:not(.gallery-thumb-loaded) {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.gallery-thumb-loaded {
  opacity: 1;
  position: relative;
}

.gallery-thumb:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.25);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes shimmer-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.gallery-grid :deep(.v3grid__body .v3grid__cell figcaption) {
  line-height: 1.4;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .gallery-thumb {
    background-color: #1e293b;
  }
  
  .gallery-thumb-loading {
    background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
    background-size: 200% 100%;
  }
  
  .gallery-thumb-loading .skeleton-icon {
    color: #475569;
  }
}
</style>
