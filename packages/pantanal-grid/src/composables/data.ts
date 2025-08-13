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

function matchFilter(value: any, f: FilterDescriptor) {
  switch (f.operator) {
    case 'contains': return String(value ?? '').toLowerCase().includes(String(f.value ?? '').toLowerCase())
    case 'eq': return value === f.value
    case 'neq': return value !== f.value
    case 'gt': return Number(value) > Number(f.value)
    case 'lt': return Number(value) < Number(f.value)
    default: return true
  }
}

export function paginate<T>(rows: T[], page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize
  return rows.slice(start, start + pageSize)
}
