import { renderHook, waitFor } from '@testing-library/react'
import { expect, it } from 'vitest'
import { useApi } from './useApi'

it('exposes an ApiError response instead of throwing into the page', async () => {
  const request = async () => { throw new Error('network unavailable') }
  const { result } = renderHook(() => useApi('health', request))
  await waitFor(() => expect(result.current.status).toBe('error'))
  if (result.current.status === 'error') {
    expect(result.current.error.message).toContain('network unavailable')
  }
})