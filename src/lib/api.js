import { API_BASE_URL } from './config.js'
import { clearToken, getToken } from './auth.js'

export async function api(path, opts = {}) {
  const url = API_BASE_URL.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)

  const method = opts.method || 'GET'
  const body = opts.body
  const auth = opts.auth !== false

  const headers = Object.assign({}, opts.headers || {})

  if (auth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
  }

  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body)
  })

  let data = null
  try {
    data = await res.json()
  } catch {

  }

  if (!res.ok) {
    const code = data?.code
    const message = data?.message || res.statusText || 'Request error'

    if (res.status === 401 && (code === 'USER_BLOCKED' || code === 'USER_DELETED' || code === 'INVALID_TOKEN')) {
      clearToken()
      window.location.href = '/login'  
    }

    const err = new Error(message)
    err.status = res.status
    err.code = code
    throw err
  }

  return data
}
