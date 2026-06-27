import Section from './Section'
import { education } from '../data/portfolio'

export default function Education() {
  return (
    <Section id="education" kicker="04" title="Education">
      {education.map((edu) => (
        <div className="edu-row reveal" key={edu.school}>
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
