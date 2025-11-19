# Charts in Grid

Demonstrates how to add small charts inside grid cells using templates. This is useful for visualizing data such as progress, trends, or comparisons in a compact way.

<ExamplePreview>
  <ChartsInGridExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import ChartsInGridExample from './components/ChartsInGridExample.vue'
</script>

## Bar Chart

Horizontal bar charts are ideal for comparing numeric values visually.

<ExamplePreview>
  <BarChartExample />
</ExamplePreview>

### Código

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

const rows = ref([
  { id: 1, product: 'Product A', sales: 850 },
  { id: 2, product: 'Product B', sales: 620 },
  { id: 3, product: 'Product C', sales: 450 },
])

const barChartTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  const maxValue = Math.max(...rows.value.map(r => r.sales), 1000)
  const percentage = Math.min((value / maxValue) * 100, 100)
  const width = 120
  const height = 20
  
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h('span', { style: { minWidth: '50px', fontSize: '0.875rem' } }, `${value}`),
    h('svg', { width, height, style: { border: '1px solid #e5e7eb', borderRadius: '4px' } }, [
      h('rect', {
        x: 0,
        y: 0,
        width: `${percentage}%`,
        height: height,
        fill: '#3b82f6',
        rx: 4
      }),
      h('text', {
        x: '50%',
        y: '50%',
        dominantBaseline: 'middle',
        textAnchor: 'middle',
        fontSize: '10px',
        fill: '#fff',
        fontWeight: 'bold'
      }, `${Math.round(percentage)}%`)
    ])
  ])
}

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'sales', 
    title: 'Sales (Bar Chart)', 
    width: 200,
    template: barChartTemplate
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

## Progress Bar

Progress bars are perfect for displaying percentages or normalized values.

<ExamplePreview>
  <ProgressBarExample />
</ExamplePreview>

### Code

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

const rows = ref([
  { id: 1, product: 'Product A', progress: 85 },
  { id: 2, product: 'Product B', progress: 77 },
  { id: 3, product: 'Product C', progress: 75 },
])

const progressTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  const width = 150
  const height = 24
  
  const getColor = (val: number) => {
    if (val >= 90) return '#10b981' // green
    if (val >= 70) return '#3b82f6' // blue
    if (val >= 50) return '#f59e0b' // yellow
    return '#ef4444' // red
  }
  
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h('div', {
      style: {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }
    }, [
      h('div', {
        style: {
          width: `${value}%`,
          height: '100%',
          backgroundColor: getColor(value),
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, [
        h('span', {
          style: {
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }
        }, `${value}%`)
      ])
    ])
  ])
}

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'progress', 
    title: 'Progress', 
    width: 200,
    template: progressTemplate
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

## Sparklines (Mini Charts)

Sparklines are small line charts that show trends over time in a compact way.

<ExamplePreview>
  <SparklineExample />
</ExamplePreview>

### Code

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import { PantanalGrid, type ColumnDef, type ColumnTemplateFn } from '@pantanal/grid'

const rows = ref([
  { id: 1, product: 'Product A', trend: [100, 150, 200, 250, 300, 350, 400] },
  { id: 2, product: 'Product B', trend: [80, 120, 160, 200, 240, 280, 320] },
  { id: 3, product: 'Product C', trend: [60, 90, 120, 150, 180, 210, 240] },
])

const sparklineTemplate: ColumnTemplateFn = (ctx) => {
  const row = ctx?.row as any
  const data = row.trend || []
  if (data.length === 0) return h('span', 'No data')
  
  const width = 120
  const height = 30
  const padding = 4
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1 || 1)) * chartWidth
    const y = padding + chartHeight - ((val - min) / range) * chartHeight
    return `${x},${y}`
  }).join(' ')
  
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
    h('svg', {
      width,
      height,
      style: { border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb' }
    }, [
      h('polyline', {
        points,
        fill: 'none',
        stroke: '#3b82f6',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }),
      h('circle', {
        cx: points.split(' ')[points.split(' ').length - 1]?.split(',')[0],
        cy: points.split(' ')[points.split(' ').length - 1]?.split(',')[1],
        r: 3,
        fill: '#3b82f6'
      })
    ]),
    h('span', { 
      style: { fontSize: '0.75rem', color: '#6b7280' } 
    }, `↑ ${((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1)}%`)
  ])
}

const columns: ColumnDef[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'product', title: 'Product', width: 150 },
  { 
    field: 'trend', 
    title: 'Trend (7 days)', 
    width: 200,
    template: sparklineTemplate
  },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

## Multiple Charts

You can combine different types of charts in the same grid for rich data visualization.

<ExamplePreview>
  <MultipleChartsExample />
</ExamplePreview>

### Code

```vue
<script setup lang="ts">
import { PantanalGrid, type ColumnDef } from '@pantanal/grid'

// Combine multiple chart templates in the same grid
const columns: ColumnDef[] = [
  { field: 'product', title: 'Product' },
  { field: 'sales', title: 'Sales', template: barChartTemplate },
  { field: 'progress', title: 'Progress', template: progressTemplate },
  { field: 'trend', title: 'Trend', template: sparklineTemplate },
]
</script>

<template>
  <PantanalGrid
    :rows="rows"
    :columns="columns"
    key-field="id"
  />
</template>
```

## Tips and Best Practices

1. **Performance**: For large data volumes, consider using `virtual` scrolling for better performance.

2. **Responsiveness**: Adjust chart sizes based on column size using dynamic `width` and `height`.

3. **Accessibility**: Add `aria-label` to SVG elements for better accessibility.

4. **Colors**: Use a consistent color palette and consider light/dark theme support.

5. **Libraries**: For more complex charts, you can integrate libraries like Chart.js or D3.js within templates.

## Advanced Examples

### Donut Chart

```vue
const donutChartTemplate: ColumnTemplateFn = (ctx) => {
  const value = ctx?.value ?? 0
  const total = 100
  const percentage = (value / total) * 100
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  return h('svg', { width: 50, height: 50 }, [
    h('circle', {
      cx: 25,
      cy: 25,
      r: radius,
      fill: 'none',
      stroke: '#e5e7eb',
      strokeWidth: 6
    }),
    h('circle', {
      cx: 25,
      cy: 25,
      r: radius,
      fill: 'none',
      stroke: '#3b82f6',
      strokeWidth: 6,
      strokeDasharray: circumference,
      strokeDashoffset: offset,
      transform: 'rotate(-90 25 25)'
    }),
    h('text', {
      x: 25,
      y: 25,
      textAnchor: 'middle',
      dominantBaseline: 'middle',
      fontSize: '10px',
      fontWeight: 'bold'
    }, `${Math.round(percentage)}%`)
  ])
}
```

### Vertical Bar Chart

```vue
const verticalBarTemplate: ColumnTemplateFn = (ctx) => {
  const row = ctx?.row as any
  const data = row.monthlyData || []
  const max = Math.max(...data, 1)
  const width = 100
  const height = 40
  const barWidth = width / data.length
  
  return h('svg', { width, height }, 
    data.map((val: number, idx: number) => {
      const barHeight = (val / max) * height
      return h('rect', {
        x: idx * barWidth,
        y: height - barHeight,
        width: barWidth - 2,
        height: barHeight,
        fill: '#3b82f6'
      })
    })
  )
}
```

