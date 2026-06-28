import { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Section from './components/Section'
import ProjectList from './components/ProjectList'
import { useLang } from './i18n'

const ALL = 'all'

export default function ProjectsPage() {
  const { t } = useLang()
  const [active, setActive] = useState(ALL)

  // Unique categories (stable key + localized label), derived from the data.
  const categories = useMemo(() => {
    const seen = new Map()
    t.projects.forEach((p) => {
      if (p.categoryKey && !seen.has(p.categoryKey)) seen.set(p.categoryKey, p.category)
    })
    return Array.from(seen, ([key, label]) => ({ key, label }))
  }, [t])

  const shown =
    active === ALL ? t.projects : t.projects.filter((p) => p.categoryKey === active)

  return (
    <>
      <div className="bg-decor" aria-hidden="true" />
      <Navbar />
      <main>
        <Section id="projects" kicker="↳" title={t.ui.sections.projects}>
          <p className="page-intro">{t.ui.projectsIntro}</p>

          {categories.length > 0 && (
            <div className="filter-bar">
              <button
                className={`filter-chip${active === ALL ? ' active' : ''}`}
                onClick={() => setActive(ALL)}
              >
                {t.ui.allCategory}
              </button>
              {categories.map((c) => (
                <button
                  key={c.key}
                  className={`filter-chip${active === c.key ? ' active' : ''}`}
                  onClick={() => setActive(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <ProjectList projects={shown} />
        </Section>
      </main>
      <Footer />
    </>
  )
}
