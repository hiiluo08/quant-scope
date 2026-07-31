export function readStringParam(search: string, key: string, fallback: string): string {
  const params = new URLSearchParams(search)
  return params.get(key) ?? fallback
}

export function writeStringParam(search: string, key: string, value: string): string {
  const params = new URLSearchParams(search)
  if (!value) {
    params.delete(key)
  } else {
    params.set(key, value)
  }
  const stringified = params.toString()
  return stringified ? `?${stringified}` : ''
}
