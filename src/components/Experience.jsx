import Section from './Section'
import Tags from './Tags'
import { useLang } from '../i18n'

// First letter of the first two words, e.g. "Wakeb Data" -> "WD".
function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

// An item is either a plain string or a project: { title, subtitle, demo, points }.
// demo links to that project's visualization on the projects page.
function BulletList({ items }) {
  const { t } = useLang()

  return (
    <ul className="bullet-list">
      {items.map((item, i) =>
        typeof item === 'string' ? (
          <li key={i}>{item}</li>
        ) : (
          <li className="exp-project" key={i}>
            <div className="exp-project-head">
              <p>
                <strong>{item.title}</strong>
                {item.subtitle && <span> — {item.subtitle}</span>}
              </p>
              {item.demo && (
                <a className="exp-demo-link" href={`/projects.html#${item.demo}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t.ui.viewDemo}
                </a>
              )}
            </div>
            <ul className="bullet-list bullet-list--sub">
              {item.points.map((point, j) => (
                <li key={j}>{point}</li>
              ))}
            </ul>
          </li>
        )
      )}
    </ul>
  )
}

export default function Experience() {
  const { t } = useLang()

  return (
    <Section id="experience" kicker="01" title={t.ui.sections.experience}>
      <div className="exp-list">
        {t.experience.map((job, i) => (
          <article className="exp-row reveal" key={i}>
            <header className="exp-head">
              <div className="exp-id">
                {job.logo ? (
                  <img className="company-logo" src={job.logo} alt={job.company} />
                ) : (
                  <span
                    className="company-logo company-logo--initials"
                    style={{ background: job.logoColor || 'var(--brand)' }}
                    aria-hidden="true"
                  >
                    {initials(job.company)}
                  </span>
                )}
                <div>
                  <h3 className="experience-title">{job.role}</h3>
                  <p className="company">
                    {job.company} · {job.location}
                  </p>
                </div>
              </div>
              <span className={`exp-date${job.current ? ' is-active' : ''}`}>
                {job.current && <span className="date-dot" />}
                {job.date}
              </span>
            </header>

            {job.groups ? (
              job.groups.map((group, i) => (
                <div className="exp-group" key={i}>
                  <h4 className="exp-group-title">{group.title}</h4>
                  {group.intro && <p className="exp-group-intro">{group.intro}</p>}
                  <BulletList items={group.items} />
                </div>
              ))
            ) : (
              <BulletList items={job.points} />
            )}
            <Tags items={job.keywords} />
          </article>
        ))}
      </div>
    </Section>
  )
}
