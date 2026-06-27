import { useLang } from '../i18n'

// Wordmark logo. Renders "Seyam" in English and "صيام" in Arabic, both in the
// same thin Tajawal lettering. Inline SVG so it inherits the navbar color.
export default function Logo({ className }) {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  return (
    <svg
      className={className}
      viewBox="0 0 170 56"
      role="img"
      aria-label="Seyam"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="85"
        y={isAr ? 40 : 39}
        textAnchor="middle"
        direction={isAr ? 'rtl' : 'ltr'}
        fontFamily="Tajawal, 'Segoe UI', Tahoma, sans-serif"
        fontWeight="300"
        fontSize={isAr ? 44 : 38}
        letterSpacing={isAr ? 0 : 1.5}
        fill="currentColor"
      >
        {isAr ? 'صيام' : 'Seyam'}
      </text>
    </svg>
  )
}
