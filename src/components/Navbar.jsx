import { useState } from 'react'
import { useLang } from '../i18n'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, toggle } = useLang()

  return (
    <header className="navbar">
      <nav className="container navbar-inner">
        <a href="/" className="logo" aria-label={t.profile.name}>
          <Logo className="logo-mark" />
        </a>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {t.navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="nav-cta-item">
            <a className="nav-cta" href="/projects.html" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
                <path d="M12 2v20M3 7l9 5 9-5" />
              </svg>
              {t.ui.allProjects}
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
            {t.ui.langButton}
          </button>
          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  )
}
