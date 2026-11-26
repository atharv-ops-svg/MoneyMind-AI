
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="website-footer" id="contact">
      <div className="website-footer-main">
        <div className="website-footer-brand">
          <a href="/" className="website-brand">
            <span className="website-brand-icon">M</span>
            <span>
              MoneyMind <strong>AI</strong>
            </span>
          </a>

          <p>
            A smarter way to understand your finances, build better habits,
            and make informed financial decisions.
          </p>
        </div>

        <div className="website-footer-links">
          <div>
            <h4>Explore</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About us</a>
          </div>

          <div>
            <h4>Get started</h4>
            <a href="/download">
              Download app <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="website-footer-bottom">
        <span>© {new Date().getFullYear()} MoneyMind AI. All rights reserved.</span>
        <span>Personal finance, made clearer.</span>
      </div>
    </footer>
  )
}
