import { useLang } from '../i18n'
import { MailIcon, PhoneIcon, PinIcon, GithubIcon, LinkedinIcon } from './icons'

export default function Hero() {
  const { t } = useLang()
  const { profile, stats, ui } = t

  return (
    <section className="hero" id="about">
      <div className="container hero-grid">
        <div className="reveal">
          <span className="hero-eyebrow">
            <span className="dot" /> {ui.available}
          </span>
          <h1>
            {ui.greeting} <span className="accent">{profile.name}</span>
          </h1>
          <p className="subtitle">{profile.title}</p>
          <p className="lead">{profile.summary}</p>

          <div className="contact-info">
            <span className="contact-item">
              <MailIcon />
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </span>
            <span className="contact-item">
              <PhoneIcon />
              {profile.phone}
            </span>
            <span className="contact-item">
              <PinIcon />
              {profile.location}
            </span>
          </div>

          <div className="cta-buttons">
            <a
              href={profile.resume}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2h14v2H5v-2z" />
              </svg>
              {ui.resume}
            </a>
            <a
              href={profile.links.linkedin}
              className="icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href={profile.links.github}
              className="icon-btn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
            >
              <GithubIcon />
            </a>
          </div>
        </div>

        <div className="hero-photo-wrap reveal">
          <div>
            <div className="hero-photo">
              <img src={profile.photo} alt={profile.name} />
            </div>
            <div className="hero-stats">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="value">{s.value}</div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>
            <a className="hero-projects-link" href="/projects.html">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
                <path d="M12 2v20M3 7l9 5 9-5" />
              </svg>
              {ui.allProjects}
              <span className="hero-projects-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
