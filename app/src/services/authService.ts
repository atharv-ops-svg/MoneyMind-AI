
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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
      throw new Error('Could not securely save your session.')
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

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json()

    if (typeof data.detail === 'string') {
      return data.detail
    }
  } catch {
    // Use the fallback message below.
  }

  return `Request failed (${response.status}). Please try again.`
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, options)

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

  const tokenResponse = await request<TokenResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

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

export async function logoutAccount(): Promise<void> {
  const token = await getToken()

  try {
    if (token) {
      await request<{ message: string }>('/auth/logout', {
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
