const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
  signal?: AbortSignal
}

export interface ApiClientResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function buildUrl(endpoint: string, params?: RequestConfig['params']): string {
  const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://')
  const base = isAbsolute ? '' : API_BASE_URL.replace(/\/+$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const fullUrl = isAbsolute ? endpoint : `${base}${cleanEndpoint}`

  if (!params) return fullUrl

  const url = new URL(fullUrl, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { params?: RequestConfig['params'] } = {}
): Promise<ApiClientResponse<T>> {
  const { params, headers = {}, ...customConfig } = options

  const url = buildUrl(endpoint, params)

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
  }

  if (customConfig.body && !(customConfig.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  }

  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: mergedHeaders,
      ...customConfig,
    })

    if (response.status === 401) {
      if (!window.location.pathname.includes('/profesionales/login')) {
        window.location.href = '/profesionales/login'
      }
    }

    let responseData: unknown = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }

    if (!response.ok) {
      const dataObj = responseData as { error?: string; message?: string; errors?: Record<string, string> } | null
      const errorMessage =
        dataObj?.error || dataObj?.message || `Error HTTP ${response.status}: ${response.statusText}`
      throw new ApiError(errorMessage, response.status, responseData)
    }

    return {
      data: responseData as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    const message = error instanceof Error ? error.message : 'Error de conexión con el servidor'
    throw new ApiError(message, 0, null)
  }
}

export const apiClient = {
  baseURL: API_BASE_URL,

  get: async <T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiClientResponse<T>> => {
    return request<T>(endpoint, {
      method: 'GET',
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
    })
  },

  post: async <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiClientResponse<T>> => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
    })
  },

  put: async <T = unknown>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig
  ): Promise<ApiClientResponse<T>> => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
    })
  },

  delete: async <T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiClientResponse<T>> => {
    return request<T>(endpoint, {
      method: 'DELETE',
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
    })
  },

  downloadFile: async (endpoint: string): Promise<Blob> => {
    const url = buildUrl(endpoint)
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new ApiError(`Error al descargar archivo (${response.status})`, response.status, null)
    }

    return response.blob()
  },
}
