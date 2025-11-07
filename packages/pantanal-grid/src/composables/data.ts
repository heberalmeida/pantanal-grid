import type { FilterDescriptor, Row, SortDescriptor } from "../types"

export function applySort<T extends Row>(rows: T[], sort?: SortDescriptor[]) {
  if (!sort?.length) return rows
  const copy = [...rows]
  return copy.sort((a, b) => {
    for (const s of sort) {
      const av = (a as any)[s.field]
      const bv = (b as any)[s.field]
      if (av === bv) continue
      const dir = s.dir === 'asc' ? 1 : -1
      return av > bv ? dir : -dir
    }
    return 0
  })
}

export function applyFilter<T extends Row>(rows: T[], filters?: FilterDescriptor[]) {
  if (!filters?.length) return rows
  return rows.filter(row => filters.every(f => matchFilter((row as any)[f.field], f)))
}

function matchFilter(value: any, f: FilterDescriptor): boolean {
  // Handle nested filters with logic
  if (f.filters && f.filters.length > 0) {
    const results = f.filters.map(subFilter => matchFilter(value, subFilter))
    if (f.logic === 'or') {
      return results.some(r => r)
    }
    return results.every(r => r)
  }
  
  // Handle null/undefined values
  const isNull = value === null || value === undefined
  const isEmpty = value === '' || (Array.isArray(value) && value.length === 0)
  
  switch (f.operator) {
    case 'contains':
      if (isNull || isEmpty) return false
      const searchValue = String(f.value ?? '').trim().toLowerCase()
      const fieldValue = String(value ?? '').toLowerCase()
      
      // Multi-word search: if search contains spaces, check if all words are present
      if (searchValue.includes(' ')) {
        const searchWords = searchValue.split(/\s+/).filter(w => w.length > 0)
        return searchWords.every(word => fieldValue.includes(word))
      }
      
      return fieldValue.includes(searchValue)
    case 'eq':
      return value === f.value
    case 'neq':
      return value !== f.value
    case 'gt':
      if (isNull) return false
      return Number(value) > Number(f.value)
    case 'gte':
      if (isNull) return false
      return Number(value) >= Number(f.value)
    case 'lt':
      if (isNull) return false
      return Number(value) < Number(f.value)
    case 'lte':
      if (isNull) return false
      return Number(value) <= Number(f.value)
    case 'startswith':
      if (isNull || isEmpty) return false
      return String(value ?? '').toLowerCase().startsWith(String(f.value ?? '').toLowerCase())
    case 'endswith':
      if (isNull || isEmpty) return false
      return String(value ?? '').toLowerCase().endsWith(String(f.value ?? '').toLowerCase())
    case 'isnull':
      return isNull
    case 'isnotnull':
      return !isNull
    case 'isempty':
      return isEmpty || isNull
    case 'isnotempty':
      return !isEmpty && !isNull
    default:
      return true
  }
}

export function paginate<T>(rows: T[], page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
