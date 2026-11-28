
import type { FinanceData, Theme } from '../types/finance'
import { getAccessToken } from './authService'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export interface SettingsInput {
  profile: string
  currency: string
  theme: Theme
}

export interface RemoteSettings {
  id: number
  profile: string
  country_code: string
  currency: string
  theme: Theme
}

type RemoteSettingsUpdate = Partial<
  Pick<
    RemoteSettings,
    'profile' | 'country_code' | 'currency' | 'theme'
  >
>

async function settingsRequest<T>(
  method: 'GET' | 'PATCH',
  data?: RemoteSettingsUpdate,
): Promise<T> {
  const token = await getAccessToken()

  if (!token) {
    throw new Error('Please sign in to sync your settings.')
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/settings/`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(data
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      ...(data
        ? { body: JSON.stringify(data) }
        : {}),
    },
  )

  if (!response.ok) {
    let message = 'Unable to sync your settings.'

    try {
      const error = await response.json()

      if (typeof error.detail === 'string') {
        message = error.detail
      } else if (Array.isArray(error.detail)) {
        message = error.detail
          .map((item: { msg?: string }) => item.msg || 'Invalid input.')
          .join(' ')
      }
    } catch {
      // Keep the fallback message.
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function getRemoteSettings(): Promise<RemoteSettings> {
  return settingsRequest<RemoteSettings>('GET')
}

export function saveRemoteSettings(
  settings: RemoteSettingsUpdate,
): Promise<RemoteSettings> {
  return settingsRequest<RemoteSettings>('PATCH', settings)
}

export function updateProfile(
  data: FinanceData,
  profile: string,
): FinanceData {
  return {
    ...data,
    profile: profile.trim() || data.profile,
  }
}

export function updateCurrency(
  data: FinanceData,
  currency: string,
): FinanceData {
  return {
    ...data,
    currency,
  }
}

export function updateTheme(
  data: FinanceData,
  theme: Theme,
): FinanceData {
  return {
    ...data,
    theme,
  }
}

export function updateSettings(
  data: FinanceData,
  settings: Partial<SettingsInput>,
): FinanceData {
  return {
    ...data,
    ...settings,
    profile: settings.profile?.trim() || data.profile,
  }
}
