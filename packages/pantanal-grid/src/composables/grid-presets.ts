import type { GridProps, Row } from '../types'

export type GridPreset = 'minimal' | 'interactive' | 'selectable' | 'server' | 'readonly'

export const GRID_PRESETS: Record<GridPreset, Partial<GridProps>> = {
  minimal: {
    pageable: true,
    sortable: true,
    filterable: true,
    showFilterRow: true,
  },
  interactive: {
    sortable: true,
    filterable: true,
    filterableMode: 'row',
    showFilterRow: true,
    pageable: true,
    navigatable: true,
    enableColumnResize: true,
    enableColumnReorder: true,
  },
  selectable: {
    sortable: true,
    filterable: true,
    filterableMode: 'row',
    showFilterRow: true,
    pageable: true,
    navigatable: true,
    enableColumnResize: true,
    enableColumnReorder: true,
    selectable: 'multiple',
  },
  server: {
    sortable: true,
    filterable: true,
    filterableMode: 'row',
    showFilterRow: true,
    pageable: true,
    serverSide: true,
    navigatable: true,
    enableColumnResize: true,
  },
  readonly: {
    sortable: false,
    filterable: false,
    showFilterRow: false,
    pageable: true,
    navigatable: false,
    enableColumnResize: false,
    enableColumnReorder: false,
    selectable: false,
    editable: false,
  },
}

export function getGridPresetProps<T extends Row = Row>(preset?: GridPreset): Partial<GridProps<T>> {
  if (!preset) return {}
  return { ...GRID_PRESETS[preset] } as Partial<GridProps<T>>
}

export function mergeGridProps<T extends Row = Row>(
  base: Partial<GridProps<T>>,
  overrides: Partial<GridProps<T>> & { preset?: GridPreset },
): Partial<GridProps<T>> {
  const result: Partial<GridProps<T>> = { ...base }
  for (const [key, value] of Object.entries(overrides)) {
    if (key === 'preset' || value === undefined) continue
    ;(result as Record<string, unknown>)[key] = value
  }
  return result
}
