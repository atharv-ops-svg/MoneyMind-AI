
import type { CurrencyOption } from '../data/currencies'

const API_URL = 'https://open.er-api.com/v6/latest'
const CACHE_PREFIX = 'moneymind-exchange-rates-'
const CACHE_DURATION = 6 * 60 * 60 * 1000

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  updatedAt: number
}

interface ExchangeApiResponse {
  result: string
  base_code: string
  rates: Record<string, number>
  time_last_update_unix?: number
}

function getCache(base: string): ExchangeRates | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${base}`)
    if (!raw) return null

    const cached = JSON.parse(raw) as ExchangeRates
    return cached?.base === base && cached.rates ? cached : null
  } catch {
    return null
  }
}

function saveCache(data: ExchangeRates): void {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${data.base}`,
      JSON.stringify(data),
    )
  } catch {
    // Caching is optional.
  }
}

export async function getExchangeRates(
  baseCurrency: string,
  forceRefresh = false,
): Promise<ExchangeRates> {
  const base = baseCurrency.toUpperCase()
  const cached = getCache(base)

  if (
    !forceRefresh &&
    cached &&
    Date.now() - cached.updatedAt < CACHE_DURATION
  ) {
    return cached
  }

  try {
    const response = await fetch(
      `${API_URL}/${encodeURIComponent(base)}`,
    )

    if (!response.ok) {
      throw new Error('Exchange-rate service is unavailable.')
    }

    const result = (await response.json()) as ExchangeApiResponse

    if (
      result.result !== 'success' ||
      result.base_code !== base ||
      !result.rates
    ) {
      throw new Error('Invalid exchange-rate response.')
    }

    const rates: ExchangeRates = {
      base,
      rates: result.rates,
      updatedAt: result.time_last_update_unix
        ? result.time_last_update_unix * 1000
        : Date.now(),
    }

    saveCache(rates)
    return rates
  } catch (error) {
    if (cached) return cached
    throw error
  }
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates,
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  if (rates.base !== fromCurrency) {
    throw new Error(
      `Exchange rates use ${rates.base}, not ${fromCurrency}.`,
    )
  }

  const rate = rates.rates[toCurrency]

  if (
    rate === undefined ||
    !Number.isFinite(rate) ||
    rate <= 0
  ) {
    throw new Error(`Exchange rate unavailable for ${toCurrency}.`)
  }

  return amount * rate
}

export function convertToBaseCurrency(
  amount: number,
  inputCurrency: string,
  baseCurrency: string,
  rates: ExchangeRates,
): number {
  if (inputCurrency === baseCurrency) {
    return amount
  }

  if (rates.base !== baseCurrency) {
    throw new Error(
      `Exchange rates use ${rates.base}, not ${baseCurrency}.`,
    )
  }

  const inputRate = rates.rates[inputCurrency]

  if (
    inputRate === undefined ||
    !Number.isFinite(inputRate) ||
    inputRate <= 0
  ) {
    throw new Error(`Exchange rate unavailable for ${inputCurrency}.`)
  }

  return amount / inputRate
}

export function formatCurrency(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

export function getCurrencyLabel(
  currency: CurrencyOption,
): string {
  return `${currency.code} — ${currency.name} (${currency.symbol})`
}
