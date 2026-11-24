
import type { SavingsGoal } from '../types/finance'

export interface GoalInput {
  name: string
  target: number
  saved: number
}

export interface GoalProgress {
  goal: SavingsGoal
  percentage: number
  remaining: number
  completed: boolean
}

/**
 * Creates a new savings goal.
 */
export function createGoal(
  goals: SavingsGoal[],
  input: GoalInput,
): SavingsGoal[] {
  const newGoal: SavingsGoal = {
    id: Date.now(),
    name: input.name.trim(),
    target: input.target,
    saved: input.saved,
  }

  return [...goals, newGoal]
}

/**
 * Updates an existing savings goal.
 */
export function updateGoal(
  goals: SavingsGoal[],
  id: number,
  updates: Partial<GoalInput>,
): SavingsGoal[] {
  return goals.map((goal) =>
    goal.id === id
      ? {
          ...goal,
          ...updates,
          name: updates.name?.trim() ?? goal.name,
        }
      : goal,
  )
}

/**
 * Updates the saved amount of a goal.
 */
export function updateGoalSavings(
  goals: SavingsGoal[],
  id: number,
  saved: number,
): SavingsGoal[] {
  return goals.map((goal) =>
    goal.id === id
      ? { ...goal, saved: Math.max(0, saved) }
      : goal,
  )
}

/**
 * Deletes a savings goal.
 */
export function deleteGoal(
  goals: SavingsGoal[],
  id: number,
): SavingsGoal[] {
  return goals.filter((goal) => goal.id !== id)
}

/**
 * Calculates the progress of a savings goal.
 */
export function getGoalProgress(
  goal: SavingsGoal,
): GoalProgress {
  const percentage =
    goal.target > 0
      ? Math.min((goal.saved / goal.target) * 100, 100)
      : 0

  return {
    goal,
    percentage,
    remaining: Math.max(goal.target - goal.saved, 0),
    completed: goal.target > 0 && goal.saved >= goal.target,
  }
}

/**
 * Calculates progress for all savings goals.
 */
export function getAllGoalProgress(
  goals: SavingsGoal[],
): GoalProgress[] {
  return goals.map(getGoalProgress)
}
