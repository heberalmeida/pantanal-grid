<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts" generic="T extends Row = Row">
import { computed, ref, watch, onMounted, provide } from 'vue'
import type { DataSourceProps, DataSourceEmits, DataSourceInstance, DataSourceTransport, DataSourceSchema } from '../types'
import type { Row, SortDescriptor, FilterDescriptor, GroupDescriptor } from '../types'
import { applyFilter, applySort, paginate } from '../composables/data'
import { buildGroupTree, flattenTree } from '../composables/group'

const props = withDefaults(defineProps<DataSourceProps<T>>(), {
  type: 'local',
  page: 1,
  pageSize: 20,
  serverPaging: false,
  serverFiltering: false,
  serverSorting: false,
  serverGrouping: false,
  autoSync: false,
  batch: false,
  sort: () => [],
  filter: () => [],
  group: () => [],
})

const emit = defineEmits<DataSourceEmits>()

// Estado interno
const internalData = ref<T[]>(props.data ?? [])
const internalTotal = ref<number | null>(null)
const isLoading = ref(false)
const abortController = ref<AbortController | null>(null)

// Estado reativo para paginação, ordenação, filtros e agrupamento
const currentPage = ref(props.page)
const currentPageSize = ref(props.pageSize)
const currentSort = ref<SortDescriptor[]>(props.sort ?? [])
const currentFilter = ref<FilterDescriptor[]>(props.filter ?? [])
const currentGroup = ref<GroupDescriptor[]>(props.group ?? [])

// Watch para props externas
watch(() => props.page, (v) => { if (v !== undefined) currentPage.value = v })
watch(() => props.pageSize, (v) => { if (v !== undefined) currentPageSize.value = v })
watch(() => props.sort, (v) => { if (v) currentSort.value = v }, { deep: true })
watch(() => props.filter, (v) => { if (v) currentFilter.value = v }, { deep: true })
watch(() => props.group, (v) => { if (v) currentGroup.value = v }, { deep: true })
watch(() => props.data, (v) => { if (v) internalData.value = v }, { deep: true })

// Emitir mudanças
watch(currentPage, (v) => emit('update:page', v))
watch(currentPageSize, (v) => emit('update:pageSize', v))
watch(currentSort, (v) => emit('update:sort', v), { deep: true })
watch(currentFilter, (v) => emit('update:filter', v), { deep: true })
watch(currentGroup, (v) => emit('update:group', v), { deep: true })

// Dados processados
const isRemote = computed(() => props.type === 'remote' || !!props.transport?.read)

const filtered = computed(() => {
  if (isRemote.value && props.serverFiltering) {
    return internalData.value
  }
  return applyFilter(internalData.value, currentFilter.value)
})

const sorted = computed(() => {
  if (isRemote.value && props.serverSorting) {
    return filtered.value
  }
  return applySort(filtered.value, currentSort.value)
})

const isGrouped = computed(() => currentGroup.value.length > 0)
const groupedTree = computed(() => {
  if (!isGrouped.value) return []
  if (isRemote.value && props.serverGrouping) {
    return sorted.value as any[]
  }
  return buildGroupTree(sorted.value as any[], currentGroup.value, {})
})

const flatNodes = computed<any[]>(() => {
  if (!isGrouped.value) return sorted.value as any[]
  return flattenTree(groupedTree.value as any[], new Set(), true) as any[]
})

const paginated = computed<any[]>(() => {
  if (isRemote.value && props.serverPaging) {
    return flatNodes.value
  }
  const nodes = flatNodes.value
  if (isGrouped.value) {
    // Quando há agrupamento, flatNodes é GroupNode[]
    const start = (currentPage.value - 1) * currentPageSize.value
    return nodes.slice(start, start + currentPageSize.value)
  }
  // Quando não há agrupamento, é T[]
  return paginate(nodes as T[], currentPage.value, currentPageSize.value)
})

const total = computed(() => {
  if (internalTotal.value !== null) return internalTotal.value
  if (isRemote.value && props.serverPaging) return internalTotal.value ?? 0
  return flatNodes.value.length
})

// Schema parsing
function parseSchema(response: any, schema?: DataSourceSchema): { data: any[]; total?: number } {
  if (!schema) {
    // Tentar inferir estrutura comum
    if (Array.isArray(response)) {
      return { data: response }
    }
    if (response?.data && Array.isArray(response.data)) {
      return { data: response.data, total: response.total }
    }
    if (response?.results && Array.isArray(response.results)) {
      return { data: response.results, total: response.count }
    }
    return { data: [] }
  }

  let data: any[] = []
  let totalValue: number | undefined

  // Parse data
  if (schema.data) {
    if (typeof schema.data === 'function') {
      data = schema.data(response) ?? []
    } else {
      data = response?.[schema.data] ?? []
    }
  } else {
    data = Array.isArray(response) ? response : response?.data ?? []
  }

  // Parse total
  if (schema.total) {
    if (typeof schema.total === 'function') {
      totalValue = schema.total(response)
    } else {
      totalValue = response?.[schema.total]
    }
  }

  // Parse errors
  if (schema.errors) {
    let errors: any
    if (typeof schema.errors === 'function') {
      errors = schema.errors(response)
    } else {
      errors = response?.[schema.errors]
    }
    if (errors) {
      emit('error', errors)
    }
  }

  // Apply parse function if provided
  if (schema.parse) {
    const parsed = schema.parse(response)
    if (Array.isArray(parsed)) {
      data = parsed
    } else if (parsed?.data) {
      data = parsed.data
      totalValue = parsed.total ?? totalValue
    }
  }

  return { data, total: totalValue }
}

// Parameter map padrão
function defaultParameterMap(data: any, type: string): any {
  if (type === 'read') {
    const params: any = {}
    if (currentPage.value && props.serverPaging) {
      params.page = currentPage.value
      params.skip = (currentPage.value - 1) * currentPageSize.value
    }
    if (currentPageSize.value && props.serverPaging) {
      params.pageSize = currentPageSize.value
      params.take = currentPageSize.value
    }
    if (currentSort.value.length > 0 && props.serverSorting) {
      params.sort = currentSort.value.map(s => `${s.field}:${s.dir}`).join(',')
    }
    if (currentFilter.value.length > 0 && props.serverFiltering) {
      params.filter = JSON.stringify(currentFilter.value)
    }
    if (currentGroup.value.length > 0 && props.serverGrouping) {
      params.group = currentGroup.value.map(g => `${g.field}:${g.dir ?? 'asc'}`).join(',')
    }
    return { ...params, ...data }
  }
  return data
}

// Transport read
async function read(): Promise<void> {
  if (!props.transport?.read) {
    return
  }

  abortController.value?.abort()
  const ctl = new AbortController()
  abortController.value = ctl

  isLoading.value = true
  emit('requestStart', { type: 'read' })

  try {
    const parameterMap = props.transport.parameterMap ?? defaultParameterMap
    const params = parameterMap({}, 'read')

    let response: any

    if (typeof props.transport.read === 'string') {
      let baseUrl = props.transport.read
      // Handle relative URLs
      if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
        baseUrl = props.transport.read
      } else if (typeof window !== 'undefined' && window.location) {
        baseUrl = new URL(props.transport.read, window.location.origin).toString()
      }
      const url = new URL(baseUrl)
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.set(key, String(params[key]))
        }
      })
      const res = await fetch(url.toString(), { signal: ctl.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      response = await res.json()
    } else {
      response = await props.transport.read({
        data: params,
        type: 'read',
        url: typeof props.transport.read === 'string' ? props.transport.read : undefined,
      })
    }

    const { data, total: totalValue } = parseSchema(response, props.schema)
    internalData.value = data as T[]
    if (totalValue !== undefined) {
      internalTotal.value = totalValue
    } else {
      internalTotal.value = null
    }

    emit('change', internalData.value)
    emit('update:data', internalData.value)
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      emit('error', error)
    }
    throw error
  } finally {
    isLoading.value = false
    emit('requestEnd', { type: 'read' })
  }
}

// Watch para auto-refresh em modo remoto - apenas quando mudanças relevantes ocorrem
watch([currentPage, currentPageSize], () => {
  if (isRemote.value && (props.serverPaging || props.serverFiltering || props.serverSorting)) {
    read()
  }
})

watch([currentSort], () => {
  if (isRemote.value && props.serverSorting) {
    read()
  }
}, { deep: true })

watch([currentFilter], () => {
  if (isRemote.value && props.serverFiltering) {
    read()
  }
}, { deep: true })

watch([currentGroup], () => {
  if (isRemote.value && props.serverGrouping) {
    read()
  }
}, { deep: true })

// Métodos públicos
const dataSourceInstance: DataSourceInstance = {
  data: () => paginated.value as any[],
  total: () => total.value,
  read,
  sync: async () => {
    // Implementar sync para create/update/destroy
    emit('sync', {})
  },
  query: (options) => {
    if (options?.page !== undefined) currentPage.value = options.page
    if (options?.pageSize !== undefined) currentPageSize.value = options.pageSize
    if (options?.sort) currentSort.value = options.sort
    if (options?.filter) currentFilter.value = options.filter
    if (options?.group) currentGroup.value = options.group
  },
}

// Expor instância via provide para uso em outros componentes
provide('datasource', dataSourceInstance)

// Expor via ref
defineExpose(dataSourceInstance)

// Expor dados processados para o Grid
watch(paginated, (value) => {
  emit('change', value)
}, { immediate: true, deep: true })

// Auto-bind em modo remoto
onMounted(() => {
  if (isRemote.value) {
    read().catch(() => {
      // Error já foi emitido
    })
  } else {
    emit('change', paginated.value)
  }
})
</script>

