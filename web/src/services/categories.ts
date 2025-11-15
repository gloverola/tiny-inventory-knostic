import { createParams } from '@/lib/query-params'
import api from './api'

export const createCategory = async (payload: any): Promise<any> => {
  const response = await api.post('/categories/create', payload)
  return response.data
}

export const getAllCategories = async (params: any): Promise<any> => {
  const queryParams = createParams({
    ...params,
  })

  const response = await api.get(`/categories?${queryParams}`)
  return response.data
}

export const getCategory = async (categoryId: any): Promise<any> => {
  if (categoryId) {
    const response = await api.get(`/categories/${categoryId}`)
    return response.data
  }
}

export const updateCategory = async (
  categoryId: any,
  payload: any
): Promise<any> => {
  const response = await api.put(`/categories/${categoryId}`, payload)
  return response.data
}

export const deleteCategory = async (categoryId: any): Promise<any> => {
  const response = await api.delete(`/categories/${categoryId}`)
  return response.data
}
