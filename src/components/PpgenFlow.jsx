import { Fragment, useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'

const Ico = {
  deck: 'M3 4h18v12H3V4zm6 16h6M12 16v4',
  check: 'M5 12l4 4 10-10',
  pdf: 'M6 2h8l4 4v16H6V2zm8 0v4h4M9 13h6M9 16h4',
  spark: 'M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z',
  query: 'M4 4h16v11H7l-3 3V4z',
  embed: 'M4 8h16M4 12h16M4 16h12',
  db: 'M4 6c0-1.1 3.6-2 8-2s8 .9 8 2v12c0 1.1-3.6 2-8 2s-8-.9-8-2V6zm0 0c0 1.1 3.6 2 8 2s8-.9 8-2',
  llm: 'M8 5L4 12l4 7M16 5l4 7-4 7',
  answer: 'M4 4h16v11H7l-3 3V4zM8.5 9.5l2 2 4-4',
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
    file: 'rag_whitepaper.pdf', filePages: '12 pages', source: 'grounded · rag_whitepaper.pdf',
    prompt: 'Turn this PDF into a 6-slide exec deck on Retrieval-Augmented Generation.',
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
    caps: { idle: 'waiting for prompt', outline: 'drafting outline', design: 'writing slide', edit: 'editing slide 3', image: 'creating cover image', ready: 'deck ready' },
    stages: ['parse_docs · Docling', 'web_search · DuckDuckGo', 'rag_retrieval · pgvector + Qdrant', 'structure_slides · LLM', 'route_assets · Flux / Icon / VLM'],
    editStages: ['locate_slide', 'rewrite_content · LLM', 'regenerate_image · Flux'],
    imgStages: ['compose_prompt · LLM', 'generate_image · Flux'],
    deck: [
      { type: 'title', otl: 'Introduction — what RAG is and why it matters now', accent: '#a78bfa', title: 'RAG, Explained', subtitle: 'How retrieval turns a general model into a domain expert' },
      { type: 'content', otl: 'Why grounding matters for trustworthy answers', kicker: 'Context', accent: '#f472b6', img: '/assets/slides/art-pink.svg', title: 'Why it matters', bullets: ['LLMs confidently hallucinate without grounding', 'RAG injects trusted, up-to-date facts at query time', 'Every claim can be traced back to its source'] },
      { type: 'content', otl: 'How retrieval-augmented generation works, step by step', kicker: 'Mechanism', accent: '#38bdf8', img: '/assets/slides/art-sky.svg', title: 'How it works', bullets: ['Embed and index your documents into vectors', 'Retrieve the most relevant chunks per question', 'Generate a grounded, cited answer'] },
      { type: 'diagram', otl: 'The RAG pipeline at a glance', accent: '#8b5cf6', title: 'The RAG pipeline', steps: [
        { icon: 'query', label: 'Query', sub: 'question' },
        { icon: 'embed', label: 'Embed', sub: 'to vectors' },
        { icon: 'db', label: 'Retrieve', sub: 'top-k · Vector DB' },
        { icon: 'llm', label: 'LLM', sub: 'augment + generate' },
        { icon: 'answer', label: 'Answer', sub: 'grounded + cited' },
      ] },
      { type: 'stat', otl: 'The measurable impact on factual accuracy', accent: '#34d399', value: '3×', label: 'fewer factual errors versus a raw LLM baseline' },
      { type: 'closing', otl: 'Takeaway — ground your AI in real, sourced data', accent: '#fbbf24', title: 'Ground your AI', subtitle: 'From confident guesses to sourced answers' },
    ],
    edit: { idx: 2, img: '/assets/slides/art-teal.svg', bulletIdx: 1, bullet: 'Top-k semantic retrieval per query', accent: '#2dd4bf' },
    cover: { idx: 0, img: '/assets/slides/art-violet.svg' },
  },
  ar: {
    head: 'ppgen · صِف العرض الذي تريده',
    file: 'rag_whitepaper.pdf', filePages: '12 صفحة', source: 'مُسند · rag_whitepaper.pdf',
    prompt: 'حوّل ملف الـ PDF إلى عرض من 6 شرائح عن Retrieval-Augmented Generation.',
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
    caps: { idle: 'بانتظار الـ prompt', outline: 'إعداد المخطّط', design: 'كتابة الشريحة', edit: 'تعديل الشريحة 3', image: 'توليد صورة الغلاف', ready: 'العرض جاهز' },
    stages: ['parse_docs · Docling', 'web_search · DuckDuckGo', 'rag_retrieval · pgvector + Qdrant', 'structure_slides · LLM', 'route_assets · Flux / Icon / VLM'],
    editStages: ['locate_slide', 'rewrite_content · LLM', 'regenerate_image · Flux'],
    imgStages: ['compose_prompt · LLM', 'generate_image · Flux'],
    deck: [
      { type: 'title', otl: 'مقدمة — ما هو RAG ولماذا الآن', accent: '#a78bfa', title: 'شرح الـ RAG', subtitle: 'كيف يحوّل الاسترجاع نموذجًا عامًا إلى خبير في مجالك' },
      { type: 'content', otl: 'لماذا الإسناد مهم لإجابات موثوقة', kicker: 'السياق', accent: '#f472b6', img: '/assets/slides/art-pink.svg', title: 'لماذا يهم؟', bullets: ['النماذج تهلوس بثقة بدون إسناد', 'RAG يضخّ حقائق موثوقة ومحدّثة وقت الاستعلام', 'كل ادعاء يمكن تتبّعه إلى مصدره'] },
      { type: 'content', otl: 'كيف يعمل الـ RAG خطوة بخطوة', kicker: 'الآلية', accent: '#38bdf8', img: '/assets/slides/art-sky.svg', title: 'كيف يعمل؟', bullets: ['تحويل مستنداتك إلى vectors وفهرستها', 'استرجاع الأجزاء الأكثر صلة لكل سؤال', 'توليد إجابة مُسندة بمصادر'] },
      { type: 'diagram', otl: 'خط الـ RAG pipeline في لمحة', accent: '#8b5cf6', title: 'RAG pipeline', steps: [
        { icon: 'query', label: 'Query', sub: 'سؤال المستخدم' },
        { icon: 'embed', label: 'Embed', sub: 'تحويل إلى vectors' },
        { icon: 'db', label: 'Retrieve', sub: 'top-k · Vector DB' },
        { icon: 'llm', label: 'LLM', sub: 'توليد مُعزَّز' },
        { icon: 'answer', label: 'Answer', sub: 'إجابة مُسندة' },
      ] },
      { type: 'stat', otl: 'الأثر القابل للقياس على دقة الحقائق', accent: '#34d399', value: '3×', label: 'أخطاء واقعية أقل مقابل LLM خام' },
      { type: 'closing', otl: 'الخلاصة — ثبّت ذكاءك على بيانات حقيقية ومُسندة', accent: '#fbbf24', title: 'ثبّت ذكاءك على الحقائق', subtitle: 'من التخمين الواثق إلى إجابات مُسندة' },
    ],
    edit: { idx: 2, img: '/assets/slides/art-teal.svg', bulletIdx: 1, bullet: 'استرجاع دلالي top-k لكل استعلام', accent: '#2dd4bf' },
    cover: { idx: 0, img: '/assets/slides/art-violet.svg' },
  },
}

// A real (bundled) generated image, revealed with a generation shimmer.
function GenImage({ src, v, full }) {
  return (
    <div className={`ppg-genimg${full ? ' full' : ''}`} key={`${src}-${v}`}>
      <img src={src} alt="" loading="lazy" />
      <span className="ppg-genimg-badge"><Glyph d={Ico.spark} /> Flux</span>
    </div>
  )
}

function Caret() { return <span className="apa-caret" /> }

function Slide({ b, source }) {
  const { phase, slide, head, sub, lines, caret, imgV } = b
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
        {hasImg && <GenImage src={slide.img} v={imgV || 0} full />}
        {hasImg && <span className="ppg-cover-tint" />}
        <div className={`ppg-cover-text${hasImg ? ' on-img' : ''}`}>
          <h5>{head}{caret === 'head' && <Caret />}</h5>
          <p>{sub}{caret === 'sub' && <Caret />}</p>
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
  if (slide.type === 'diagram') {
    return (
      <div className="ppg-slide diagram build" style={{ '--ac': slide.accent }}>
        <h5>{head}{caret === 'head' && <Caret />}</h5>
        {phase === 'done' && (
          <div className="ppg-diagram">
            {slide.steps.map((st, i) => (
              <Fragment key={i}>
                <div className="ppg-dnode" style={{ animationDelay: `${i * 130}ms` }}>
                  <span className="ppg-dnode-ic"><Glyph d={Ico[st.icon]} /></span>
                  <strong>{st.label}</strong>
                  <small>{st.sub}</small>
                </div>
                {i < slide.steps.length - 1 && (
                  <span className="ppg-darrow" style={{ animationDelay: `${i * 130 + 65}ms` }} />
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="ppg-slide content build" style={{ '--ac': slide.accent }}>
      <div className="ppg-body">
        {slide.kicker && <span className="ppg-kicker">{slide.kicker}</span>}
        <h5>{head}{caret === 'head' && <Caret />}</h5>
        <ul>
          {lines.map((txt, i) => (
            <li key={i} className={b.markIdx === i ? 'mark' : ''}>
              {txt}{caret === i && <Caret />}
            </li>
          ))}
        </ul>
        <span className="ppg-source"><Glyph d={Ico.check} />{source}</span>
      </div>
      <GenImage src={slide.img} v={imgV || 0} />
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
      mode: s.mode, outline: s.outline,
      build: s.build && { ...s.build, lines: s.build.lines ? [...s.build.lines] : [] },
      thumbs: [...s.thumbs], cap: s.cap,
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
    // stream a string word-by-word into build via apply(partial)
    const stream = async (apply, target, ms = 42) => {
      const words = String(target).split(' ')
      let acc = ''
      for (let i = 0; i < words.length && alive; i++) {
        acc += (i ? ' ' : '') + words[i]; apply(acc); commit(); await wait(ms)
      }
    }
    const fullBuild = (idx, slide, extra = {}) => ({
      idx, phase: 'done', slide, head: slide.title || '', sub: slide.subtitle || '',
      lines: slide.bullets ? [...slide.bullets] : [], caret: null, ...extra,
    })

    async function writeSlide(idx, slide) {
      s.cap = `${S.caps.design} ${idx + 1}`
      s.build = { idx, phase: 'skeleton', slide }; commit(); await wait(430)
      s.build = { idx, phase: 'stream', slide, head: '', sub: '', lines: [], caret: 'head', imgV: 0 }; commit(); await wait(120)
      if (slide.type === 'title' || slide.type === 'closing') {
        await stream((v) => { s.build.head = v }, slide.title)
        s.build.caret = 'sub'; commit()
        await stream((v) => { s.build.sub = v }, slide.subtitle)
      } else if (slide.type === 'stat') {
        s.build = fullBuild(idx, slide); commit(); await wait(300)
      } else if (slide.type === 'diagram') {
        await stream((v) => { s.build.head = v }, slide.title)
        s.build.caret = null; s.build.phase = 'done'; commit()
        await wait(slide.steps.length * 140 + 350)
      } else {
        await stream((v) => { s.build.head = v }, slide.title)
        for (let j = 0; j < slide.bullets.length && alive; j++) {
          s.build.lines.push(''); s.build.caret = j; commit()
          await stream((v) => { s.build.lines[j] = v }, slide.bullets[j], 34)
        }
      }
      s.build.caret = null; s.build.phase = 'done'; commit(); await wait(260)
      s.thumbs.push(idx); commit(); await wait(140)
    }

    async function loop() {
      while (alive) {
        Object.assign(s, { messages: [], mode: 'outline', outline: 0, build: null, thumbs: [], cap: S.caps.idle })
        commit(); await wait(500)

        // 1 — upload + prompt → outline → write slides
        pushUser({ name: S.file, pages: S.filePages }); await wait(650)
        await typeUser(S.prompt); await wait(300)
        pushBot(S.botOutline); s.cap = S.caps.outline; commit(); await wait(450)
        await pushTrace(S.stages.slice(0, 3), 360)
        for (let i = 0; i < deck.length && alive; i++) { s.outline = i + 1; commit(); await wait(320) }
        await wait(400)
        setBot(S.botBuild); s.mode = 'deck'; last().trace.push(S.stages[3]); commit(); await wait(380)
        last().trace.push(S.stages[4]); commit(); await wait(280)
        for (let i = 0; i < deck.length && alive; i++) await writeSlide(i, deck[i])
        setBot(S.botReady(deck.length), 'done'); s.cap = S.caps.ready; commit(); await wait(1900)

        // 2 — edit prompt (appended) → rewrite + regenerate image
        pushUser(); await wait(250); await typeUser(S.editPrompt); await wait(300)
        pushBot(S.botEdit); s.cap = S.caps.edit; commit(); await wait(400)
        await pushTrace(S.editStages, 420)
        const e = S.edit
        deck[e.idx] = { ...deck[e.idx], accent: e.accent }
        s.build = { idx: e.idx, phase: 'skeleton', slide: deck[e.idx] }; commit(); await wait(500)
        deck[e.idx].bullets[e.bulletIdx] = e.bullet; deck[e.idx].img = e.img
        s.build = fullBuild(e.idx, deck[e.idx], { imgV: 1, markIdx: e.bulletIdx }); commit(); await wait(950)
        setBot(S.botEditDone, 'done'); s.cap = S.caps.ready; commit(); await wait(1900)

        // 3 — create image prompt (appended) → generate cover image
        pushUser(); await wait(250); await typeUser(S.imgPrompt); await wait(300)
        pushBot(S.botImg); s.cap = S.caps.image; commit(); await wait(400)
        await pushTrace(S.imgStages, 480)
        const c = S.cover
        s.build = { idx: c.idx, phase: 'skeleton', slide: { ...deck[c.idx], img: c.img } }; commit(); await wait(560)
        deck[c.idx] = { ...deck[c.idx], img: c.img }
        s.build = fullBuild(c.idx, deck[c.idx], { imgV: 1 }); commit(); await wait(1000)
        setBot(S.botImgDone, 'done'); s.cap = S.caps.ready; commit(); await wait(2600)
      }
    }
    loop()
    return () => { alive = false; clearTimeout(timer) }
  }, [playing, lang])

  const S = STR[lang] || STR.en
  const lastMsg = sc.messages[sc.messages.length - 1]
  const running = lastMsg?.role === 'bot' && lastMsg.status === 'work'

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
                <div className="apa-bubble user">{m.text}{m.caret && <Caret />}</div>
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
                {sc.build ? <Slide b={sc.build} source={S.source} /> : <div className="ppg-slide empty"><Glyph d={Ico.deck} /></div>}
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
