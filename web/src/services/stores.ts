import { createParams } from '@/lib/query-params'
import api from './api'

export const createStore = async (requestBody: any): Promise<any> => {
  const response = await api.post('/stores', requestBody)
  return response.data
}

export const getAllStores = async (params: any): Promise<any> => {
  const queryParams = createParams({
    ...params,
  })

  const response = await api.get(`/stores?${queryParams}`)
  return response.data
}

export const getStore = async (storeId: any): Promise<any> => {
  if (storeId) {
    const response = await api.get(`/stores/${storeId}`)
    return response.data
  }
}

export const getStoreProducts = async (storeId: any): Promise<any> => {
  if (storeId) {
    const response = await api.get(`/stores/${storeId}/products`)
    return response.data
  }
}
