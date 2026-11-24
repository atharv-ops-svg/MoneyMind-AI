
import {
  FINANCE_CATEGORIES,
} from '../types/finance'

import type {
  FinanceData,
} from '../types/finance'

import type {
  TransactionInput,
} from '../services/transactionService'

import type {
  GoalInput,
} from '../services/goalService'

import type {
  SettingsInput,
} from '../services/settingsService'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

function result(errors: string[]): ValidationResult {
  return {
    valid: errors.length === 0,
    errors,
  }
}


function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00`)

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === Number(value.slice(0, 4)) &&
    date.getMonth() + 1 === Number(value.slice(5, 7)) &&
    date.getDate() === Number(value.slice(8, 10))
  )
}


export function validateTransaction(
  input: TransactionInput,
): ValidationResult {
  const errors: string[] = []

  if (!input.title.trim()) {
    errors.push('Transaction title is required.')
  }

  if (
    !FINANCE_CATEGORIES.includes(input.category)
  ) {
    errors.push('Please select a valid transaction category.')
  }

  if (!isValidDate(input.date)) {
    errors.push('Please enter a valid transaction date.')
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    errors.push('Transaction amount must be greater than zero.')
  }

  if (
    input.type !== 'income' &&
    input.type !== 'expense'
  ) {
    errors.push('Please select a valid transaction type.')
  }

  return result(errors)
}

export function validateBudget(
  amount: number,
): ValidationResult {
  const errors: string[] = []

  if (!Number.isFinite(amount) || amount < 0) {
    errors.push('Budget must be a valid non-negative amount.')
  }

  return result(errors)
}

export function validateGoal(
  input: GoalInput,
): ValidationResult {
  const errors: string[] = []

  if (!input.name.trim()) {
    errors.push('Savings goal name is required.')
  }

  if (!Number.isFinite(input.target) || input.target <= 0) {
    errors.push('Goal target must be greater than zero.')
  }

  if (!Number.isFinite(input.saved) || input.saved < 0) {
    errors.push('Saved amount cannot be negative.')
  }

  return result(errors)
}

export function validateSettings(
  settings: Partial<SettingsInput>,
): ValidationResult {
  const errors: string[] = []

  if (
    settings.profile !== undefined &&
    !settings.profile.trim()
  ) {
    errors.push('Profile name cannot be empty.')
  }

  if (
    settings.currency !== undefined &&
    !/^[A-Z]{3}$/.test(settings.currency)
  ) {
    errors.push('Currency must be a three-letter currency code.')
  }

  if (
    settings.theme !== undefined &&
    settings.theme !== 'light' &&
    settings.theme !== 'dark'
  ) {
    errors.push('Please select a valid theme.')
  }

  return result(errors)
}

export function validateFinanceData(
  data: FinanceData,
): ValidationResult {
  const errors: string[] = []

  if (!data.profile.trim()) {
    errors.push('Profile name is missing.')
  }

  if (!/^[A-Z]{3}$/.test(data.currency)) {
    errors.push('Currency code is invalid.')
  }

  if (
    data.theme !== 'light' &&
    data.theme !== 'dark'
  ) {
    errors.push('Theme value is invalid.')
  }

  for (const transaction of data.transactions) {
    const validation = validateTransaction(transaction)

    errors.push(...validation.errors)
  }

  for (const [category, amount] of Object.entries(data.budgets)) {
    if (
      !FINANCE_CATEGORIES.includes(
        category as (typeof FINANCE_CATEGORIES)[number],
      ) ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      errors.push(`Budget for ${category} is invalid.`)
    }
  }

  for (const goal of data.goals) {
    const validation = validateGoal({
      name: goal.name,
      target: goal.target,
      saved: goal.saved,
    })

    errors.push(...validation.errors)
  }

  return result(errors)
}
