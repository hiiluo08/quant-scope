import { useEffect, useReducer } from 'react'
import { ApiError } from '../api/client'

export type ApiState<T> = 
    | { status: 'loading'; retry: () => void }
    | { status: 'error'; error: ApiError; retry: () => void }
    | { status: 'empty'; retry: () => void }
    | { status: 'success'; data: T; retry: () => void }

export function useApi<T>(key: string, request: (signal: AbortSignal) => Promise<T>): ApiState<T> {
    const [version, retry] = useReducer((value: number) => value + 1, 0)
    const [state, setState] = useReducer(
        (_: ApiState<T>, next: ApiState<T>) => next,
        { status: 'loading', retry } as ApiState<T>
    )
    useEffect(() => {
        const controller = new AbortController()
        setState({ status: 'loading', retry })
        request(controller.signal)
            .then((data) => setState({ status: Array.isArray(data) && data.length === 0 ? 'empty' : 'success', ...(Array.isArray(data) && data.length === 0 ? {} : { data }), retry } as ApiState<T>))
            .catch((error: unknown) => {
            if (error instanceof DOMException && error.name === 'AbortError') return
            setState({ status: 'error', error: error instanceof ApiError ? error : new ApiError(0, String(error)), retry })
        })
        return () => controller.abort()
    }, [key, version])
    return state
}
