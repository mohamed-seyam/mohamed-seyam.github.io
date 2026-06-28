import { useEffect, useRef, useState } from 'react'

/* Small stroke icons (inherit currentColor). */
const Ico = {
  prompt: 'M4 4h16v12H7l-3 3V4z',
  doc: 'M6 2h8l4 4v16H6V2zm8 0v4h4',
  search: 'M10 4a6 6 0 104.5 10.5L20 20M10 4a6 6 0 010 12',
  rag: 'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zm0 0v12c0 1.1 3.6 2 8 2s8-.9 8-2V6',
  llm: 'M8 5L4 12l4 7M16 5l4 7-4 7M13 4l-2 16',
  image: 'M3 5h18v14H3V5zm0 11l5-5 4 4 3-3 6 6',
  icon: 'M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z',
  vlm: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zm10 3a3 3 0 100-6 3 3 0 000 6z',
  deck: 'M3 4h18v12H3V4zm6 16h6M12 16v4',
}

function Glyph({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// Each stage carries its own gradient (c1 → c2).
const PRE = [
  { icon: 'prompt', title: 'Prompt', sub: '+ template', c1: '#c4b5fd', c2: '#ddd6fe' },     // light violet
  { icon: 'doc', title: 'Parse docs', sub: 'Docling · pdfplumber', c1: '#f9a8d4', c2: '#fbcfe8' }, // light pink
  { icon: 'search', title: 'Web search', sub: 'DuckDuckGo', c1: '#7dd3fc', c2: '#bae6fd' },  // light sky
  { icon: 'rag', title: 'RAG', sub: 'pgvector · Qdrant', c1: '#6ee7b7', c2: '#a7f3d0' },     // light green
  { icon: 'llm', title: 'LLM content', sub: 'structured output', c1: '#fcd34d', c2: '#fde68a' }, // light amber
]
const BRANCH = [
  { icon: 'image', title: 'Flux images', c1: '#f9a8d4', c2: '#fbcfe8' }, // light pink
  { icon: 'icon', title: 'Icon finder', c1: '#fcd34d', c2: '#fde68a' },  // light amber
  { icon: 'vlm', title: 'VLM', c1: '#67e8f9', c2: '#a5f3fc' },           // light cyan
]
const BRANCH_COLOR = '#c4b5fd'
const ASSEMBLE = { icon: 'deck', title: 'Assemble deck', sub: 'render from template', c1: '#c4b5fd', c2: '#f9a8d4' } // light violet→pink

const TOTAL = 7 // 0..4 PRE, 5 branch, 6 assemble

const style = (c1, c2) => ({ '--c1': c1, '--c2': c2 })

export default function PpgenFlow() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setPlaying(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setPlaying(true),
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setActive((a) => (a + 1) % (TOTAL + 1)), 950)
    return () => clearInterval(id)
  }, [playing])

  const cls = (i) => (i < active ? 'done' : i === active ? 'active' : '')

  return (
    <div className="flow" ref={ref}>
      <div className="flow-track">
        {PRE.map((s, i) => {
          const nextColor = i < PRE.length - 1 ? PRE[i + 1].c1 : BRANCH_COLOR
          return (
            <div className="flow-cell" key={i}>
              <div className={`flow-node ${cls(i)}`} style={style(s.c1, s.c2)}>
                <span className="flow-ic"><Glyph d={Ico[s.icon]} /></span>
                <strong>{s.title}</strong>
                <small>{s.sub}</small>
              </div>
              <span className={`flow-link ${i < active ? 'done' : ''}`} style={{ '--lc': nextColor }} />
            </div>
          )
        })}

        {/* Branch: per-slide asset routing */}
        <div className="flow-cell">
          <div className={`flow-branch ${cls(5)}`} style={{ '--c1': BRANCH_COLOR }}>
            <span className="flow-branch-label">routing agent · per slide</span>
            <div className="flow-branch-items">
              {BRANCH.map((b, i) => (
                <span className="flow-bchip" key={i} style={style(b.c1, b.c2)}>
                  <span className="flow-ic sm"><Glyph d={Ico[b.icon]} /></span>
                  {b.title}
                </span>
              ))}
            </div>
          </div>
          <span className={`flow-link ${5 < active ? 'done' : ''}`} style={{ '--lc': ASSEMBLE.c1 }} />
        </div>

        {/* Assemble */}
        <div className="flow-cell">
          <div className={`flow-node ${cls(6)}`} style={style(ASSEMBLE.c1, ASSEMBLE.c2)}>
            <span className="flow-ic"><Glyph d={Ico[ASSEMBLE.icon]} /></span>
            <strong>{ASSEMBLE.title}</strong>
            <small>{ASSEMBLE.sub}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
