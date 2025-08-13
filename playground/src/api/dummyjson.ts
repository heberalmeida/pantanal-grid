import { fetchPaged } from './fetchers'

export interface Product { id: number; title: string; price: number; brand?: string; category?: string }

export async function fetchProducts(page: number, pageSize: number, query?: string) {
  const base = query ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products'
  const { rows, total } = await fetchPaged<Product>({
    baseUrl: base,
    page,
    pageSize,
    query,
    rowsKey: 'products',
    totalKey: 'total',
    paramMap: { limit: 'limit', skip: 'skip', query: 'q' },
    extraParams: { select: 'id,title,price,brand,category' }
  })
  return { rows, total }
}
