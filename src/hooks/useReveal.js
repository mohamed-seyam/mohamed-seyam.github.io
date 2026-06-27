import { useEffect } from 'react'

// Reveals `.reveal` elements as they scroll into view.
// The hidden state is gated behind the `js-reveal` class on <html> (added here),
// so if JS ever fails to run, content stays fully visible instead of blank.
// A fallback timer also guarantees nothing remains hidden permanently.
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js-reveal')

    const els = Array.from(document.querySelectorAll('.reveal'))
    const revealAll = () => els.forEach((el) => el.classList.add('in'))

    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => observer.observe(el))

    // Safety net: if anything is still hidden after a moment, show it.
    const fallback = setTimeout(revealAll, 1500)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])
}
