
import type {
  FinanceCategory,
  FinanceData,
  Transaction,
} from '../types/finance'

export type BudgetStatus = 'safe' | 'warning' | 'exceeded'

export interface BudgetSummary {
  category: FinanceCategory
  budget: number
  spent: number
  remaining: number
  percentage: number
  status: BudgetStatus
}

/**
 * Updates the budget for a specific category.
 */
export function updateBudget(
  budgets: FinanceData['budgets'],
  category: FinanceCategory,
  amount: number,
): FinanceData['budgets'] {
  return {
    ...budgets,
    [category]: Math.max(0, amount),
  }
}

/**
 * Calculates monthly expenses for a category.
 */
export function getCategoryMonthlySpending(
  transactions: Transaction[],
  category: FinanceCategory,
  date = new Date(),
): number {
  return transactions
    .filter((transaction) => {
      const transactionDate = new Date(`${transaction.date}T00:00:00`)

      return (
        transaction.type === 'expense' &&
        transaction.category === category &&
        transactionDate.getMonth() === date.getMonth() &&
        transactionDate.getFullYear() === date.getFullYear()
      )
    })
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calculates the budget status.
 */
export function getBudgetStatus(
  spent: number,
  budget: number,
): BudgetStatus {
  if (spent >= budget && budget > 0) {
    return 'exceeded'
  }

  if (budget > 0 && spent >= budget * 0.8) {
    return 'warning'
  }

  return 'safe'
}

/**
 * Calculates the complete budget summary for a category.
 */
export function getBudgetSummary(
  transactions: Transaction[],
  budgets: FinanceData['budgets'],
  category: FinanceCategory,
  date = new Date(),
): BudgetSummary {
  const budget = budgets[category]
  const spent = getCategoryMonthlySpending(
    transactions,
    category,
    date,
  )

  const percentage =
    budget > 0 ? (spent / budget) * 100 : spent > 0 ? 100 : 0

  return {
    category,
    budget,
    spent,
    remaining: budget - spent,
    percentage,
    status: getBudgetStatus(spent, budget),
  }
}

/**
 * Returns budget summaries for every category.
 */
export function getAllBudgetSummaries(
  transactions: Transaction[],
  budgets: FinanceData['budgets'],
  date = new Date(),
): BudgetSummary[] {
  return (Object.keys(budgets) as FinanceCategory[]).map((category) =>
    getBudgetSummary(transactions, budgets, category, date),
  )
}
