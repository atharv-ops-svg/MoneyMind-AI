
import { useEffect, useState } from 'react'

import Sidebar from './components/layout/Sidebar'
import type { PageId } from './components/layout/Sidebar'

import Topbar from './components/layout/Topbar'
import Dashboard from './pages/Dashboard'

import {
  TransactionsPage,
  BudgetsPage,
  GoalsPage,
  ReportsPage,
  AssistantPage,
  SettingsPage,
} from './pages/FinancePages'

import Modal from './components/common/Modal'
import NotificationContainer from './components/common/NotificationContainer'

import { useFinance } from './context/useFinance'

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const { data } = useFinance()

  useEffect(() => {
    document.body.classList.toggle('dark', data.theme === 'dark')
  }, [data.theme])

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />

      case 'transactions':
        return <TransactionsPage />

      case 'budgets':
        return <BudgetsPage />

      case 'goals':
        return <GoalsPage />

      case 'reports':
        return <ReportsPage />

      case 'assistant':
        return <AssistantPage />

      case 'settings':
        return <SettingsPage />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main">
        <Topbar activePage={activePage} />

        {renderPage()}

        <footer>
          MoneyMind AI <span>•</span> Personal Finance Management
          <span className="footer-right">
            Built to help you manage your finances
          </span>
        </footer>
      </main>

      <Modal />
      <NotificationContainer />
    </div>
  )
}

export default App
