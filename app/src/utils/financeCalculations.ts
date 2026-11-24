
import type { Transaction } from '../types/finance'

/**
 * Calculates total income from transactions.
 */
export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calculates total expenses from transactions.
 */
export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

/**
 * Calculates the current balance.
 */
export function getBalance(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpenses(transactions)
}

/**
 * Returns transactions from the current month.
 */
export function getCurrentMonthTransactions(
  transactions: Transaction[],
): Transaction[] {
  const now = new Date()

  return transactions.filter((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`)

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  })
}

/**
 * Calculates savings for the current month.
 */
export function getMonthlySavings(
  transactions: Transaction[],
): number {
  const monthlyTransactions = getCurrentMonthTransactions(transactions)

  return (
    getTotalIncome(monthlyTransactions) -
    getTotalExpenses(monthlyTransactions)
  )
}

/**
 * Returns the most recent transactions.
 */
export function getRecentTransactions(
  transactions: Transaction[],
  limit = 5,
): Transaction[] {
  return [...transactions]
    .sort(
      (a, b) =>
        new Date(`${b.date}T00:00:00`).getTime() -
        new Date(`${a.date}T00:00:00`).getTime(),
    )
    .slice(0, limit)
}

/**
 * Calculates expenses grouped by category for the current month.
 */
export function getCategoryExpenses(
  transactions: Transaction[],
): Record<string, number> {
  const monthlyExpenses = getCurrentMonthTransactions(transactions)
    .filter((transaction) => transaction.type === 'expense')

  return monthlyExpenses.reduce<Record<string, number>>(
    (totals, transaction) => {
      totals[transaction.category] =
        (totals[transaction.category] ?? 0) + transaction.amount

      return totals
    },
    {},
  )
}
