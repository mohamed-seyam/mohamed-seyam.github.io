// Inline, dot-separated keyword list (editorial style).
export default function Tags({ items }) {
  return (
    <ul className="kw">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
