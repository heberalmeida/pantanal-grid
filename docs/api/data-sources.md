# Data Sources API Reference

Pantanal Grid provides specialized data source components for different data scenarios.

## Components

### PantanalDataSource

Generic data source component for REST APIs, local data, and custom data providers.

```vue
<template>
  <PantanalDataSource
    :data-source="dataSource"
    :schema="schema"
    v-slot="{ rows, loading }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" :loading="loading" />
  </PantanalDataSource>
</template>
```

### PantanalHierarchicalDataSource

For hierarchical/tree data structures.

```vue
<template>
  <PantanalHierarchicalDataSource
    :data-source="hierarchicalData"
    v-slot="{ rows }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
  </PantanalHierarchicalDataSource>
</template>
```

### PantanalTreeListDataSource

For tree list data with parent-child relationships.

```vue
<template>
  <PantanalTreeListDataSource
    :data-source="treeData"
    parent-id-field="parentId"
    v-slot="{ rows }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
  </PantanalTreeListDataSource>
</template>
```

### PantanalGanttDataSource

For Gantt chart data with tasks and timelines.

```vue
<template>
  <PantanalGanttDataSource
    :data-source="ganttData"
    v-slot="{ rows }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
  </PantanalGanttDataSource>
</template>
```

### PantanalSchedulerDataSource

For scheduler/calendar data.

```vue
<template>
  <PantanalSchedulerDataSource
    :data-source="schedulerData"
    v-slot="{ rows }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
  </PantanalSchedulerDataSource>
</template>
```

### PantanalPivotDataSource

For pivot table data with aggregations.

```vue
<template>
  <PantanalPivotDataSource
    :data-source="pivotData"
    :columns="pivotColumns"
    :rows="pivotRows"
    v-slot="{ rows }"
  >
    <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
  </PantanalPivotDataSource>
</template>
```

## Usage Examples

See the [Examples](/examples/basic) section for detailed usage examples of each data source type:

- [REST API Example](/examples/data-rest)
- [GraphQL Example](/examples/data-graphql)
- [WebSocket Example](/examples/data-websocket)

## See Also

- [PantanalGrid Component](/api/grid)
- [Server-Side Mode Guide](/guide/server-side)

