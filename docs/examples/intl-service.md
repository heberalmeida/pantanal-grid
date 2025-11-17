# IntlService Examples

Complete examples demonstrating the IntlService internationalization capabilities.

<ExamplePreview>
  <IntlServiceCompleteExample />
</ExamplePreview>

<script setup>
import ExamplePreview from '../.vitepress/components/ExamplePreview.vue'
import IntlServiceCompleteExample from './components/IntlServiceCompleteExample.vue'
</script>

## Basic Date Formatting

```vue
<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')
const date = new Date(2024, 0, 15)

const shortDate = intl.formatDate(date, 'short')
const longDate = intl.formatDate(date, 'long')
const customDate = intl.formatDate(date, { date: 'full' })
</script>

<template>
  <div>
    <p>Short: {{ shortDate }}</p>
    <p>Long: {{ longDate }}</p>
    <p>Full: {{ customDate }}</p>
  </div>
</template>
```

## Number Formatting

```vue
<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')
const amount = 1234.56

const currency = intl.formatNumber(amount, 'c')
const decimal = intl.formatNumber(amount, 'n')
const percent = intl.formatNumber(0.15, 'p')
const custom = intl.formatNumber(amount, { 
  style: 'currency', 
  currency: 'EUR',
  minimumFractionDigits: 2 
})
</script>

<template>
  <div>
    <p>Currency: {{ currency }}</p>
    <p>Decimal: {{ decimal }}</p>
    <p>Percent: {{ percent }}</p>
    <p>Custom: {{ custom }}</p>
  </div>
</template>
```

## String Formatting with Placeholders

```vue
<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')

const total = intl.format('Total amount {0:c}', [1234.56])
const range = intl.format('Showing {0} to {1} of {2}', [1, 10, 100])
const mixed = intl.format('Price: {0:n}, Date: {1:d}', [99.99, new Date()])
</script>

<template>
  <div>
    <p>{{ total }}</p>
    <p>{{ range }}</p>
    <p>{{ mixed }}</p>
  </div>
</template>
```

## Date and Month Names

```vue
<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')

const dayNames = intl.dateFormatNames({ type: 'days', nameType: 'long' })
const monthNames = intl.dateFormatNames({ type: 'months', nameType: 'short' })
const firstDay = intl.firstDay()
</script>

<template>
  <div>
    <h3>Day Names</h3>
    <ul>
      <li v-for="(name, day) in dayNames" :key="day">{{ name }}</li>
    </ul>
    
    <h3>Month Names</h3>
    <ul>
      <li v-for="(name, month) in monthNames" :key="month">{{ name }}</li>
    </ul>
    
    <p>First day of week: {{ firstDay === 0 ? 'Sunday' : 'Monday' }}</p>
  </div>
</template>
```

## Using with Grid

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, IntlService, type ColumnDef } from '@pantanal/grid'

const intl = new IntlService('en')

interface Product {
  id: number
  name: string
  price: number
  date: Date
}

const rows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 1234.56, date: new Date(2024, 0, 15) },
  { id: 2, name: 'Product B', price: 567.89, date: new Date(2024, 1, 20) },
  { id: 3, name: 'Product C', price: 890.12, date: new Date(2024, 2, 25) },
])

const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: 'Name', width: 200 },
  { 
    field: 'price', 
    title: 'Price',
    width: 120,
    format: (v: number) => intl.formatNumber(v, 'c')
  },
  { 
    field: 'date', 
    title: 'Date',
    width: 150,
    format: (v: Date) => intl.formatDate(v, 'short')
  }
]
</script>

<template>
  <PantanalGrid 
    :rows="rows" 
    :columns="columns" 
    key-field="id"
    :height="300"
    locale="en"
    responsive="table"
  />
</template>
```

## Multiple Locales

```vue
<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intlEN = new IntlService('en')
const intlPT = new IntlService('pt-BR')
const intlES = new IntlService('es')

const date = new Date(2024, 0, 15)
const amount = 1234.56

const dates = {
  en: intlEN.formatDate(date, 'long'),
  pt: intlPT.formatDate(date, 'long'),
  es: intlES.formatDate(date, 'long')
}

const amounts = {
  en: intlEN.formatNumber(amount, 'c'),
  pt: intlPT.formatNumber(amount, 'c'),
  es: intlES.formatNumber(amount, 'c')
}
</script>

<template>
  <div>
    <h3>Date Formatting</h3>
    <ul>
      <li>English: {{ dates.en }}</li>
      <li>Portuguese: {{ dates.pt }}</li>
      <li>Spanish: {{ dates.es }}</li>
    </ul>
    
    <h3>Currency Formatting</h3>
    <ul>
      <li>English: {{ amounts.en }}</li>
      <li>Portuguese: {{ amounts.pt }}</li>
      <li>Spanish: {{ amounts.es }}</li>
    </ul>
  </div>
</template>
```

