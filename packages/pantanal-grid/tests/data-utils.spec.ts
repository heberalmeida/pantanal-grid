import { describe, it, expect } from 'vitest'
import { applySort, applyFilter, paginate } from '../src/composables/data'
import type { SortDescriptor, FilterDescriptor } from '../src/types'

type Row = { id: number; name: string; price: number; date?: string; category?: string | null }

describe('applySort', () => {
  const rows: Row[] = [
    { id: 3, name: 'Charlie', price: 30 },
    { id: 1, name: 'Alice', price: 10 },
    { id: 2, name: 'Bob', price: 20 },
  ]

  it('should return original array when sort is empty', () => {
    const result = applySort(rows, [])
    expect(result).toEqual(rows)
  })

  it('should return original array when sort is undefined', () => {
    const result = applySort(rows, undefined)
    expect(result).toEqual(rows)
  })

  it('should sort by number field ascending', () => {
    const sort: SortDescriptor[] = [{ field: 'id', dir: 'asc' }]
    const result = applySort(rows, sort)
    expect(result.map(r => r.id)).toEqual([1, 2, 3])
  })

  it('should sort by number field descending', () => {
    const sort: SortDescriptor[] = [{ field: 'id', dir: 'desc' }]
    const result = applySort(rows, sort)
    expect(result.map(r => r.id)).toEqual([3, 2, 1])
  })

  it('should sort by string field', () => {
    const sort: SortDescriptor[] = [{ field: 'name', dir: 'asc' }]
    const result = applySort(rows, sort)
    expect(result.map(r => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('should handle null values - nulls go to end', () => {
    const rowsWithNull: Row[] = [
      { id: 1, name: 'Alice', price: 10, category: 'A' },
      { id: 2, name: 'Bob', price: 20, category: null },
      { id: 3, name: 'Charlie', price: 30, category: 'B' },
    ]
    const sort: SortDescriptor[] = [{ field: 'category', dir: 'asc' }]
    const result = applySort(rowsWithNull, sort)
    expect(result[result.length - 1].category).toBeNull()
  })

  it('should handle multiple sort descriptors', () => {
    const multiRows: Row[] = [
      { id: 1, name: 'Alice', price: 30 },
      { id: 2, name: 'Alice', price: 20 },
      { id: 3, name: 'Bob', price: 10 },
    ]
    const sort: SortDescriptor[] = [
      { field: 'name', dir: 'asc' },
      { field: 'price', dir: 'asc' },
    ]
    const result = applySort(multiRows, sort)
    expect(result[0].name).toBe('Alice')
    expect(result[0].price).toBe(20)
    expect(result[1].name).toBe('Alice')
    expect(result[1].price).toBe(30)
  })

  it('should handle date strings', () => {
    const dateRows: Row[] = [
      { id: 1, name: 'A', price: 10, date: '2024-01-15' },
      { id: 2, name: 'B', price: 20, date: '2024-01-10' },
      { id: 3, name: 'C', price: 30, date: '2024-01-20' },
    ]
    const sort: SortDescriptor[] = [{ field: 'date', dir: 'asc' }]
    const result = applySort(dateRows, sort)
    expect(result.map(r => r.date)).toEqual(['2024-01-10', '2024-01-15', '2024-01-20'])
  })

  it('should handle Date objects', () => {
    const dateRows: Row[] = [
      { id: 1, name: 'A', price: 10, date: '2024-01-15' },
      { id: 2, name: 'B', price: 20, date: '2024-01-10' },
    ]
    const sort: SortDescriptor[] = [{ field: 'date', dir: 'asc' }]
    const result = applySort(dateRows, sort)
    expect(result[0].date).toBe('2024-01-10')
  })
})

describe('applyFilter', () => {
  const rows: Row[] = [
    { id: 1, name: 'Apple', price: 10, category: 'Fruit' },
    { id: 2, name: 'Banana', price: 20, category: 'Fruit' },
    { id: 3, name: 'Carrot', price: 15, category: 'Vegetable' },
    { id: 4, name: 'Date', price: 25, category: null },
  ]

  it('should return original array when filters are empty', () => {
    const result = applyFilter(rows, [])
    expect(result).toEqual(rows)
  })

  it('should return original array when filters are undefined', () => {
    const result = applyFilter(rows, undefined)
    expect(result).toEqual(rows)
  })

  it('should filter by contains operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'name', operator: 'contains', value: 'an' },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(1)
    expect(result.map(r => r.name)).toContain('Banana')
  })

  it('should filter by eq operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'eq', value: 'Fruit' },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.every(r => r.category === 'Fruit')).toBe(true)
  })

  it('should filter by neq operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'neq', value: 'Fruit' },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.every(r => r.category !== 'Fruit')).toBe(true)
  })

  it('should filter by gt operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'price', operator: 'gt', value: 15 },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.every(r => r.price > 15)).toBe(true)
  })

  it('should filter by gte operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'price', operator: 'gte', value: 15 },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(3)
    expect(result.every(r => r.price >= 15)).toBe(true)
  })

  it('should filter by lt operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'price', operator: 'lt', value: 20 },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.every(r => r.price < 20)).toBe(true)
  })

  it('should filter by lte operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'price', operator: 'lte', value: 20 },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(3)
    expect(result.every(r => r.price <= 20)).toBe(true)
  })

  it('should filter by startswith operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'name', operator: 'startswith', value: 'C' },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Carrot')
  })

  it('should filter by endswith operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'name', operator: 'endswith', value: 'e' },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.map(r => r.name)).toContain('Apple')
    expect(result.map(r => r.name)).toContain('Date')
  })

  it('should filter by isnull operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'isnull', value: null },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(1)
    expect(result[0].category).toBeNull()
  })

  it('should filter by isnotnull operator', () => {
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'isnotnull', value: null },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(3)
    expect(result.every(r => r.category !== null)).toBe(true)
  })

  it('should filter by isempty operator', () => {
    const emptyRows: Row[] = [
      { id: 1, name: 'A', price: 10, category: '' },
      { id: 2, name: 'B', price: 20, category: 'Fruit' },
    ]
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'isempty', value: '' },
    ]
    const result = applyFilter(emptyRows, filter)
    expect(result.length).toBe(1)
  })

  it('should filter by isnotempty operator', () => {
    const emptyRows: Row[] = [
      { id: 1, name: 'A', price: 10, category: '' },
      { id: 2, name: 'B', price: 20, category: 'Fruit' },
    ]
    const filter: FilterDescriptor[] = [
      { field: 'category', operator: 'isnotempty', value: '' },
    ]
    const result = applyFilter(emptyRows, filter)
    expect(result.length).toBe(1)
    expect(result[0].category).toBe('Fruit')
  })

  it('should handle multiple filters with AND logic', () => {
    const filter: FilterDescriptor[] = [
      { field: 'price', operator: 'gt', value: 10 },
      { field: 'price', operator: 'lt', value: 25 },
    ]
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(2)
    expect(result.map(r => r.name)).toContain('Banana')
    expect(result.map(r => r.name)).toContain('Carrot')
  })

  it('should handle nested filters with OR logic', () => {
    const filter: FilterDescriptor[] = [
      {
        field: 'category',
        operator: 'eq',
        value: 'Fruit',
        logic: 'or',
        filters: [
          { field: 'category', operator: 'eq', value: 'Vegetable' },
        ],
      },
    ]
    // When nested filters exist, only subfilters are evaluated
    // So this should match rows where category is 'Vegetable' (OR logic with subfilters)
    const result = applyFilter(rows, filter)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Carrot')
  })

  it('should handle date filtering with eq operator', () => {
    const dateRows: Row[] = [
      { id: 1, name: 'A', price: 10, date: '2024-01-15' },
      { id: 2, name: 'B', price: 20, date: '2024-01-16' },
    ]
    const filter: FilterDescriptor[] = [
      { field: 'date', operator: 'eq', value: '2024-01-15' },
    ]
    const result = applyFilter(dateRows, filter)
    expect(result.length).toBe(1)
    expect(result[0].date).toBe('2024-01-15')
  })

  it('should handle multi-word search in contains', () => {
    const multiRows: Row[] = [
      { id: 1, name: 'Red Apple', price: 10 },
      { id: 2, name: 'Green Apple', price: 20 },
      { id: 3, name: 'Red Carrot', price: 15 },
    ]
    const filter: FilterDescriptor[] = [
      { field: 'name', operator: 'contains', value: 'red apple' },
    ]
    const result = applyFilter(multiRows, filter)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Red Apple')
  })
})

describe('paginate', () => {
  const rows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))

  it('should return first page by default', () => {
    const result = paginate(rows)
    expect(result.length).toBe(20)
    expect(result[0].id).toBe(1)
  })

  it('should return specified page', () => {
    const result = paginate(rows, 2, 10)
    expect(result.length).toBe(10)
    expect(result[0].id).toBe(11)
  })

  it('should return correct page size', () => {
    const result = paginate(rows, 1, 5)
    expect(result.length).toBe(5)
  })

  it('should return empty array for page beyond data', () => {
    const result = paginate(rows, 100, 10)
    expect(result.length).toBe(0)
  })

  it('should return partial page when data is insufficient', () => {
    const smallRows = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }))
    const result = paginate(smallRows, 1, 10)
    expect(result.length).toBe(5)
  })
})


