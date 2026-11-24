import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import type { FinanceData, FinanceCategory } from '../types/finance'
import type { TransactionInput } from '../services/transactionService'
import type { GoalInput } from '../services/goalService'
import type { SettingsInput } from '../services/settingsService'

export interface FinanceContextType {
  data: FinanceData
  setData: Dispatch<SetStateAction<FinanceData>>
  addTransaction: (input: TransactionInput) => void
  editTransaction: (id: number, updates: Partial<TransactionInput>) => void
  removeTransaction: (id: number) => void
  changeBudget: (category: FinanceCategory, amount: number) => void
  addGoal: (input: GoalInput) => void
  editGoal: (id: number, updates: Partial<GoalInput>) => void
  changeGoalSavings: (id: number, saved: number) => void
  removeGoal: (id: number) => void
  updateSettings: (settings: Partial<SettingsInput>) => void
  resetData: () => void
}

export const FinanceContext = createContext<FinanceContextType | undefined>(
  undefined,
)