import { queryOptions } from '@tanstack/react-query'
import { getAllStores, getStore, getStoreProducts } from '@/services/stores'

interface StoresQueryParams {
  page?: number
  limit?: number
  name?: string
  [key: string]: any
}

interface StoreProductsQueryParams {
  page?: number
  limit?: number
  name?: string
  category?: string[]
  stock?: string[]
  [key: string]: any
}

export const storesQuery = (params: StoresQueryParams = {}) =>
  queryOptions({
    queryKey: ['stores', params],
    queryFn: () => getAllStores(params),
  })

export const storeQuery = (params: any = {}) =>
  queryOptions({
    queryKey: ['stores', { id: params.id }],
    queryFn: () => getStore(params.id),
  })

export const storeProductsQuery = (
  storeId: any,
  options: any,
  queryParams: StoreProductsQueryParams
) =>
  queryOptions({
    queryKey: ['store-products', { id: storeId }],
    queryFn: () => getStoreProducts(storeId, queryParams),
    ...options,
  })
