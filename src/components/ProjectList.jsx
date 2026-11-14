import Tags from './Tags'
import ModelEmbed from './ModelEmbed'
import PpgenFlow from './PpgenFlow'
import ApaFlow from './ApaFlow'
import BaleeghFlow from './BaleeghFlow'
import NasehFlow from './NasehFlow'
import { useLang } from '../i18n'

// project.demo -> animated visualization rendered under the description.
const DEMOS = {
  ppgen: PpgenFlow,
  apa: ApaFlow,
  baleegh: BaleeghFlow,
  naseh: NasehFlow,
}

// Renders the list of project rows. Shared by the home preview and the
// dedicated projects page.
export default function ProjectList({ projects, showModels = true }) {
  const { t } = useLang()

  return (
    <div className="row-list">
      {projects.map((project, i) => {
        const Demo = DEMOS[project.demo]
        return (
        <article className="proj-row reveal" id={project.id} key={project.id || i}>
          <div className="proj-body">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>
            <Tags items={project.keywords} />
            {showModels && project.model && <ModelEmbed src={project.model} />}
            {showModels && Demo && <Demo />}
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
        )
      })}
    </div>
  )
}
