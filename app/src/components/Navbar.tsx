
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="website-navbar">
      <div className="website-navbar-inner">
        <a href="/" className="website-brand" onClick={closeMenu}>
          <span className="website-brand-icon">M</span>
          <span>
            MoneyMind <strong>AI</strong>
          </span>
        </a>

        <nav className={`website-nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How it works
          </a>

          <a href="#about" onClick={closeMenu}>
            About
          </a>

          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>

          <div className="website-mobile-auth">
            <a href="/login" onClick={closeMenu}>
              Log In
            </a>

            <a href="/register" onClick={closeMenu}>
              Sign Up
            </a>
          </div>

          <a
            href="/download"
            className="website-mobile-download"
            onClick={closeMenu}
          >
            Download App
            <ArrowUpRight size={16} />
          </a>
        </nav>

        <div className="website-navbar-actions">
          <a href="/login" className="website-login-button">
            Log In
          </a>

          <a href="/register" className="website-signup-button">
            Sign Up
          </a>

          <a href="/download" className="website-download-button">
            Download App
            <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          className="website-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}
