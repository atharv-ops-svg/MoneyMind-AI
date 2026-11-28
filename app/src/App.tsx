
import { lazy, Suspense, useEffect, useState } from 'react'

import './styles/legacy.css'
import './styles/finance.css'

import Sidebar from './components/layout/Sidebar'
import type { PageId } from './components/layout/Sidebar'

import Topbar from './components/layout/Topbar'

import Modal from './components/common/Modal'
import NotificationContainer from './components/common/NotificationContainer'

import { useFinance } from './context/useFinance'
import { isDesktopApp } from './utils/platform'

import {
  loginAccount,
  registerAccount,
  restoreSession,
  type AuthUser,
} from './services/authService'

import { getRemoteSettings } from './services/settingsService'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const HomePage = lazy(() => import('./pages/HomePage'))
const InstallationPage = lazy(() => import('./pages/InstallationPage'))
const StartingPage = lazy(() => import('./pages/StartingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))

const TransactionsPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.TransactionsPage,
  })),
)

const BudgetsPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.BudgetsPage,
  })),
)

const GoalsPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.GoalsPage,
  })),
)

const ReportsPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.ReportsPage,
  })),
)

const AssistantPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.AssistantPage,
  })),
)

const SettingsPage = lazy(() =>
  import('./pages/FinancePages').then((module) => ({
    default: module.SettingsPage,
  })),
)

type AuthScreen = 'starting' | 'login' | 'register'
type WebsiteScreen = 'home' | 'login' | 'register'

function getWebsiteScreen(): WebsiteScreen {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return 'login'
  if (path === '/register' || path === '/signup') return 'register'

  return 'home'
}

function PageLoading() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <p>Loading MoneyMind AI...</p>
      </div>
    </div>
  )
}

function FinanceApp() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [isRestoringSettings, setIsRestoringSettings] = useState(true)

  const { data, updateSettings } = useFinance()

  useEffect(() => {
    let cancelled = false

    async function restoreSettings() {
      try {
        const settings = await getRemoteSettings()

        if (cancelled) return

        updateSettings({
          profile: settings.profile,
          currency: settings.currency,
          theme: settings.theme,
        })
      } catch (error) {
        console.error('Unable to restore account settings:', error)
      } finally {
        if (!cancelled) {
          setIsRestoringSettings(false)
        }
      }
    }

    void restoreSettings()

    return () => {
      cancelled = true
    }
  }, [updateSettings])

  useEffect(() => {
    document.body.classList.toggle('dark', data.theme === 'dark')

    return () => {
      document.body.classList.remove('dark')
    }
  }, [data.theme])

  function handleNavigate(page: PageId) {
    setActivePage(page)
  }

  function renderPage() {
    if ((activePage as string) === 'download') {
      return <InstallationPage />
    }

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

  if (isRestoringSettings) {
    return <PageLoading />
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main className="main">
        <Topbar activePage={activePage} />

        <Suspense fallback={<PageLoading />}>
          {renderPage()}
        </Suspense>

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

function DesktopApp() {
  const [screen, setScreen] = useState<AuthScreen>('starting')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const user = await restoreSession()

        if (!cancelled) {
          setCurrentUser(user)
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null)
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false)
        }
      }
    }

    void checkSession()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogin(email: string, password: string) {
    const user = await loginAccount(email, password)
    setCurrentUser(user)
  }

  async function handleRegister(
    name: string,
    email: string,
    password: string,
    countryCode: string,
    currency: string,
  ) {
    await registerAccount(
      name,
      email,
      password,
      countryCode,
      currency,
    )

    const user = await loginAccount(email, password)
    setCurrentUser(user)
  }

  if (checkingSession) {
    return <PageLoading />
  }

  if (currentUser) {
    return <FinanceApp />
  }

  return (
    <Suspense fallback={<PageLoading />}>
      {(() => {
        switch (screen) {
          case 'login':
            return (
              <LoginPage
                onLogin={handleLogin}
                onCreateAccount={() => setScreen('register')}
                onBack={() => setScreen('starting')}
              />
            )

          case 'register':
            return (
              <RegisterPage
                onRegister={handleRegister}
                onSignIn={() => setScreen('login')}
                onBack={() => setScreen('starting')}
              />
            )

          default:
            return (
              <StartingPage
                onSignIn={() => setScreen('login')}
                onCreateAccount={() => setScreen('register')}
              />
            )
        }
      })()}
    </Suspense>
  )
}

function WebsiteApp() {
  const [screen, setScreen] = useState<WebsiteScreen>(getWebsiteScreen)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const user = await restoreSession()

        if (!cancelled) {
          setCurrentUser(user)
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null)
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false)
        }
      }
    }

    void checkSession()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function handleNavigation(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      if (!(event.target instanceof Element)) return

      const link = event.target.closest('a[href]') as HTMLAnchorElement | null

      if (
        !link ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) {
        return
      }

      const url = new URL(link.href, window.location.href)

      if (url.origin !== window.location.origin) return

      const path = url.pathname.replace(/\/+$/, '') || '/'

      let nextScreen: WebsiteScreen | null = null

      if (path === '/login') {
        nextScreen = 'login'
      } else if (path === '/register' || path === '/signup') {
        nextScreen = 'register'
      } else if (path === '/') {
        nextScreen = 'home'
      }

      if (!nextScreen) return

      event.preventDefault()

      window.history.pushState({}, '', url.pathname + url.search + url.hash)
      setScreen(nextScreen)

      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    function handlePopState() {
      setScreen(getWebsiteScreen())
    }

    document.addEventListener('click', handleNavigation)
    window.addEventListener('popstate', handlePopState)

    return () => {
      document.removeEventListener('click', handleNavigation)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  async function handleLogin(email: string, password: string) {
    const user = await loginAccount(email, password)
    setCurrentUser(user)
  }

  async function handleRegister(
    name: string,
    email: string,
    password: string,
    countryCode: string,
    currency: string,
  ) {
    await registerAccount(
      name,
      email,
      password,
      countryCode,
      currency,
    )

    const user = await loginAccount(email, password)
    setCurrentUser(user)
  }

  function navigateTo(nextScreen: WebsiteScreen) {
    const paths: Record<WebsiteScreen, string> = {
      home: '/',
      login: '/login',
      register: '/register',
    }

    window.history.pushState({}, '', paths[nextScreen])
    setScreen(nextScreen)

    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  if (checkingSession) {
    return <PageLoading />
  }

  if (currentUser) {
    return <FinanceApp />
  }

  return (
    <Suspense fallback={<PageLoading />}>
      {screen === 'login' ? (
        <LoginPage
          onLogin={handleLogin}
          onCreateAccount={() => navigateTo('register')}
          onBack={() => navigateTo('home')}
        />
      ) : screen === 'register' ? (
        <RegisterPage
          onRegister={handleRegister}
          onSignIn={() => navigateTo('login')}
          onBack={() => navigateTo('home')}
        />
      ) : (
        <HomePage />
      )}
    </Suspense>
  )
}

function App() {
  if (!isDesktopApp) {
    return (
      <div className="website-app">
        <WebsiteApp />
      </div>
    )
  }

  return <DesktopApp />
}

export default App
