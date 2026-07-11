import { describe, it, expect } from 'vitest'
import { getGridPresetProps, mergeGridProps, GRID_PRESETS } from '../src/composables/grid-presets'

describe('grid-presets', () => {
  it('returns interactive defaults with keyboard navigation', () => {
    const props = getGridPresetProps('interactive')
    expect(props.navigatable).toBe(true)
    expect(props.sortable).toBe(true)
    expect(props.filterable).toBe(true)
  })

  it('returns selectable preset with multiple selection', () => {
    const props = getGridPresetProps('selectable')
    expect(props.selectable).toBe('multiple')
    expect(props.navigatable).toBe(true)
  })

  it('returns readonly preset with features disabled', () => {
    const props = getGridPresetProps('readonly')
    expect(props.sortable).toBe(false)
    expect(props.filterable).toBe(false)
    expect(props.navigatable).toBe(false)
  })

  it('merges overrides without clobbering preset with undefined', () => {
    const merged = mergeGridProps(GRID_PRESETS.interactive, {
      height: 400,
      navigatable: undefined,
    })
    expect(merged.height).toBe(400)
    expect(merged.navigatable).toBe(true)
  })

  it('allows overrides to replace preset values', () => {
    const merged = mergeGridProps(GRID_PRESETS.readonly, {
      sortable: true,
    })
    expect(merged.sortable).toBe(true)
  })
})
