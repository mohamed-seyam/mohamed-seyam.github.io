import Section from './Section'
import Tags from './Tags'
import { publications } from '../data/portfolio'

export default function Publications() {
  return (
    <Section id="publications" kicker="03" title="Publications">
      {publications.map((pub) => (
        <article className="pub-row reveal" key={pub.title}>
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
