import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'

/* Stroke icons (inherit currentColor). */
const Ico = {
  bolt: 'M13 3L4 14h6l-1 7 9-12h-6l1-6z',
  doc: 'M6 2h8l4 4v16H6V2zm8 0v4h4M9 13h6M9 17h4',
  branch: 'M6 3a2 2 0 100 4 2 2 0 000-4zm0 4v10m0 0a2 2 0 100 4 2 2 0 000-4zm12-6a2 2 0 100 4 2 2 0 000-4zm0 4a6 6 0 01-6 6H6',
  mail: 'M3 6h18v12H3V6zm0 1l9 6 9-6',
  deal: 'M3 8h18v12H3V8zm6 0V5h6v3M3 13h18',
  hash: 'M9 4L7 20M17 4l-2 16M5 9h15M4 15h15',
  tray: 'M4 13v6h16v-6M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5',
  check: 'M5 12l4 4 10-10',
}

function Glyph({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// Localized copy. The prompt, node labels, captions and bot messages all swap
// with the active language. Pipeline node ids (prompt_analyzer…) stay as code.
const STR = {
  en: {
    head: 'APA · describe your automation',
    promptBase: 'When my Salla store receives an order, create an invoice in Odoo. Then if the order price is greater than 50 USD, email me — otherwise create a deal in my CRM.',
    numFind: '50', numNew: '100', addClause: ' and alert the team on Slack',
    condA: 'Price > 50 USD?', condB: 'Price > 100 USD?',
    trigBadge: 'trigger',
    botGen: 'Generating workflow…', botReady: 'Workflow ready · 6 nodes · 1 condition',
    botUpd: 'Updating workflow…', botUpdDone: 'Workflow updated · 7 nodes · 1 condition',
    caps: { idle: 'waiting for prompt', edit: 'editing prompt', build: 'building workflow', run: 'updating workflow', ready: 'workflow ready' },
    trace1: ['prompt_analyzer', 'services_retrieval · RAG', 'planner', 'condition_extraction', 'connections_maker', 'human_approval'],
    trace2: ['condition_extraction', 'connections_maker', 'human_approval'],
    nodes: {
      trigger: { t: 'Salla Order', s: 'order.created' },
      invoice: { t: 'Create Invoice', s: 'Odoo' },
      cond: { s: 'condition' },
      email: { t: 'Send Email', s: 'notify' },
      crm: { t: 'Create Deal', s: 'CRM' },
      slack: { t: 'Slack Alert', s: 'team channel' },
      out: { t: 'Outputs', s: '' },
    },
  },
  ar: {
    head: 'APA · صِف الأتمتة التي تريدها',
    promptBase: 'عندما يستقبل متجر Salla طلبًا جديدًا، أنشئ فاتورة في Odoo. ثم إذا كان سعر الطلب أكبر من 50 USD، أرسِل لي بريدًا إلكترونيًا — وإلا فأنشئ صفقة في الـ CRM.',
    numFind: '50', numNew: '100', addClause: ' ونبّه الفريق على Slack',
    condA: 'السعر > 50 USD؟', condB: 'السعر > 100 USD؟',
    trigBadge: 'مُشغِّل',
    botGen: 'جارٍ توليد سير العمل…', botReady: 'سير العمل جاهز · 6 عُقد · شرط واحد',
    botUpd: 'جارٍ تحديث سير العمل…', botUpdDone: 'تم تحديث سير العمل · 7 عُقد · شرط واحد',
    caps: { idle: 'بانتظار الـ prompt', edit: 'تعديل الـ prompt', build: 'بناء سير العمل', run: 'تحديث سير العمل', ready: 'سير العمل جاهز' },
    trace1: ['prompt_analyzer', 'services_retrieval · RAG', 'planner', 'condition_extraction', 'connections_maker', 'human_approval'],
    trace2: ['condition_extraction', 'connections_maker', 'human_approval'],
    nodes: {
      trigger: { t: 'طلب Salla', s: 'order.created' },
      invoice: { t: 'إنشاء فاتورة', s: 'Odoo' },
      cond: { s: 'شرط' },
      email: { t: 'إرسال بريد', s: 'إشعار' },
      crm: { t: 'إنشاء صفقة', s: 'CRM' },
      slack: { t: 'تنبيه Slack', s: 'قناة الفريق' },
      out: { t: 'المخرجات', s: '' },
    },
  },
}

// Node geometry (x/y in %). Labels come from STR.
const NODES = [
  { id: 'trigger', x: 50, y: 10, ac: '#64748b', icon: 'bolt',   badge: true },
  { id: 'invoice', x: 50, y: 27, ac: '#7c3aed', icon: 'doc',    check: true },
  { id: 'cond',    x: 50, y: 44, ac: '#f59e0b', icon: 'branch' },
  { id: 'email',   x: 25, y: 63, ac: '#f97316', icon: 'mail',   check: true },
  { id: 'crm',     x: 75, y: 63, ac: '#2563eb', icon: 'deal',   check: true },
  { id: 'slack',   x: 75, y: 81, ac: '#16a34a', icon: 'hash',   check: true },
  { id: 'out',     x: 50, y: 94, ac: '#64748b', icon: 'tray',   badge: true },
]

const EDGES = [
  { id: 'e_ti', d: 'M50 10 V27' },
  { id: 'e_ic', d: 'M50 27 V44' },
  { id: 'e_ce', d: 'M50 44 V52 Q50 54 48 54 H27 Q25 54 25 56 V63' },
  { id: 'e_cc', d: 'M50 44 V52 Q50 54 52 54 H73 Q75 54 75 56 V63' },
  { id: 'e_eo', d: 'M25 63 V88 Q25 90 27.5 90 H47.5 Q50 90 50 92 V94' },
  { id: 'e_co', d: 'M75 63 V88 Q75 90 72.5 90 H52.5 Q50 90 50 92 V94' },
  { id: 'e_cs', d: 'M75 63 V81' },
  { id: 'e_so', d: 'M75 81 V88 Q75 90 72.5 90 H52.5 Q50 90 50 92 V94' },
]

const DOTS = [
  { id: 'd_top', x: 50, y: 15 },
  { id: 'd_bot', x: 50, y: 89 },
]

// Render text with highlighted ranges ({ s, e, k:'add'|'del' }).
function Marked({ text, marks }) {
  if (!marks || marks.length === 0) return text
  const sorted = [...marks].filter((m) => m.e > m.s).sort((a, b) => a.s - b.s)
  const out = []
  let idx = 0
  sorted.forEach((m, k) => {
    const s = Math.max(idx, m.s)
    const e = Math.min(text.length, m.e)
    if (s > idx) out.push(text.slice(idx, s))
    if (e > s) out.push(<mark key={k} className={m.k === 'del' ? 'apa-del' : 'apa-add'}>{text.slice(s, e)}</mark>)
    idx = Math.max(idx, e)
  })
  if (idx < text.length) out.push(text.slice(idx))
  return out
}

const EMPTY = {
  shown: new Set(), checks: new Set(), pulse: new Set(),
  condTitle: '', outBadge: '2',
  trace: [], bot: null, text: '', caret: false, editing: false, marks: [],
}

export default function ApaFlow() {
  const { lang } = useLang()
  const [sc, setSc] = useState(EMPTY)
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
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    const S = STR[lang] || STR.en
    let alive = true
    let timer
    const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms) })

    const s = { ...EMPTY, shown: new Set(), checks: new Set(), pulse: new Set(), trace: [], marks: [], markLive: null }
    const commit = () => setSc({
      shown: new Set(s.shown), checks: new Set(s.checks), pulse: new Set(s.pulse),
      condTitle: s.condTitle, outBadge: s.outBadge,
      trace: [...s.trace], bot: s.bot && { ...s.bot }, text: s.text, caret: s.caret, editing: s.editing,
      marks: [...s.marks, ...(s.markLive ? [s.markLive] : [])],
    })
    const reveal = (...ids) => ids.forEach((i) => s.shown.add(i))
    const pulse = (...ids) => { s.pulse = new Set(ids) }

    const typePlain = async (target, from = '') => {
      s.caret = true
      for (let i = from.length + 1; i <= target.length && alive; i++) {
        s.text = target.slice(0, i); commit(); await wait(18)
      }
      s.caret = false; commit()
    }
    const deleteRange = async (start, count) => {
      for (let k = 0; k < count && alive; k++) {
        s.text = s.text.slice(0, start) + s.text.slice(start + 1); commit(); await wait(26)
      }
    }
    const insertAdd = async (start, str) => {
      const before = s.text.slice(0, start)
      const after = s.text.slice(start)
      for (let i = 1; i <= str.length && alive; i++) {
        s.text = before + str.slice(0, i) + after
        s.markLive = { s: start, e: start + i, k: 'add' }
        commit(); await wait(22)
      }
      s.marks = [...s.marks, { s: start, e: start + str.length, k: 'add' }]
      s.markLive = null; commit()
    }

    async function loop() {
      while (alive) {
        // reset
        Object.assign(s, {
          shown: new Set(), checks: new Set(), pulse: new Set(),
          condTitle: S.condA, outBadge: '2',
          trace: [], bot: null, text: '', caret: false, editing: false, marks: [], markLive: null,
        })
        commit(); await wait(550)

        // pass 1 — describe
        await typePlain(S.promptBase)
        await wait(400)
        s.bot = { status: 'work', title: S.botGen }; commit(); await wait(650)

        // pass 1 — build
        reveal('trigger'); commit(); await wait(620)
        reveal('e_ti', 'd_top', 'invoice'); s.trace.push(S.trace1[0]); commit(); await wait(700)
        reveal('e_ic', 'cond'); s.trace.push(S.trace1[1]); commit(); await wait(700)
        reveal('e_ce', 'e_cc', 'email', 'crm'); s.trace.push(S.trace1[2]); commit(); await wait(640)
        s.trace.push(S.trace1[3]); commit(); await wait(440)
        reveal('e_eo', 'e_co', 'd_bot', 'out'); s.trace.push(S.trace1[4]); commit(); await wait(720)

        // pass 1 — execute
        pulse('trigger'); commit(); await wait(600)
        pulse('e_ti', 'invoice'); s.checks.add('invoice'); commit(); await wait(600)
        pulse('e_ic', 'cond'); commit(); await wait(600)
        pulse('e_ce', 'e_cc', 'email', 'crm'); s.checks.add('email'); s.checks.add('crm'); commit(); await wait(600)
        pulse('e_eo', 'e_co', 'out'); commit(); await wait(600)
        s.trace.push(S.trace1[5]); s.pulse = new Set()
        s.bot = { status: 'done', title: S.botReady }; commit()
        await wait(1700)

        // pass 2 — edit the prompt in place
        s.bot = null; s.editing = true; commit(); await wait(350)
        const i = s.text.indexOf(S.numFind)              // select the threshold
        s.markLive = { s: i, e: i + S.numFind.length, k: 'del' }; commit(); await wait(650)
        s.markLive = null
        await deleteRange(i, S.numFind.length)           // remove it
        await insertAdd(i, S.numNew)                     // type the new value (highlighted)
        const p = s.text.lastIndexOf('.')                // append the Slack clause (highlighted)
        await insertAdd(p, S.addClause)
        s.editing = false; commit(); await wait(450)
        s.bot = { status: 'work', title: S.botUpd }; s.trace = []; commit(); await wait(650)

        // pass 2 — apply only the diff
        s.condTitle = S.condB; s.trace.push(S.trace2[0]); pulse('cond'); commit(); await wait(750)
        s.shown.delete('e_co'); reveal('e_cs', 'slack'); s.checks.add('slack')
        s.trace.push(S.trace2[1]); pulse('e_cs', 'slack'); commit(); await wait(750)
        reveal('e_so'); s.outBadge = '3'; pulse('e_so', 'out'); commit(); await wait(700)
        s.trace.push(S.trace2[2]); s.pulse = new Set()
        s.bot = { status: 'done', title: S.botUpdDone }; commit()
        await wait(2100)
      }
    }
    loop()
    return () => { alive = false; clearTimeout(timer) }
  }, [playing, lang])

  const S = STR[lang] || STR.en
  const running = sc.pulse.size > 0
  const caption = sc.editing
    ? S.caps.edit
    : !sc.bot
      ? S.caps.idle
      : running
        ? S.caps.run
        : sc.bot.status === 'done'
          ? S.caps.ready
          : S.caps.build

  return (
    <div className="apa" ref={ref}>
      {/* Chat pane */}
      <div className="apa-chat">
        <div className="apa-chat-head">
          <span className="av"><Glyph d={Ico.bolt} /></span>
          {S.head}
        </div>

        {(sc.text || sc.caret) && (
          <div className={`apa-bubble user${sc.editing ? ' editing' : ''}`}>
            <Marked text={sc.text} marks={sc.marks} />
            {sc.caret && <span className="apa-caret" />}
          </div>
        )}

        {sc.bot && (
          <div className="apa-bubble bot">
            <div className="apa-bot-title">
              {sc.bot.status === 'done' ? (
                <span className="apa-bot-done"><Glyph d={Ico.check} /></span>
              ) : (
                <span className="apa-spin" />
              )}
              {sc.bot.title}
            </div>
            {sc.trace.length > 0 && (
              <ul className="apa-trace">
                {sc.trace.map((label, i) => (
                  <li key={i} className="show">
                    <span className="tk"><Glyph d={Ico.check} /></span>
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Workflow canvas */}
      <div className="apa-canvas">
        <div className={`apa-cap${running ? ' run' : ''}`}>
          <span className="apa-cap-dot" />
          {caption}
        </div>

        <svg className="apa-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
          {EDGES.map((e) => (
            <path
              key={e.id}
              d={e.d}
              vectorEffect="non-scaling-stroke"
              className={`${sc.shown.has(e.id) ? 'show' : ''}${sc.pulse.has(e.id) ? ' live' : ''}`}
            />
          ))}
        </svg>

        {DOTS.map((dt) => (
          <span
            key={dt.id}
            className={`apa-dot${sc.shown.has(dt.id) ? ' show' : ''}${sc.pulse.has(dt.id) ? ' live' : ''}`}
            style={{ left: `${dt.x}%`, top: `${dt.y}%` }}
          />
        ))}

        {NODES.map((n) => {
          const nd = S.nodes[n.id]
          const title = n.id === 'cond' ? sc.condTitle : nd.t
          const badge = n.id === 'out' ? sc.outBadge : n.id === 'trigger' ? S.trigBadge : null
          return (
            <div
              key={n.id}
              className={`apa-card${sc.shown.has(n.id) ? ' show' : ''}${sc.pulse.has(n.id) ? ' active' : ''}`}
              style={{ left: `${n.x}%`, top: `${n.y}%`, '--ac': n.ac }}
            >
              <span className="apa-tile"><Glyph d={Ico[n.icon]} /></span>
              <span className="apa-txt">
                <strong>{title}</strong>
                {nd.s && <small>{nd.s}</small>}
              </span>
              {n.check && (
                <span className={`apa-check${sc.checks.has(n.id) ? ' show' : ''}`}>
                  <Glyph d={Ico.check} />
                </span>
              )}
              {badge && <span className="apa-badge">{badge}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
