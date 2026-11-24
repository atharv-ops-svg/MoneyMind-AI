
import type { FinanceCategory, Transaction } from '../types/finance'

export interface MonthlyReport {
  month: string
  income: number
  expenses: number
  savings: number
}

export interface CategoryReport {
  category: FinanceCategory
  amount: number
  percentage: number
}

export interface ReportSummary {
  totalIncome: number
  totalExpenses: number
  savings: number
  savingsRate: number
}

/**
 * Returns transactions for a selected month.
 * Month uses JavaScript's 0-based numbering (January = 0).
 */
export function getTransactionsForMonth(
  transactions: Transaction[],
  year: number,
  month: number,
): Transaction[] {
  return transactions.filter((transaction) => {
    const date = new Date(`${transaction.date}T00:00:00`)

    return (
      date.getFullYear() === year &&
      date.getMonth() === month
    )
  })
}

/**
 * Generates a report for a selected month.
 */
export function generateMonthlyReport(
  transactions: Transaction[],
  year: number,
  month: number,
): MonthlyReport {
  const monthlyTransactions = getTransactionsForMonth(
    transactions,
    year,
    month,
  )

  const income = monthlyTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0)

  const expenses = monthlyTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0)

  return {
    month: new Date(year, month, 1).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    }),
    income,
    expenses,
    savings: income - expenses,
  }
}

/**
 * Generates reports for the latest six months.
 */
export function generateMonthlyTrends(
  transactions: Transaction[],
  numberOfMonths = 6,
  referenceDate = new Date(),
): MonthlyReport[] {
  const reports: MonthlyReport[] = []

  for (let i = numberOfMonths - 1; i >= 0; i--) {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - i,
      1,
    )

    reports.push(
      generateMonthlyReport(
        transactions,
        date.getFullYear(),
        date.getMonth(),
      ),
    )
  }

  return reports
}

/**
 * Calculates expenses grouped by category for a selected month.
 */
export function generateCategoryReport(
  transactions: Transaction[],
  year: number,
  month: number,
): CategoryReport[] {
  const monthlyExpenses = getTransactionsForMonth(
    transactions,
    year,
    month,
  ).filter((transaction) => transaction.type === 'expense')

  const totals = monthlyExpenses.reduce<
    Partial<Record<FinanceCategory, number>>
  >((result, transaction) => {
    result[transaction.category] =
      (result[transaction.category] ?? 0) + transaction.amount

    return result
  }, {})

  const totalExpenses = monthlyExpenses.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  )

  return Object.entries(totals).map(([category, amount]) => ({
    category: category as FinanceCategory,
    amount: amount ?? 0,
    percentage:
      totalExpenses > 0 ? ((amount ?? 0) / totalExpenses) * 100 : 0,
  }))
}

/**
 * Generates a financial summary for a selected month.
 */
export function generateReportSummary(
  transactions: Transaction[],
  year: number,
  month: number,
): ReportSummary {
  const report = generateMonthlyReport(transactions, year, month)

  return {
    totalIncome: report.income,
    totalExpenses: report.expenses,
    savings: report.savings,
    savingsRate:
      report.income > 0
        ? (report.savings / report.income) * 100
        : 0,
  }
}
