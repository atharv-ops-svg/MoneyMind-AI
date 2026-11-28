
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="website-hero">
          <div className="website-hero-content">
            <div className="website-eyebrow">
              <Sparkles size={14} />
              SMARTER PERSONAL FINANCE
            </div>

            <h1>
              Take control of
              <br />
              your money.
              <br />
              <span>Build your future.</span>
            </h1>

            <p>
              Understand your finances, track your spending, plan your
              goals, and make more informed financial decisions with
              MoneyMind AI.
            </p>

            <div className="website-hero-actions">
              <a href="/login" className="website-primary-button">
                Log In
                <ArrowRight size={18} />
              </a>

              <a href="/register" className="website-secondary-button">
                Sign Up
              </a>

              <a href="/download" className="website-secondary-button">
                Download App
              </a>
            </div>

            <div className="website-hero-trust">
              <ShieldCheck size={17} />
              Your financial journey, organised in one place.
            </div>
          </div>

          <div className="website-hero-visual">
            <div className="website-hero-glow" />

            <div className="website-dashboard-preview">
              <div className="preview-heading">
                <div>
                  <span>YOUR FINANCIAL OVERVIEW</span>
                  <h3>Money at a glance</h3>
                </div>

                <div className="preview-icon">
                  <Wallet size={21} />
                </div>
              </div>

              <div className="preview-summary-grid">
                <div className="preview-summary-card">
                  <span>Total balance</span>
                  <strong>₹48,500</strong>
                  <small>Illustrative example</small>
                </div>

                <div className="preview-summary-card">
                  <span>Monthly savings</span>
                  <strong>₹8,200</strong>
                  <small>Illustrative example</small>
                </div>
              </div>

              <div className="preview-progress-section">
                <div>
                  <span>YOUR SAVINGS GOAL</span>
                  <strong>Building towards your goal</strong>
                </div>

                <div className="preview-progress-bar">
                  <span />
                </div>
              </div>

              <div className="preview-insight">
                <Sparkles size={17} />
                Small, consistent steps can help build better money habits.
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="website-section" id="features">
          <div className="website-section-heading">
            <span className="website-section-label">
              WHAT YOU CAN DO
            </span>

            <h2>
              Everything you need to understand your money
            </h2>

            <p>
              Explore practical tools that help you organise your
              finances and understand your financial habits.
            </p>
          </div>

          <div className="website-feature-grid">
            <div className="website-feature-card">
              <div className="website-feature-icon purple">
                <Wallet size={23} />
              </div>

              <h3>Expense Tracking</h3>

              <p>
                Record and organise transactions to understand where
                your money goes.
              </p>
            </div>

            <div className="website-feature-card">
              <div className="website-feature-icon green">
                <Target size={23} />
              </div>

              <h3>Budget Planning</h3>

              <p>
                Set spending limits, monitor your progress, and work
                towards your financial goals.
              </p>
            </div>

            <div className="website-feature-card">
              <div className="website-feature-icon coral">
                <ChartNoAxesCombined size={23} />
              </div>

              <h3>Financial Reports</h3>

              <p>
                Explore visual summaries and useful insights into
                your income and expenses.
              </p>
            </div>

            <div className="website-feature-card">
              <div className="website-feature-icon blue">
                <Bot size={23} />
              </div>

              <h3>AI Assistant</h3>

              <p>
                Explore financial concepts and get help understanding
                your personal finance information.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="website-section website-how-section"
          id="how-it-works"
        >
          <div className="website-section-heading">
            <span className="website-section-label">
              GETTING STARTED
            </span>

            <h2>Make your financial journey simpler</h2>

            <p>
              Start organising your finances with a few simple steps.
            </p>
          </div>

          <div className="website-steps-grid">
            <div className="website-step-card">
              <span className="website-step-number">01</span>

              <h3>Create your account</h3>

              <p>
                Register for MoneyMind AI and set up your personal
                finance workspace.
              </p>
            </div>

            <div className="website-step-card">
              <span className="website-step-number">02</span>

              <h3>Organise your finances</h3>

              <p>
                Add transactions, create budgets, and define the
                financial goals you want to track.
              </p>
            </div>

            <div className="website-step-card">
              <span className="website-step-number">03</span>

              <h3>Understand your progress</h3>

              <p>
                Review reports, explore insights, and build more
                informed financial habits.
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="website-about-section" id="about">
          <div className="website-about-content">
            <div className="website-about-icon">
              <Sparkles size={23} />
            </div>

            <span className="website-section-label">
              ABOUT MONEY MIND AI
            </span>

            <h2>
              Better financial understanding.
              <span> Better everyday decisions.</span>
            </h2>

            <p>
              MoneyMind AI is designed to make personal finance
              easier to understand. It brings everyday financial
              organisation, budgeting tools, reports, and AI-assisted
              explanations together in one application.
            </p>

            <a href="/register" className="website-text-link">
              Get started
              <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="website-about-points">
            <div>
              <CheckCircle2 size={19} />
              Organised financial information
            </div>

            <div>
              <CheckCircle2 size={19} />
              Practical budgeting tools
            </div>

            <div>
              <CheckCircle2 size={19} />
              Clear financial reports
            </div>

            <div>
              <CheckCircle2 size={19} />
              AI-assisted explanations
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="website-cta-section">
          <div className="website-cta-content">
            <span className="website-section-label">
              START YOUR JOURNEY
            </span>

            <h2>
              Your money deserves a clearer plan.
            </h2>

            <p>
              Start organising your finances and take the next step
              towards understanding your money better.
            </p>

            <a href="/register" className="website-primary-button">
              Create Your Account
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
