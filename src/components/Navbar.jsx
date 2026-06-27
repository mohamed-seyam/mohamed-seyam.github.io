import { useState } from 'react'
import { useLang } from '../i18n'
import Logo from './Logo'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, toggle } = useLang()

  return (
    <header className="navbar">
      <nav className="container navbar-inner">
        <a href="#about" className="logo" aria-label={t.profile.name}>
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
