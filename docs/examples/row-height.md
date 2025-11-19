# Row Height with Images

Demonstrates how to customize row height when displaying images in the grid.

<ExamplePreview>
  <RowHeightExample />
</ExamplePreview>

<script setup lang="ts">
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import RowHeightExample from './components/RowHeightExample.vue'
</script>

## Basic Row Height

Set a custom row height using the `rowHeight` property in image options. The grid will use the maximum row height specified across all image columns.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref([
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'john@example.com'
  }
])

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
    responsive="table"
    :striped="true"
  />
</template>
```

## Different Row Heights

When multiple image columns specify different row heights, the grid uses the maximum value.

```typescript
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
```

## Row Height with Large Images

For larger images, increase the row height proportionally to prevent cropping.

```typescript
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
```

## Best Practices

1. **Set row height based on image size**: For round images, add extra space (typically 20-30px more than image size).

2. **Use maximum value**: When multiple image columns have different `rowHeight` values, the grid automatically uses the maximum.

3. **Consider content**: If cells contain multiple lines of text, increase `rowHeight` accordingly.

4. **Test responsiveness**: Ensure row heights work well on different screen sizes.

## See Also

- [Image Columns](/examples/images) - Image column examples
- [ImageColumnOptions API](/api/types#imagecolumnoptions) - Complete API reference


