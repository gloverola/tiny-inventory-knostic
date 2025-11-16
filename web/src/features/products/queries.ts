import { queryOptions } from '@tanstack/react-query'
import { getAllCategories } from '@/services/categories'
import { getAllProducts } from '@/services/products'

interface ProductsQueryParams {
  page?: number
  limit?: number
  name?: string
  category?: string[]
  stock?: string[]
  [key: string]: any
}

interface CategoriesQueryParams {
  page?: number
  limit?: number
  name?: string
  [key: string]: any
}

export const productsQuery = (params: ProductsQueryParams = {}) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: () => getAllProducts(params),
  })

export const categoriesQuery = (params: CategoriesQueryParams = {}) =>
  queryOptions({
    queryKey: ['categories', params],
    queryFn: () => getAllCategories(params),
  })
