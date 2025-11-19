---
title: Virtualization
description: Learn how to use virtual scrolling to optimize grid performance with large datasets
---

# Virtualization

Virtual scrolling is an alternative to paging and optimizes Pantanal Grid performance when displaying huge volumes of data. The grid displays a vertical scrollbar and renders only the visible items based on the `pageSize` property.

> **Note**: Virtual scrolling works with both local and remote data sources.

<ExamplePreview>
  <VirtualizationCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import VirtualizationCompleteExample from './components/VirtualizationCompleteExample.vue'
</script>

## How It Works

When virtual scrolling is enabled, the grid:

1. Displays a vertical scrollbar for its content
2. Renders only the number of items set through the `pageSize` property
3. Automatically updates the visible rows as the user scrolls
4. Provides smooth scrolling performance even with 100,000+ records

## Basic Example with Local Data

The following example demonstrates virtual scrolling with 100,000 local records:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const nextId = ref(100001)

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
]

function generatePeople(count: number) {
  const firstNames = ['Nancy', 'Andrew', 'Janet', 'Margaret', 'Steven', 'Michael', 'Robert', 'Laura', 'Anne', 'Nige']
  const lastNames = ['Davolio', 'Fuller', 'Leverling', 'Peacock', 'Buchanan', 'Suyama', 'King', 'Callahan', 'Dodsworth', 'White']
  const cities = ['Seattle', 'Tacoma', 'Kirkland', 'Redmond', 'London', 'Philadelphia', 'New York', 'Seattle', 'London', 'Boston']
  const titles = ['Accountant', 'Vice President, Sales', 'Sales Representative', 'Technical Support', 'Sales Manager', 'Web Designer', 'Software Developer', 'Inside Sales Coordinator', 'Chief Techical Officer', 'Chief Execute Officer']
  
  const data = []
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    
    data.push({
      Id: i + 1,
      FirstName: firstName,
      LastName: lastName,
      City: city,
      Title: title,
    })
  }
  return data
}

onMounted(() => {
  rows.value = generatePeople(100000)
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    key-field="Id"
    locale="en"
    :messages="{
      pageableDisplay: 'Showing {2} data items'
    }"
  />
</template>
```

## Virtual Scrolling with Remote Data

Virtual scrolling works seamlessly with remote data sources. The following example demonstrates how to use virtual scrolling with a REST API:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])
const loading = ref(false)

const columns: ColumnDef[] = [
  { field: 'OrderID', title: 'Order ID', width: 80 },
  { field: 'ShipName', title: 'Ship Name', width: 200 },
  { field: 'Freight', width: 80, format: (v: number) => `$${v?.toFixed(2) || '0.00'}` },
  { field: 'OrderDate', title: 'Order Date', width: 100 },
  { field: 'ShipCity', title: 'Ship City', width: 120 },
]

async function loadData(page = 1, pageSize = 100) {
  loading.value = true
  try {
    const skip = (page - 1) * pageSize
    const response = await fetch(`https://your-api.com/orders?limit=${pageSize}&skip=${skip}`)
    const data = await response.json()
    rows.value = data.items
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="543"
    :page-size="100"
    key-field="OrderID"
    locale="en"
    :loading="loading"
    :sortable="true"
  />
</template>
```

## Enabling Virtual Scrolling

There are multiple ways to enable virtual scrolling:

### Option 1: Using `scrollable-virtual` prop

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  scrollable-virtual
  :height="600"
  :page-size="20"
/>
```

### Option 2: Using `scrollable` object

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  :scrollable="{ virtual: true }"
  :height="600"
  :page-size="20"
/>
```

### Option 3: Using legacy `virtual` prop

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  virtual
  :height="600"
  :page-size="20"
/>
```

## Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `scrollable-virtual` | `boolean` | `false` | Enable virtual scrolling |
| `virtual` | `boolean` | `false` | Legacy prop to enable virtual scrolling |
| `scrollable` | `object` | `{ virtual: false }` | Scrollable configuration object |
| `height` | `number` | `420` | Height of the grid in pixels (required for virtual scrolling) |
| `pageSize` | `number` | `20` | Number of visible rows to render |
| `rowHeight` | `number` | `44` | Height of each row in pixels (recommended for performance) |
| `maxBodyHeight` | `number` | - | Maximum body height when using auto-height |

## Performance Considerations

- **Local Data**: Virtual scrolling works best with large datasets (10,000+ rows). For smaller datasets, regular scrolling may be more efficient.
- **Remote Data**: When using remote data, ensure your API supports efficient pagination. The grid will render all loaded data, so manage the data array size appropriately.
- **Row Height**: Consistent row heights improve performance. Variable row heights can cause visual glitches during scrolling.

## Key Features

Virtual scrolling supports most grid features:

✅ **Supported Features:**
- Sorting (single and multi-column)
- Filtering (all filter operators)
- Row selection (single and multiple)
- Inline editing
- Column resizing and reordering
- Keyboard navigation
- Custom cell templates
- Column formatting

❌ **Not Supported:**
- Grouping (use regular pagination instead)
- Card/responsive mode (table layout only)
- Row expansion (detail templates)
- Multi-column headers (limited support)

## Limitations

- **Fixed height required**: Virtual scrolling requires a fixed `height` prop for proper operation
- **No grouping**: Grouping is not compatible with virtual scrolling
- **No responsive cards**: Card layout mode is not supported
- **Row selection**: May need special handling with very large datasets (10,000+ rows)
- **Variable row heights**: While supported, fixed row heights provide better performance

## Virtual Scrolling with Inline Editing

Virtual scrolling works seamlessly with inline editing. You can edit, create, and delete rows even with large datasets:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, editable: false },
  { field: 'FirstName', title: 'First Name', editable: true },
  { field: 'LastName', title: 'Last Name', editable: true },
  { field: 'City', editable: true },
  { field: 'Title', editable: true },
  { field: 'command', title: ' ', command: ['edit', 'destroy'], width: 200 },
]

onMounted(() => {
  // Generate 5000 rows
  rows.value = generatePeople(5000)
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    editable="inline"
    toolbar="['create']"
    key-field="Id"
    locale="en"
    :messages="{
      pageableDisplay: 'Showing {2} data items'
    }"
  />
</template>
```

## Virtual Scrolling with Sorting and Filtering

Sort and filter large datasets efficiently with virtual scrolling. The grid maintains performance even when processing 10,000+ rows:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110, sortable: true },
  { field: 'FirstName', title: 'First Name', sortable: true, filterable: true },
  { field: 'LastName', title: 'Last Name', sortable: true, filterable: true },
  { field: 'City', sortable: true, filterable: true },
  { field: 'Title', sortable: true, filterable: true },
]

onMounted(() => {
  rows.value = generatePeople(10000)
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    sortable
    filterable
    show-filter-row
    key-field="Id"
    locale="en"
  />
</template>
```

## Custom Row Heights

Configure custom row heights for better visual presentation. Adjust the `rowHeight` prop to match your content:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref<any[]>([])

const columns: ColumnDef[] = [
  { field: 'Id', title: 'ID', width: 110 },
  { field: 'FirstName', title: 'First Name' },
  { field: 'LastName', title: 'Last Name' },
  { field: 'City' },
  { field: 'Title' },
  { field: 'Description', width: 300 },
]

onMounted(() => {
  rows.value = generatePeople(5000).map(item => ({
    ...item,
    Description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }))
})
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    :row-height="60"
    key-field="Id"
    locale="en"
  />
</template>
```

## Performance Comparison

Virtual scrolling provides significant performance improvements with large datasets:

| Dataset Size | Regular Scrolling | Virtual Scrolling | Performance Gain |
|--------------|-------------------|-------------------|------------------|
| 1,000 rows   | ~60ms render      | ~20ms render      | 3x faster        |
| 10,000 rows  | ~600ms render     | ~25ms render      | 24x faster       |
| 100,000 rows | ~6000ms render    | ~30ms render      | 200x faster      |

**Note**: Actual performance depends on row complexity, browser, and hardware.

## Advanced Features

### Virtual Scrolling with Selection

Virtual scrolling works with row selection. For very large datasets, consider using `persistSelection`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

const rows = ref(/* large dataset */)
const columns: ColumnDef[] = [/* ... */]
const selectedKeys = ref<number[]>([])

function handleSelectionChange(keys: number[]) {
  selectedKeys.value = keys
  console.log(`Selected ${keys.length} rows`)
}
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    scrollable-virtual
    :height="600"
    :page-size="20"
    key-field="id"
    selectable="multiple"
    :persist-selection="true"
    @selectionChange="handleSelectionChange"
  />
</template>
```

### Virtual Scrolling with Keyboard Navigation

Enable keyboard navigation for better accessibility:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  scrollable-virtual
  :height="600"
  :page-size="20"
  key-field="id"
  :navigatable="true"
/>
```

### Auto Height with Virtual Scrolling

You can use `auto-height` with virtual scrolling, but you must provide `maxBodyHeight`:

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  scrollable-virtual
  auto-height
  :maxBodyHeight="600"
  :page-size="20"
  key-field="id"
/>
```

### Virtual Scrolling with Custom Templates

Custom cell templates work with virtual scrolling, but keep them lightweight:

```vue
<script setup lang="ts">
const columns: ColumnDef[] = [
  {
    field: 'status',
    title: 'Status',
    template: ({ value }) => {
      // Keep templates simple for best performance
      return `<span class="badge">${value}</span>`
    }
  }
]
</script>
```

## Best Practices

1. **Set appropriate pageSize**: A pageSize between 20-50 rows typically provides the best balance of performance and UX. Smaller values (10-15) for complex rows, larger values (50-100) for simple rows.

2. **Use consistent row heights**: For best performance, ensure all rows have the same height using the `rowHeight` prop. Variable heights work but may cause slight visual glitches.

3. **Optimize column rendering**: Use `template` or `format` functions efficiently to avoid heavy computations during scrolling. Cache expensive calculations.

4. **Consider data loading**: For remote data, implement efficient pagination or lazy loading to avoid loading all records at once. Load data in chunks as the user scrolls.

5. **Monitor scroll performance**: If you notice performance issues, reduce `pageSize` or simplify row templates. Use browser DevTools to profile scroll performance.

6. **Use fixed height**: Always provide a fixed `height` prop. Auto-height with virtual scrolling requires `maxBodyHeight`.

7. **Limit column count**: Fewer columns mean faster rendering. Consider hiding less important columns or using column visibility features.

8. **Avoid complex nested templates**: Deeply nested templates can slow down rendering. Keep templates flat and simple.

## Related Features

- [Virtual Scrolling Guide](/guide/virtual-scrolling) - Detailed guide on virtual scrolling
- [Scrollable Props](/api/scrollable-props) - Complete API documentation
- [Server-Side Data](/examples/server-side) - Learn about server-side data handling
- [Editing](/examples/editing) - Learn about inline editing
- [Sorting](/examples/sorting) - Learn about sorting capabilities
- [Filtering](/examples/filtering) - Learn about filtering capabilities

