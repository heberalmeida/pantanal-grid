import { computed, type MaybeRef, unref } from 'vue'
import type { ColumnDef, DataProvider, GridProps, Row, SelectionMode } from '../types'
import { getGridPresetProps, mergeGridProps, type GridPreset } from './grid-presets'
import { buildGridColumns, type SimpleColumnInput, type UseGridColumnsOptions } from './useGridColumns'
import { useGridState, type UseGridStateOptions } from './useGridState'

export interface UseGridOptions<T extends Row = Row> extends UseGridStateOptions, UseGridColumnsOptions {
  rows: MaybeRef<T[]>
  keyField: keyof T | string
  columns?: MaybeRef<SimpleColumnInput<T>[]>
  columnDefs?: MaybeRef<ColumnDef<T>[]>
  preset?: GridPreset
  selectable?: SelectionMode
  serverSide?: boolean
  total?: MaybeRef<number | undefined>
  dataProvider?: DataProvider<T>
  height?: number
  locale?: MaybeRef<string>
}

export function useGrid<T extends Row = Row>(options: UseGridOptions<T>) {
  const state = useGridState(options)
  const preset = options.preset ?? 'interactive'

  const columnDefs = computed<ColumnDef<T>[]>(() => {
    if (options.columnDefs) {
      return unref(options.columnDefs)
    }
    return buildGridColumns(unref(options.columns ?? []), {
      locale: options.locale,
      currency: options.currency,
      defaults: options.defaults,
    })
  })

  const gridProps = computed((): Partial<GridProps<T>> & {
    rows: T[]
    columns: ColumnDef<T>[]
    keyField: keyof T | string
  } => ({
    ...mergeGridProps(getGridPresetProps<T>(preset), {
      selectable: options.selectable,
      serverSide: options.serverSide,
      total: unref(options.total),
      dataProvider: options.dataProvider,
      height: options.height,
      locale: unref(options.locale),
    }),
    rows: unref(options.rows),
    columns: columnDefs.value,
    keyField: options.keyField,
  }))

  return {
    ...state,
    columns: columnDefs,
    gridProps,
    preset,
  }
}
