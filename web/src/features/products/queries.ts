import { queryOptions } from '@tanstack/react-query'
import { getAllProducts } from '@/services/products'

interface ProductsQueryParams {
  page?: number
  limit?: number
  name?: string
  category?: string[]
  stock?: string[]
  [key: string]: any
}

export const productsQuery = (params: ProductsQueryParams = {}) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: () => getAllProducts(params),
  })
