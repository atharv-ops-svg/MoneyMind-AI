
import type { Transaction, TransactionType } from '../types/finance'

export interface TransactionInput {
  title: string
  category: Transaction['category']
  date: string
  amount: number
  type: TransactionType
}

/**
 * Creates a new transaction.
 */
export function createTransaction(
  transactions: Transaction[],
  input: TransactionInput,
): Transaction[] {
  const newTransaction: Transaction = {
    id: Date.now(),
    ...input,
  }

  return [newTransaction, ...transactions]
}

/**
 * Updates an existing transaction.
 */
export function updateTransaction(
  transactions: Transaction[],
  id: number,
  updates: Partial<TransactionInput>,
): Transaction[] {
  return transactions.map((transaction) =>
    transaction.id === id
      ? { ...transaction, ...updates }
      : transaction,
  )
}

/**
 * Deletes a transaction.
 */
export function deleteTransaction(
  transactions: Transaction[],
  id: number,
): Transaction[] {
  return transactions.filter((transaction) => transaction.id !== id)
}

/**
 * Searches transactions by title, category, or type.
 */
export function searchTransactions(
  transactions: Transaction[],
  searchTerm: string,
): Transaction[] {
  const query = searchTerm.trim().toLowerCase()

  if (!query) {
    return transactions
  }

  return transactions.filter((transaction) =>
    [
      transaction.title,
      transaction.category,
      transaction.type,
    ].some((value) => value.toLowerCase().includes(query)),
  )
}

/**
 * Filters transactions by income or expense.
 */
export function filterTransactionsByType(
  transactions: Transaction[],
  type: TransactionType | 'all',
): Transaction[] {
  if (type === 'all') {
    return transactions
  }

  return transactions.filter((transaction) => transaction.type === type)
}

/**
 * Sorts transactions by date.
 */
export function sortTransactionsByDate(
  transactions: Transaction[],
  order: 'newest' | 'oldest' = 'newest',
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(`${a.date}T00:00:00`).getTime()
    const dateB = new Date(`${b.date}T00:00:00`).getTime()

    return order === 'newest' ? dateB - dateA : dateA - dateB
  })
}
