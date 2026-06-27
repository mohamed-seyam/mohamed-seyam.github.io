// Reusable section wrapper with an editorial left-aligned heading.
export default function Section({ id, kicker, title, children }) {
  return (
    <section className="section" id={id}>
      <div className="container">
        <div className="section-head reveal">
          {kicker && <span className="section-kicker">{kicker}</span>}
          <h2 className="section-title">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}
