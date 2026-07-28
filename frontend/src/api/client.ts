export class ApiError extends Error {
    public readonly status: number
    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, { signal })
    if (!response.ok) {
        let message: string = `Request failed with HTTP ${response.status}`
        try { message = (await response.json()).detail ?? message } catch { }
        throw new ApiError(response.status, message)
    }
    return response.json() as Promise<T>
}