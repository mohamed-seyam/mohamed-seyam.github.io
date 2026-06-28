import Section from './Section'
import ProjectList from './ProjectList'
import { useLang } from '../i18n'

export default function Projects() {
  const { t } = useLang()

  return (
    <Section id="projects" kicker="02" title={t.ui.sections.projects}>
      {/* Home preview: 3D viewers live on the full projects page (linked from the navbar). */}
      <ProjectList projects={t.projects} showModels={false} />
    </Section>
  )
}
