import Section from './Section'
import Tags from './Tags'
import { projects } from '../data/portfolio'

export default function Projects() {
  return (
    <Section id="projects" kicker="02" title="Projects">
      <div className="row-list">
        {projects.map((project, i) => (
          <article className="proj-row reveal" key={project.title}>
            <span className="proj-index">{String(i + 1).padStart(2, '0')}</span>
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
              View →
            </a>
          </article>
        ))}
      </div>
    </Section>
  )
}
