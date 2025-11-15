import { createParams } from '@/lib/query-params'
import api from './api'

export const createProduct = async (payload: any): Promise<any> => {
  const response = await api.post('/products', payload)
  return response.data
}

export const getAllProducts = async (params: any): Promise<any> => {
  const queryParams = createParams({
    ...params,
  })

  const response = await api.get(`/products?${queryParams}`)
  return response.data
}

export const getProduct = async (productId: any): Promise<any> => {
  if (productId) {
    const response = await api.get(`/products/${productId}`)
    return response.data
  }
}

export const updateProduct = async (
  productId: any,
  payload: any
): Promise<any> => {
  const response = await api.patch(`/products/${productId}`, payload)
  return response.data
}

export const deleteProduct = async (productId: any): Promise<any> => {
  const response = await api.delete(`/products/${productId}`)
  return response.data
}
