<template>
  <div class="space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold leading-tight">IntlService</h1>
      <p class="text-slate-600 dark:text-slate-400">
        The IntlService provides internationalization methods for formatting dates, numbers, and strings
        based on a specific locale. This page demonstrates all IntlService capabilities.
      </p>
    </header>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Date Formatting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Format dates using various formats and options.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Short Format</h3>
          <p class="text-sm">{{ shortDate }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Long Format</h3>
          <p class="text-sm">{{ longDate }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Full Format</h3>
          <p class="text-sm">{{ fullDate }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Custom Options</h3>
          <p class="text-sm">{{ customDate }}</p>
        </div>
      </div>

      <ExampleCode :source="dateFormatCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Number Formatting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Format numbers as currency, decimals, or percentages.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Currency</h3>
          <p class="text-sm">{{ currencyFormat }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Decimal</h3>
          <p class="text-sm">{{ decimalFormat }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Percent</h3>
          <p class="text-sm">{{ percentFormat }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Custom Options</h3>
          <p class="text-sm">{{ customNumberFormat }}</p>
        </div>
      </div>

      <ExampleCode :source="numberFormatCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">String Formatting</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Format strings with placeholders for dates, numbers, and other values.
      </p>

      <div class="space-y-2">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm"><strong>Currency placeholder:</strong> {{ formattedCurrency }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm"><strong>Multiple placeholders:</strong> {{ formattedRange }}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm"><strong>Mixed types:</strong> {{ formattedMixed }}</p>
        </div>
      </div>

      <ExampleCode :source="stringFormatCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Date and Month Names</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Get localized day and month names from the current locale.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Day Names</h3>
          <ul class="text-sm space-y-1">
            <li v-for="(name, day) in dayNames" :key="day">{{ name }}</li>
          </ul>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="font-semibold mb-2">Month Names</h3>
          <ul class="text-sm space-y-1">
            <li v-for="(name, month) in monthNames" :key="month">{{ name }}</li>
          </ul>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-sm"><strong>First day of week:</strong> {{ firstDayText }}</p>
      </div>

      <ExampleCode :source="dateNamesCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Using with Grid</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Use IntlService to format grid column values.
      </p>

      <PantanalGrid
        :rows="gridRows"
        :columns="gridColumns as any"
        key-field="id"
        :height="300"
        locale="en"
        responsive="table"
      />

      <ExampleCode :source="gridCode" />
    </article>

    <article class="space-y-4">
      <h2 class="text-2xl font-semibold">Multiple Locales</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        Compare formatting across different locales.
      </p>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold mb-2">Date Formatting</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">English (en)</p>
              <p class="text-sm">{{ localeDates.en }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">Portuguese (pt-BR)</p>
              <p class="text-sm">{{ localeDates.pt }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">Spanish (es)</p>
              <p class="text-sm">{{ localeDates.es }}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2">Currency Formatting</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">English (en)</p>
              <p class="text-sm">{{ localeAmounts.en }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">Portuguese (pt-BR)</p>
              <p class="text-sm">{{ localeAmounts.pt }}</p>
            </div>
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p class="text-sm font-semibold mb-1">Spanish (es)</p>
              <p class="text-sm">{{ localeAmounts.es }}</p>
            </div>
          </div>
        </div>
      </div>

      <ExampleCode :source="localesCode" />
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PantanalGrid, IntlService, type ColumnDef } from '@pantanal/grid'
import ExampleCode from '../components/ExampleCode.vue'

const intl = new IntlService('en')
const intlPT = new IntlService('pt-BR')
const intlES = new IntlService('es')

const sampleDate = new Date(2024, 0, 15)
const sampleAmount = 1234.56

const shortDate = computed(() => intl.formatDate(sampleDate, 'short'))
const longDate = computed(() => intl.formatDate(sampleDate, 'long'))
const fullDate = computed(() => intl.formatDate(sampleDate, 'full'))
const customDate = computed(() => intl.formatDate(sampleDate, { date: 'full', time: 'short' }))

const currencyFormat = computed(() => intl.formatNumber(sampleAmount, 'c'))
const decimalFormat = computed(() => intl.formatNumber(sampleAmount, 'n'))
const percentFormat = computed(() => intl.formatNumber(0.15, 'p'))
const customNumberFormat = computed(() => intl.formatNumber(sampleAmount, { 
  style: 'currency', 
  currency: 'EUR',
  minimumFractionDigits: 2 
}))

const formattedCurrency = computed(() => intl.format('Total amount {0:c}', [sampleAmount]))
const formattedRange = computed(() => intl.format('Showing {0} to {1} of {2}', [1, 10, 100]))
const formattedMixed = computed(() => intl.format('Price: {0:n}, Date: {1:d}', [99.99, sampleDate]))

const dayNames = computed(() => intl.dateFormatNames({ type: 'days', nameType: 'long' }))
const monthNames = computed(() => intl.dateFormatNames({ type: 'months', nameType: 'short' }))
const firstDay = computed(() => intl.firstDay())
const firstDayText = computed(() => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[firstDay.value]
})

const localeDates = computed(() => ({
  en: intl.formatDate(sampleDate, 'long'),
  pt: intlPT.formatDate(sampleDate, 'long'),
  es: intlES.formatDate(sampleDate, 'long')
}))

const localeAmounts = computed(() => ({
  en: intl.formatNumber(sampleAmount, 'c'),
  pt: intlPT.formatNumber(sampleAmount, 'c'),
  es: intlES.formatNumber(sampleAmount, 'c')
}))

interface Product {
  id: number
  name: string
  price: number
  date: Date
  discount: number
}

const gridRows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 1234.56, date: new Date(2024, 0, 15), discount: 0.15 },
  { id: 2, name: 'Product B', price: 567.89, date: new Date(2024, 1, 20), discount: 0.25 },
  { id: 3, name: 'Product C', price: 890.12, date: new Date(2024, 2, 25), discount: 0.10 },
  { id: 4, name: 'Product D', price: 2345.67, date: new Date(2024, 3, 10), discount: 0.30 },
  { id: 5, name: 'Product E', price: 456.78, date: new Date(2024, 4, 5), discount: 0.20 },
])

const gridColumns: ColumnDef<Product>[] = [
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
  },
  { 
    field: 'discount', 
    title: 'Discount',
    width: 120,
    format: (v: number) => intl.formatNumber(v, 'p')
  }
]

const dateFormatCode = `<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')
const date = new Date(2024, 0, 15)

const shortDate = intl.formatDate(date, 'short')
const longDate = intl.formatDate(date, 'long')
const fullDate = intl.formatDate(date, 'full')
const customDate = intl.formatDate(date, { date: 'full', time: 'short' })
<\/script>

<template>
  <div>
    <p>Short: {{ shortDate }}</p>
    <p>Long: {{ longDate }}</p>
    <p>Full: {{ fullDate }}</p>
    <p>Custom: {{ customDate }}</p>
  </div>
</template>`

const numberFormatCode = `<script setup lang="ts">
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
<\/script>

<template>
  <div>
    <p>Currency: {{ currency }}</p>
    <p>Decimal: {{ decimal }}</p>
    <p>Percent: {{ percent }}</p>
    <p>Custom: {{ custom }}</p>
  </div>
</template>`

const stringFormatCode = `<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')

const total = intl.format('Total amount {0:c}', [1234.56])
const range = intl.format('Showing {0} to {1} of {2}', [1, 10, 100])
const mixed = intl.format('Price: {0:n}, Date: {1:d}', [99.99, new Date()])
<\/script>

<template>
  <div>
    <p>{{ total }}</p>
    <p>{{ range }}</p>
    <p>{{ mixed }}</p>
  </div>
</template>`

const dateNamesCode = `<script setup lang="ts">
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')

const dayNames = intl.dateFormatNames({ type: 'days', nameType: 'long' })
const monthNames = intl.dateFormatNames({ type: 'months', nameType: 'short' })
const firstDay = intl.firstDay()
<\/script>

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
    
    <p>First day: {{ firstDay }}</p>
  </div>
</template>`

const gridCode = `<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, IntlService, type ColumnDef } from '@pantanal/grid'

const intl = new IntlService('en')

interface Product {
  id: number
  name: string
  price: number
  date: Date
  discount: number
}

const rows = ref<Product[]>([
  { id: 1, name: 'Product A', price: 1234.56, date: new Date(2024, 0, 15), discount: 0.15 }
])

const columns: ColumnDef<Product>[] = [
  { field: 'id', title: 'ID' },
  { field: 'name', title: 'Name' },
  { 
    field: 'price', 
    title: 'Price',
    format: (v: number) => intl.formatNumber(v, 'c')
  },
  { 
    field: 'date', 
    title: 'Date',
    format: (v: Date) => intl.formatDate(v, 'short')
  },
  { 
    field: 'discount', 
    title: 'Discount',
    format: (v: number) => intl.formatNumber(v, 'p')
  }
]
<\/script>

<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
</template>`

const localesCode = `<script setup lang="ts">
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
<\/script>

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
</template>`
</script>

<style scoped>
.space-y-8 > * + * {
  margin-top: 2rem;
}
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}
.space-y-1 > * + * {
  margin-top: 0.25rem;
}
.text-3xl {
  font-size: 1.875rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.text-xl {
  font-size: 1.25rem;
}
.text-sm {
  font-size: 0.875rem;
}
.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}
.leading-tight {
  line-height: 1.25;
}
.text-slate-600 {
  color: #475569;
}
.dark .text-slate-400 {
  color: #94a3b8;
}
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.md\:grid-cols-2 {
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.md\:grid-cols-3 {
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.gap-4 {
  gap: 1rem;
}
.p-4 {
  padding: 1rem;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.dark .bg-gray-800 {
  background-color: #1f2937;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>

