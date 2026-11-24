
import { useMemo, useState } from 'react'
import {
  Bot,
  Pencil,
  Plus,
  Send,
  Trash2,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts'

import { useFinance } from '../context/useFinance'
import {
  FINANCE_CATEGORIES,
  type FinanceCategory,
  type Transaction,
} from '../types/finance'

import type { TransactionInput } from '../services/transactionService'
import {
  filterTransactionsByType,
  searchTransactions,
  sortTransactionsByDate,
} from '../services/transactionService'

import {
  getAllBudgetSummaries,
} from '../services/budgetService'

import {
  getAllGoalProgress,
} from '../services/goalService'

import {
  generateMonthlyTrends,
  generateCategoryReport,
} from '../services/reportService'

import {
  generateAssistantResponse,
} from '../services/assistantService'

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString('en-IN')}`
  }
}

function displayDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function PageHeading({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="section-intro">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* TRANSACTIONS                                                               */
/* -------------------------------------------------------------------------- */

const emptyTransaction: TransactionInput = {
  title: '',
  category: 'Other',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  type: 'expense',
}

export function TransactionsPage() {
  const {
    data,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useFinance()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TransactionInput>(emptyTransaction)

  const transactions = useMemo(() => {
    const searched = searchTransactions(data.transactions, search)
    const filtered = filterTransactionsByType(searched, typeFilter)
    return sortTransactionsByDate(filtered, 'newest')
  }, [data.transactions, search, typeFilter])

  function startNewTransaction() {
    setEditingId(null)
    setForm({
      ...emptyTransaction,
      date: new Date().toISOString().slice(0, 10),
    })
    setShowForm(true)
  }

  function startEditing(transaction: Transaction) {
    setEditingId(transaction.id)
    setForm({
      title: transaction.title,
      category: transaction.category,
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
    })
    setShowForm(true)
  }

  function submitTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const input = {
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
    }

    if (!input.title || !Number.isFinite(input.amount) || input.amount <= 0) {
      window.alert('Enter a title and an amount greater than zero.')
      return
    }

    try {
      if (editingId !== null) {
        editTransaction(editingId, input)
      } else {
        addTransaction(input)
      }

      setShowForm(false)
      setEditingId(null)
      setForm(emptyTransaction)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to save transaction.')
    }
  }

  function deleteTransaction(id: number) {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(id)
    }
  }

  const income = data.transactions
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)

  const expenses = data.transactions
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="page active">
      <PageHeading
        title="Transactions"
        description="Manage and review all your recorded financial activity."
        action={
          <button className="primary-btn" onClick={startNewTransaction}>
            <Plus size={16} /> Add Transaction
          </button>
        }
      />

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">Total Transactions</div>
          <div className="stat-value">{data.transactions.length}</div>
          <div className="stat-foot muted">All recorded entries</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Total Income</div>
          <div className="stat-value">{money(income, data.currency)}</div>
          <div className="stat-foot muted">Recorded income</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Total Expenses</div>
          <div className="stat-value">{money(expenses, data.currency)}</div>
          <div className="stat-foot muted">Recorded expenses</div>
        </article>
      </div>

      {showForm && (
        <form className="panel" onSubmit={submitTransaction}>
          <div className="panel-head">
            <div>
              <h3>{editingId === null ? 'Add Transaction' : 'Edit Transaction'}</h3>
              <p>Enter the transaction details below.</p>
            </div>
          </div>

          <div className="form-two">
            <label>
              Transaction title
              <input
                value={form.title}
                onChange={event => setForm({ ...form, title: event.target.value })}
                placeholder="e.g. Books"
                required
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount || ''}
                onChange={event => setForm({ ...form, amount: Number(event.target.value) })}
                required
              />
            </label>

            <label>
              Type
              <select
                value={form.type}
                onChange={event => setForm({
                  ...form,
                  type: event.target.value as TransactionInput['type'],
                })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={event => setForm({
                  ...form,
                  category: event.target.value as FinanceCategory,
                })}
              >
                {FINANCE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={event => setForm({ ...form, date: event.target.value })}
                required
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="soft-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editingId === null ? 'Save Transaction' : 'Update Transaction'}
            </button>
          </div>
        </form>
      )}

      <section className="panel">
        <div className="toolbar">
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search transactions..."
            aria-label="Search transactions"
          />

          <select
            value={typeFilter}
            onChange={event => setTypeFilter(event.target.value as typeof typeFilter)}
            aria-label="Filter by transaction type"
          >
            <option value="all">All transactions</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>{transaction.category}</td>
                  <td>{displayDate(transaction.date)}</td>
                  <td>{transaction.type}</td>
                  <td className={transaction.type === 'income' ? 'income-text' : 'expense-text'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {money(transaction.amount, data.currency)}
                  </td>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => startEditing(transaction)}
                      aria-label={`Edit ${transaction.title}`}
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="text-btn"
                      onClick={() => deleteTransaction(transaction.id)}
                      aria-label={`Delete ${transaction.title}`}
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6}>No matching transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* BUDGETS                                                                    */
/* -------------------------------------------------------------------------- */

export function BudgetsPage() {
  const { data, changeBudget } = useFinance()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const summaries = getAllBudgetSummaries(data.transactions, data.budgets)

  function saveBudget(category: FinanceCategory) {
    const amount = Number(drafts[category] ?? data.budgets[category])

    if (!Number.isFinite(amount) || amount < 0) {
      window.alert('Enter a valid budget amount.')
      return
    }

    try {
      changeBudget(category, amount)
      setDrafts(current => {
        const next = { ...current }
        delete next[category]
        return next
      })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to update budget.')
    }
  }

  const totalBudget = summaries.reduce((sum, item) => sum + item.budget, 0)
  const totalSpent = summaries.reduce((sum, item) => sum + item.spent, 0)

  return (
    <div className="page active">
      <PageHeading
        title="Budget Management"
        description="Set monthly spending limits and monitor your category expenses."
      />

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">Total Budget</div>
          <div className="stat-value">{money(totalBudget, data.currency)}</div>
          <div className="stat-foot muted">Across all categories</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Total Spent</div>
          <div className="stat-value">{money(totalSpent, data.currency)}</div>
          <div className="stat-foot muted">This month</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Remaining</div>
          <div className="stat-value">{money(totalBudget - totalSpent, data.currency)}</div>
          <div className="stat-foot muted">Budget minus spending</div>
        </article>
      </div>

      <div className="budget-grid">
        {summaries.map(item => {
          const percentage = item.budget > 0
            ? Math.min(item.percentage, 100)
            : 0

          return (
            <article className="budget-card" key={item.category}>
              <div className="panel-head">
                <div>
                  <h3>{item.category}</h3>
                  <p>
                    {item.status === 'exceeded'
                      ? 'Budget exceeded'
                      : item.status === 'warning'
                        ? 'Approaching limit'
                        : 'Within budget'}
                  </p>
                </div>
                <span>{item.percentage.toFixed(0)}%</span>
              </div>

              <div className="stat-value">
                {money(item.spent, data.currency)}
              </div>
              <p className="muted">
                of {money(item.budget, data.currency)}
              </p>

              <div
                style={{
                  height: 8,
                  background: 'var(--line)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  margin: '14px 0',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: item.status === 'exceeded'
                      ? 'var(--coral)'
                      : item.status === 'warning'
                        ? '#e5ae55'
                        : 'var(--green)',
                    borderRadius: 20,
                  }}
                />
              </div>

              <p className="muted">
                {item.remaining >= 0
                  ? `${money(item.remaining, data.currency)} remaining`
                  : `${money(Math.abs(item.remaining), data.currency)} over budget`}
              </p>

              <label>
                Monthly budget
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={drafts[item.category] ?? String(item.budget)}
                  onChange={event => setDrafts(current => ({
                    ...current,
                    [item.category]: event.target.value,
                  }))}
                />
              </label>

              <button
                className="soft-btn"
                onClick={() => saveBudget(item.category)}
              >
                Save Budget
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SAVINGS GOALS                                                              */
/* -------------------------------------------------------------------------- */

export function GoalsPage() {
  const {
    data,
    addGoal,
    editGoal,
    changeGoalSavings,
    removeGoal,
  } = useFinance()

  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [saved, setSaved] = useState('0')
  const [showForm, setShowForm] = useState(false)
  const [savingDrafts, setSavingDrafts] = useState<Record<number, string>>({})

  const goals = getAllGoalProgress(data.goals)

  function createNewGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const targetAmount = Number(target)
    const savedAmount = Number(saved)

    if (
      !name.trim() ||
      !Number.isFinite(targetAmount) ||
      !Number.isFinite(savedAmount) ||
      targetAmount <= 0 ||
      savedAmount < 0 ||
      savedAmount > targetAmount
    ) {
      window.alert('Enter a goal name and valid target and saved amounts.')
      return
    }

    try {
      addGoal({
        name: name.trim(),
        target: targetAmount,
        saved: savedAmount,
      })
      setName('')
      setTarget('')
      setSaved('0')
      setShowForm(false)
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to create goal.')
    }
  }

  function updateGoalDetails(id: number, currentName: string, currentTarget: number) {
    const nextName = window.prompt('Goal name:', currentName)
    if (nextName === null) return

    const nextTarget = window.prompt('Target amount:', String(currentTarget))
    if (nextTarget === null) return

    const amount = Number(nextTarget)
    if (!nextName.trim() || !Number.isFinite(amount) || amount <= 0) {
      window.alert('Enter a valid goal name and target.')
      return
    }

    try {
      editGoal(id, { name: nextName.trim(), target: amount })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to edit goal.')
    }
  }

  function saveGoalAmount(id: number, currentSaved: number, targetAmount: number) {
    const amount = Number(savingDrafts[id] ?? currentSaved)

    if (!Number.isFinite(amount) || amount < 0 || amount > targetAmount) {
      window.alert('Saved amount must be between zero and the target amount.')
      return
    }

    try {
      changeGoalSavings(id, amount)
      setSavingDrafts(current => {
        const next = { ...current }
        delete next[id]
        return next
      })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to update savings.')
    }
  }

  return (
    <div className="page active">
      <PageHeading
        title="Savings Goals"
        description="Create savings targets and keep track of your progress."
        action={
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} /> Add Goal
          </button>
        }
      />

      {showForm && (
        <form className="panel" onSubmit={createNewGoal}>
          <div className="panel-head">
            <div>
              <h3>Create a savings goal</h3>
              <p>Give your goal a name and set a target.</p>
            </div>
          </div>

          <div className="form-two">
            <label>
              Goal name
              <input value={name} onChange={event => setName(event.target.value)} required />
            </label>
            <label>
              Target amount
              <input type="number" min="1" value={target} onChange={event => setTarget(event.target.value)} required />
            </label>
            <label>
              Already saved
              <input type="number" min="0" value={saved} onChange={event => setSaved(event.target.value)} />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="soft-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">Create Goal</button>
          </div>
        </form>
      )}

      <div className="goal-grid">
        {goals.map(({ goal, percentage, remaining, completed }) => (
          <article className="goal-card" key={goal.id}>
            <div className="panel-head">
              <div>
                <h3>{goal.name}</h3>
                <p>{completed ? 'Goal completed' : 'Savings progress'}</p>
              </div>
              <button
                className="text-btn"
                onClick={() => updateGoalDetails(goal.id, goal.name, goal.target)}
                title="Edit goal"
                aria-label={`Edit ${goal.name}`}
              >
                <Pencil size={16} />
              </button>
            </div>

            <div className="stat-value">{money(goal.saved, data.currency)}</div>
            <p className="muted">of {money(goal.target, data.currency)}</p>

            <div
              style={{
                height: 9,
                background: 'var(--line)',
                borderRadius: 20,
                overflow: 'hidden',
                margin: '16px 0',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: 'var(--purple)',
                  borderRadius: 20,
                }}
              />
            </div>

            <div className="stat-foot">
              <strong>{percentage.toFixed(1)}%</strong>
              <span>{completed ? 'Completed' : `${money(remaining, data.currency)} to go`}</span>
            </div>

            <label>
              Update saved amount
              <input
                type="number"
                min="0"
                max={goal.target}
                value={savingDrafts[goal.id] ?? String(goal.saved)}
                onChange={event => setSavingDrafts(current => ({
                  ...current,
                  [goal.id]: event.target.value,
                }))}
              />
            </label>

            <div className="modal-actions">
              <button
                className="soft-btn"
                onClick={() => saveGoalAmount(goal.id, goal.saved, goal.target)}
              >
                Update Savings
              </button>
              <button
                className="text-btn"
                onClick={() => {
                  if (window.confirm(`Delete the goal "${goal.name}"?`)) {
                    removeGoal(goal.id)
                  }
                }}
                title="Delete goal"
                aria-label={`Delete ${goal.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}

        {goals.length === 0 && (
          <div className="panel empty-state">You haven't created any savings goals yet.</div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* REPORTS                                                                    */
/* -------------------------------------------------------------------------- */

export function ReportsPage() {
  const { data } = useFinance()
  const now = new Date()

  const monthlyReports = generateMonthlyTrends(data.transactions, 6, now)
  const categoryReports = generateCategoryReport(
    data.transactions,
    now.getFullYear(),
    now.getMonth(),
  )

  const currentMonth = monthlyReports[monthlyReports.length - 1]
  const totalIncome = currentMonth?.income ?? 0
  const totalExpenses = currentMonth?.expenses ?? 0
  const savings = currentMonth?.savings ?? 0

  return (
    <div className="page active">
      <PageHeading
        title="Financial Reports"
        description="Understand your financial activity through monthly trends and category analysis."
      />

      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">Monthly Income</div>
          <div className="stat-value">{money(totalIncome, data.currency)}</div>
          <div className="stat-foot muted">Current month</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Monthly Expenses</div>
          <div className="stat-value">{money(totalExpenses, data.currency)}</div>
          <div className="stat-foot muted">Current month</div>
        </article>
        <article className="stat-card">
          <div className="stat-top">Monthly Savings</div>
          <div className="stat-value">{money(savings, data.currency)}</div>
          <div className="stat-foot muted">Income minus expenses</div>
        </article>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Six-month financial trend</h3>
            <p>Monthly income and expenses</p>
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyReports}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(value) => money(Number(value), data.currency)} />
              <Line type="monotone" dataKey="income" name="Income" stroke="#16a879" strokeWidth={2.5} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#7458e8" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Current-month category spending</h3>
            <p>Expenses grouped by category</p>
          </div>
        </div>

        {categoryReports.length > 0 ? (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryReports}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => money(Number(value), data.currency)} />
                <Bar dataKey="amount" name="Expenses" fill="#7458e8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state">No expenses recorded for this month.</div>
        )}
      </section>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Category breakdown</h3>
            <p>Share of this month's recorded expenses</p>
          </div>
        </div>

        {categoryReports.map(item => (
          <div className="tx-item" key={item.category}>
            <div className="tx-name">{item.category}</div>
            <div className="tx-meta">{item.percentage.toFixed(1)}%</div>
            <div className="tx-amount">
              {money(item.amount, data.currency)}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* AI ASSISTANT                                                               */
/* -------------------------------------------------------------------------- */

export function AssistantPage() {
  const { data } = useFinance()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; suggestions?: string[] }[]
  >([
    {
      role: 'assistant',
      text: 'Hello! I can help you understand your recorded income, expenses, budgets and savings. What would you like to know?',
      suggestions: [
        'Show my balance',
        'Analyze my expenses',
        'Check my budgets',
        'How can I save money?',
      ],
    },
  ])

  function askQuestion(value = question) {
    const text = value.trim()
    if (!text) return

    const response = generateAssistantResponse(text, data)

    setMessages(current => [
      ...current,
      { role: 'user', text },
      {
        role: 'assistant',
        text: response.message,
        suggestions: response.suggestions,
      },
    ])
    setQuestion('')
  }

  return (
    <div className="page active">
      <PageHeading
        title="AI Financial Assistant"
        description="Ask questions about your recorded financial activity."
      />

      <section className="panel assistant-layout">
        <div className="panel-head">
          <div>
            <h3><Bot size={19} /> MoneyMind Assistant</h3>
            <p>Financial insights based on your saved data</p>
          </div>
        </div>

        <div
          className="assistant-messages"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minHeight: 280,
            maxHeight: 480,
            overflowY: 'auto',
            padding: 12,
          }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`assistant-message ${message.role}`}>
              <strong>{message.role === 'user' ? 'You' : 'MoneyMind Assistant'}</strong>
              <p>{message.text}</p>

              {message.role === 'assistant' && message.suggestions && (
                <div className="assistant-suggestions">
                  {message.suggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      className="soft-btn"
                      onClick={() => askQuestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          className="toolbar"
          onSubmit={event => {
            event.preventDefault()
            askQuestion()
          }}
        >
          <input
            value={question}
            onChange={event => setQuestion(event.target.value)}
            placeholder="Ask about your finances..."
            aria-label="Ask MoneyMind Assistant"
          />
          <button type="submit" className="primary-btn" disabled={!question.trim()}>
            <Send size={16} /> Send
          </button>
        </form>

        <p className="muted">
          This version uses the existing rule-based assistant service. It is not connected to an external AI model.
        </p>
      </section>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* SETTINGS                                                                   */
/* -------------------------------------------------------------------------- */

export function SettingsPage() {
  const { data, updateSettings, resetData } = useFinance()
  const [profile, setProfile] = useState(data.profile)
  const [currency, setCurrency] = useState(data.currency)

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      updateSettings({
        profile: profile.trim(),
        currency,
      })
      window.alert('Settings saved successfully.')
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to save settings.')
    }
  }

  function toggleTheme() {
    updateSettings({
      theme: data.theme === 'light' ? 'dark' : 'light',
    })
  }

  function resetApplicationData() {
    if (
      window.confirm(
        'This will restore the default demonstration data and replace your current saved data. Continue?',
      )
    ) {
      resetData()
      setProfile('MoneyMind User')
      setCurrency('INR')
    }
  }

  return (
    <div className="page active">
      <PageHeading
        title="Settings"
        description="Manage your MoneyMind AI preferences and application data."
      />

      <form className="panel settings-panel" onSubmit={saveSettings}>
        <div className="panel-head">
          <div>
            <h3>Personal Preferences</h3>
            <p>Update your account display details.</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Profile name</strong>
            <p className="muted">Name displayed in your application.</p>
          </div>
          <input
            value={profile}
            onChange={event => setProfile(event.target.value)}
            required
          />
        </div>

        <div className="setting-row">
          <div>
            <strong>Currency</strong>
            <p className="muted">Currency used to display your financial amounts.</p>
          </div>
          <select value={currency} onChange={event => setCurrency(event.target.value)}>
            <option value="INR">INR — Indian Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="JPY">JPY — Japanese Yen</option>
          </select>
        </div>

        <div className="modal-actions">
          <button type="submit" className="primary-btn">Save Preferences</button>
        </div>
      </form>

      <section className="panel settings-panel">
        <div className="panel-head">
          <div>
            <h3>Appearance</h3>
            <p>Choose how MoneyMind AI looks.</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Dark mode</strong>
            <p className="muted">Switch between light and dark appearance.</p>
          </div>
          <button type="button" className="soft-btn" onClick={toggleTheme}>
            {data.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </section>

      <section className="panel settings-panel">
        <div className="panel-head">
          <div>
            <h3>Application Data</h3>
            <p>Manage the financial information stored on this device.</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Reset demonstration data</strong>
            <p className="muted">
              Restore the original sample transactions, budgets and goals.
            </p>
          </div>
          <button type="button" className="soft-btn" onClick={resetApplicationData}>
            Reset Data
          </button>
        </div>
      </section>
    </div>
  )
}
