
import type { FinanceData } from '../types/finance'

import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getMonthlySavings,
} from '../utils/financeCalculations'

import { getAllBudgetSummaries } from './budgetService'

export interface AssistantResponse {
  message: string
  suggestions: string[]
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

/**
 * Generates a rule-based response to a financial question.
 */
export function generateAssistantResponse(
  question: string,
  data: FinanceData,
): AssistantResponse {
  const query = question.trim().toLowerCase()
  const currency = data.currency

  const income = getTotalIncome(data.transactions)
  const expenses = getTotalExpenses(data.transactions)
  const balance = getBalance(data.transactions)
  const savings = getMonthlySavings(data.transactions)

  const budgets = getAllBudgetSummaries(
    data.transactions,
    data.budgets,
  )

  if (!query) {
    return {
      message: 'Please enter a question so I can help you.',
      suggestions: [
        'Show my balance',
        'Analyze my expenses',
        'How can I save money?',
      ],
    }
  }

  if (
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('hey')
  ) {
    return {
      message:
        'Hello! I am MoneyMind AI, your financial management assistant. How can I help you today?',
      suggestions: [
        'Show my balance',
        'Analyze my expenses',
        'Check my budgets',
      ],
    }
  }

  if (
    query.includes('expense') ||
    query.includes('spending') ||
    query.includes('spent')
  ) {
    return {
      message:
        `Your recorded total expenses are ${formatMoney(expenses, currency)}. ` +
        `Your total recorded income is ${formatMoney(income, currency)}. ` +
        `Your monthly savings are ${formatMoney(savings, currency)}.`,
      suggestions: [
        'Show my balance',
        'Which budget needs attention?',
        'How can I save money?',
      ],
    }
  }

  if (
    query.includes('budget') ||
    query.includes('limit')
  ) {
    const attentionBudgets = budgets.filter(
      (budget) => budget.status !== 'safe',
    )

    if (attentionBudgets.length === 0) {
      return {
        message:
          'All your category budgets are currently below the warning threshold. Keep monitoring your spending.',
        suggestions: [
          'Analyze my expenses',
          'Show my balance',
        ],
      }
    }

    const details = attentionBudgets
      .map(
        (budget) =>
          `${budget.category}: ${formatMoney(budget.spent, currency)} spent out of ${formatMoney(budget.budget, currency)} (${budget.percentage.toFixed(1)}%)`,
      )
      .join('; ')

    return {
      message: `These budgets need attention: ${details}.`,
      suggestions: [
        'How can I reduce my spending?',
        'Show my balance',
      ],
    }
  }

  if (
    query.includes('saving') ||
    query.includes('save money')
  ) {
    return {
      message:
        `Your current-month recorded savings are ${formatMoney(savings, currency)}. ` +
        'Consider setting a realistic spending limit, reviewing non-essential purchases, and saving a portion of any income you receive.',
      suggestions: [
        'Show my monthly summary',
        'Check my budgets',
      ],
    }
  }

  if (
    query.includes('month') ||
    query.includes('analysis') ||
    query.includes('report')
  ) {
    return {
      message:
        `Your current-month summary: income ${formatMoney(
          getTotalIncome(
            data.transactions.filter((transaction) => {
              const date = new Date(`${transaction.date}T00:00:00`)
              const now = new Date()

              return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear() &&
                transaction.type === 'income'
              )
            }),
          ),
          currency,
        )}, expenses ${formatMoney(
          data.transactions
            .filter((transaction) => {
              const date = new Date(`${transaction.date}T00:00:00`)
              const now = new Date()

              return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear() &&
                transaction.type === 'expense'
              )
            })
            .reduce((total, transaction) => total + transaction.amount, 0),
          currency,
        )}, and savings ${formatMoney(savings, currency)}.`,
      suggestions: [
        'Check my budgets',
        'How can I save money?',
      ],
    }
  }

  if (
    query.includes('income') ||
    query.includes('balance') ||
    query.includes('money')
  ) {
    return {
      message:
        `Your total recorded income is ${formatMoney(income, currency)}. ` +
        `Your total recorded expenses are ${formatMoney(expenses, currency)}. ` +
        `Your current recorded balance is ${formatMoney(balance, currency)}.`,
      suggestions: [
        'Analyze my expenses',
        'Show my monthly summary',
      ],
    }
  }

  return {
    message:
      'I can help you understand your income, expenses, budgets, savings, and financial summaries. Please try asking a more specific financial question.',
    suggestions: [
      'Show my balance',
      'Analyze my expenses',
      'Check my budgets',
      'How can I save money?',
    ],
  }
}
