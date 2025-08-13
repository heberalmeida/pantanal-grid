export type AggregateName = 'sum' | 'avg' | 'min' | 'max' | 'count'

export interface GroupDescriptor { field: string; dir?: 'asc' | 'desc' }

export interface GroupNodeGroup {
  type: 'group'
  key: string
  level: number
  field: string
  value: unknown
  rows: any[]
  aggregates: Record<string, number>
  children: GroupNode[]
}
export interface GroupNodeRow {
  type: 'row'
  key: string
  level: number
  row: any
}
export interface GroupNodeFooter {
  type: 'footer'
  key: string
  level: number
  field: string
  value: unknown
  aggregates: Record<string, number>
}

export type GroupNode = GroupNodeGroup | GroupNodeRow | GroupNodeFooter

type AggSpec = Record<string, AggregateName[]>

const aggs: Record<AggregateName, (vals: number[]) => number> = {
  sum: (v) => v.reduce((a, b) => a + (Number(b) || 0), 0),
  avg: (v) => (v.length ? v.reduce((a, b) => a + (Number(b) || 0), 0) / v.length : 0),
  min: (v) => (v.length ? Math.min(...v.map(Number)) : 0),
  max: (v) => (v.length ? Math.max(...v.map(Number)) : 0),
  count: (v) => v.length
}

function computeAggregates(rows: any[], spec: AggSpec): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [field, fns] of Object.entries(spec)) {
    const vals = rows.map(r => (r as any)[field]).filter(v => v != null) as number[]
    for (const fn of fns) {
      out[`${field}:${fn}`] = aggs[fn](vals)
    }
  }
  out['count'] = rows.length
  return out
}

export function buildGroupTree(rows: any[], groups: GroupDescriptor[], spec: AggSpec, level = 0): GroupNode[] {
  if (!groups?.length) {
    return rows.map((row, i) => ({ type: 'row', key: `r-${i}`, level, row })) as GroupNode[]
  }
  const [g0, ...rest] = groups

  const buckets = new Map<unknown, any[]>()
  for (const r of rows) {
    const v = (r as any)[g0.field]
    const k = v as unknown as string
    if (!buckets.has(k)) buckets.set(k, [])
    buckets.get(k)!.push(r)
  }

  const keys = Array.from(buckets.keys())
  if (g0.dir === 'desc') keys.sort((a: any, b: any) => (a > b ? -1 : a < b ? 1 : 0))
  else keys.sort((a: any, b: any) => (a > b ? 1 : a < b ? -1 : 0))

  const nodes: GroupNode[] = []
  for (const k of keys) {
    const bucket = buckets.get(k)!
    const childSpec = spec
    const groupAggs = computeAggregates(bucket, childSpec)
    const children = rest.length
      ? buildGroupTree(bucket, rest, spec, level + 1) 
      : bucket.map((row, i) => ({ type: 'row', key: `r-${String(k)}-${i}`, level: level + 1, row } as GroupNodeRow))


    const grp: GroupNodeGroup = {
      type: 'group',
      key: `g-${String(g0.field)}=${String(k)}`,
      level,
      field: g0.field,
      value: k,
      rows: bucket,
      aggregates: groupAggs,
      children
    }
    nodes.push(grp)

    const foot: GroupNodeFooter = {
      type: 'footer',
      key: `f-${String(g0.field)}=${String(k)}`,
      level,
      field: g0.field,
      value: k,
      aggregates: groupAggs
    }
    nodes.push(foot)
  }
  return nodes
}

export function flattenTree(
  nodes: GroupNode[],
  expanded: Set<string>,
  showFooters = true
): GroupNode[] {
  const out: GroupNode[] = []
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i]
    if (n.type === 'group') {
      out.push(n)
      const isOpen = expanded.has(n.key)
      if (isOpen) {

        for (const c of n.children) {
          if (c.type === 'group') {
            out.push(...flattenTree([c], expanded, showFooters))
          } else if (c.type === 'row') {
            out.push(c)
          }
        }
        
        const maybeFooter = nodes[i + 1]
        if (showFooters && maybeFooter?.type === 'footer') {
          out.push(maybeFooter)
        }
      }

    } else if (n.type === 'row') {
      out.push(n)
    } else if (n.type === 'footer') {
      
    }
  }
  return out
}
