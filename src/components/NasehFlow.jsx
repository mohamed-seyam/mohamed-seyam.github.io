import { Fragment, useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from './demo/usePlayer'
import { Cursor, DropZone, SamplePdf } from './demo/parts'

/* A walkthrough of Naseh in the app's own style (naseh-web: the Baleegh family
   look with a teal accent), in three scenes: a PDF going through the ingest
   pipeline, a question answered with numbered citations that light up the
   cited passage on the page, and the grounding rule: nothing in the documents,
   nothing made up. Ingest and search times are from the Baleegh latency
   benchmark's 4-page PDF. */

// A neutral letter mark standing in for the app's logo.
function BrandMark() {
  const { lang } = useLang()
  return <span className="ns-letter">{lang === 'ar' ? 'ن' : 'N'}</span>
}

const PATHS = {
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  layers: 'm12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  plus: 'M12 5v14M5 12h14',
}
function Icon({ name, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

// The walkthrough's scenes, in order.
const SCENES = ['home', 'projects', 'upload', 'ask', 'grounded']
const NAV_ICONS = ['home', 'folder', 'chat']
const STAGES = ['parsing', 'chunking', 'embedding']

// The project's documents. `cite` is the citation that lands in the document;
// the rest are there to be searched and passed over. `start` and `times` (ms)
// stagger the ingest so the files finish at different moments.
const DOCS = [
  { name: 'riyadh-price-guide.pdf', chunks: 6, cite: 1, view: 'prices', start: 0, times: [1500, 600, 700] },
  { name: 'jeddah-price-guide.pdf', chunks: 6, start: 200, times: [1700, 600, 800] },
  { name: 'brokerage-terms.pdf', chunks: 3, cite: 2, view: 'terms', start: 400, times: [900, 400, 500] },
  { name: 'mortgage-rules.pdf', chunks: 14, start: 600, times: [2300, 800, 1000] },
  { name: 'rental-contracts.pdf', chunks: 9, start: 800, times: [1800, 700, 800] },
  { name: 'building-code-summary.pdf', chunks: 21, start: 1000, times: [2700, 900, 1100] },
]
const TOTAL_CHUNKS = DOCS.reduce((sum, d) => sum + d.chunks, 0)
const INGEST_MS = Math.max(...DOCS.map((d) => d.start + d.times.reduce((a, b) => a + b, 0)))
// Each citation: its document, the passage to light on the page, and the page.
const CITED = [null, { doc: DOCS[0], passage: 'price', page: 2 }, { doc: DOCS[2], passage: 'commission', page: 1 }]

const statusAt = (d, ms) => {
  let t = ms - d.start
  if (t < 0) return 'uploading'
  for (let k = 0; k < STAGES.length; k++) {
    if (t < d.times[k]) return STAGES[k]
    t -= d.times[k]
  }
  return 'ready'
}
const ALL_READY = DOCS.map(() => 'ready')

const STR = {
  en: {
    you: 'You',
    brand: 'Naseh',
    nav: ['Home', 'Projects', 'Chats'],
    hero: ['Ask your documents, and ', 'see where every answer came from', '.'],
    lead: 'Upload files, watch them parsed, chunked and indexed, then ask questions that are answered only from what you gave it — each claim cited back to its page.',
    projectsIn: 'Projects in this workspace',
    projectsTitle: 'Projects',
    projectLead: 'A project is a set of documents and the chats that answer from them. A chat can only ever retrieve from its own project.',
    namePlaceholder: 'Project name',
    add: 'New project',
    project: 'Riyadh listings',
    existing: [['HR policies', '12 documents · 5 conversations'], ['Legal contracts', '8 documents · 3 conversations']],
    fresh: 'No documents yet · created just now',
    tabs: ['Chats', 'Documents'],
    upload: 'Upload files',
    formats: 'PDF, Word, PowerPoint and more',
    files: (n) => `${n} PDFs`,
    status: { uploading: 'Uploading…', parsing: 'Parsing…', chunking: 'Chunking…', embedding: 'Embedding…', ready: (n) => `${n} chunks` },
    indexed: (docs, chunks) => `${docs} documents · ${chunks} chunks indexed`,
    searching: (n) => `Searching ${n} documents…`,
    found: (hits, n) => `Answer found in ${hits} of ${n} documents`,
    notFound: (n) => `Nothing relevant in ${n} documents`,
    library: (n) => `${n} documents in this project`,
    page: (n) => `p. ${n}`,
    index: 'Stored in Qdrant, partitioned per project',
    preview: 'Preview',
    viewer: 'Document',
    empty: 'No documents yet',
    idle: 'Cited passages light up on the page',
    none: 'No passage matched, so nothing is cited',
    q1: 'What is the average price per metre for land in Hittin, and what is the sales commission?',
    a1: 'The average price for residential land in Hittin is SAR 6,200 per square metre [1]. The brokerage commission on a sale is 2.5% of the property value [2].',
    sourcesHead: 'Sources · 2',
    sources: [
      { excerpt: 'Hittin · residential land · 6,200 SAR per m²' },
      { excerpt: 'Sales commission: 2.5% of the property value.' },
    ],
    retrieval: 'Hybrid search · this project only · 0.03 s',
    q2: 'Who is the CEO of Microsoft?',
    a2: 'The provided documents do not contain this information.',
    grounded: 'Answers come only from the retrieved passages, so nothing is filled in from the model’s own knowledge.',
    thinking: 'Writing the answer',
    placeholder: 'Ask a question about your documents…',
  },
  ar: {
    you: 'أنت',
    brand: 'ناصح',
    nav: ['الرئيسية', 'المشاريع', 'المحادثات'],
    hero: ['اسأل مستنداتك، ', 'واعرف من أين جاء كل جواب', '.'],
    lead: 'ارفع ملفاتك وتابعها وهي تُحلَّل وتُقسَّم وتُفهرَس، ثم اطرح أسئلة لا يُجاب عنها إلا مما قدّمته، وكل معلومة موثّقة بصفحتها.',
    projectsIn: 'المشاريع في مساحة العمل هذه',
    projectsTitle: 'المشاريع',
    projectLead: 'المشروع مجموعة من المستندات والمحادثات التي تُجيب منها. لا تسترجع أي محادثة إلا من مشروعها.',
    namePlaceholder: 'اسم المشروع',
    add: 'مشروع جديد',
    project: 'عقارات الرياض',
    existing: [['سياسات الموارد البشرية', '12 مستنداً · 5 محادثات'], ['العقود القانونية', '8 مستندات · 3 محادثات']],
    fresh: 'لا مستندات بعد · أُنشئ الآن',
    tabs: ['المحادثات', 'المستندات'],
    upload: 'رفع ملفات',
    formats: 'PDF و Word و PowerPoint وغيرها',
    files: (n) => `${n} ملفات PDF`,
    status: { uploading: 'جارٍ الرفع…', parsing: 'جارٍ التحليل…', chunking: 'جارٍ التقسيم…', embedding: 'جارٍ التضمين…', ready: (n) => `${n} مقطعًا` },
    indexed: (docs, chunks) => `${docs} مستندات · ${chunks} مقطعًا مفهرسًا`,
    searching: (n) => `جارٍ البحث في ${n} مستندات…`,
    found: (hits, n) => `الإجابة في ${hits} من ${n} مستندات`,
    notFound: (n) => `لا شيء ذو صلة في ${n} مستندات`,
    library: (n) => `${n} مستندات في هذا المشروع`,
    page: (n) => `ص ${n}`,
    index: 'مخزّنة في Qdrant، معزولة لكل مشروع',
    preview: 'معاينة',
    viewer: 'المستند',
    empty: 'لا توجد مستندات بعد',
    idle: 'المقاطع المستشهد بها تُظلَّل على الصفحة',
    none: 'لم يطابق أي مقطع، فلا استشهاد',
    q1: 'كم متوسط سعر المتر للأراضي في حطين، وكم عمولة السعي عند البيع؟',
    a1: 'متوسط سعر المتر للأراضي السكنية في حي حطين 6,200 ريال [1]. وعمولة السعي عند البيع 2.5% من قيمة العقار [2].',
    sourcesHead: 'المصادر · 2',
    sources: [
      { excerpt: 'حطين · أراضٍ سكنية · 6,200 ريال للمتر المربع' },
      { excerpt: 'عمولة السعي عند البيع: 2.5% من قيمة العقار.' },
    ],
    retrieval: 'بحث هجين · هذا المشروع فقط · 0.03 ث',
    q2: 'من هو الرئيس التنفيذي لمايكروسوفت؟',
    a2: 'المستندات المتاحة لا تحتوي على هذه المعلومة.',
    grounded: 'الإجابات من المقاطع المسترجعة فقط، فلا يُملأ أي شيء من معرفة النموذج الخاصة.',
    thinking: 'جارٍ كتابة الإجابة',
    placeholder: 'اطرح سؤالاً عن مستنداتك…',
  },
}

// Answer text with [n] turned into the app's citation pills.
function withCitations(text, highlighted) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = /^\[(\d+)\]$/.exec(part)
    if (!m) return <Fragment key={i}>{part}</Fragment>
    return <span key={i} className={`ns-cite${highlighted === Number(m[1]) ? ' open' : ''}`} data-cur={`cite${m[1]}`}>{m[1]}</span>
  })
}

const EMPTY = {
  drop: false, docs: null, search: null, typed: '', turns: [], pending: null, highlight: 0,
  // new project
  pname: '', creating: false, created: false,
  // pointer
  cur: null, click: 0,
}

export default function NasehFlow() {
  const { lang } = useLang()
  const S = STR[lang] || STR.en
  const ref = useRef(null)
  const logRef = useRef(null)
  const { started, paused, scene, run, go, start } = usePlayer(ref, SCENES.length)
  const [sc, setSc] = useState(EMPTY)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [sc.turns.length, sc.pending])

  useEffect(() => {
    if (!started) return undefined
    return start(async ({ wait, live }) => {
      const s = { ...EMPTY, turns: [] }
      const commit = () => live() && setSc({ ...s, turns: [...s.turns], pending: s.pending && { ...s.pending } })
      const set = async (patch, ms = 0) => { Object.assign(s, patch); commit(); if (ms) await wait(ms) }

      const point = (cur) => set({ cur }, 620)
      const click = (patch) => set({ ...patch, click: s.click + 1 }, 380)

      const typeQuestion = async (q) => {
        await point('ask')
        for (let i = 2; i < q.length + 2 && live(); i += 2) { s.typed = q.slice(0, i); commit(); await wait(44) }
        await point('send')
        await click({})
        s.turns.push({ role: 'user', text: q })
        await set({ typed: '', cur: null }, 300)
      }
      const answer = async (text, opts) => {
        await set({ pending: { text: '', sources: false, ...opts }, search: 'scan', highlight: 0 }, 1300)
        await set({ search: opts.withSources ? 'found' : 'none' })
        if (opts.withSources) { s.pending.sources = true; commit(); await wait(400) }
        for (let i = 3; i < text.length + 3 && live(); i += 3) {
          s.pending.text = text.slice(0, i)
          if (opts.withSources) {
            const cites = [...s.pending.text.matchAll(/\[(\d+)\]/g)]
            s.highlight = cites.length ? Number(cites[cites.length - 1][1]) : 0
          }
          commit(); await wait(text.length > 80 ? 42 : 66)
        }
        s.turns.push({ role: 'answer', ...s.pending, text, done: true })
        await set({ pending: null })
      }

      const home = async () => {
        await set({}, 2600)
        await point('nav-projects')
        await click({})
      }
      const projects = async () => {
        await set({}, 700)
        await point('pname')
        for (let i = 1; i <= S.project.length && live(); i++) await set({ pname: S.project.slice(0, i) }, 60)
        await point('padd')
        await click({ creating: true })
        await set({ creating: false, created: true, pname: '' }, 1200)
        await point('ptile')
        await click({})
      }
      const upload = async () => {
        await set({}, 500)
        await set({ cur: 'drop', drop: true }, 1100)
        await click({ drop: false, docs: DOCS.map(() => 'uploading') })
        await set({ cur: null }, 300)
        // All files go through the pipeline at once, finishing at their own pace.
        for (let ms = 0; ms <= INGEST_MS && live(); ms += 150) {
          await set({ docs: DOCS.map((d) => statusAt(d, ms)) }, 150)
        }
        await set({ docs: ALL_READY }, 2600)
      }
      const ask = async () => {
        await set({ docs: ALL_READY }, 400)
        await typeQuestion(S.q1)
        await answer(S.a1, { withSources: true })
        // Click back through the citations: each opens its own document.
        await wait(700)
        await point('cite1')
        await click({ highlight: 1 })
        await wait(1300)
        await point('cite2')
        await click({ highlight: 2 })
        await set({ cur: null }, 1600)
      }
      const grounded = async () => {
        s.turns.push({ role: 'user', text: S.q1 }, { role: 'answer', text: S.a1, sources: true, done: true })
        await set({ docs: ALL_READY }, 700)
        await typeQuestion(S.q2)
        await answer(S.a2, { muted: true })
        await set({}, 3600)
      }

      await { home, projects, upload, ask, grounded }[SCENES[scene]]()
    }, () => go(scene + 1))
  }, [started, scene, run, S, go, start])

  const renderAnswer = (turn, key) => (
    <div key={key} className="ns-row ns-answer">
      <span className="ns-mark"><BrandMark /></span>
      <div className="ns-stack">
        <div className={`ns-bubble${turn.muted ? ' ns-bubble-muted' : ''}`} dir="auto">
          {turn.text ? withCitations(turn.text, turn.sources ? sc.highlight : 0) : null}
          {!turn.done && (
            <span className="ns-typing" aria-label={S.thinking}><span /><span /><span /></span>
          )}
        </div>
        {!turn.done && !turn.text && <p className="ns-meta">{S.thinking}</p>}
        {turn.sources && (
          <>
            <p className="ns-meta"><span className="ns-chip"><Icon name="layers" size={11} />{S.retrieval}</span></p>
            <div className="ns-sources">
              <p className="ns-sources-head">{S.sourcesHead}</p>
              <ol className="ns-strip">
                {S.sources.map((src, i) => (
                  <li key={i}>
                    <span className={`ns-card${sc.highlight === i + 1 ? ' highlighted' : ''}`}>
                      <span className="ns-num">{i + 1}</span>
                      <span className="ns-card-body">
                        <span className="ns-card-title">
                          <span className="ns-card-name">{CITED[i + 1].doc.name}</span>
                          <span className="ns-card-page">{S.page(CITED[i + 1].page)}</span>
                        </span>
                        <span className="ns-card-excerpt" dir="auto">{src.excerpt}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
        {turn.done && turn.muted && <p className="ns-meta">{S.grounded}</p>}
      </div>
    </div>
  )

  const first = sc.docs?.[0]
  const allReady = sc.docs?.every((st) => st === 'ready')
  const cited = CITED[sc.highlight]
  const hits = DOCS.filter((d) => d.cite).length

  const uploadScene = (
    <div className="ns-screen ns-screen-upload">
      <div className="ns-docs">
        <div className="ns-docs-body">
          <DropZone title={S.upload} formats={S.formats} over={sc.drop} dragName={S.files(DOCS.length)} />
          {sc.docs && (
            <ul className="ns-files">
              {DOCS.map((d, i) => {
                const st = sc.docs[i]
                const pos = STAGES.indexOf(st)
                return (
                  <li key={d.name} style={{ '--i': i }}>
                    <span className="dm-ftype">PDF</span>
                    <span className="ns-file-name">{d.name}</span>
                    <span className="dm-steps" aria-hidden="true">
                      {STAGES.map((stage, k) => (
                        <span key={stage} className={`dm-step${st === 'ready' || k < pos ? ' done' : k === pos ? ' active' : ''}`} />
                      ))}
                    </span>
                    <span className={`ns-file-status${st === 'ready' ? ' is-ready' : ''}`}>
                      {st === 'ready' ? S.status.ready(d.chunks) : S.status[st]}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
          {allReady && (
            <p className="dm-note"><Icon name="layers" size={12} />{S.indexed(DOCS.length, TOTAL_CHUNKS)} · {S.index}</p>
          )}
        </div>
      </div>
      <div className="dm-viewer">
        <div className="dm-viewer-head">
          <span>{S.preview}</span>
          {sc.docs && <small>{DOCS[0].name} · {S.page(2)}</small>}
        </div>
        {sc.docs ? (
          <SamplePdf lang={lang} doc="prices" mode={first === 'parsing' ? 'scan' : first === 'chunking' || first === 'embedding' ? 'chunks' : null} />
        ) : (
          <p className="dm-viewer-empty">{S.empty}</p>
        )}
      </div>
    </div>
  )

  const askScene = (
    <div className="ns-screen ns-screen-ask">
      <section className="ns-chat">
        <div className="ns-log" ref={logRef}>
          {sc.turns.map((turn, i) =>
            turn.role === 'user' ? (
              <div key={i} className="ns-row ns-user">
                <div className="ns-bubble" dir="auto">{turn.text}</div>
                <span className="ns-face"><Icon name="user" size={13} /></span>
              </div>
            ) : (
              renderAnswer(turn, i)
            ),
          )}
          {sc.pending && renderAnswer(sc.pending, 'pending')}
        </div>
        <div className="ns-input">
          <div className="ns-compose">
            <div className={`ns-textarea${sc.typed ? '' : ' empty'}`} dir="auto" data-cur="ask">{sc.typed || S.placeholder}</div>
          </div>
          <span className={`ns-send${sc.typed ? '' : ' disabled'}`} data-cur="send"><Icon name="arrowUp" size={15} /></span>
        </div>
      </section>

      {/* Every document is searched; the cited ones open here */}
      <div className={`dm-viewer${cited ? ' is-hit' : ''}`}>
        <div className="dm-viewer-head">
          <span>{S.viewer}</span>
          <small>
            {sc.search === 'scan' ? S.searching(DOCS.length)
              : sc.search === 'found' ? S.found(hits, DOCS.length)
              : sc.search === 'none' ? S.notFound(DOCS.length)
              : S.library(DOCS.length)}
          </small>
        </div>
        <ul className={`ns-rail${sc.search ? ` is-${sc.search}` : ''}`}>
          {DOCS.map((d, i) => (
            <li
              key={d.name}
              className={`${d.cite ? 'is-hit' : ''}${cited?.doc === d ? ' is-open' : ''}`}
              style={{ '--i': i }}
            >
              <span className="dm-ftype">PDF</span>
              <span className="ns-file-name">{d.name}</span>
              {d.cite && sc.search === 'found' && <span className="ns-cite open">{d.cite}</span>}
            </li>
          ))}
        </ul>
        {sc.search === 'found' ? (
          <SamplePdf key={(cited || CITED[1]).doc.view} lang={lang} doc={(cited || CITED[1]).doc.view} highlight={cited?.passage} />
        ) : (
          <p className="dm-viewer-empty">{sc.search === 'none' ? S.none : S.idle}</p>
        )}
        <p className={`dm-viewer-foot${cited ? ' show' : ''}`}>
          {cited && (
            <span className="ns-viewer-chip">
              <span className="ns-cite open">{sc.highlight}</span>
              {cited.doc.name} · {S.page(cited.page)}
            </span>
          )}
        </p>
      </div>
    </div>
  )

  const view = SCENES[scene]
  const inProject = view === 'upload' || view === 'ask' || view === 'grounded'
  const made = sc.created || inProject

  // The hero line appears a word at a time.
  const words = (text, from) => text.split(/(\s+)/).map((word, i) => (
    word.trim() ? <span key={i} className="dm-word" style={{ '--w': from + i / 2 }}>{word}</span> : word
  ))
  const tile = (name, meta, extra) => (
    <div key={name} className={`dm-tile${extra ? ' is-new' : ''}`} data-cur={extra ? 'ptile' : undefined}>
      <div className="dm-tile-head">
        <span className="ns-head-ic"><Icon name="folder" /></span>
        <strong>{name}</strong>
      </div>
      <p>{meta}</p>
    </div>
  )

  const sidebar = (
    <aside className="ns-side">
      <span className="ns-wordmark"><span className="ns-mark"><BrandMark /></span>{S.brand}</span>
      <ul>
        {S.nav.map((item, i) => (
          <li key={i} className={i === (view === 'home' ? 0 : 1) ? 'is-active' : undefined} data-cur={i === 1 ? 'nav-projects' : undefined}>
            <Icon name={NAV_ICONS[i]} size={15} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="ns-side-label">{S.projectsTitle}</p>
      <ul className="ns-side-projects">
        {made && <li className={inProject ? 'is-active' : undefined}>{S.project}</li>}
        {S.existing.map(([name]) => <li key={name}>{name}</li>)}
      </ul>
    </aside>
  )

  const homeScene = (
    <>
      <div className="dm-hero">
        <h4>
          {words(S.hero[0], 0)}
          <span className="dm-accent">{words(S.hero[1], 5)}</span>
          {S.hero[2]}
        </h4>
        <p>{S.lead}</p>
      </div>
      <p className="ns-sources-head">{S.projectsIn}</p>
      <div className="dm-tiles">{S.existing.map(([name, meta]) => tile(name, meta))}</div>
    </>
  )

  const projectsScene = (
    <>
      <h4 className="ns-h">{S.projectsTitle}</h4>
      <p className="ns-lead">{S.projectLead}</p>
      <div className="ns-create">
        <span className={`ns-field${sc.pname ? '' : ' empty'}`} data-cur="pname">{sc.pname || S.namePlaceholder}</span>
        <span className={`ns-btn${sc.pname || sc.creating ? '' : ' disabled'}`} data-cur="padd">
          {sc.creating ? <span className="ns-spin" /> : <Icon name="plus" size={14} />}
          {S.add}
        </span>
      </div>
      <div className="dm-tiles">
        {sc.created && tile(S.project, S.fresh, true)}
        {S.existing.map(([name, meta]) => tile(name, meta))}
      </div>
    </>
  )

  const projectScene = (
    <>
      <div className="ns-project">
        <span className="ns-head-ic"><Icon name="folder" /></span>
        <h4 className="ns-h">{S.project}</h4>
        <ul className="ns-tabs">
          {S.tabs.map((tab, i) => (
            <li key={i} className={i === (view === 'upload' ? 1 : 0) ? 'is-active' : undefined}>{tab}</li>
          ))}
        </ul>
      </div>
      <Fragment key={view === 'upload' ? 'upload' : 'ask'}>{view === 'upload' ? uploadScene : askScene}</Fragment>
    </>
  )

  return (
    <div className={`ns${paused ? ' is-paused' : ''}`} ref={ref}>
      <div className="dm-frame">
        <div className="ns-app">
          {sidebar}
          <div className="ns-main" key={inProject ? 'project' : view}>
            {view === 'home' ? homeScene : view === 'projects' ? projectsScene : projectScene}
          </div>
        </div>
      </div>
      <Cursor rootRef={ref} target={sc.cur} click={sc.click} label={S.you} />
    </div>
  )
}
