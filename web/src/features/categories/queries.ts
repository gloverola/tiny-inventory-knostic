import { queryOptions } from '@tanstack/react-query'
import { getAllCategories } from '@/services/categories'

interface ProductsQueryParams {
  page?: number
  limit?: number
  name?: string
  [key: string]: any
}

export const categoriesQuery = (params: ProductsQueryParams = {}) =>
  queryOptions({
    queryKey: ['categories', params],
    queryFn: () => getAllCategories(params),
  })
