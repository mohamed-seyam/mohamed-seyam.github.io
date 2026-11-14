import { memo, useLayoutEffect, useState } from 'react'

/* Pieces shared by the Baleegh and Naseh walkthroughs: the upload
   drop zone and file row, and the sample PDF page both demos cite.
   Colours come from the --dm-* variables each demo sets on its root. */

const STAGES = ['parsing', 'chunking', 'embedding']

export const DropZone = memo(function DropZone({ title, formats, over, dragName }) {
  return (
    <div className={`dm-drop${over ? ' is-over' : ''}`} data-cur="drop">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
      <strong>{title}</strong>
      <small>{formats}</small>
      {over && (
        <span className="dm-drag">
          <span className="dm-ftype">PDF</span>
          {dragName}
        </span>
      )}
    </div>
  )
})

// status: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'ready'
export const DocRow = memo(function DocRow({ name, meta, status, label, timing }) {
  const pos = STAGES.indexOf(status)
  return (
    <div className="dm-file">
      <span className="dm-ftype dm-ftype-lg">PDF</span>
      <span className="dm-file-body">
        <span className="dm-file-name">{name}</span>
        <span className="dm-file-meta">
          {meta}
          {status === 'ready' && timing && <> · {timing}</>}
        </span>
        <span className="dm-pipeline">
          <span className="dm-steps" aria-hidden="true">
            {STAGES.map((stage, p) => (
              <span key={stage} className={`dm-step${status === 'ready' || p < pos ? ' done' : p === pos ? ' active' : ''}`} />
            ))}
          </span>
          <span className={`dm-pipeline-label${status === 'ready' ? ' is-ready' : ''}`}>{label}</span>
        </span>
      </span>
    </div>
  )
})

// The sample documents. Made-up listing data, except the three figures the
// benchmark agent actually answered with (6,200 / 2.5% / 30%).
const PAGE = {
  en: {
    kicker: 'Riyadh price guide · 2025',
    title: 'Average prices by district',
    lead: 'Asking prices for residential plots, north Riyadh.',
    cols: ['District', 'Residential land', 'Change'],
    unit: 'SAR / m²',
    rows: [['Hittin', '6,200', '+4%'], ['Al Malqa', '5,400', '+3%'], ['Al Narjis', '4,100', '+6%'], ['Al Arid', '3,300', '+5%']],
    terms: 'Brokerage terms',
    commission: ['Sales commission:', '2.5%', 'of the property value.'],
    down: 'Down payment on land: 30% of the price.',
    foot: 'p. 2 / 4',
    chunk: 'chunk',
    note: 'Prices are averages of listed plots and are updated every quarter.',
    termsDoc: {
      kicker: 'Brokerage terms · 2025',
      title: 'Fees and payments',
      lead: 'Standard terms for sales handled by the office.',
      extra: ['Rental commission: 5% of the first year’s rent.', 'A written offer stays valid for 14 days.'],
      foot: 'p. 1 / 2',
    },
  },
  ar: {
    kicker: 'دليل أسعار الرياض · 2025',
    title: 'متوسط الأسعار حسب الحي',
    lead: 'أسعار العرض للأراضي السكنية، شمال الرياض.',
    cols: ['الحي', 'الأراضي السكنية', 'التغيّر'],
    unit: 'ريال / م²',
    rows: [['حطين', '6,200', '+4%'], ['الملقا', '5,400', '+3%'], ['النرجس', '4,100', '+6%'], ['العارض', '3,300', '+5%']],
    terms: 'شروط الوساطة',
    commission: ['عمولة السعي عند البيع:', '2.5%', 'من قيمة العقار.'],
    down: 'الدفعة المقدمة للأراضي: 30% من السعر.',
    foot: 'ص 2 / 4',
    chunk: 'مقطع',
    note: 'الأسعار متوسطات للأراضي المعروضة وتُحدَّث كل ربع سنة.',
    termsDoc: {
      kicker: 'شروط الوساطة · 2025',
      title: 'الرسوم والدفعات',
      lead: 'الشروط المعتمدة لعمليات البيع عبر المكتب.',
      extra: ['عمولة الإيجار: 5% من إيجار السنة الأولى.', 'العرض المكتوب سارٍ لمدة 14 يومًا.'],
      foot: 'ص 1 / 2',
    },
  },
}

// highlight: 'price' | 'commission' | null. mode: 'scan' (parsing) | 'chunks'.
// doc: 'prices' (the price guide alone) | 'terms' (the brokerage terms); with
// neither, one page carries both the table and the terms.
export const SamplePdf = memo(function SamplePdf({ lang, highlight, strong, mode, doc }) {
  const c = PAGE[lang] || PAGE.en
  const terms = doc === 'terms'
  const top = terms ? c.termsDoc : c
  const hl = (key) => (highlight === key ? ` is-hl${strong ? ' is-strong' : ''}` : '')
  return (
    <div className={`spdf${mode ? ` spdf-${mode}` : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <p className="spdf-kicker">{top.kicker}</p>
      <h5 className="spdf-title">{top.title}</h5>
      <p className="spdf-lead">{top.lead}</p>
      {!terms && (
        <div className="spdf-block" data-chunk={`${c.chunk} 3`}>
          <table>
            <thead>
              <tr>
                <th>{c.cols[0]}</th>
                <th>{c.cols[1]} <span>({c.unit})</span></th>
                <th>{c.cols[2]}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row, i) => (
                <tr key={i} className={i === 0 ? `spdf-row${hl('price')}` : undefined}>
                  <td>{row[0]}</td>
                  <td className="spdf-num">{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {doc === 'prices' ? (
        <div className="spdf-block" data-chunk={`${c.chunk} 4`}>
          <p className="spdf-line">{c.note}</p>
        </div>
      ) : (
        <div className="spdf-block" data-chunk={`${c.chunk} ${terms ? 1 : 4}`}>
          <h6>{c.terms}</h6>
          <p className={`spdf-line${hl('commission')}`}>
            {c.commission[0]} <b className="spdf-num">{c.commission[1]}</b> {c.commission[2]}
          </p>
          <p className="spdf-line">{c.down}</p>
          {terms && c.termsDoc.extra.map((line, i) => <p key={i} className="spdf-line">{line}</p>)}
        </div>
      )}
      <span className="spdf-foot">{top.foot}</span>
      <span className="spdf-scanline" aria-hidden="true" />
    </div>
  )
})

// A labelled pointer that glides to whichever element carries data-cur={target}
// inside the demo root, and pulses on each `click`.
export const Cursor = memo(function Cursor({ rootRef, target, click, label }) {
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const el = target && root?.querySelector(`[data-cur="${target}"]`)
    if (!el) return
    const box = root.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    // Small targets are hit in the middle, wide ones near their leading edge.
    const rtl = getComputedStyle(el).direction === 'rtl'
    const inset = r.width < 220 ? r.width / 2 : 46
    setPos({ x: (rtl ? r.right - inset : r.left + inset) - box.left, y: r.top + r.height * 0.62 - box.top })
  }, [rootRef, target])

  if (!pos) return null
  return (
    <span
      className={`dm-cursor${target ? '' : ' is-hidden'}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      aria-hidden="true"
    >
      <svg width="18" height="18" viewBox="0 0 18 18">
        <path d="M2 1.5 15.5 7.6 9.4 9.6 7.2 16z" />
      </svg>
      <span className="dm-cursor-tag">{label}</span>
      {click > 0 && <i key={click} className="dm-cursor-ring" />}
    </span>
  )
})
