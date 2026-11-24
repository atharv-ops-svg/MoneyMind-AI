
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Sparkles,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { useFinance } from '../context/useFinance'

import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getRecentTransactions,
  getCategoryExpenses,
} from '../utils/financeCalculations'

const chartColors = [
  '#7458e8',
  '#16a879',
  '#f17b78',
  '#927cf4',
  '#e5ae55',
  '#69a9d9',
]

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
    },
  )
}

function createCashFlowData(
  transactions: ReturnType<typeof useFinance>['data']['transactions'],
) {
  const today = new Date()
  const result = []

  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')

    const dayTransactions = transactions.filter(
      transaction => transaction.date === dateKey,
    )

    result.push({
      day: date.toLocaleDateString('en-IN', {
        weekday: 'short',
      }),
      income: dayTransactions
        .filter(transaction => transaction.type === 'income')
        .reduce((total, transaction) => total + transaction.amount, 0),
      expenses: dayTransactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((total, transaction) => total + transaction.amount, 0),
    })
  }

  return result
}

function Dashboard() {
  const { data } = useFinance()

  const income = getTotalIncome(data.transactions)
  const expenses = getTotalExpenses(data.transactions)
  const balance = getBalance(data.transactions)

  const recentTransactions = getRecentTransactions(
    data.transactions,
    5,
  )

  const categoryExpenses = getCategoryExpenses(data.transactions)

  const categoryData = Object.entries(categoryExpenses)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      amount,
    }))

  const cashFlowData = createCashFlowData(data.transactions)

  const savings = income - expenses

  return (
    <div className="page active">
      <section className="welcome-row">
        <div>
          <h2>Welcome back!</h2>
          <p>Here's what's happening with your finances.</p>
        </div>

        <div className="live-tag">
          <i />
          FINANCIAL OVERVIEW
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card balance-card">
          <div className="stat-top">
            Total Balance
            <span className="stat-icon">
              <Wallet size={16} />
            </span>
          </div>

          <div className="stat-value">
            {formatCurrency(balance, data.currency)}
          </div>

          <div className="stat-foot">
            Your current financial balance
          </div>

          <div className="balance-orb" />
        </article>

        <article className="stat-card">
          <div className="stat-top">
            Total Income
            <span className="stat-icon green">
              <TrendingUp size={16} />
            </span>
          </div>

          <div className="stat-value">
            {formatCurrency(income, data.currency)}
          </div>

          <div className="stat-foot muted">
            Recorded income
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            Total Expenses
            <span className="stat-icon coral">
              <TrendingDown size={16} />
            </span>
          </div>

          <div className="stat-value">
            {formatCurrency(expenses, data.currency)}
          </div>

          <div className="stat-foot muted">
            Recorded expenses
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            Net Savings
            <span className="stat-icon violet">
              <PiggyBank size={16} />
            </span>
          </div>

          <div className="stat-value">
            {formatCurrency(savings, data.currency)}
          </div>

          <div className="stat-foot muted">
            Income minus expenses
          </div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h3>Cash Flow</h3>
              <p>Income and expenses over the last seven days</p>
            </div>

            <span className="more">•••</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#edf0f5"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9aa3b2', fontSize: 10 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={45}
                  tick={{ fill: '#9aa3b2', fontSize: 10 }}
                />

                <Tooltip
                  formatter={(value) =>
                    formatCurrency(Number(value), data.currency)
                  }
                />

                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#16a879"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#7458e8"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h3>Spending Breakdown</h3>
              <p>Expenses by category this month</p>
            </div>
          </div>

          {categoryData.length > 0 ? (
            <>
              <div className="chart-wrap doughnut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {categoryData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) =>
                        formatCurrency(Number(value), data.currency)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="legend">
                {categoryData.map((item, index) => (
                  <div className="legend-item" key={item.name}>
                    <span
                      className="legend-dot"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    {item.name}
                    <strong>
                      {formatCurrency(item.amount, data.currency)}
                    </strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              No expense data available yet.
            </div>
          )}
        </article>
      </section>

      <section className="lower-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h3>Recent Transactions</h3>
              <p>Your latest recorded financial activity</p>
            </div>
          </div>

          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <div className="tx-item" key={transaction.id}>
                <div className="tx-icon">
                  {transaction.type === 'income' ? (
                    <ArrowDownRight size={17} />
                  ) : (
                    <ArrowUpRight size={17} />
                  )}
                </div>

                <div>
                  <div className="tx-name">
                    {transaction.title}
                  </div>

                  <div className="tx-meta">
                    {transaction.category} · {formatDate(transaction.date)}
                  </div>
                </div>

                <div
                  className={`tx-amount ${
                    transaction.type === 'income'
                      ? 'income-text'
                      : 'expense-text'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(
                    transaction.amount,
                    data.currency,
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              No transactions have been recorded.
            </div>
          )}
        </article>

        <article className="panel assistant-preview">
          <div className="assistant-art">
            <Sparkles size={23} />
          </div>

          <div className="eyebrow">MONEYMIND ASSISTANT</div>

          <h3>Your financial companion</h3>

          <p>
            Explore your financial activity and get helpful
            insights from your recorded data.
          </p>

          <p className="muted">
            Assistant preview — currently using demonstration
            logic, not a connected AI model.
          </p>
        </article>
      </section>
    </div>
  )
}

export default Dashboard
