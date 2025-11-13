# Scrollable Props

Pantanal Grid provides advanced scrolling capabilities through `scrollable-virtual` and `scrollable-endless` props, enabling efficient handling of large datasets.

<ExamplePreview>
  <ScrollableVirtualCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ScrollableVirtualCompleteExample from './components/ScrollableVirtualCompleteExample.vue'
</script>

## scrollable-virtual

The `scrollable-virtual` prop enables virtual scrolling, rendering only visible rows for optimal performance with large datasets.

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, sortable: true },
  { field: 'name', title: 'Name', sortable: true, filterable: true },
  { field: 'price', title: 'Price', sortable: true, format: (v: number) => `$${v.toFixed(2)}` },
  { field: 'category', title: 'Category', filterable: true }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="420"
    :row-height="44"
  />
</template>
```

### With Sorting and Filtering

Virtual scrolling works seamlessly with sorting and filtering:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="420"
    :row-height="44"
    sortable
    filterable
    show-filter-row
  />
</template>
```

### Using scrollable Object

You can also use the `scrollable` prop as an object:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :scrollable="{ virtual: true }"
    :height="420"
    :row-height="44"
  />
</template>
```

### Custom Height and Row Height

Adjust the viewport and row dimensions:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="600"
    :row-height="50"
  />
</template>
```

## scrollable-endless

The `scrollable-endless` prop enables infinite scrolling, progressively loading more items as you scroll to the bottom.

<ExamplePreview>
  <ScrollableEndlessCompleteExample />
</ExamplePreview>

<script setup>
import ScrollableEndlessCompleteExample from './components/ScrollableEndlessCompleteExample.vue'
</script>

### Basic Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
  status: ['Active', 'Inactive', 'Pending'][i % 3]
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'description', title: 'Description' },
  { field: 'status', title: 'Status' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="20"
  />
</template>
```

### Custom Page Size

Control how many items load initially and incrementally:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="50"
  />
</template>
```

### With Sorting and Filtering

Endless scrolling works with sorting and filtering:

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="20"
    sortable
    filterable
    show-filter-row
  />
</template>
```

### Using scrollable Object

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    :scrollable="{ endless: true }"
    :height="420"
    :row-height="44"
    :page-size="20"
  />
</template>
```

## Comparison

### scrollable-virtual vs scrollable-endless

| Feature | scrollable-virtual | scrollable-endless |
|---------|-------------------|-------------------|
| **Rendering** | Only visible rows | All loaded rows |
| **Memory** | Low (constant) | Medium (grows) |
| **Performance** | Excellent | Good |
| **Use Case** | Very large datasets (10k+) | Medium datasets (1k-10k) |
| **Loading** | Instant | Progressive |
| **Scrollbar** | Full height | Grows as loaded |

### When to Use Each

**Use `scrollable-virtual` when:**
- ✅ Dataset has 10,000+ rows
- ✅ Memory usage is a concern
- ✅ You need maximum performance
- ✅ Fixed viewport height is acceptable

**Use `scrollable-endless` when:**
- ✅ Dataset has 1,000-10,000 rows
- ✅ You want infinite scroll UX
- ✅ Progressive loading is acceptable
- ✅ You want to avoid pagination controls

**Use standard pagination when:**
- ✅ Dataset has < 1,000 rows
- ✅ Users need explicit page navigation
- ✅ You want predictable page-based navigation

## Advanced Examples

### Virtual Scrolling with Grouping

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef, type GroupDescriptor } from '@pantanal/grid'

const rows = ref(Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: ['Electronics', 'Clothing', 'Accessories'][i % 3],
  price: Math.round(Math.random() * 100000) / 100
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'category', title: 'Category' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` }
]

const group = ref<GroupDescriptor[]>([{ field: 'category' }])
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="420"
    :row-height="44"
    v-model:group="group"
  />
</template>
```

### Endless Scrolling with Custom Templates

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 3000 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  status: ['Active', 'Inactive'][i % 2],
  priority: i % 5
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { 
    field: 'name', 
    title: 'Name',
    template: ({ value }) => `<strong>${value}</strong>`
  },
  { 
    field: 'status', 
    title: 'Status',
    template: ({ value }) => 
      `<span style="color: ${value === 'Active' ? 'green' : 'red'}">${value}</span>`
  },
  { field: 'priority', title: 'Priority' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="25"
  />
</template>
```

### Virtual Scrolling with Selection

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(Array.from({ length: 8000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.round(Math.random() * 100000) / 100
})))

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name' },
  { field: 'price', title: 'Price', format: (v: number) => `$${v.toFixed(2)}` }
]

const selectedKeys = ref<number[]>([])
</script>

<template>
  <div>
    <p>Selected: {{ selectedKeys.length }} items</p>
    <PantanalGrid
      :rows="rows"
      :columns="columns"
      key-field="id"
      scrollable-virtual
      :height="420"
      :row-height="44"
      selectable="multiple"
      v-model:selectedKeys="selectedKeys"
    />
  </div>
</template>
```

### Endless Scrolling with Striped Rows

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="420"
    :row-height="44"
    :page-size="20"
    striped
  />
</template>
```

### Virtual Scrolling with Pinned Columns

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80, pinned: 'left' },
  { field: 'name', title: 'Name', width: 200 },
  { field: 'description', title: 'Description', width: 300 },
  { field: 'price', title: 'Price', width: 120, pinned: 'right' }
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="420"
    :row-height="44"
  />
</template>
```

## Performance Tips

### For Virtual Scrolling

1. **Set fixed row height**: Improves scroll position calculations
2. **Limit column count**: Fewer columns = faster rendering
3. **Avoid complex templates**: Simple cell templates perform better
4. **Use column widths**: Fixed widths prevent layout recalculations

### For Endless Scrolling

1. **Optimize page size**: Balance between initial load and scroll frequency
2. **Use appropriate thresholds**: Default 100px from bottom works well
3. **Consider data structure**: Flat data structures load faster
4. **Monitor memory**: Watch for memory growth with very large datasets

## Configuration Options

### Virtual Scrolling Configuration

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-virtual
    :height="500"        <!-- Viewport height -->
    :row-height="50"    <!-- Fixed row height -->
  />
</template>
```

### Endless Scrolling Configuration

```vue
<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
    scrollable-endless
    :height="500"        <!-- Viewport height -->
    :row-height="50"    <!-- Row height -->
    :page-size="30"     <!-- Initial and incremental load size -->
  />
</template>
```

## Limitations

### scrollable-virtual

- Requires fixed `height` prop
- Works best with fixed `rowHeight`
- Not compatible with standard pagination
- May have issues with variable row heights

### scrollable-endless

- Requires fixed `height` prop
- Memory usage grows with loaded items
- Not recommended for datasets > 10,000 rows
- Not compatible with server-side mode

## See Also

- [Virtual Scrolling Guide](/guide/virtual-scrolling) - Complete virtual scrolling documentation
- [ScrollableProps API](/api/scrollable-props) - API reference
- [Grid Props API](/api/grid-props) - All grid props
- [Performance Guide](/guide/performance) - Optimization tips

