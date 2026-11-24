
import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { FinanceContext } from './FinanceContextValue'
import type { FinanceContextType } from './FinanceContextValue'

import type {
  FinanceData,
  FinanceCategory,
} from '../types/finance'

import type { TransactionInput } from '../services/transactionService'
import type { GoalInput } from '../services/goalService'
import type { SettingsInput } from '../services/settingsService'

import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService'

import { updateBudget } from '../services/budgetService'

import {
  createGoal,
  updateGoal,
  updateGoalSavings,
  deleteGoal,
} from '../services/goalService'

import { updateSettings } from '../services/settingsService'
import * as defaultDataModule from '../data/defaultData'

import {
  validateTransaction,
  validateBudget,
  validateGoal,
  validateSettings,
  validateFinanceData,
} from '../utils/financeValidation'

import { assertValid } from '../utils/validationError'

interface FinanceProviderProps {
  children: ReactNode
}

function isFinanceData(value: unknown): value is FinanceData {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<FinanceData>

  return (
    typeof candidate.profile === 'string' &&
    typeof candidate.currency === 'string' &&
    Array.isArray(candidate.transactions) &&
    Array.isArray(candidate.goals) &&
    typeof candidate.budgets === 'object' &&
    candidate.budgets !== null
  )
}

function getDefaultData(): FinanceData {
  const exportedData = Object.values(defaultDataModule).find(
    value => typeof value === 'function',
  )

  if (!exportedData) {
    throw new Error('Default finance data function was not found.')
  }

  const result: unknown = exportedData()

  if (!isFinanceData(result)) {
    throw new Error('Default finance data is invalid.')
  }

  return result
}

function loadInitialData(): FinanceData {
  const defaults = getDefaultData()

  try {
    const savedData = localStorage.getItem('moneymind-finance-data')

    if (savedData) {
      const parsedData: unknown = JSON.parse(savedData)

      if (isFinanceData(parsedData)) {
        const restoredData = {
          ...defaults,
          ...parsedData,
        }

        const validation = validateFinanceData(restoredData)

        if (validation.valid) {
          return restoredData
        }

        console.warn(
          'Saved finance data failed validation:',
          validation.errors,
        )
      }
    }
  } catch (error) {
    console.error('Failed to load finance data:', error)
  }

  return defaults
}

export function FinanceProvider({ children }: FinanceProviderProps) {
  const [data, setData] = useState<FinanceData>(loadInitialData)

  useEffect(() => {
    try {
      localStorage.setItem(
        'moneymind-finance-data',
        JSON.stringify(data),
      )
    } catch (error) {
      console.error('Failed to save finance data:', error)
    }
  }, [data])

  const addTransaction = useCallback((input: TransactionInput) => {
    assertValid(validateTransaction(input))

    setData(current => ({
      ...current,
      transactions: createTransaction(current.transactions, input),
    }))
  }, [])

  const editTransaction = useCallback(
    (id: number, updates: Partial<TransactionInput>) => {
      setData(current => {
        const existing = current.transactions.find(
          transaction => transaction.id === id,
        )

        if (!existing) {
          throw new Error('Transaction not found.')
        }

        const updatedTransaction = {
          ...existing,
          ...updates,
        }

        assertValid(validateTransaction(updatedTransaction))

        return {
          ...current,
          transactions: updateTransaction(
            current.transactions,
            id,
            updates,
          ),
        }
      })
    },
    [],
  )

  const removeTransaction = useCallback((id: number) => {
    setData(current => ({
      ...current,
      transactions: deleteTransaction(current.transactions, id),
    }))
  }, [])

  const changeBudget = useCallback(
    (category: FinanceCategory, amount: number) => {
      assertValid(validateBudget(amount))

      setData(current => ({
        ...current,
        budgets: updateBudget(current.budgets, category, amount),
      }))
    },
    [],
  )

  const addGoal = useCallback((input: GoalInput) => {
    assertValid(validateGoal(input))

    setData(current => ({
      ...current,
      goals: createGoal(current.goals, input),
    }))
  }, [])

  const editGoal = useCallback(
    (id: number, updates: Partial<GoalInput>) => {
      setData(current => {
        const existing = current.goals.find(goal => goal.id === id)

        if (!existing) {
          throw new Error('Savings goal not found.')
        }

        const updatedGoal = {
          ...existing,
          ...updates,
        }

        assertValid(validateGoal(updatedGoal))

        return {
          ...current,
          goals: updateGoal(current.goals, id, updates),
        }
      })
    },
    [],
  )

  const changeGoalSavings = useCallback((id: number, saved: number) => {
    setData(current => {
      const existing = current.goals.find(goal => goal.id === id)

      if (!existing) {
        throw new Error('Savings goal not found.')
      }

      assertValid(
        validateGoal({
          name: existing.name,
          target: existing.target,
          saved,
        }),
      )

      return {
        ...current,
        goals: updateGoalSavings(current.goals, id, saved),
      }
    })
  }, [])

  const removeGoal = useCallback((id: number) => {
    setData(current => ({
      ...current,
      goals: deleteGoal(current.goals, id),
    }))
  }, [])

  const handleUpdateSettings = useCallback(
    (settings: Partial<SettingsInput>) => {
      assertValid(validateSettings(settings))

      setData(current => updateSettings(current, settings))
    },
    [],
  )

  const resetData = useCallback(() => {
    setData(getDefaultData())
  }, [])

  const contextValue: FinanceContextType = {
    data,
    setData,
    addTransaction,
    editTransaction,
    removeTransaction,
    changeBudget,
    addGoal,
    editGoal,
    changeGoalSavings,
    removeGoal,
    updateSettings: handleUpdateSettings,
    resetData,
  }

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  )
}
