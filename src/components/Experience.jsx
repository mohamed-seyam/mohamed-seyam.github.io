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

            <ul className="bullet-list">
              {job.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            <Tags items={job.keywords} />
          </article>
        ))}
      </div>
    </Section>
  )
}
