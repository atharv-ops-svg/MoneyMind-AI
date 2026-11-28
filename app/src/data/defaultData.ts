
import type { FinanceData } from '../types/finance'

export function createDefaultData(): FinanceData {
  return {
    profile: '',
    baseCurrency: '',
    currency: '',
    theme: 'light',

    transactions: [],

    budgets: {
      Food: 0,
      Shopping: 0,
      Transport: 0,
      Education: 0,
      Entertainment: 0,
      Other: 0,
    },

    goals: [],
  }
}
