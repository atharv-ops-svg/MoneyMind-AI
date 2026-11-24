
import { Moon, Sun } from 'lucide-react'
import { useFinance } from '../../context/useFinance'

import type { PageId } from './Sidebar'

interface TopbarProps {
  activePage: PageId
}

const pageTitles: Record<PageId, string> = {
  dashboard: 'Financial Overview',
  transactions: 'Transactions',
  budgets: 'Budget Management',
  goals: 'Savings Goals',
  reports: 'Financial Reports',
  assistant: 'AI Financial Assistant',
  settings: 'Settings',
}

function Topbar({ activePage }: TopbarProps) {
  const { data, updateSettings } = useFinance()

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const toggleTheme = () => {
    updateSettings({
      theme: data.theme === 'light' ? 'dark' : 'light',
    })
  }

  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">MONEY MANAGEMENT</div>
        <h1>
          {pageTitles[activePage]}
          {activePage === 'dashboard' && (
            <span> · Overview</span>
          )}
        </h1>
      </div>

      <div className="top-actions">
        <div className="date-pill">{currentDate}</div>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={
            data.theme === 'light'
              ? 'Switch to dark theme'
              : 'Switch to light theme'
          }
          title="Toggle theme"
        >
          {data.theme === 'light' ? (
            <Moon size={17} />
          ) : (
            <Sun size={17} />
          )}
        </button>
      </div>
    </header>
  )
}

export default Topbar
