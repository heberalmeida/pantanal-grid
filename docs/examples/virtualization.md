---
title: Virtualization
description: Learn how to use virtual scrolling to optimize grid performance with large datasets
---

# Virtualization

Virtual scrolling is an alternative to paging and optimizes Pantanal Grid performance when displaying huge volumes of data. The grid displays a vertical scrollbar and renders only the visible items based on the `pageSize` property.

> **Note**: Virtual scrolling works with both local and remote data sources.

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
| `height` | `number` | `420` | Height of the grid in pixels |
| `pageSize` | `number` | `20` | Number of visible rows to render |
| `rowHeight` | `number` | `44` | Height of each row in pixels |

## Performance Considerations

- **Local Data**: Virtual scrolling works best with large datasets (10,000+ rows). For smaller datasets, regular scrolling may be more efficient.
- **Remote Data**: When using remote data, ensure your API supports efficient pagination. The grid will render all loaded data, so manage the data array size appropriately.
- **Row Height**: Consistent row heights improve performance. Variable row heights can cause visual glitches during scrolling.

## Limitations

- Virtual scrolling is not compatible with:
  - Grouping
  - Card/responsive mode
  - Row expansion (detail templates)
- Fixed height is required for proper operation
- Row selection may need special handling with very large datasets

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

## Best Practices

1. **Set appropriate pageSize**: A pageSize between 20-50 rows typically provides the best balance of performance and UX.

2. **Use consistent row heights**: For best performance, ensure all rows have the same height using the `rowHeight` prop.

3. **Optimize column rendering**: Use `template` or `format` functions efficiently to avoid heavy computations during scrolling.

4. **Consider data loading**: For remote data, implement efficient pagination or lazy loading to avoid loading all records at once.

5. **Monitor scroll performance**: If you notice performance issues, reduce `pageSize` or simplify row templates.

## Related Features

- [Virtual Scrolling Guide](/guide/virtual-scrolling) - Detailed guide on virtual scrolling
- [Scrollable Props](/api/scrollable-props) - Complete API documentation
- [Server-Side Data](/examples/server-side) - Learn about server-side data handling
- [Editing](/examples/editing) - Learn about inline editing
- [Sorting](/examples/sorting) - Learn about sorting capabilities
- [Filtering](/examples/filtering) - Learn about filtering capabilities

