import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from './demo/usePlayer'
import { Chapters, DocRow, DropZone, SamplePdf } from './demo/parts'

/* A walkthrough of Baleegh in the app's own style, in three scenes: the agent
   wizard, a PDF going into the agent's knowledge base, and a live call whose
   answers light up the passage they came from. Stage times are medians from
   the repo's latency benchmark: 40 turns, RTX 4090, gemma-4-12b AWQ on vLLM,
   streamed TTS. */

/* ---------- Voice lens: a port of the app's VoiceLens canvas ---------- */

const LOOKS = {
  connecting: { rgb: [79, 184, 232], amp: 0.06, speed: 0.5, glow: 0.4 },
  listening: { rgb: [79, 184, 232], amp: 0.08, speed: 0.7, glow: 0.65 },
  hearing: { rgb: [150, 105, 250], amp: 0.28, speed: 1.4, glow: 1 },
  thinking: { rgb: [210, 85, 200], amp: 0.36, speed: 1.1, glow: 0.9 },
  speaking: { rgb: [74, 222, 150], amp: 0.5, speed: 1.6, glow: 1 },
}

const STRANDS = [
  { freq: 1.0, speed: 1.0, phase: 0.0, weight: 1.0 },
  { freq: 1.6, speed: -0.8, phase: 1.3, weight: 0.85 },
  { freq: 2.2, speed: 1.3, phase: 2.6, weight: 0.7 },
  { freq: 0.7, speed: -1.1, phase: 4.1, weight: 0.9 },
  { freq: 2.9, speed: 0.7, phase: 5.2, weight: 0.55 },
  { freq: 1.3, speed: -1.6, phase: 0.9, weight: 0.75 },
  { freq: 3.4, speed: 1.1, phase: 3.3, weight: 0.45 },
]

const rgba = ([r, g, b], a) => `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`

// Light-theme drawing only: the portfolio has no dark mode.
function drawLens(ctx, width, height, clock, look) {
  const { amp, glow } = look
  const rgb = look.rgb.map((c) => c * 0.72)
  const cx = width / 2
  const cy = height / 2
  const halfWidth = width * 0.47
  const swing = height * 0.44 * amp

  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'multiply'

  const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, halfWidth * 0.55)
  bloom.addColorStop(0, rgba(rgb, 0.22 * glow))
  bloom.addColorStop(1, rgba(rgb, 0))
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, 0.2 + amp * 0.55)
  ctx.translate(-cx, -cy)
  ctx.fillStyle = bloom
  ctx.fillRect(cx - halfWidth, cy - halfWidth, halfWidth * 2, halfWidth * 2)
  ctx.restore()

  const core = rgb.map((c) => c * 0.8)
  const stroke = ctx.createLinearGradient(cx - halfWidth, 0, cx + halfWidth, 0)
  stroke.addColorStop(0, rgba(rgb, 0))
  stroke.addColorStop(0.12, rgba(rgb, 0.55 * glow))
  stroke.addColorStop(0.5, rgba(core, glow))
  stroke.addColorStop(0.88, rgba(rgb, 0.55 * glow))
  stroke.addColorStop(1, rgba(rgb, 0))
  ctx.strokeStyle = stroke
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const paths = STRANDS.map((s) => {
    const path = new Path2D()
    for (let i = 0; i <= 120; i += 1) {
      const u = (i / 120) * 2 - 1
      const envelope = (1 - u * u) ** 1.7
      const wave = Math.sin(u * s.freq * Math.PI + clock * s.speed + s.phase)
      const x = cx + u * halfWidth
      const y = cy + wave * envelope * swing * s.weight
      if (i === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
    }
    return path
  })
  ctx.globalAlpha = 0.18
  ctx.lineWidth = 6
  paths.forEach((p) => ctx.stroke(p))
  ctx.globalAlpha = 0.9
  ctx.lineWidth = 1.3
  paths.forEach((p) => ctx.stroke(p))
  ctx.globalAlpha = 1
}

function VoiceLens({ state }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const current = { ...LOOKS.connecting, rgb: [...LOOKS.connecting.rgb] }
    let width = 0
    let height = 0
    let clock = 1
    let frame = 0

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      width = box.width
      height = box.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    let last = performance.now()
    frame = requestAnimationFrame(function step(now) {
      const dt = Math.min(now - last, 64) / 1000
      last = now
      const target = LOOKS[stateRef.current] || LOOKS.listening
      clock += dt * current.speed
      let goal = target.amp
      // No microphone here: the caller's voice and the agent's are simulated pulses.
      if (stateRef.current === 'hearing') goal += 0.22 * (0.5 + 0.5 * Math.sin(clock * 4.3) * Math.sin(clock * 2.1 + 1))
      if (stateRef.current === 'speaking') goal *= 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(clock * 3.1) * Math.sin(clock * 1.7 + 0.8))
      const k = 1 - Math.exp(-dt / 0.22)
      current.amp += (goal - current.amp) * k
      current.glow += (target.glow - current.glow) * k
      current.speed += (target.speed - current.speed) * k
      current.rgb = current.rgb.map((c, i) => c + (target.rgb[i] - c) * k)
      drawLens(ctx, width, height, reduced ? 1 : clock, current)
      frame = requestAnimationFrame(step)
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="bl-lens" aria-hidden="true" />
}

/* ---------- Icons: the app's Lucide-like set (24 grid, 1.75 stroke) ---------- */

const PATHS = {
  chevronDown: 'M6 9l6 6 6-6',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM19 11a7 7 0 0 1-14 0M12 18v3',
  phoneOff: 'M10.7 13.3a16 16 0 0 0 3.4 2.6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 4.2 2 2 0 0 1 5.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L9 9.7M22 2 2 22',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  radio: 'M4.9 19.1a10 10 0 0 1 0-14.2M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M19.1 4.9a10 10 0 0 1 0 14.2M12 12h.01',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  waves: 'M2 12h2M6 8v8M10 5v14M14 8v8M18 10v4M22 12h0',
  type: 'M4 7V4h16v3M9 20h6M12 4v16',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  cpu: 'M6 6h12v12H6zM9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  volume: 'M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  check: 'M20 6 9 17l-5-5',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  bot: 'M12 8V4M8 4h8M5 8h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM9 13v2M15 13v2',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5',
}
function Icon({ name, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

/* ---------- The walkthrough ---------- */

// Two real benchmark turns: the "Faisal" real-estate agent answering from a
// Riyadh price sheet. The call is Najdi Arabic in either UI language.
const TURNS = [
  {
    ask: 'كم سعر متر الأرض في حطين؟',
    spoken: 'أبشر، متوسط سعر المتر للأراضي السكنية في حي حطين هو ستة آلاف وميتين ريال.',
    hl: 'price',
    speak: { en: '6,200 → ستة آلاف وميتين', ar: '6,200 ← ستة آلاف وميتين' },
  },
  {
    ask: 'وكم عمولة السعي عند البيع؟',
    spoken: 'عمولة السعي عند البيع اثنين ونص بالمية من قيمة العقار.',
    hl: 'commission',
    speak: { en: '2.5% → اثنين ونص بالمية', ar: '2.5% ← اثنين ونص بالمية' },
  },
]

const STAGES = [
  { id: 'livekit', icon: 'radio' },
  { id: 'warmup', icon: 'zap', time: '0.93 s' },
  { id: 'turn', icon: 'waves', time: '0.40 s' },
  { id: 'stt', icon: 'type', time: '0.08 s' },
  { id: 'rag', icon: 'search', time: '0.03 s', tool: true },
  { id: 'llm', icon: 'cpu', time: '0.44 s' },
  { id: 'speak', icon: 'hash' },
  { id: 'tts', icon: 'volume', time: '0.05 s' },
]
const PER_TURN = ['turn', 'stt', 'rag', 'llm', 'speak', 'tts']

// GPU memory at idle from the benchmark (MiB of a 24,564 MiB card).
const GPU = { total: 24564, parts: [['stt', 4806], ['tts', 6160], ['llm', 11078]] }

// Rough scene lengths in seconds, for the chapter progress bars.
const DURATIONS = [12.5, 9.5, 27]
const NAV_ICONS = ['home', 'bot', 'file', 'volume', 'mic']
const TOOLS = ['rag', 'end_call']

const STR = {
  en: {
    brand: 'Baleegh',
    nav: ['Home', 'Agents', 'Documents', 'Text to Speech', 'Speech to Text'],
    chapters: [['Create the agent', 'Three-step wizard'], ['Add knowledge', 'Upload a PDF'], ['Take a call', 'Answers from that PDF']],
    wizTitle: 'Agent setup',
    steps: [
      ['Setup agent', 'Define identity, role and language.'],
      ['Voice & model', 'Pick how it sounds and how it thinks.'],
      ['Review & create', 'Check the details before the agent is created.'],
    ],
    f: { name: 'Agent name', role: 'Agent role', language: 'Language', voice: 'Voice', model: 'Model', tools: 'Tools the agent may call' },
    v: {
      name: 'Faisal', role: 'Real-estate assistant for Riyadh listings', language: 'Arabic · Najdi',
      voice: 'Faisal', voiceSub: 'Fasee7 · Najdi', model: 'Baleegh v1', modelSub: 'gemma-4-12b AWQ on vLLM',
    },
    tools: { rag: 'Search the agent’s documents', end_call: 'Hang up when the caller is done' },
    next: 'Next step', create: 'Create agent', creating: 'Creating…', created: 'Agent created',
    tabs: ['Agent', 'Voice', 'Knowledge base', 'Analysis', 'Advanced'],
    kbHint: 'What the agent is allowed to answer from.',
    upload: 'Upload files',
    formats: 'PDF (scans too), Word, PowerPoint, Excel, images, TXT, MD, CSV, HTML · up to 2 MB each',
    file: 'riyadh-price-guide.pdf',
    pages: '4 pages',
    kb: { uploading: 'Uploading…', parsing: 'Parsing…', chunking: 'Chunking…', embedding: 'Embedding…', ready: 'Ready · 6 chunks' },
    kbTiming: 'parsed 4.2 s · embedded 0.8 s',
    kbNote: 'Indexed through Naseh: dense + BM25 vectors in Qdrant',
    preview: 'Preview',
    page: 'p. 2',
    empty: 'No documents yet',
    kbTitle: 'Knowledge base',
    hit: 'rag matched this passage · 0.03 s',
    ref: 'Answering from',
    gloss: [
      ['“What is the land price per metre in Hittin?”', '“Sure. Residential land in Hittin averages 6,200 riyals per metre.”'],
      ['“And the sales commission?”', '“The sales commission is 2.5% of the property value.”'],
    ],
    minimise: 'Minimise',
    agent: 'Faisal',
    voice: 'Fasee7 · Najdi',
    status: { connecting: 'Connecting…', listening: 'Listening', hearing: 'Hearing you', thinking: 'Thinking', speaking: 'Speaking' },
    hint: { connecting: 'Setting up the call', listening: 'Just talk — no button to hold', hearing: '', thinking: '', speaking: 'Say something to interrupt' },
    mute: 'Mute', end: 'End', transcript: 'Transcript',
    panelTitle: 'This turn',
    panelSub: 'Median of 40 benchmark turns · RTX 4090',
    tool: 'tool',
    stages: {
      livekit: ['LiveKit room', 'Self-hosted · WebRTC · no cloud'],
      warmup: ['Warm-up', 'STT, LLM and TTS in parallel'],
      turn: ['End of turn', 'Silero VAD + turn detector, local ONNX'],
      stt: ['Speech to text', 'Cohere Transcribe Arabic'],
      rag: ['rag', 'Document search through Naseh'],
      llm: ['Language model', 'gemma-4-12b AWQ on vLLM'],
      speak: ['Speakable text', ''],
      tts: ['Speech synthesis', 'Fasee7 Najdi on VoxCPM2 · streamed'],
    },
    ttfa: 'Time to first audio',
    before: 'before streaming',
    gpu: 'One 24 GB GPU',
    gpuParts: { stt: 'STT', tts: 'TTS', llm: 'LLM' },
  },
  ar: {
    brand: 'بليغ',
    nav: ['الرئيسية', 'الوكلاء', 'المستندات', 'تحويل النص إلى كلام', 'تحويل الكلام إلى نص'],
    chapters: [['إنشاء الوكيل', 'معالج من ثلاث خطوات'], ['إضافة المعرفة', 'رفع ملف PDF'], ['استقبال مكالمة', 'إجابات من ذلك الملف']],
    wizTitle: 'إعداد الوكيل',
    steps: [
      ['إعداد الوكيل', 'حدّد الهوية والدور واللغة.'],
      ['الصوت والنموذج', 'اختر كيف يتحدث وكيف يفكّر.'],
      ['المراجعة والإنشاء', 'راجع التفاصيل قبل إنشاء الوكيل.'],
    ],
    f: { name: 'اسم الوكيل', role: 'دور الوكيل', language: 'اللغة', voice: 'الصوت', model: 'النموذج', tools: 'الأدوات التي يجوز للوكيل استدعاؤها' },
    v: {
      name: 'فيصل', role: 'مساعد عقاري لعروض الرياض', language: 'العربية · نجدي',
      voice: 'فيصل', voiceSub: 'فصيح · نجدي', model: 'Baleegh v1', modelSub: 'gemma-4-12b AWQ على vLLM',
    },
    tools: { rag: 'البحث في مستندات الوكيل', end_call: 'إنهاء المكالمة عند انتهاء المتصل' },
    next: 'الخطوة التالية', create: 'إنشاء الوكيل', creating: 'جارٍ الإنشاء…', created: 'تم إنشاء الوكيل',
    tabs: ['الوكيل', 'الصوت', 'قاعدة المعرفة', 'التحليل', 'متقدم'],
    kbHint: 'ما يُسمح للوكيل أن يجيب منه.',
    upload: 'رفع ملفات',
    formats: 'PDF (والممسوح ضوئيًا)، Word، PowerPoint، Excel، صور، TXT، MD، CSV، HTML · حتى 2 MB لكل ملف',
    file: 'riyadh-price-guide.pdf',
    pages: '4 صفحات',
    kb: { uploading: 'جارٍ الرفع…', parsing: 'جارٍ التحليل…', chunking: 'جارٍ التقسيم…', embedding: 'جارٍ التضمين…', ready: 'جاهز · 6 مقاطع' },
    kbTiming: 'التحليل 4.2 ث · التضمين 0.8 ث',
    kbNote: 'الفهرسة عبر ناصح: متجهات Dense + BM25 في Qdrant',
    preview: 'معاينة',
    page: 'ص 2',
    empty: 'لا توجد مستندات بعد',
    kbTitle: 'قاعدة المعرفة',
    hit: 'أداة rag طابقت هذا المقطع · 0.03 ث',
    ref: 'الإجابة من',
    gloss: null,
    minimise: 'تصغير',
    agent: 'فيصل',
    voice: 'فصيح · نجدي',
    status: { connecting: 'جارٍ الاتصال…', listening: 'يستمع', hearing: 'يسمعك', thinking: 'يفكّر', speaking: 'يتحدث' },
    hint: { connecting: 'جارٍ تجهيز المكالمة', listening: 'تحدّث فحسب — لا زر تضغطه', hearing: '', thinking: '', speaking: 'قل شيئاً لمقاطعته' },
    mute: 'كتم', end: 'إنهاء', transcript: 'التفريغ',
    panelTitle: 'هذا الدور',
    panelSub: 'الوسيط لـ 40 دورًا في الاختبار · RTX 4090',
    tool: 'أداة',
    stages: {
      livekit: ['غرفة LiveKit', 'ذاتية الاستضافة · WebRTC · دون سحابة'],
      warmup: ['التسخين', 'STT والـ LLM والـ TTS معًا'],
      turn: ['نهاية الدور', 'Silero VAD + turn detector محليًا (ONNX)'],
      stt: ['تحويل الكلام لنص', 'Cohere Transcribe Arabic'],
      rag: ['rag', 'بحث المستندات عبر ناصح'],
      llm: ['النموذج اللغوي', 'gemma-4-12b AWQ على vLLM'],
      speak: ['نص قابل للنطق', ''],
      tts: ['تركيب الصوت', 'فصيح النجدي على VoxCPM2 · متدفّق'],
    },
    ttfa: 'زمن أول صوت',
    before: 'قبل البث المتدفّق',
    gpu: 'معالج GPU واحد 24 GB',
    gpuParts: { stt: 'STT', tts: 'TTS', llm: 'LLM' },
  },
}

const EMPTY = {
  // wizard
  step: 0, focus: null, name: '', role: '', language: false, voice: false, model: false, tools: [],
  press: null, creating: false, created: false,
  // knowledge base
  drop: false, file: null,
  // call
  state: 'connecting', caption: '', who: null, turn: 0, done: [], active: null, first: false, hl: null,
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function BaleeghFlow() {
  const { lang } = useLang()
  const S = STR[lang] || STR.en
  const ref = useRef(null)
  const { playing, scene, run, go } = usePlayer(ref, 3)
  const [sc, setSc] = useState(EMPTY)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!playing || scene !== 2) return undefined
    const started = Date.now()
    setElapsed(0)
    const id = setInterval(() => setElapsed((Date.now() - started) / 1000), 500)
    return () => clearInterval(id)
  }, [playing, scene, run])

  useEffect(() => {
    if (!playing) return undefined
    let alive = true
    let timer
    const wait = (ms) => new Promise((r) => { timer = setTimeout(r, ms) })
    const s = { ...EMPTY, tools: [], done: [] }
    const commit = () => alive && setSc({ ...s, tools: [...s.tools], done: [...s.done] })
    const set = async (patch, ms = 0) => { Object.assign(s, patch); commit(); if (ms) await wait(ms) }
    const type = async (key, text, ms) => {
      for (let i = 1; i <= text.length && alive; i++) { s[key] = text.slice(0, i); commit(); await wait(ms) }
    }
    const runStage = async (id, ms) => { await set({ active: id }, ms); s.done.push(id); await set({ active: null }) }
    const say = async (text, who) => {
      const words = text.split(' ')
      s.who = who
      for (let i = 1; i <= words.length && alive; i++) { s.caption = words.slice(0, i).join(' '); commit(); await wait(310) }
    }

    const wizard = async () => {
      await set({}, 600)
      await set({ focus: 'name' }, 200)
      await type('name', S.v.name, 80)
      await set({ focus: 'role' }, 250)
      await type('role', S.v.role, 30)
      await set({ focus: 'language' }, 300)
      await set({ language: true }, 600)
      await set({ focus: null, press: 'next' }, 350)
      await set({ press: null, step: 1 }, 600)
      await set({ focus: 'voice', voice: true }, 750)
      await set({ focus: 'model', model: true }, 750)
      await set({ focus: 'tools', tools: ['rag'] }, 450)
      await set({ tools: ['rag', 'end_call'] }, 650)
      await set({ focus: null, press: 'next' }, 350)
      await set({ press: null, step: 2 }, 1700)
      await set({ press: 'create' }, 300)
      await set({ press: null, creating: true }, 900)
      await set({ creating: false, created: true }, 1900)
    }

    const knowledge = async () => {
      await set({}, 700)
      await set({ drop: true }, 900)
      await set({ drop: false, file: 'uploading' }, 700)
      await set({ file: 'parsing' }, 1800)
      await set({ file: 'chunking' }, 1000)
      await set({ file: 'embedding' }, 900)
      await set({ file: 'ready' }, 2800)
    }

    const call = async () => {
      await runStage('livekit', 700)
      await runStage('warmup', 900)
      await set({ state: 'listening' }, 1000)
      for (let t = 0; t < TURNS.length && alive; t++) {
        const turn = TURNS[t]
        await set({ turn: t, state: 'hearing', hl: null, first: t > 0 && s.first }, 250)
        s.done = s.done.filter((id) => !PER_TURN.includes(id))
        await say(turn.ask, 'caller')
        await wait(500)
        await set({ state: 'thinking' })
        await runStage('turn', 700)
        await runStage('stt', 450)
        await set({ hl: turn.hl })
        await runStage('rag', 450)
        await runStage('llm', 900)
        await runStage('speak', 450)
        await runStage('tts', 450)
        await set({ first: true, state: 'speaking', caption: '' })
        await say(turn.spoken, 'agent')
        await wait(t === TURNS.length - 1 ? 2600 : 2000)
        await set({ state: 'listening', caption: '', who: null }, 1000)
      }
    }

    ;[wizard, knowledge, call][scene]().then(() => alive && go(scene + 1))
    return () => { alive = false; clearTimeout(timer) }
  }, [playing, scene, run, S, go])

  const initial = lang === 'ar' ? 'ف' : 'F'
  const caret = <i className="bl-caret" />
  const check = <span className="bl-ok"><Icon name="check" size={13} /></span>
  const field = (id, label, children) => (
    <div className={`bl-field${sc.focus === id ? ' is-focus' : ''}`}>
      <span className="bl-label">{label}</span>
      {children}
    </div>
  )

  const sidebar = (
    <aside className="bl-side">
      <span className="bl-wordmark">{S.brand}</span>
      <ul>
        {S.nav.map((item, i) => (
          <li key={i} className={i === 1 ? 'is-active' : undefined}>
            <Icon name={NAV_ICONS[i]} size={15} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  )

  const wizardScene = (
    <div className="bl-app">
      {sidebar}
      <div className="bl-main">
        <h4 className="bl-h">{S.wizTitle}</h4>
        <ol className="bl-stepper">
          {S.steps.map(([title, desc], i) => (
            <li key={i} className={`${i === sc.step ? 'is-active' : ''}${i < sc.step || sc.created ? ' is-done' : ''}`}>
              <span className="bl-step-n">{i < sc.step || sc.created ? <Icon name="check" size={12} /> : i + 1}</span>
              <span className="bl-step-txt">
                <strong>{title}</strong>
                <small>{desc}</small>
              </span>
            </li>
          ))}
        </ol>

        <div className="bl-form" key={sc.step}>
          {sc.step === 0 && (
            <>
              {field('name', S.f.name, <span className="bl-input">{sc.name}{sc.focus === 'name' && caret}</span>)}
              {field('role', S.f.role, <span className="bl-input">{sc.role}{sc.focus === 'role' && caret}</span>)}
              {field('language', S.f.language, (
                <span className="bl-input bl-select">
                  {sc.language ? S.v.language : <em>—</em>}
                  <Icon name="chevronDown" size={14} />
                </span>
              ))}
            </>
          )}
          {sc.step === 1 && (
            <>
              {field('voice', S.f.voice, (
                <span className={`bl-option${sc.voice ? ' is-on' : ''}`}>
                  <span className="bl-face bl-face-sm">{initial}</span>
                  <span className="bl-option-txt"><strong>{S.v.voice}</strong><small>{S.v.voiceSub}</small></span>
                  <span className="bl-wave" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                  {sc.voice && check}
                </span>
              ))}
              {field('model', S.f.model, (
                <span className={`bl-option${sc.model ? ' is-on' : ''}`}>
                  <span className="bl-tile-ic"><Icon name="cpu" /></span>
                  <span className="bl-option-txt"><strong>{S.v.model}</strong><small>{S.v.modelSub}</small></span>
                  {sc.model && check}
                </span>
              ))}
              {field('tools', S.f.tools, (
                <span className="bl-toolrows">
                  {TOOLS.map((tool) => (
                    <span key={tool} className={`bl-toolrow${sc.tools.includes(tool) ? ' is-on' : ''}`}>
                      <span className="bl-switch" />
                      <code>{tool}</code>
                      <small>{S.tools[tool]}</small>
                    </span>
                  ))}
                </span>
              ))}
            </>
          )}
          {sc.step === 2 && (
            <dl className="bl-review">
              <div><dt>{S.f.name}</dt><dd>{S.v.name}</dd></div>
              <div><dt>{S.f.role}</dt><dd>{S.v.role}</dd></div>
              <div><dt>{S.f.language}</dt><dd>{S.v.language}</dd></div>
              <div><dt>{S.f.voice}</dt><dd>{S.v.voice} · {S.v.voiceSub}</dd></div>
              <div><dt>{S.f.model}</dt><dd>{S.v.model} · {S.v.modelSub}</dd></div>
              <div><dt>{S.f.tools}</dt><dd>{TOOLS.map((tool) => <code key={tool}>{tool}</code>)}</dd></div>
            </dl>
          )}
        </div>

        <footer className="bl-foot">
          {sc.created ? (
            <span className="bl-toast">{check}{S.created}</span>
          ) : sc.step < 2 ? (
            <span className={`bl-btn${sc.press === 'next' ? ' is-press' : ''}`}>{S.next}</span>
          ) : (
            <span className={`bl-btn${sc.press === 'create' ? ' is-press' : ''}`}>
              {sc.creating && <span className="bl-spin" />}
              {sc.creating ? S.creating : S.create}
            </span>
          )}
        </footer>
      </div>
    </div>
  )

  const knowledgeScene = (
    <div className="bl-app">
      {sidebar}
      <div className="bl-main">
        <div className="bl-agent-head">
          <span className="bl-face bl-face-sm">{initial}</span>
          <h4 className="bl-h">{S.agent}</h4>
        </div>
        <ul className="bl-tabs">
          {S.tabs.map((tab, i) => <li key={i} className={i === 2 ? 'is-active' : undefined}>{tab}</li>)}
        </ul>
        <div className="bl-kb">
          <div className="bl-kb-left">
            <p className="bl-hint">{S.kbHint}</p>
            <DropZone title={S.upload} formats={S.formats} over={sc.drop} dragName={S.file} />
            {sc.file && (
              <DocRow name={S.file} meta={S.pages} status={sc.file} label={S.kb[sc.file]} timing={S.kbTiming} />
            )}
            {sc.file === 'ready' && <p className="dm-note"><Icon name="search" size={12} />{S.kbNote}</p>}
          </div>
          <div className="dm-viewer">
            <div className="dm-viewer-head">
              <span>{S.preview}</span>
              {sc.file && <small>{S.file} · {S.page}</small>}
            </div>
            {sc.file ? (
              <SamplePdf lang="ar" mode={sc.file === 'parsing' ? 'scan' : sc.file === 'chunking' || sc.file === 'embedding' ? 'chunks' : null} />
            ) : (
              <p className="dm-viewer-empty">{S.empty}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const { state } = sc
  const turn = TURNS[sc.turn]
  const gloss = S.gloss && sc.who && S.gloss[sc.turn][sc.who === 'caller' ? 0 : 1]
  const gpuUsed = GPU.parts.reduce((a, [, v]) => a + v, 0)

  const callScene = (
    <div className="bl-call">
      {/* The call dialog */}
      <div className={`bl-vm bl-vm-${state}`}>
        <header className="bl-vm-head">
          <span className="bl-chip"><Icon name="chevronDown" size={15} />{S.minimise}</span>
          <span className="bl-chip bl-timer"><span className="bl-live-dot" />{fmt(elapsed)}</span>
        </header>

        <div className="bl-stage">
          <VoiceLens state={state} />
          <div className="bl-identity">
            <span className="bl-face">{initial}</span>
            <h4 className="bl-name">{S.agent}</h4>
            <p className="bl-voice">{S.voice}</p>
          </div>
          <div className="bl-status">
            <span className="bl-status-label">{S.status[state]}</span>
            {S.hint[state] && <span className="bl-status-hint">{S.hint[state]}</span>}
          </div>
          <p className={`bl-caption${sc.who ? ` bl-caption-${sc.who}` : ''}`} dir="rtl">
            <span key={sc.who || 'idle'}>{sc.caption}</span>
          </p>
          <p className="bl-gloss">{gloss}</p>
        </div>

        <footer className="bl-dock">
          <span className="bl-key"><Icon name="mic" size={20} /><small>{S.mute}</small></span>
          <span className="bl-key bl-key-end"><Icon name="phoneOff" size={22} /><small>{S.end}</small></span>
          <span className="bl-key"><Icon name="chat" size={20} /><small>{S.transcript}</small></span>
        </footer>
      </div>

      {/* The uploaded PDF, with the passage the answer came from */}
      <div className={`dm-viewer${sc.hl ? ' is-hit' : ''}`}>
        <div className="dm-viewer-head">
          <span>{S.kbTitle}</span>
          <small>{S.file} · {S.page}</small>
        </div>
        <SamplePdf lang="ar" highlight={sc.hl} strong={state === 'speaking'} />
        <p className={`dm-viewer-foot${sc.hl ? ' show' : ''}`}>
          <Icon name="search" size={12} />
          {state === 'speaking' ? `${S.ref} ${S.file} · ${S.page}` : S.hit}
        </p>
      </div>

      {/* The pipeline, as an app panel */}
      <div className="bl-panel">
        <div className="bl-panel-head">
          <span className="bl-tile-ic"><Icon name="activity" /></span>
          <div>
            <strong>{S.panelTitle}</strong>
            <small>{S.panelSub}</small>
          </div>
        </div>

        <ul className="bl-rows">
          {STAGES.map((st) => {
            const [name, desc] = S.stages[st.id]
            const done = sc.done.includes(st.id)
            const active = sc.active === st.id
            return (
              <li key={st.id} className={`bl-row${done ? ' is-done' : ''}${active ? ' is-active' : ''}`}>
                <span className="bl-tile-ic"><Icon name={st.icon} /></span>
                <span className="bl-row-txt">
                  <span className="bl-row-name">
                    {name}
                    {st.tool && <span className="bl-tool">{S.tool}</span>}
                  </span>
                  <small>{st.id === 'speak' ? turn.speak[lang] || turn.speak.en : desc}</small>
                </span>
                <span className="bl-row-end">
                  {active && <span className="bl-spin" />}
                  {done && st.time && <span className="bl-time">{st.time}</span>}
                  {done && check}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="bl-ttfa">
          <div className="bl-ttfa-top">
            <span className="bl-eyebrow">{S.ttfa}</span>
            <span className={`bl-badge-live${sc.first ? ' show' : ''}`}>−56%</span>
          </div>
          <div className="bl-meter">
            <span className="bl-meter-label">1.00 s</span>
            <span className="bl-meter-track"><i className={sc.first ? 'show' : ''} style={{ width: '44%' }} /></span>
          </div>
          <div className="bl-meter bl-meter-before">
            <span className="bl-meter-label">2.27 s</span>
            <span className="bl-meter-track"><i className="show" style={{ width: '100%' }} /></span>
            <small>{S.before}</small>
          </div>
        </div>

        <div className="bl-gpu">
          <div className="bl-ttfa-top">
            <span className="bl-eyebrow">{S.gpu}</span>
            <span className="bl-time">{(gpuUsed / 1024).toFixed(1)} / {(GPU.total / 1024).toFixed(1)} GiB</span>
          </div>
          <div className="bl-gpu-bar">
            {GPU.parts.map(([k, v]) => (
              <span key={k} className={`bl-gpu-${k}`} style={{ width: `${(v / GPU.total) * 100}%` }}>
                {S.gpuParts[k]} {(v / 1024).toFixed(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bl" ref={ref}>
      <Chapters items={S.chapters} scene={scene} run={run} durations={DURATIONS} onPick={go} />
      <div className="bl-screen" key={scene}>
        {[wizardScene, knowledgeScene, callScene][scene]}
      </div>
    </div>
  )
}
