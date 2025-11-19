import { watch, type Ref } from 'vue'
import type { FilterDescriptor } from '../types'

export type StorageType = 'localStorage' | 'sessionStorage'

function getStorage(type: StorageType): Storage | null {
  if (typeof window === 'undefined') return null
  return type === 'localStorage' ? window.localStorage : window.sessionStorage
}

export function useFilterPersistence(
  filters: Ref<FilterDescriptor[]>,
  enabled: boolean | StorageType | undefined,
  key: string = 'pantanal-grid-filters'
) {
  if (!enabled) return

  const storageType: StorageType = enabled === true ? 'localStorage' : enabled
  const storage = getStorage(storageType)
  if (!storage) return

  // Load from storage on init
  try {
    const stored = storage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        filters.value = parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load filters from storage:', error)
  }

  // Save to storage on change
  watch(
    filters,
    (newFilters) => {
      try {
        storage.setItem(key, JSON.stringify(newFilters))
      } catch (error) {
        console.warn('Failed to save filters to storage:', error)
      }
    },
    { deep: true }
  )
}

export function usePaginationPersistence(
  page: Ref<number>,
  pageSize: Ref<number>,
  enabled: boolean | StorageType | undefined,
  key: string = 'pantanal-grid-pagination'
) {
  if (!enabled) return

  const storageType: StorageType = enabled === true ? 'localStorage' : enabled
  const storage = getStorage(storageType)
  if (!storage) return

  // Load from storage on init
  try {
    const stored = storage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (typeof parsed === 'object' && parsed !== null) {
        if (typeof parsed.page === 'number' && parsed.page > 0) {
          page.value = parsed.page
        }
        if (typeof parsed.pageSize === 'number' && parsed.pageSize > 0) {
          pageSize.value = parsed.pageSize
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load pagination from storage:', error)
  }

  // Save to storage on change
  watch(
    [page, pageSize],
    ([newPage, newPageSize]) => {
      try {
        storage.setItem(
          key,
          JSON.stringify({ page: newPage, pageSize: newPageSize })
        )
      } catch (error) {
        console.warn('Failed to save pagination to storage:', error)
      }
    },
    { deep: true }
  )
}

