import Section from './Section'
import { useLang } from '../i18n'

export default function Education() {
  const { t } = useLang()

  return (
    <Section id="education" kicker="04" title={t.ui.sections.education}>
      {t.education.map((edu, i) => (
        <div className="edu-row reveal" key={i}>
          <span className="edu-date">{edu.date}</span>
          <div>
            <h3 className="edu-school">{edu.school}</h3>
            <p className="edu-degree">{edu.degree}</p>
            <p className="edu-faculty">{edu.faculty}</p>
          </div>
        </div>
      ))}
    </Section>
  )
}
