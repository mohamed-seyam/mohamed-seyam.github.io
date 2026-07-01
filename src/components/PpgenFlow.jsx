import { Fragment, useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'

/* Stroke icons (inherit currentColor). */
const Ico = {
  deck: 'M3 4h18v12H3V4zm6 16h6M12 16v4',
  check: 'M5 12l4 4 10-10',
  pdf: 'M6 2h8l4 4v16H6V2zm8 0v4h4M9 13h6M9 16h4',
  spark: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z',
}
function Glyph({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const STR = {
  en: {
    head: 'ppgen · describe your deck',
    file: 'rag_whitepaper.pdf', filePages: '12 pages',
    prompt: 'Turn this PDF into a 5-slide exec deck on Retrieval-Augmented Generation.',
    editPrompt: 'Make “How it works” punchier and regenerate its image in a teal theme.',
    imgPrompt: 'Generate a cover image for the intro slide.',
    botOutline: 'Reading PDF · drafting outline…',
    botBuild: 'Designing slides + generating images…',
    botReady: (n) => `Presentation ready · ${n} slides`,
    botEdit: 'Editing slide 3…',
    botEditDone: 'Slide 3 updated · image regenerated',
    botImg: 'Generating cover image · Flux…',
    botImgDone: 'Cover image added to slide 1',
    outlineHead: (n) => `Outline · ${n} slides`,
    caps: { idle: 'waiting for prompt', outline: 'drafting outline', design: 'designing slide', edit: 'editing slide 3', image: 'creating cover image', ready: 'deck ready' },
    stages: ['parse_docs · Docling', 'web_search · DuckDuckGo', 'rag_retrieval · pgvector + Qdrant', 'structure_slides · LLM', 'route_assets · Flux / Icon / VLM'],
    editStages: ['locate_slide', 'rewrite_content · LLM', 'regenerate_image · Flux'],
    imgStages: ['compose_prompt · LLM', 'generate_image · Flux'],
    deck: [
      { type: 'title', otl: 'Introduction', accent: '#a78bfa', title: 'RAG, Explained', subtitle: 'Grounding language models in your own data' },
      { type: 'content', otl: 'Why it matters', accent: '#f472b6', img: 330, title: 'Why it matters', bullets: ['LLMs hallucinate without context', 'RAG injects trusted, current facts', 'Every answer can cite its source'] },
      { type: 'content', otl: 'How it works', accent: '#38bdf8', img: 205, title: 'How it works', bullets: ['Embed & index your documents', 'Retrieve the most relevant chunks', 'Generate grounded, sourced answers'] },
      { type: 'stat', otl: 'The impact', accent: '#34d399', value: '3×', label: 'fewer factual errors vs. a raw LLM' },
      { type: 'closing', otl: 'Takeaway', accent: '#fbbf24', title: 'Ground your AI', subtitle: 'From guesswork to evidence' },
    ],
    edit: { idx: 2, img: 168, bulletIdx: 1, bullet: 'Top-k semantic retrieval', accent: '#2dd4bf' },
    cover: { idx: 0, img: 265 },
  },
  ar: {
    head: 'ppgen · صِف العرض الذي تريده',
    file: 'rag_whitepaper.pdf', filePages: '12 صفحة',
    prompt: 'حوّل ملف الـ PDF إلى عرض من 5 شرائح عن Retrieval-Augmented Generation.',
    editPrompt: 'اجعل شريحة «How it works» أكثر إيجازًا وأعد توليد صورتها بطابع تركوازي.',
    imgPrompt: 'ولّد صورة غلاف لشريحة المقدمة.',
    botOutline: 'قراءة الـ PDF · إعداد المخطّط…',
    botBuild: 'تصميم الشرائح + توليد الصور…',
    botReady: (n) => `العرض جاهز · ${n} شرائح`,
    botEdit: 'تعديل الشريحة 3…',
    botEditDone: 'تم تحديث الشريحة 3 · أُعيد توليد الصورة',
    botImg: 'توليد صورة الغلاف · Flux…',
    botImgDone: 'أُضيفت صورة الغلاف إلى الشريحة 1',
    outlineHead: (n) => `المخطّط · ${n} شرائح`,
    caps: { idle: 'بانتظار الـ prompt', outline: 'إعداد المخطّط', design: 'تصميم الشريحة', edit: 'تعديل الشريحة 3', image: 'توليد صورة الغلاف', ready: 'العرض جاهز' },
    stages: ['parse_docs · Docling', 'web_search · DuckDuckGo', 'rag_retrieval · pgvector + Qdrant', 'structure_slides · LLM', 'route_assets · Flux / Icon / VLM'],
    editStages: ['locate_slide', 'rewrite_content · LLM', 'regenerate_image · Flux'],
    imgStages: ['compose_prompt · LLM', 'generate_image · Flux'],
    deck: [
      { type: 'title', otl: 'مقدمة', accent: '#a78bfa', title: 'شرح الـ RAG', subtitle: 'إسناد نماذج اللغة إلى بياناتك الخاصة' },
      { type: 'content', otl: 'لماذا يهم', accent: '#f472b6', img: 330, title: 'لماذا يهم؟', bullets: ['النماذج تهلوس بدون سياق', 'RAG يضخّ حقائق موثوقة ومحدّثة', 'كل إجابة يمكن أن تُسند إلى مصدرها'] },
      { type: 'content', otl: 'كيف يعمل', accent: '#38bdf8', img: 205, title: 'كيف يعمل؟', bullets: ['فهرسة مستنداتك عبر embeddings', 'استرجاع الأجزاء الأكثر صلة', 'توليد إجابات مُسندة بمصادر'] },
      { type: 'stat', otl: 'الأثر', accent: '#34d399', value: '3×', label: 'أخطاء واقعية أقل مقابل LLM خام' },
      { type: 'closing', otl: 'الخلاصة', accent: '#fbbf24', title: 'ثبّت ذكاءك على الحقائق', subtitle: 'من التخمين إلى الدليل' },
    ],
    edit: { idx: 2, img: 168, bulletIdx: 1, bullet: 'استرجاع دلالي top-k', accent: '#2dd4bf' },
    cover: { idx: 0, img: 265 },
  },
}

// Faux "generated" image: layered gradients keyed by hue, with a Flux badge.
function GenImage({ hue, v, full }) {
  return (
    <div className={`ppg-genimg${full ? ' full' : ''}`} key={`${hue}-${v}`} style={{ '--h': hue }}>
      <span className="ppg-genimg-badge"><Glyph d={Ico.spark} /> Flux</span>
    </div>
  )
}

function Slide({ b }) {
  const { phase, slide, imgV, markIdx } = b
  if (phase === 'skeleton') {
    return (
      <div className="ppg-slide skeleton" style={{ '--ac': slide.accent }}>
        <span className="sk sk-title" />
        <span className="sk sk-line" />
        <span className="sk sk-line short" />
        {(slide.type === 'content' || slide.img != null) && <span className="sk sk-media" />}
      </div>
    )
  }
  if (slide.type === 'title' || slide.type === 'closing') {
    const hasImg = slide.img != null
    return (
      <div className="ppg-slide cover build" style={{ '--ac': slide.accent }}>
        {hasImg && <GenImage hue={slide.img} v={imgV || 0} full />}
        {hasImg && <span className="ppg-cover-tint" />}
        <div className={`ppg-cover-text${hasImg ? ' on-img' : ''}`}>
          <h5>{slide.title}</h5>
          <p>{slide.subtitle}</p>
        </div>
      </div>
    )
  }
  if (slide.type === 'stat') {
    return (
      <div className="ppg-slide stat build" style={{ '--ac': slide.accent }}>
        <strong>{slide.value}</strong>
        <span>{slide.label}</span>
      </div>
    )
  }
  return (
    <div className="ppg-slide content build" style={{ '--ac': slide.accent }}>
      <div className="ppg-body">
        <h5>{slide.title}</h5>
        <ul>
          {slide.bullets.map((txt, i) => (
            <li key={i} className={markIdx === i ? 'mark' : ''} style={{ animationDelay: `${120 + i * 120}ms` }}>{txt}</li>
          ))}
        </ul>
      </div>
      <GenImage hue={slide.img} v={imgV || 0} />
    </div>
  )
}

const EMPTY = { messages: [], mode: 'outline', outline: 0, build: null, thumbs: [], cap: 'idle' }

export default function PpgenFlow() {
  const { lang } = useLang()
  const [sc, setSc] = useState(EMPTY)
  const [playing, setPlaying] = useState(false)
  const ref = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setPlaying(true); return }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPlaying(true), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // keep the chat scrolled to the latest message
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [sc])

  useEffect(() => {
    if (!playing) return
    const S = STR[lang] || STR.en
    let alive = true
    let timer
    const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms) })
    const deck = S.deck.map((d) => ({ ...d, bullets: d.bullets ? [...d.bullets] : undefined }))

    const s = { messages: [], mode: 'outline', outline: 0, build: null, thumbs: [], cap: S.caps.idle }
    const commit = () => setSc({
      messages: s.messages.map((m) => ({ ...m, trace: m.trace ? [...m.trace] : undefined })),
      mode: s.mode, outline: s.outline, build: s.build && { ...s.build }, thumbs: [...s.thumbs], cap: s.cap,
    })
    const last = () => s.messages[s.messages.length - 1]
    const pushUser = (file = null) => { s.messages.push({ role: 'user', file, text: '', caret: false }); commit() }
    const pushBot = (title, status = 'work') => { s.messages.push({ role: 'bot', status, title, trace: [] }); commit() }
    const setBot = (title, status) => { const m = last(); m.title = title; if (status) m.status = status; commit() }
    const pushTrace = async (arr, ms = 400) => {
      for (let i = 0; i < arr.length && alive; i++) { last().trace.push(arr[i]); commit(); await wait(ms) }
    }
    const typeUser = async (target) => {
      const m = last(); m.caret = true
      for (let i = 1; i <= target.length && alive; i++) { m.text = target.slice(0, i); commit(); await wait(15) }
      m.caret = false; commit()
    }

    async function loop() {
      while (alive) {
        Object.assign(s, { messages: [], mode: 'outline', outline: 0, build: null, thumbs: [], cap: S.caps.idle })
        commit(); await wait(500)

        // 1 — upload + prompt → outline → build
        pushUser({ name: S.file, pages: S.filePages }); await wait(650)
        await typeUser(S.prompt); await wait(300)
        pushBot(S.botOutline); s.cap = S.caps.outline; commit(); await wait(450)
        await pushTrace(S.stages.slice(0, 3), 360)
        for (let i = 0; i < deck.length && alive; i++) { s.outline = i + 1; commit(); await wait(330) }
        await wait(450)
        setBot(S.botBuild); s.mode = 'deck'; last().trace.push(S.stages[3]); commit(); await wait(400)
        last().trace.push(S.stages[4]); commit(); await wait(300)
        for (let i = 0; i < deck.length && alive; i++) {
          s.cap = `${S.caps.design} ${i + 1}`
          s.build = { idx: i, phase: 'skeleton', slide: deck[i] }; commit(); await wait(480)
          s.build = { idx: i, phase: 'content', slide: deck[i], imgV: 0 }; commit(); await wait(800)
          s.thumbs.push(i); commit(); await wait(150)
        }
        setBot(S.botReady(deck.length), 'done'); s.cap = S.caps.ready; commit(); await wait(1900)

        // 2 — edit prompt (appended) → rewrite + regenerate image
        pushUser(); await wait(250); await typeUser(S.editPrompt); await wait(300)
        pushBot(S.botEdit); s.cap = S.caps.edit; commit(); await wait(400)
        await pushTrace(S.editStages, 420)
        const e = S.edit
        deck[e.idx] = { ...deck[e.idx], accent: e.accent }
        s.build = { idx: e.idx, phase: 'skeleton', slide: deck[e.idx] }; commit(); await wait(500)
        deck[e.idx].bullets[e.bulletIdx] = e.bullet; deck[e.idx].img = e.img
        s.build = { idx: e.idx, phase: 'content', slide: deck[e.idx], imgV: 1, markIdx: e.bulletIdx }; commit(); await wait(850)
        setBot(S.botEditDone, 'done'); s.cap = S.caps.ready; commit(); await wait(1900)

        // 3 — create image prompt (appended) → generate cover image
        pushUser(); await wait(250); await typeUser(S.imgPrompt); await wait(300)
        pushBot(S.botImg); s.cap = S.caps.image; commit(); await wait(400)
        await pushTrace(S.imgStages, 480)
        const c = S.cover
        s.build = { idx: c.idx, phase: 'skeleton', slide: { ...deck[c.idx], img: c.img } }; commit(); await wait(560)
        deck[c.idx] = { ...deck[c.idx], img: c.img }
        s.build = { idx: c.idx, phase: 'content', slide: deck[c.idx], imgV: 1 }; commit(); await wait(950)
        setBot(S.botImgDone, 'done'); s.cap = S.caps.ready; commit(); await wait(2600)
      }
    }
    loop()
    return () => { alive = false; clearTimeout(timer) }
  }, [playing, lang])

  const S = STR[lang] || STR.en
  const running = sc.messages.length > 0 && sc.messages[sc.messages.length - 1].role === 'bot'
    && sc.messages[sc.messages.length - 1].status === 'work'

  return (
    <div className="apa" ref={ref}>
      {/* Chat thread */}
      <div className="apa-chat ppg-chat" ref={chatRef}>
        <div className="apa-chat-head">
          <span className="av"><Glyph d={Ico.deck} /></span>
          {S.head}
        </div>

        {sc.messages.map((m, i) =>
          m.role === 'user' ? (
            <Fragment key={i}>
              {m.file && (
                <div className="ppg-file">
                  <span className="ppg-file-ic"><Glyph d={Ico.pdf} /></span>
                  <span className="ppg-file-meta"><strong>{m.file.name}</strong><small>{m.file.pages}</small></span>
                </div>
              )}
              {(m.text || m.caret) && (
                <div className="apa-bubble user">{m.text}{m.caret && <span className="apa-caret" />}</div>
              )}
            </Fragment>
          ) : (
            <div className="apa-bubble bot" key={i}>
              <div className="apa-bot-title">
                {m.status === 'done'
                  ? <span className="apa-bot-done"><Glyph d={Ico.check} /></span>
                  : <span className="apa-spin" />}
                {m.title}
              </div>
              {m.trace.length > 0 && (
                <ul className="apa-trace">
                  {m.trace.map((label, k) => (
                    <li key={k} className="show"><span className="tk"><Glyph d={Ico.check} /></span>{label}</li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}
      </div>

      {/* Canvas: outline → deck */}
      <div className="apa-canvas ppg-canvas">
        <div className={`apa-cap${running ? ' run' : ''}`}>
          <span className="apa-cap-dot" />{sc.cap}
        </div>

        <div className="ppg-wrap">
          {sc.mode === 'outline' ? (
            <div className="ppg-outline">
              <div className="ppg-outline-head">{S.outlineHead(S.deck.length)}</div>
              <ol>
                {S.deck.map((sl, i) => (
                  <li key={i} className={sc.outline > i ? 'show' : ''} style={{ '--ac': sl.accent }}>
                    <span className="n">{i + 1}</span>{sl.otl}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <>
              <div className="ppg-stage">
                {sc.build ? <Slide b={sc.build} /> : <div className="ppg-slide empty"><Glyph d={Ico.deck} /></div>}
              </div>
              <div className="ppg-film">
                {S.deck.map((slide, i) => (
                  <span key={i}
                    className={`ppg-thumb${sc.thumbs.includes(i) ? ' show' : ''}${sc.build?.idx === i ? ' current' : ''}`}
                    style={{ '--ac': slide.accent }}>
                    <span className="ppg-thumb-bar" />
                    <span className="ppg-thumb-line" />
                    <span className="ppg-thumb-line short" />
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
