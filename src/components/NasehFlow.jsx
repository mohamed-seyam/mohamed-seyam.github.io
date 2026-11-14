import { Fragment, useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from './demo/usePlayer'
import { Chapters, DocRow, DropZone, SamplePdf } from './demo/parts'

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
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM6.5 17A2.5 2.5 0 0 0 4 19.5 2.5 2.5 0 0 0 6.5 22H20v-5',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  layers: 'm12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
}
function Icon({ name, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

// Which passage on the sample page each citation points at.
const CITED = [null, 'price', 'commission']
// Rough scene lengths in seconds, for the chapter progress bars.
const DURATIONS = [9.5, 12.5, 7.5]

const STR = {
  en: {
    chapters: [['Upload a document', 'Parse, chunk, embed'], ['Ask a question', 'Cited answer'], ['Stay grounded', 'No answer, no guess']],
    docsTitle: 'Documents',
    docsSub: 'Project · Riyadh listings',
    upload: 'Upload files',
    formats: 'PDF, Word, PowerPoint and more',
    file: 'riyadh-price-guide.pdf',
    pages: '4 pages',
    timing: 'parsed 4.2 s · embedded 0.8 s',
    status: { uploading: 'Uploading…', parsing: 'Parsing…', chunking: 'Chunking…', embedding: 'Embedding…', ready: 'Ready · 6 chunks' },
    index: 'Dense + BM25 vectors in Qdrant, partitioned per project',
    preview: 'Preview',
    viewer: 'Document',
    empty: 'No documents yet',
    pageRef: 'p. 2',
    citation: 'Citation',
    idle: 'Cited passages light up on the page',
    none: 'No passage matched, so nothing is cited',
    chatTitle: 'Riyadh listings',
    chatSub: 'Answers only from this project’s documents',
    q1: 'What is the average price per metre for land in Hittin, and what is the sales commission?',
    a1: 'The average price for residential land in Hittin is SAR 6,200 per square metre [1]. The brokerage commission on a sale is 2.5% of the property value [2].',
    sourcesHead: 'Sources · 2',
    sources: [
      { paper: '| District | Residential land |\n| Hittin | 6,200 SAR / m² |', excerpt: 'Hittin · residential land · 6,200 SAR per m²' },
      { paper: 'Sales commission: 2.5% of the property value.', excerpt: 'Sales commission: 2.5% of the property value.' },
    ],
    retrieval: 'Dense + BM25 → RRF · this project only · 0.03 s',
    q2: 'Who is the CEO of Microsoft?',
    a2: 'The provided documents do not contain this information.',
    grounded: 'Answers come only from the retrieved passages, so nothing is filled in from the model’s own knowledge.',
    thinking: 'Writing the answer',
    placeholder: 'Ask a question about your documents…',
    scope: 'Search in',
    scopeAll: 'All documents',
    note: 'Each question is answered on its own.',
  },
  ar: {
    chapters: [['رفع مستند', 'تحليل، تقسيم، تضمين'], ['طرح سؤال', 'إجابة موثّقة'], ['التزام بالمصدر', 'لا إجابة، لا تخمين']],
    docsTitle: 'المستندات',
    docsSub: 'مشروع · عقارات الرياض',
    upload: 'رفع ملفات',
    formats: 'PDF و Word و PowerPoint وغيرها',
    file: 'riyadh-price-guide.pdf',
    pages: '4 صفحات',
    timing: 'التحليل 4.2 ث · التضمين 0.8 ث',
    status: { uploading: 'جارٍ الرفع…', parsing: 'جارٍ التحليل…', chunking: 'جارٍ التقسيم…', embedding: 'جارٍ التضمين…', ready: 'جاهز · 6 مقاطع' },
    index: 'متجهات Dense + BM25 في Qdrant، معزولة لكل مشروع',
    preview: 'معاينة',
    viewer: 'المستند',
    empty: 'لا توجد مستندات بعد',
    pageRef: 'ص 2',
    citation: 'الاستشهاد',
    idle: 'المقاطع المستشهد بها تُظلَّل على الصفحة',
    none: 'لم يطابق أي مقطع، فلا استشهاد',
    chatTitle: 'عقارات الرياض',
    chatSub: 'إجابات من مستندات هذا المشروع فقط',
    q1: 'كم متوسط سعر المتر للأراضي في حطين، وكم عمولة السعي عند البيع؟',
    a1: 'متوسط سعر المتر للأراضي السكنية في حي حطين 6,200 ريال [1]. وعمولة السعي عند البيع 2.5% من قيمة العقار [2].',
    sourcesHead: 'المصادر · 2',
    sources: [
      { paper: '| الحي | الأراضي السكنية |\n| حطين | 6,200 ريال / م² |', excerpt: 'حطين · أراضٍ سكنية · 6,200 ريال للمتر المربع' },
      { paper: 'عمولة السعي: 2.5% من قيمة العقار.', excerpt: 'عمولة السعي عند البيع: 2.5% من قيمة العقار.' },
    ],
    retrieval: 'Dense + BM25 ← RRF · هذا المشروع فقط · 0.03 ث',
    q2: 'من هو الرئيس التنفيذي لمايكروسوفت؟',
    a2: 'المستندات المتاحة لا تحتوي على هذه المعلومة.',
    grounded: 'الإجابات من المقاطع المسترجعة فقط، فلا يُملأ أي شيء من معرفة النموذج الخاصة.',
    thinking: 'جارٍ كتابة الإجابة',
    placeholder: 'اطرح سؤالاً عن مستنداتك…',
    scope: 'البحث في',
    scopeAll: 'كل المستندات',
    note: 'يُجاب عن كل سؤال على حدة.',
  },
}

// Answer text with [n] turned into the app's citation pills.
function withCitations(text, highlighted) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    const m = /^\[(\d+)\]$/.exec(part)
    if (!m) return <Fragment key={i}>{part}</Fragment>
    return <span key={i} className={`ns-cite${highlighted === Number(m[1]) ? ' open' : ''}`}>{m[1]}</span>
  })
}

const EMPTY = { drop: false, file: null, typed: '', turns: [], pending: null, highlight: 0, missed: false }

export default function NasehFlow() {
  const { lang } = useLang()
  const S = STR[lang] || STR.en
  const ref = useRef(null)
  const logRef = useRef(null)
  const { playing, scene, run, go } = usePlayer(ref, 3)
  const [sc, setSc] = useState(EMPTY)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [sc.turns.length, sc.pending])

  useEffect(() => {
    if (!playing) return undefined
    let alive = true
    let timer
    const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms) })
    const s = { ...EMPTY, turns: [] }
    const commit = () => alive && setSc({ ...s, turns: [...s.turns], pending: s.pending && { ...s.pending } })
    const set = async (patch, ms = 0) => { Object.assign(s, patch); commit(); if (ms) await wait(ms) }

    const typeQuestion = async (q) => {
      for (let i = 1; i <= q.length && alive; i++) { s.typed = q.slice(0, i); commit(); await wait(22) }
      await wait(350)
      s.turns.push({ role: 'user', text: q })
      await set({ typed: '' }, 300)
    }
    const answer = async (text, opts) => {
      await set({ pending: { text: '', sources: false, ...opts } }, 900)
      if (opts.withSources) { s.pending.sources = true; commit(); await wait(400) }
      for (let i = 1; i <= text.length && alive; i++) {
        s.pending.text = text.slice(0, i)
        if (opts.withSources) {
          const cites = [...s.pending.text.matchAll(/\[(\d+)\]/g)]
          s.highlight = cites.length ? Number(cites[cites.length - 1][1]) : 0
        }
        commit(); await wait(text.length > 80 ? 14 : 22)
      }
      s.turns.push({ role: 'answer', ...s.pending, text, done: true })
      await set({ pending: null })
    }

    const upload = async () => {
      await set({}, 700)
      await set({ drop: true }, 900)
      await set({ drop: false, file: 'uploading' }, 700)
      await set({ file: 'parsing' }, 1800)
      await set({ file: 'chunking' }, 1000)
      await set({ file: 'embedding' }, 900)
      await set({ file: 'ready' }, 2800)
    }
    const ask = async () => {
      await set({ file: 'ready' }, 600)
      await typeQuestion(S.q1)
      await answer(S.a1, { withSources: true })
      // Step back through the citations, as a reader clicking each pill would.
      await wait(1300)
      await set({ highlight: 1 }, 1500)
      await set({ highlight: 2 }, 1700)
    }
    const grounded = async () => {
      s.turns.push({ role: 'user', text: S.q1 }, { role: 'answer', text: S.a1, sources: true, done: true })
      await set({ file: 'ready' }, 700)
      await typeQuestion(S.q2)
      await answer(S.a2, { muted: true })
      await set({ missed: true }, 3600)
    }

    ;[upload, ask, grounded][scene]().then(() => alive && go(scene + 1))
    return () => { alive = false; clearTimeout(timer) }
  }, [playing, scene, run, S, go])

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
                      <span className="ns-visual">
                        <span className="ns-paper" dir="auto">
                          <span className="dm-ftype">PDF</span>
                          <span className="ns-paper-text">{src.paper}</span>
                        </span>
                        <span className="ns-num">{i + 1}</span>
                      </span>
                      <span className="ns-card-body">
                        <span className="ns-card-title">
                          <span className="ns-card-name">{S.file}</span>
                          <span className="ns-card-page">{S.pageRef}</span>
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

  const uploadScene = (
    <div className="ns-screen ns-screen-upload">
      <div className="ns-docs">
        <div className="ns-head">
          <span className="ns-head-ic"><Icon name="book" /></span>
          <div>
            <strong>{S.docsTitle}</strong>
            <small>{S.docsSub}</small>
          </div>
        </div>
        <div className="ns-docs-body">
          <DropZone title={S.upload} formats={S.formats} over={sc.drop} dragName={S.file} />
          {sc.file && (
            <DocRow name={S.file} meta={S.pages} status={sc.file} label={S.status[sc.file]} timing={S.timing} />
          )}
          {sc.file === 'ready' && <p className="dm-note"><Icon name="layers" size={12} />{S.index}</p>}
        </div>
      </div>
      <div className="dm-viewer">
        <div className="dm-viewer-head">
          <span>{S.preview}</span>
          {sc.file && <small>{S.file} · {S.pageRef}</small>}
        </div>
        {sc.file ? (
          <SamplePdf lang={lang} mode={sc.file === 'parsing' ? 'scan' : sc.file === 'chunking' || sc.file === 'embedding' ? 'chunks' : null} />
        ) : (
          <p className="dm-viewer-empty">{S.empty}</p>
        )}
      </div>
    </div>
  )

  const askScene = (
    <div className="ns-screen ns-screen-ask">
      <section className="ns-chat">
        <div className="ns-head">
          <span className="ns-mark"><BrandMark /></span>
          <div>
            <strong>{S.chatTitle}</strong>
            <small>{S.chatSub}</small>
          </div>
        </div>
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
            <div className={`ns-textarea${sc.typed ? '' : ' empty'}`} dir="auto">{sc.typed || S.placeholder}</div>
            <div className="ns-compose-foot">
              <span className="ns-scope">{S.scope} <span className="ns-select">{S.scopeAll}</span></span>
              <span className="ns-note">{S.note}</span>
            </div>
          </div>
          <span className={`ns-send${sc.typed ? '' : ' disabled'}`}><Icon name="arrowUp" size={15} /></span>
        </div>
      </section>

      {/* The cited page */}
      <div className={`dm-viewer${sc.highlight ? ' is-hit' : ''}`}>
        <div className="dm-viewer-head">
          <span>{S.viewer}</span>
          <small>{S.file} · {S.pageRef}</small>
        </div>
        <SamplePdf lang={lang} highlight={CITED[sc.highlight]} />
        <p className="dm-viewer-foot show">
          {sc.highlight ? (
            <span className="ns-viewer-chip">
              <span className="ns-cite open">{sc.highlight}</span>
              {S.citation} {sc.highlight} · {S.pageRef}
            </span>
          ) : sc.missed ? S.none : S.idle}
        </p>
      </div>
    </div>
  )

  return (
    <div className="ns" ref={ref}>
      <Chapters items={S.chapters} scene={scene} run={run} durations={DURATIONS} onPick={go} />
      <Fragment key={scene === 0 ? 'upload' : 'ask'}>{scene === 0 ? uploadScene : askScene}</Fragment>
    </div>
  )
}
