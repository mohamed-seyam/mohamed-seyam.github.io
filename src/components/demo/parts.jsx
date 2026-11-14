/* Pieces shared by the Baleegh and Naseh walkthroughs: the chapter bar, the
   upload drop zone and file row, and the sample PDF page both demos cite.
   Colours come from the --dm-* variables each demo sets on its root. */

const STAGES = ['parsing', 'chunking', 'embedding']

export function Chapters({ items, scene, run, durations, onPick }) {
  return (
    <div className="dm-chapters" role="tablist">
      {items.map(([title, sub], i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === scene}
          className={`dm-chapter${i === scene ? ' is-active' : ''}${i < scene ? ' is-done' : ''}`}
          onClick={() => onPick(i)}
        >
          <span className="dm-chapter-n">{i < scene ? '✓' : i + 1}</span>
          <span className="dm-chapter-txt">
            <strong>{title}</strong>
            <small>{sub}</small>
          </span>
          {i === scene && <i key={run} className="dm-chapter-bar" style={{ animationDuration: `${durations[i]}s` }} />}
        </button>
      ))}
    </div>
  )
}

export function DropZone({ title, formats, over, dragName }) {
  return (
    <div className={`dm-drop${over ? ' is-over' : ''}`}>
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
}

// status: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'ready'
export function DocRow({ name, meta, status, label, timing }) {
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
}

// Page 2 of the sample price guide. Made-up listing data, except the three
// figures the benchmark agent actually answered with (6,200 / 2.5% / 30%).
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
  },
}

// highlight: 'price' | 'commission' | null. mode: 'scan' (parsing) | 'chunks'.
export function SamplePdf({ lang, highlight, strong, mode }) {
  const c = PAGE[lang] || PAGE.en
  const hl = (key) => (highlight === key ? ` is-hl${strong ? ' is-strong' : ''}` : '')
  return (
    <div className={`spdf${mode ? ` spdf-${mode}` : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <p className="spdf-kicker">{c.kicker}</p>
      <h5 className="spdf-title">{c.title}</h5>
      <p className="spdf-lead">{c.lead}</p>
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
      <div className="spdf-block" data-chunk={`${c.chunk} 4`}>
        <h6>{c.terms}</h6>
        <p className={`spdf-line${hl('commission')}`}>
          {c.commission[0]} <b className="spdf-num">{c.commission[1]}</b> {c.commission[2]}
        </p>
        <p className="spdf-line">{c.down}</p>
      </div>
      <span className="spdf-foot">{c.foot}</span>
      <span className="spdf-scanline" aria-hidden="true" />
    </div>
  )
}
