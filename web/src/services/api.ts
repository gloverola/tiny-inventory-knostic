import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { handleApiError } from '@/services/error-handler'

interface ErrorResponse {
  success: boolean
  message: string
  status: number
  errors?: Record<string, string[]>
}

const baseURL: string = 'http://0.0.0.0:3000/'

const defaultConfig: AxiosRequestConfig = {
  baseURL,
  timeout: 120000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  },
}

const api: AxiosInstance = axios.create(defaultConfig)

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.status} ${response.config.url}`)
    }

    return response
  },
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
      _retryCount?: number
    }

    if (import.meta.env.DEV) {
      console.log(`❌ [API] ${error.response?.status} ${error.config?.url}`)
    }

    const status = error.response?.status ?? 0
    const shouldRetry = status >= 500
    const retryCount = originalRequest._retryCount ?? 0
    const maxRetries = 2

    if (shouldRetry && retryCount < maxRetries && originalRequest) {
      originalRequest._retry = true
      originalRequest._retryCount = retryCount + 1

      if (import.meta.env.DEV) {
        console.log(
          `🔄 [RETRY] Attempt ${originalRequest._retryCount}/${maxRetries} for ${originalRequest.url}`
        )
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, originalRequest._retryCount! * 1000)
      )

      return api(originalRequest)
    }

    return Promise.reject(handleApiError(error))
  }
)

export default api
