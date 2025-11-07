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
          <figure class="product-image-wrapper">
            <div class="image-container">
              <!-- Loading skeleton -->
              <div 
                v-if="imageLoadingStates[row.id] === true"
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
              <!-- Error state -->
              <div 
                v-else-if="imageErrorStates[row.id]"
                class="gallery-thumb gallery-thumb-error"
              >
                <svg 
                  class="error-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="error-text">Failed to load</span>
              </div>
              <!-- Actual image -->
              <img
                v-else
                :src="value"
                :alt="`Photo of ${row.name}`"
                loading="lazy"
                class="gallery-thumb"
                :class="{ 'gallery-thumb-loaded': imageLoadingStates[row.id] === false && !imageErrorStates[row.id] }"
                @load="handleImageLoad(row.id)"
                @error="handleImageError(row.id)"
                @click="openImagePreview(value, row.name)"
              />
              <!-- Image overlay on hover - only show when image is loaded -->
              <div 
                v-if="imageLoadingStates[row.id] === false && !imageErrorStates[row.id]"
                class="image-overlay"
              >
                <button 
                  @click.stop="openImagePreview(value, row.name)"
                  class="preview-button"
                  aria-label="Preview image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="preview-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span class="preview-text">Preview</span>
                </button>
              </div>
            </div>
            <figcaption class="product-name">
              {{ row.name }}
            </figcaption>
          </figure>
        </template>
        <template v-else-if="column.field === 'price'">
          <span class="price-value">$ {{ Number(value).toFixed(2) }}</span>
        </template>
        <template v-else-if="column.field === 'status'">
          <span class="status-badge" :class="statusClass(value as string)">
            <span class="status-dot"></span>
            {{ value }}
          </span>
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
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=90',
    price: 89,
    status: 'Available'
  },
  {
    id: 2,
    name: 'Pulse Mechanical Keyboard',
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=90',
    price: 149,
    status: 'Sold out'
  },
  {
    id: 3,
    name: 'North Travel Backpack',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=90',
    price: 129,
    status: 'Available'
  },
  {
    id: 4,
    name: 'Wireless Headphones',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=90',
    price: 199,
    status: 'Available'
  },
  {
    id: 5,
    name: 'Smart Watch Pro',
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=90',
    price: 299,
    status: 'Available'
  },
  {
    id: 6,
    name: 'Gaming Mouse',
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=90',
    price: 79,
    status: 'Sold out'
  }
]

const columns = [
  { field: 'id', title: '#', width: 60 },
  { field: 'image', title: 'Product', width: 280 },
  { field: 'category', title: 'Category', width: 160 },
  { field: 'status', title: 'Status', width: 140, filterable: true },
  { field: 'price', title: 'Price', width: 120 }
]

const codeSnippet = exampleSource

// Image loading and error state management
const imageLoadingStates = ref<Record<number, boolean | undefined>>({})
const imageErrorStates = ref<Record<number, boolean>>({})

// Initialize images and check if already loaded (cached)
onMounted(() => {
  rows.forEach(row => {
    imageLoadingStates.value[row.id] = true
    imageErrorStates.value[row.id] = false
    
    const img = new Image()
    img.src = row.image
    
    if (img.complete) {
      // Image already loaded (cached)
      imageLoadingStates.value[row.id] = false
      imageErrorStates.value[row.id] = false
    } else {
      img.onload = () => {
        imageLoadingStates.value[row.id] = false
        imageErrorStates.value[row.id] = false
      }
      img.onerror = () => {
        imageLoadingStates.value[row.id] = false
        imageErrorStates.value[row.id] = true
      }
    }
  })
})

function handleImageLoad(imageId: number) {
  imageLoadingStates.value[imageId] = false
  imageErrorStates.value[imageId] = false
}

function handleImageError(imageId: number) {
  imageLoadingStates.value[imageId] = false
  imageErrorStates.value[imageId] = true
}

function openImagePreview(imageUrl: string, imageName: string) {
  // Open image in new tab/window for full preview
  window.open(imageUrl, '_blank', 'noopener,noreferrer')
}

function statusClass(status: string) {
  const statusLower = status.toLowerCase().replace(/\s+/g, '-')
  return `status-${statusLower}`
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

/* Product image wrapper */
.product-image-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

/* Image container for loading state */
.image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 0.875rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-container:hover {
  transform: translateY(-2px);
}

.gallery-thumb {
  height: 120px;
  width: 120px;
  border-radius: 0.875rem;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f8fafc;
  display: block;
}

.gallery-grid :deep(.v3grid__body figure) {
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
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

.image-container:hover .gallery-thumb {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.1);
}

/* Image overlay on hover */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0.875rem;
  pointer-events: none;
}

.image-container:hover .image-overlay {
  opacity: 1;
  pointer-events: all;
}

.preview-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.875rem;
  pointer-events: all;
}

.preview-button:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.preview-icon {
  width: 24px;
  height: 24px;
}

.preview-text {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

/* Error state */
.gallery-thumb-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px dashed #fca5a5;
  color: #dc2626;
}

.error-icon {
  width: 32px;
  height: 32px;
  opacity: 0.7;
}

.error-text {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Product name */
.product-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
  max-width: 120px;
  margin: 0;
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
  margin-top: 0;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .product-name {
    color: #f1f5f9;
  }
  
  .preview-button {
    background: rgba(15, 23, 42, 0.95);
    color: #f1f5f9;
  }
  
  .preview-button:hover {
    background: rgba(30, 41, 59, 1);
  }
  
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
  
  .image-container:hover .gallery-thumb {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  
  .gallery-thumb-error {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    border-color: #dc2626;
    color: #fca5a5;
  }
}

/* Status badge styling */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}

.status-available {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.status-sold-out {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
}

/* Price styling */
.price-value {
  font-weight: 600;
  color: #1e293b;
  font-feature-settings: 'tnum';
  letter-spacing: 0.02em;
}

@media (prefers-color-scheme: dark) {
  .price-value {
    color: #f1f5f9;
  }
}
</style>
