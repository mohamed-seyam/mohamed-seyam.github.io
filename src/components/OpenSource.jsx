import Section from './Section'
import ProjectList from './ProjectList'
import { useLang } from '../i18n'

// Home page: open-source work. The interactive demos live on /projects.html.
export default function OpenSource() {
  const { t } = useLang()

  return (
    <Section id="open-source" kicker="02" title={t.ui.sections.openSource}>
      <ProjectList projects={t.openSource} showModels={false} />
    </Section>
  )
}
