
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export interface AuthUser {
  id: number
  email: string
  is_active: boolean
}

interface TokenResponse {
  access_token: string
  token_type: string
}

const TOKEN_KEY = 'moneymind_auth_token'

async function getToken(): Promise<string | null> {
  if (window.electronAPI?.auth) {
    return window.electronAPI.auth.getToken()
  }

  return localStorage.getItem(TOKEN_KEY)
}

async function saveToken(token: string): Promise<void> {
  if (window.electronAPI?.auth) {
    const saved = await window.electronAPI.auth.setToken(token)

    if (!saved) {
      throw new Error('Unable to securely save your login session.')
    }

    return
  }

  localStorage.setItem(TOKEN_KEY, token)
}

async function removeToken(): Promise<void> {
  if (window.electronAPI?.auth) {
    await window.electronAPI.auth.clearToken()
    return
  }

  localStorage.removeItem(TOKEN_KEY)
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const error = await response.json()

    if (typeof error.detail === 'string') {
      return error.detail
    }

    if (Array.isArray(error.detail)) {
      return error.detail
        .map((item: { msg?: string }) => item.msg || 'Invalid input.')
        .join(' ')
    }

    if (typeof error.message === 'string') {
      return error.message
    }
  } catch {
    // Use the fallback message if the response is not JSON.
  }

  return `Request failed (${response.status}). Please try again.`
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch(
      `${API_BASE_URL}/api/v1${endpoint}`,
      options,
    )
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not connect to the API at ${API_BASE_URL}. Make sure the backend is running.`,
      )
    }

    throw error
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response.json() as Promise<T>
}

export async function registerAccount(
  name: string,
  email: string,
  password: string,
  countryCode: string,
  currency: string,
): Promise<AuthUser> {
  return request<AuthUser>('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      country_code: countryCode,
      currency,
    }),
  })
}

export async function loginAccount(
  email: string,
  password: string,
): Promise<AuthUser> {
  const formData = new URLSearchParams()

  formData.set('username', email)
  formData.set('password', password)

  const tokenResponse = await request<TokenResponse>(
    '/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    },
  )

  await saveToken(tokenResponse.access_token)

  return getCurrentUser()
}

export async function getCurrentUser(): Promise<AuthUser> {
  const token = await getToken()

  if (!token) {
    throw new Error('No active session.')
  }

  return request<AuthUser>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAccessToken(): Promise<string | null> {
  return getToken()
}

export async function logoutAccount(): Promise<void> {
  const token = await getToken()

  try {
    if (token) {
      await request('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
  } finally {
    await removeToken()
  }
}

export async function restoreSession(): Promise<AuthUser | null> {
  const token = await getToken()

  if (!token) {
    return null
  }

  try {
    return await getCurrentUser()
  } catch {
    await removeToken()
    return null
  }
}
