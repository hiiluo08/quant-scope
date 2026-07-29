export class ApiError extends Error {
  public readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, { signal })
  const contentType = response.headers.get('content-type')
  const isJson = Boolean(contentType && contentType.includes('application/json'))

  if (!response.ok) {
    let message = `Request failed with HTTP ${response.status}`
    if (isJson) {
      try {
        const body = await response.json()
        message = body.detail ?? message
      } catch { /* retain default message */ }
    }
    throw new ApiError(response.status, message)
  }

  if (!isJson) {
    throw new ApiError(
      response.status,
      `Expected JSON from API but received HTML/non-JSON content (${contentType ?? 'unknown'}). Check if backend is running on ${BASE_URL}.`,
    )
  }

  return response.json() as Promise<T>
}