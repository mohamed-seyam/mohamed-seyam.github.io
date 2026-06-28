import { Suspense, lazy, useState } from 'react'
import { useLang } from '../i18n'

// The heavy Three.js bundle is only fetched once the user clicks to interact.
const ModelViewer = lazy(() => import('./ModelViewer'))

export default function ModelEmbed({ src }) {
  const [active, setActive] = useState(false)
  const { t } = useLang()

  return (
    <div className="model-embed">
      {active ? (
        <Suspense
          fallback={<div className="model-placeholder">{t.ui.model3dLoading}</div>}
        >
          <ModelViewer src={src} />
        </Suspense>
      ) : (
        <button className="model-cta" onClick={() => setActive(true)}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
            <path d="M12 2v20M3 7l9 5 9-5" />
          </svg>
          <span>{t.ui.model3dCta}</span>
          <small>{t.ui.model3dHint}</small>
        </button>
      )}
    </div>
  )
}
