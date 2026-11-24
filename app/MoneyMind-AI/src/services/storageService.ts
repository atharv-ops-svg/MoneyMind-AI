
import type { FinanceData } from '../types/finance'
import { createDefaultData } from '../data/defaultData'

const STORAGE_KEY = 'moneymind_demo_v1'

/**
 * Loads financial data from LocalStorage.
 * Returns default demo data if no saved data exists.
 */
export function loadFinanceData(): FinanceData {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (!savedData) {
      return createDefaultData()
    }

    const parsedData: unknown = JSON.parse(savedData)

    if (
      typeof parsedData === 'object' &&
      parsedData !== null &&
      'transactions' in parsedData &&
      'budgets' in parsedData &&
      'goals' in parsedData &&
      Array.isArray(parsedData.transactions) &&
      Array.isArray(parsedData.goals)
    ) {
      return parsedData as FinanceData
    }

    return createDefaultData()
  } catch (error) {
    console.error('Failed to load financial data:', error)
    return createDefaultData()
  }
}

/**
 * Saves financial data to LocalStorage.
 */
export function saveFinanceData(data: FinanceData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save financial data:', error)
  }
}

/**
 * Resets financial data to the original demo dataset.
 */
export function resetFinanceData(): FinanceData {
  const defaultData = createDefaultData()

  saveFinanceData(defaultData)

  return defaultData
}
