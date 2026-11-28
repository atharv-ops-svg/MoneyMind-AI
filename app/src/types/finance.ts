
export type TransactionType = 'income' | 'expense'

export type Theme = 'light' | 'dark'

export const FINANCE_CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Education',
  'Entertainment',
  'Other',
] as const

export type FinanceCategory =
  (typeof FINANCE_CATEGORIES)[number]

export interface Transaction {
  id: number
  title: string
  category: FinanceCategory
  date: string
  amount: number
  type: TransactionType
}

export interface SavingsGoal {
  id: number
  name: string
  target: number
  saved: number
}

export interface FinanceData {
  profile: string

  // Currency in which financial amounts are actually stored.
  baseCurrency: string

  // Currency selected for displaying financial amounts.
  currency: string

  theme: Theme
  transactions: Transaction[]
  budgets: Record<FinanceCategory, number>
  goals: SavingsGoal[]
}
