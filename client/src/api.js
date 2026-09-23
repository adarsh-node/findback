const apiBaseUrl = '/api'

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      ...(!isFormData && options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(payload.message || 'Something went wrong.')
    error.fields = payload.errors || []
    throw error
  }

  return payload
}