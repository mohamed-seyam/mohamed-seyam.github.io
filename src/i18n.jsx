import { createContext, useContext, useEffect, useState } from 'react'
import en from './data/en'
import ar from './data/ar'

const content = { en, ar }
const LangContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('lang', lang)

    // Swap the tab favicon to match the active language.
    const favicon = document.querySelector('link[rel="icon"]')
    if (favicon) {
      favicon.href = lang === 'ar' ? '/assets/logo.svg' : '/assets/logo-en.svg'
    }
  }, [lang])

  const toggle = () => setLang((l) => (l === 'en' ? 'ar' : 'en'))

  return (
    <LangContext.Provider value={{ lang, setLang, toggle, t: content[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

// Returns { lang, toggle, t } where `t` is the full content tree for the
// active language.
export function useLang() {
  return useContext(LangContext)
}
