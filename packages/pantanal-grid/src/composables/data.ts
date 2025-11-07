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
      // Special handling for dates - compare only date part (without time)
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) {
          return false
        }
        
        // Compare only date part (year, month, day)
        return valueDate.getFullYear() === filterDate.getFullYear() &&
               valueDate.getMonth() === filterDate.getMonth() &&
               valueDate.getDate() === filterDate.getDate()
      }
      return value === f.value
    case 'neq':
      // Special handling for dates
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) {
          return true
        }
        
        // Compare only date part (year, month, day)
        return !(valueDate.getFullYear() === filterDate.getFullYear() &&
                 valueDate.getMonth() === filterDate.getMonth() &&
                 valueDate.getDate() === filterDate.getDate())
      }
      return value !== f.value
    case 'gt':
      if (isNull) return false
      // Handle dates
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) return false
        // Compare only date part for equality, but use full time for comparison
        const valueDateOnly = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate())
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate())
        return valueDateOnly.getTime() > filterDateOnly.getTime()
      }
      return Number(value) > Number(f.value)
    case 'gte':
      if (isNull) return false
      // Handle dates
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) return false
        const valueDateOnly = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate())
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate())
        return valueDateOnly.getTime() >= filterDateOnly.getTime()
      }
      return Number(value) >= Number(f.value)
    case 'lt':
      if (isNull) return false
      // Handle dates
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) return false
        const valueDateOnly = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate())
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate())
        return valueDateOnly.getTime() < filterDateOnly.getTime()
      }
      return Number(value) < Number(f.value)
    case 'lte':
      if (isNull) return false
      // Handle dates
      if (value instanceof Date || f.value instanceof Date || (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) || (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value))) {
        const valueDate = value instanceof Date ? value : (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? new Date(value + 'T00:00:00') : new Date(value))
        const filterDate = f.value instanceof Date ? f.value : (typeof f.value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(f.value) ? new Date(f.value + 'T00:00:00') : new Date(f.value))
        if (isNaN(valueDate.getTime()) || isNaN(filterDate.getTime())) return false
        const valueDateOnly = new Date(valueDate.getFullYear(), valueDate.getMonth(), valueDate.getDate())
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate())
        return valueDateOnly.getTime() <= filterDateOnly.getTime()
      }
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
