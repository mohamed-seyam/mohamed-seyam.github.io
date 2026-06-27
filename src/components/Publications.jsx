import Section from './Section'
import Tags from './Tags'
import { useLang } from '../i18n'

export default function Publications() {
  const { t } = useLang()

  return (
    <Section id="publications" kicker="03" title={t.ui.sections.publications}>
      {t.publications.map((pub, i) => (
        <article className="pub-row reveal" key={i}>
          <img src={pub.image} alt={pub.title} />
          <div>
            <h3>{pub.title}</h3>
            <p className="pub-year">{pub.year}</p>
            <p className="pub-desc">{pub.description}</p>
            <Tags items={pub.keywords} />
          </div>
        </article>
      ))}
    </Section>
  )
}
