
import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react'

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void> | void
  onCreateAccount: () => void
  onBack: () => void
  onForgotPassword?: () => void
}

export default function LoginPage({
  onLogin,
  onCreateAccount,
  onBack,
  onForgotPassword,
}: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)
      await onLogin(email.trim(), password)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <button className="auth-back-button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="auth-brand">
          <div className="auth-brand-icon">M</div>
          <span>
            MoneyMind <strong>AI</strong>
          </span>
        </div>

        <div className="auth-header-placeholder" />
      </header>

      <section className="auth-content">
        <div className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-heading-icon">
              <LockKeyhole size={23} />
            </div>

            <span className="auth-eyebrow">WELCOME BACK</span>
            <h1>Sign in to your account</h1>
            <p>
              Continue your financial journey with MoneyMind AI.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>

              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="login-password">Password</label>

                {onForgotPassword && (
                  <button
                    type="button"
                    className="auth-text-button"
                    onClick={onForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Keep me signed in</span>
            </label>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO MONEYMIND AI?</span>
          </div>

          <button
            type="button"
            className="auth-create-button"
            onClick={onCreateAccount}
          >
            Create an account
          </button>

          <div className="auth-security-note">
            <ShieldCheck size={16} />
            Your account security matters to us.
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        © {new Date().getFullYear()} MoneyMind AI
      </footer>
    </main>
  )
}
