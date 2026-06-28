import Tags from './Tags'
import ModelEmbed from './ModelEmbed'
import PpgenFlow from './PpgenFlow'
import { useLang } from '../i18n'

// Renders the list of project rows. Shared by the home preview and the
// dedicated projects page.
export default function ProjectList({ projects, showModels = true }) {
  const { t } = useLang()

  return (
    <div className="row-list">
      {projects.map((project, i) => (
        <article className="proj-row reveal" key={i}>
          <div className="proj-body">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <Tags items={project.keywords} />
            {showModels && project.model && <ModelEmbed src={project.model} />}
            {showModels && project.demo === 'ppgen' && <PpgenFlow />}
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
  )
}
