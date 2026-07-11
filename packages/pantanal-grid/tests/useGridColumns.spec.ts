import { describe, it, expect } from 'vitest'
import { buildGridColumns } from '../src/composables/useGridColumns'

describe('useGridColumns', () => {
  it('builds columns with inferred titles', () => {
    const columns = buildGridColumns([
      { field: 'productName', title: 'Product' },
      { field: 'unitPrice', format: 'currency' },
      { field: 'createdAt', type: 'date' },
    ], { locale: 'en', currency: 'USD' })

    expect(columns).toHaveLength(3)
    expect(columns[0].title).toBe('Product')
    expect(columns[1].title).toBe('Unit Price')
    expect(columns[1].format).toBeTypeOf('function')
    expect(columns[2].filterableUI).toBe('date')
  })

  it('formats currency values', () => {
    const columns = buildGridColumns([
      { field: 'price', format: 'currency' },
    ], { locale: 'en', currency: 'USD' })

    const formatted = columns[0].format?.(29.9, { price: 29.9 })
    expect(String(formatted)).toContain('29.9')
  })

  it('skips hidden columns', () => {
    const columns = buildGridColumns([
      { field: 'id' },
      { field: 'secret', hidden: true },
    ])

    expect(columns).toHaveLength(1)
    expect(columns[0].field).toBe('id')
  })
})
