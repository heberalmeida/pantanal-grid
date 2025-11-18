# Image Columns

Demonstrates rendering images in grid columns with various shapes, sizes, and configurations.

<ExamplePreview>
  <ImagesExample />
</ExamplePreview>

<script setup lang="ts">
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ImagesExample from './components/ImagesExample.vue'
</script>

## Basic Image Shapes

Images can be rendered in three shapes: `round` (circular), `square` (sharp corners), or `rounded` (rounded corners).

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    thumbnail: 'https://picsum.photos/100/100?random=1',
    photo: 'https://picsum.photos/200/200?random=1'
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
      alt: (row) => `${row.name} avatar`
    }
  },
  {
    field: 'thumbnail',
    title: 'Thumbnail (Square)',
    width: 100,
    image: {
      shape: 'square',
      size: 60,
      objectFit: 'cover'
    }
  },
  {
    field: 'photo',
    title: 'Photo (Rounded)',
    width: 120,
    image: {
      shape: 'rounded',
      size: 80,
      objectFit: 'cover'
    }
  }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    responsive="table"
  />
</template>
```

## Images with Endpoint Prefix

Use an `endpoint` prefix to automatically prepend URLs. The field value is appended to the endpoint.

```typescript
const columns: ColumnDef[] = [
  {
    field: 'avatarId',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      endpoint: 'https://api.example.com/avatars/',
      placeholder: 'https://via.placeholder.com/50'
    }
  }
]
```

If `avatarId` is `123`, the final URL will be `https://api.example.com/avatars/123`.

## Dynamic Endpoint Function

Use a function to dynamically generate the full image URL based on row data.

```typescript
const columns: ColumnDef[] = [
  {
    field: 'avatarId',
    title: 'Avatar',
    width: 100,
    image: {
      shape: 'round',
      size: 50,
      endpoint: (row) => {
        // Dynamic endpoint based on row data
        return `https://api.example.com/users/${row.id}/avatar`
      },
      placeholder: 'https://via.placeholder.com/50'
    }
  }
]
```

## Row Height

Use the `rowHeight` option to increase the row height when displaying images. This ensures images are not cropped and have adequate space.

```typescript
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
      alt: (row) => `${row.name} avatar`
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
```

When multiple image columns specify different row heights, the grid uses the maximum value.

## Simple Boolean Image

For quick setup, use `image: true` to enable default image rendering.

```typescript
const columns: ColumnDef[] = [
  {
    field: 'avatar',
    title: 'Avatar',
    width: 100,
    image: true  // Uses default: square, 40px, cover
  }
]
```

## Image Options

### `shape`

Image shape: `'round'` (circular), `'square'` (sharp corners), or `'rounded'` (rounded corners).

### `size`

Image size in pixels or CSS value. Can be a number (pixels) or string (CSS value).

```typescript
size: 50        // 50px
size: '3rem'    // 3rem
size: '100%'    // 100% of container
```

### `objectFit`

CSS `object-fit` property: `'contain'`, `'cover'`, `'fill'`, `'none'`, or `'scale-down'`.

### `placeholder`

Placeholder image URL to show while loading or if the image fails to load.

### `errorPlaceholder`

Image URL to show when the main image fails to load. Falls back to `placeholder` if not specified.

### `loading`

Image loading strategy: `'lazy'` (default) or `'eager'`.

### `endpoint`

API endpoint prefix or function to generate the full image URL.

```typescript
// String endpoint
endpoint: 'https://api.example.com/images/'

// Function endpoint
endpoint: (row) => `https://api.example.com/users/${row.id}/avatar`
```

### `alt`

Alt text for accessibility. Can be a string or function.

```typescript
alt: 'User avatar'
alt: (row) => `${row.name} avatar`
```

### `rowHeight`

Optional row height when this image column is present. Specified in pixels or CSS value. The grid uses the maximum `rowHeight` value across all image columns.

```typescript
rowHeight: 70        // 70px
rowHeight: '5rem'    // 5rem
```

## See Also

- [ImageColumnOptions API](/api/types#imagecolumnoptions) - Complete API reference
- [ColumnDef API](/api/column-def#image) - Column definition
- [Row Height Example](/examples/row-height) - Row height examples


