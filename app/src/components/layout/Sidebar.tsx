
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  ChartNoAxesCombined,
  Sparkles,
  Settings,
  MonitorDown,
  CircleHelp,
  MoreHorizontal,
} from 'lucide-react'

import { isDesktopApp } from '../../utils/platform'

export type PageId =
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'goals'
  | 'reports'
  | 'assistant'
  | 'settings'
  | 'download'

interface SidebarProps {
  activePage: PageId
  onNavigate: (page: PageId) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'budgets', label: 'Budgets', icon: Wallet },
  { id: 'goals', label: 'Savings Goals', icon: Target },
  { id: 'reports', label: 'Reports', icon: ChartNoAxesCombined },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const visibleNavigationItems = isDesktopApp
    ? navigationItems
    : [
        ...navigationItems,
        {
          id: 'download' as const,
          label: 'Download App',
          icon: MonitorDown,
        },
      ]

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
  <img
    src="/icons.png"
    alt="MoneyMind AI"
    className="brand-logo"
  />
</div>

        <div>
          <b>MoneyMind AI</b>
          <small>SMART FINANCE</small>
        </div>
      </div>

      <div className="side-label">WORKSPACE</div>

      <nav aria-label="Main navigation">
        {visibleNavigationItems.map(item => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activePage === item.id ? 'active' : ''
              }`}
              onClick={() => onNavigate(item.id)}
              aria-current={
                activePage === item.id ? 'page' : undefined
              }
            >
              <span>
                <Icon size={18} />
              </span>

              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">
            <CircleHelp size={20} />
          </div>

          <b>Need some help?</b>

          <p>
            Explore your finances and make smarter decisions.
          </p>
        </div>

        <div className="profile">
          <div className="avatar">MM</div>

          <div>
            <b>MoneyMind User</b>
            <small>Personal Account</small>
          </div>

          <MoreHorizontal className="dots" size={18} />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
