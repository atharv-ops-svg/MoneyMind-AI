
import type { FinanceData, Theme } from '../types/finance'

export interface SettingsInput {
  profile: string
  currency: string
  theme: Theme
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
