import { AxiosError } from 'axios'

interface ErrorResponse {
  message?: string
  code?: string
  details?: any
}

export interface ApiError extends Error {
  status?: number
  code?: string
  details?: any
}

export const handleApiError = (error: AxiosError<ErrorResponse>): ApiError => {
  let errorMessage = error.response?.data?.message || error.message

  // Handle array error messages for 400 status
  if (error.response?.status === 400 && Array.isArray(errorMessage)) {
    errorMessage = errorMessage.join(', ')
  }

  const apiError: ApiError = new Error(errorMessage)

  // Add additional error properties
  apiError.status = error.response?.status
  apiError.code = error.response?.data?.code
  apiError.details = error.response?.data?.details

  // Log error in development
  if (import.meta.env.MODE === 'development') {
    console.error('❌ [API Error]:', {
      status: apiError.status,
      message: apiError.message,
      code: apiError.code,
      details: apiError.details,
    })
  }

  return apiError
}
