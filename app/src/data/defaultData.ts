
import type { FinanceData } from '../types/finance'

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function createDefaultData(): FinanceData {
  const today = getToday()

  return {
    profile: 'MoneyMind User',
    currency: 'INR',
    theme: 'light',

    transactions: [
      {
        id: 1,
        title: 'Monthly Allowance',
        category: 'Other',
        date: today,
        amount: 12000,
        type: 'income',
      },
      {
        id: 2,
        title: 'School Supplies',
        category: 'Education',
        date: today,
        amount: 1200,
        type: 'expense',
      },
      {
        id: 3,
        title: 'Lunch',
        category: 'Food',
        date: today,
        amount: 450,
        type: 'expense',
      },
      {
        id: 4,
        title: 'Bus Pass',
        category: 'Transport',
        date: today,
        amount: 700,
        type: 'expense',
      },
      {
        id: 5,
        title: 'Online Course',
        category: 'Education',
        date: today,
        amount: 900,
        type: 'expense',
      },
      {
        id: 6,
        title: 'Gift Received',
        category: 'Other',
        date: today,
        amount: 2500,
        type: 'income',
      },
      {
        id: 7,
        title: 'Books',
        category: 'Education',
        date: today,
        amount: 650,
        type: 'expense',
      },
      {
        id: 8,
        title: 'Snacks',
        category: 'Food',
        date: today,
        amount: 300,
        type: 'expense',
      },
      {
        id: 9,
        title: 'Movie',
        category: 'Entertainment',
        date: today,
        amount: 500,
        type: 'expense',
      },
      {
        id: 10,
        title: 'Clothes',
        category: 'Shopping',
        date: today,
        amount: 1500,
        type: 'expense',
      },
    ],

    budgets: {
      Food: 3000,
      Shopping: 4000,
      Transport: 2000,
      Education: 3000,
      Entertainment: 1500,
      Other: 2000,
    },

    goals: [
      {
        id: 1,
        name: 'New Bicycle',
        target: 12000,
        saved: 4500,
      },
      {
        id: 2,
        name: 'New Laptop',
        target: 50000,
        saved: 15000,
      },
      {
        id: 3,
        name: 'Emergency Savings',
        target: 10000,
        saved: 3000,
      },
    ],
  }
}
