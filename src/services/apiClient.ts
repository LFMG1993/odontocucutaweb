const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export type ResponseType = 'json' | 'text' | 'blob'

export interface RequestConfig {
  params?: Record<string, string | number | boolean | undefined | null>
  headers?: Record<string, string>
  signal?: AbortSignal
  /** Formato esperado del cuerpo de respuesta. Por defecto `json`. */
  responseType?: ResponseType
  /**
   * Evita la redirección automática al login cuando la petición devuelve 401.
   * Útil en endpoints públicos (login, 2FA, recuperación de contraseña) donde
   * un 401 es un error de negocio y no una sesión expirada.
   */
  skipAuthRedirect?: boolean
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

type InternalRequestOptions = RequestInit & {
  params?: RequestConfig['params']
  responseType?: ResponseType
  skipAuthRedirect?: boolean
}

function extractErrorMessage(payload: unknown, status: number, statusText: string): string {
  if (payload && typeof payload === 'object') {
    const data = payload as { error?: string; message?: string }
    if (data.error) return data.error
    if (data.message) return data.message
  }
  return `Error HTTP ${status}: ${statusText}`
}

async function readErrorPayload(response: Response, responseType: ResponseType): Promise<unknown> {
  const contentType = response.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      return await response.json()
    }
    if (responseType === 'blob' || contentType.includes('application/pdf') || contentType.startsWith('image/')) {
      return null
    }
    return await response.text()
  } catch {
    return null
  }
}

async function request<T>(
  endpoint: string,
  options: InternalRequestOptions = {}
): Promise<ApiClientResponse<T>> {
  const {
    params,
    headers = {},
    responseType = 'json',
    skipAuthRedirect = false,
    ...customConfig
  } = options

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

    if (response.status === 401 && !skipAuthRedirect) {
      const path = window.location.pathname
      if (!path.startsWith('/login') && !path.startsWith('/profesionales/login')) {
        window.location.href = '/login'
      }
    }

    if (!response.ok) {
      const payload = await readErrorPayload(response, responseType)
      throw new ApiError(extractErrorMessage(payload, response.status, response.statusText), response.status, payload)
    }

    if (response.status === 204) {
      return {
        data: null as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    }

    if (responseType === 'blob') {
      const blob = await response.blob()
      return {
        data: blob as T,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    }

    let responseData: unknown = null
    const contentType = response.headers.get('content-type')
    if (responseType === 'text' || (contentType && !contentType.includes('application/json'))) {
      responseData = await response.text()
    } else {
      responseData = await response.json()
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
      responseType: config?.responseType,
      skipAuthRedirect: config?.skipAuthRedirect,
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
      responseType: config?.responseType,
      skipAuthRedirect: config?.skipAuthRedirect,
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
      responseType: config?.responseType,
      skipAuthRedirect: config?.skipAuthRedirect,
    })
  },

  delete: async <T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiClientResponse<T>> => {
    return request<T>(endpoint, {
      method: 'DELETE',
      params: config?.params,
      headers: config?.headers,
      signal: config?.signal,
      responseType: config?.responseType,
      skipAuthRedirect: config?.skipAuthRedirect,
    })
  },

  downloadFile: async (endpoint: string, params?: RequestConfig['params']): Promise<Blob> => {
    const res = await request<Blob>(endpoint, {
      method: 'GET',
      params,
      responseType: 'blob',
    })
    return res.data
  },
}
