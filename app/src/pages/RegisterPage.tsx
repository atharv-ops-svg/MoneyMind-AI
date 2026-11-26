
import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

interface RegisterPageProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void> | void
  onSignIn: () => void
  onBack: () => void
}

export default function RegisterPage({
  onRegister,
  onSignIn,
  onBack,
}: RegisterPageProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please complete all fields.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and privacy policy.')
      return
    }

    try {
      setLoading(true)

      await onRegister(
        name.trim(),
        email.trim(),
        password,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <button
          type="button"
          className="auth-back-button"
          onClick={onBack}
        >
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
              <UserRound size={23} />
            </div>

            <span className="auth-eyebrow">
              GET STARTED
            </span>

            <h1>Create your account</h1>

            <p>
              Start building better financial habits with MoneyMind AI.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">
                Full name
              </label>

              <div className="auth-input-wrapper">
                <UserRound size={18} />

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Email address
              </label>

              <div className="auth-input-wrapper">
                <Mail size={18} />

                <input
                  id="register-email"
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
              <label htmlFor="register-password">
                Password
              </label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
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

              <span className="auth-field-hint">
                Use at least 8 characters.
              </span>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>

              <div className="auth-input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your password again"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
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
                checked={agreeToTerms}
                onChange={(event) => setAgreeToTerms(event.target.checked)}
              />

              <span>
                I agree to the Terms of Service and Privacy Policy.
              </span>
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
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>ALREADY HAVE AN ACCOUNT?</span>
          </div>

          <button
            type="button"
            className="auth-create-button"
            onClick={onSignIn}
          >
            Sign in instead
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
