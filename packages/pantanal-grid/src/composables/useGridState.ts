import { ref } from 'vue'
import type { FilterDescriptor, SortDescriptor } from '../types'

export interface UseGridStateOptions {
  sort?: SortDescriptor[]
  filter?: FilterDescriptor[]
  page?: number
  pageSize?: number
  selectedKeys?: unknown[]
}

export function useGridState(options: UseGridStateOptions = {}) {
  const sort = ref<SortDescriptor[]>(options.sort ?? [])
  const filter = ref<FilterDescriptor[]>(options.filter ?? [])
  const page = ref(options.page ?? 1)
  const pageSize = ref(options.pageSize ?? 20)
  const selectedKeys = ref<unknown[]>(options.selectedKeys ?? [])

  function reset() {
    sort.value = []
    filter.value = []
    page.value = 1
    pageSize.value = options.pageSize ?? 20
    selectedKeys.value = []
  }

  return {
    sort,
    filter,
    page,
    pageSize,
    selectedKeys,
    reset,
  }
}
