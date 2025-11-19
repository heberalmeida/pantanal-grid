---
title: Core Features
description: Overview of Pantanal Grid's core features including sorting, filtering, pagination, selection, grouping, and virtual scrolling
---

# Core Features

Pantanal Grid provides a comprehensive set of core features that form the foundation of data grid functionality. These features work seamlessly together to provide a powerful and flexible data management experience.

## Overview

The core features of Pantanal Grid include:

- **[Sorting](#sorting)** - Multi-column sorting with ascending/descending cycles
- **[Filtering](#filtering)** - Per-column filtering with multiple operators
- **[Pagination](#pagination)** - Client-side and server-side pagination
- **[Selection](#selection)** - Single or multiple row selection
- **[Grouping](#grouping)** - Multi-level grouping with aggregations
- **[Virtual Scrolling](#virtual-scrolling)** - Efficient rendering for large datasets

## Sorting

Pantanal Grid provides flexible sorting capabilities with support for single and multiple column sorting.

**Key Features:**
- Single and multi-column sorting
- Ascending/descending cycles
- Custom sort functions
- Server-side sorting support

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  v-model:sort="sort"
/>
```

📖 [Learn more about Sorting →](/guide/sorting)

## Filtering

Powerful filtering capabilities with multiple operators, filter modes, and custom filter UIs.

**Key Features:**
- Multiple filter operators (equals, contains, starts with, etc.)
- Filter modes (and/or)
- Custom filter UIs
- Server-side filtering support

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  v-model:filter="filter"
/>
```

📖 [Learn more about Filtering →](/guide/filtering)

## Pagination

Flexible pagination with customizable page sizes, navigation controls, and server-side support.

**Key Features:**
- Client-side and server-side pagination
- Customizable page sizes
- Multiple pagination variants (simple, pages, edges)
- URL-based pagination

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  :pageable="true"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

📖 [Learn more about Pagination →](/guide/pagination)

## Selection

Single and multiple row selection with checkboxes and programmatic control.

**Key Features:**
- Single or multiple selection
- Checkbox support
- Programmatic selection control
- Selection persistence across pages

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  @selectionChange="handleSelectionChange"
/>
```

📖 [Learn more about Selection →](/guide/selection)

## Grouping

Multi-level grouping with optional aggregations and group footers.

**Key Features:**
- Multi-level grouping
- Drag-and-drop grouping UI
- Aggregations (sum, avg, min, max, count)
- Expandable/collapsible groups
- Group footers

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  groupable
  :group="group"
  :aggregates="aggregates"
/>
```

📖 [Learn more about Grouping →](/guide/grouping)

## Virtual Scrolling

Efficient rendering for large datasets by only rendering visible rows.

**Key Features:**
- Handles 100,000+ rows efficiently
- Smooth scrolling performance
- Works with sorting and filtering
- Custom row heights

**Quick Example:**
```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  scrollable-virtual
  :height="600"
  :page-size="50"
/>
```

📖 [Learn more about Virtual Scrolling →](/guide/virtual-scrolling)

## Feature Combinations

These core features work seamlessly together:

### Sorting + Filtering + Pagination

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  v-model:sort="sort"
  v-model:filter="filter"
  v-model:page="page"
  v-model:pageSize="pageSize"
/>
```

### Selection + Grouping

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  selectable="multiple"
  groupable
  :group="group"
/>
```

### Virtual Scrolling + Sorting + Filtering

```vue
<PantanalGrid
  :rows="rows"
  :columns="columns"
  key-field="id"
  scrollable-virtual
  v-model:sort="sort"
  v-model:filter="filter"
/>
```

## Server-Side Operations

All core features support server-side operations for handling large datasets:

- **Server-Side Sorting** - Sort data on the server
- **Server-Side Filtering** - Filter data on the server
- **Server-Side Pagination** - Paginate data on the server
- **Server-Side Grouping** - Group data on the server

📖 [Learn more about Server-Side Operations →](/guide/server-side)

## Performance Considerations

- Use **virtual scrolling** for datasets with 10,000+ rows
- Use **server-side mode** for datasets that cannot fit in memory
- Enable **pagination** for better initial load times
- Use **persisted state** to avoid unnecessary re-renders

## Next Steps

- Explore [Advanced Features](/guide/editing) like editing and export
- Learn about [Column Management](/guide/column-management)
- Check out [Examples](/examples) to see these features in action
- Read the [API Reference](/api/grid) for detailed documentation


