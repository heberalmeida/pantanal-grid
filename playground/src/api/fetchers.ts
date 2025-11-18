export type FetchPagedOptions = {
  baseUrl: string
  page: number
  pageSize: number
  query?: string
  rowsKey: string
  totalKey: string
  paramMap?: { limit?: string; skip?: string; query?: string }
  extraParams?: Record<string,string|number|boolean>
  mapRows?<TIn,TOut>(rows: TIn[]): TOut[]
}

export async function fetchPaged<T = any>(opts: FetchPagedOptions): Promise<{ rows: T[]; total: number; raw: any }> {
  const { baseUrl, page, pageSize, query, rowsKey, totalKey, paramMap = {}, extraParams = {}, mapRows } = opts
  const limitKey = paramMap.limit ?? 'limit'
  const skipKey  = paramMap.skip  ?? 'skip'
  const queryKey = paramMap.query ?? 'q'

  const url = new URL(baseUrl)
  url.searchParams.set(limitKey, String(pageSize))
  url.searchParams.set(skipKey, String((page - 1) * pageSize))
  if (query != null && query !== '') url.searchParams.set(queryKey, String(query))
  for (const [k, v] of Object.entries(extraParams)) url.searchParams.set(k, String(v))

  try {
    // Add timeout and better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const json = await res.json()
      const rawRows = (json as any)[rowsKey] ?? []
      const rows = mapRows ? mapRows(rawRows) : rawRows
      const total = Number((json as any)[totalKey] ?? rawRows.length)
      return { rows, total, raw: json }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      // If it's an abort error (timeout) or network error, throw to be handled by caller
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw fetchError
    }
  } catch (error) {
    // Re-throw to be handled by caller with fallback data
    throw error
  }
}
