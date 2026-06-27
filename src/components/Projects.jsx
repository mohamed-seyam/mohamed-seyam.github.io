import Section from './Section'
import Tags from './Tags'
import { useLang } from '../i18n'

export default function Projects() {
  const { t } = useLang()

  return (
    <Section id="projects" kicker="02" title={t.ui.sections.projects}>
      <div className="row-list">
        {t.projects.map((project, i) => (
          <article className="proj-row reveal" key={i}>
            <div className="proj-body">
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>
              <Tags items={project.keywords} />
            </div>
            <a
              className="project-link"
              href={project.link}
              target={project.link.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              {t.ui.viewProject}
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}
