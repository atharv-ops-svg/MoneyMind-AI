
import {
  ArrowRight,
  Download,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

interface StartingPageProps {
  onSignIn: () => void
  onCreateAccount: () => void
}

export default function StartingPage({
  onSignIn,
  onCreateAccount,
}: StartingPageProps) {
  return (
    <main className="starting-page">
      <header className="starting-header">
        <div className="starting-brand">
          <div className="starting-brand-icon">M</div>
          <span>
            MoneyMind <strong>AI</strong>
          </span>
        </div>

        <div className="starting-header-actions">
          <a
            href="/downloads/MoneyMind-AI-Setup-0.1.0.exe"
            download="MoneyMind-AI-Setup-0.1.0.exe"
            className="starting-signin-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            Download
          </a>

          <span>Already have an account?</span>

          <button
            className="starting-signin-link"
            onClick={onSignIn}
            type="button"
          >
            Sign in
          </button>
        </div>
      </header>

      <section className="starting-content">
        <div className="starting-copy">
          <div className="starting-eyebrow">
            <Sparkles size={15} />
            SMARTER FINANCES START HERE
          </div>

          <h1>
            Take control of
            <br />
            your money.
            <br />
            <span>Think smarter.</span>
          </h1>

          <p className="starting-description">
            Meet your personal finance companion. Understand your spending,
            manage your budgets, track your goals, and make more informed
            financial decisions with MoneyMind AI.
          </p>

          <div className="starting-buttons">
            <button
              className="starting-primary-button"
              onClick={onCreateAccount}
              type="button"
            >
              Create your account
              <ArrowRight size={18} />
            </button>

            <button
              className="starting-secondary-button"
              onClick={onSignIn}
              type="button"
            >
              Sign in
            </button>
          </div>

          <div className="starting-trust">
            <ShieldCheck size={17} />
            Your financial information deserves protection.
          </div>
        </div>

        <div className="starting-visual">
          <div className="starting-visual-glow" />

          <div className="starting-preview-card">
            <div className="starting-preview-top">
              <div>
                <span className="preview-label">
                  YOUR FINANCIAL JOURNEY
                </span>
                <h3>Make every decision count.</h3>
              </div>

              <div className="preview-icon">
                <TrendingUp size={21} />
              </div>
            </div>

            <div className="preview-chart">
              <div className="preview-chart-line">
                {Array.from({ length: 7 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
            </div>

            <div className="preview-bottom">
              <div>
                <span>Plan</span>
                <strong>With clarity</strong>
              </div>

              <div>
                <span>Track</span>
                <strong>With confidence</strong>
              </div>
            </div>
          </div>

          <div className="starting-floating-note">
            <Sparkles size={17} />
            <div>
              <strong>Smarter money habits</strong>
              <span>Start with a better view</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="starting-footer">
        <span>© {new Date().getFullYear()} MoneyMind AI</span>
        <span>
          Designed to help you make informed financial decisions.
        </span>
      </footer>
    </main>
  )
}
