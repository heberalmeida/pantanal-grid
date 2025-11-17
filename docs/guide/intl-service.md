# IntlService

The IntlService provides internationalization methods for formatting dates, numbers, and strings based on a specific locale.

## Creating an IntlService Instance

Create a new instance by passing a locale string:

```typescript
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en')
const intlPT = new IntlService('pt-BR')
const intlES = new IntlService('es')
```

## Formatting Dates

### formatDate

Converts a Date object to a string based on the specified format:

```typescript
const intl = new IntlService('en')
const date = new Date(2024, 0, 15)

intl.formatDate(date)
intl.formatDate(date, 'short')
intl.formatDate(date, 'long')
intl.formatDate(date, { date: 'full', time: 'short' })
```

### dateFormatNames

Returns day or month names from the current locale:

```typescript
const intl = new IntlService('en')

const dayNames = intl.dateFormatNames({ type: 'days', nameType: 'long' })
const monthNames = intl.dateFormatNames({ type: 'months', nameType: 'short' })
```

### dateFieldName

Returns a localized date field name:

```typescript
const intl = new IntlService('en')

const dayName = intl.dateFieldName({ type: 'day', nameType: 'long' })
const monthName = intl.dateFieldName({ type: 'month', nameType: 'short' })
```

### firstDay

Returns the first day index of the week (0 = Sunday):

```typescript
const intl = new IntlService('en')
const firstDay = intl.firstDay()
```

### splitDateFormat

Splits a date format into parts:

```typescript
const intl = new IntlService('en')
const parts = intl.splitDateFormat('MM/dd/yyyy')
```

### parseDate

Converts a string to a Date object:

```typescript
const intl = new IntlService('en')

const date1 = intl.parseDate('2024-01-15')
const date2 = intl.parseDate('01/15/2024', 'MM/dd/yyyy')
const date3 = intl.parseDate('2024-01-15', ['MM/dd/yyyy', 'yyyy-MM-dd'])
```

## Formatting Numbers

### formatNumber

Converts a number to a string based on the specified format:

```typescript
const intl = new IntlService('en')

intl.formatNumber(1234.56, 'c')
intl.formatNumber(1234.56, 'n')
intl.formatNumber(0.15, 'p')
intl.formatNumber(1234.56, { style: 'currency', currency: 'USD' })
intl.formatNumber(1234.56, { style: 'decimal', minimumFractionDigits: 2 })
```

### numberSymbols

Returns number symbols from the current locale:

```typescript
const intl = new IntlService('en')
const symbols = intl.numberSymbols()
```

### parseNumber

Converts a string to a number:

```typescript
const intl = new IntlService('en')

const num1 = intl.parseNumber('1234.56')
const num2 = intl.parseNumber('1,234.56', { style: 'decimal' })
```

## Formatting Strings

### format

Formats a string with placeholders:

```typescript
const intl = new IntlService('en')

intl.format('Total amount {0:c}', [1234.56])
intl.format('Showing {0} to {1} of {2}', [1, 10, 100])
intl.format('Price: {0:n}, Date: {1:d}', [99.99, new Date()])
```

### toString

Converts a value to a string based on format:

```typescript
const intl = new IntlService('en')

intl.toString(new Date(2024, 0, 15), 'short')
intl.toString(1234.56, 'c')
intl.toString(0.15, 'p')
```

## Format Options

### Date Format Options

- `'short'` - Short date format (e.g., "1/15/24")
- `'medium'` - Medium date format (e.g., "Jan 15, 2024")
- `'long'` - Long date format (e.g., "January 15, 2024")
- `'full'` - Full date format (e.g., "Monday, January 15, 2024")
- Custom pattern: `'MM/dd/yyyy'`, `'dd-MM-yyyy'`, etc.

### Number Format Options

- `'c'` or `'C'` - Currency format
- `'n'` or `'N'` - Decimal format
- `'p'` or `'P'` - Percent format
- Custom options: `{ style: 'currency', currency: 'USD' }`

## Usage Examples

### Basic Usage

```typescript
import { IntlService } from '@pantanal/grid'

const intl = new IntlService('en-US')

const formattedDate = intl.formatDate(new Date(), 'long')
const formattedNumber = intl.formatNumber(1234.56, 'c')
const formattedString = intl.format('Total: {0:c}', [1234.56])
```

### With Grid Component

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PantanalGrid, IntlService, type ColumnDef } from '@pantanal/grid'

const intl = new IntlService('en')

const rows = ref([
  { id: 1, name: 'Product A', price: 1234.56, date: new Date(2024, 0, 15) }
])

const columns: ColumnDef[] = [
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
  }
]
</script>

<template>
  <PantanalGrid :rows="rows" :columns="columns" key-field="id" />
</template>
```

### Different Locales

```typescript
const intlEN = new IntlService('en')
const intlPT = new IntlService('pt-BR')
const intlES = new IntlService('es')

const date = new Date(2024, 0, 15)

console.log(intlEN.formatDate(date, 'long'))
console.log(intlPT.formatDate(date, 'long'))
console.log(intlES.formatDate(date, 'long'))
```

## See Also

- [Internationalization Guide](/guide/i18n) - Grid i18n features
- [PantanalGrid API](/api/grid) - Complete API reference

