import { computed, type ComputedRef, type MaybeRef, unref } from 'vue'
import type { ColumnDef, Row } from '../types'
import { IntlService } from '../i18n/intl'

export type SimpleColumnFormat =
  | 'currency'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'number'
  | 'boolean'

export interface SimpleColumnInput<T = Row> {
  field: keyof T | string
  title?: string
  width?: number | string
  format?: SimpleColumnFormat | ((value: unknown, row: T) => string)
  sortable?: boolean
  filterable?: boolean
  hidden?: boolean
  type?: ColumnDef<T>['type']
}

export interface UseGridColumnsOptions {
  locale?: MaybeRef<string>
  currency?: string
  defaults?: {
    sortable?: boolean
    filterable?: boolean
  }
}

function resolveFormat<T>(
  format: SimpleColumnFormat,
  locale: string,
  currency: string,
): (value: unknown, row: T) => string {
  const intl = new IntlService(locale)

  switch (format) {
    case 'currency':
      return (value) => intl.formatNumber(Number(value), { style: 'currency', currency })
    case 'percent':
      return (value) => intl.formatNumber(Number(value), { style: 'percent' })
    case 'date':
      return (value) => {
        const date = value instanceof Date ? value : new Date(String(value))
        return Number.isNaN(date.getTime()) ? String(value ?? '') : intl.formatDate(date, { date: 'short' })
      }
    case 'datetime':
      return (value) => {
        const date = value instanceof Date ? value : new Date(String(value))
        return Number.isNaN(date.getTime()) ? String(value ?? '') : intl.formatDate(date, { datetime: 'short' })
      }
    case 'number':
      return (value) => intl.formatNumber(Number(value), { style: 'decimal' })
    case 'boolean':
      return (value) => (value ? 'Yes' : 'No')
    default:
      return (value) => String(value ?? '')
  }
}

function toTitle(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase())
    .trim()
}

export function buildGridColumns<T = Row>(
  columns: SimpleColumnInput<T>[],
  options: UseGridColumnsOptions = {},
): ColumnDef<T>[] {
  const locale = unref(options.locale) ?? 'en'
  const currency = options.currency ?? 'USD'
  const defaultSortable = options.defaults?.sortable
  const defaultFilterable = options.defaults?.filterable

  return columns
    .filter((column) => !column.hidden)
    .map((column) => {
      const field = String(column.field)
      const def: ColumnDef<T> = {
        field: column.field,
        title: column.title ?? toTitle(field),
        width: column.width,
        type: column.type,
      }

      if (defaultSortable !== undefined || column.sortable !== undefined) {
        def.sortable = column.sortable ?? defaultSortable
      }
      if (defaultFilterable !== undefined || column.filterable !== undefined) {
        def.filterable = column.filterable ?? defaultFilterable
      }

      if (column.format) {
        def.format = typeof column.format === 'function'
          ? column.format
          : resolveFormat<T>(column.format, locale, currency)
      }

      if (column.type === 'number' && !def.format) {
        def.filterableUI = 'numeric'
      }
      if (column.type === 'boolean' && !def.format) {
        def.format = resolveFormat<T>('boolean', locale, currency)
        def.filterableUI = 'boolean'
      }
      if (column.type === 'date' && !def.format) {
        def.format = resolveFormat<T>('date', locale, currency)
        def.filterableUI = 'date'
      }

      return def
    })
}

export function useGridColumns<T = Row>(
  columns: MaybeRef<SimpleColumnInput<T>[]>,
  options: UseGridColumnsOptions = {},
): ComputedRef<ColumnDef<T>[]> {
  return computed(() => buildGridColumns(unref(columns), options))
}
