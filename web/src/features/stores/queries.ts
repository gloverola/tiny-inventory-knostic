import { queryOptions } from '@tanstack/react-query'
import { getAllStores, getStore } from '@/services/stores'

interface StoresQueryParams {
  page?: number
  limit?: number
  name?: string
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
