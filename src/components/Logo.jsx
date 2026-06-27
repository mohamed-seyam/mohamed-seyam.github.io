// "صيام" (Seyam) wordmark, rendered as inline SVG so it inherits the
// surrounding text color (currentColor) and the page-loaded Tajawal font.
export default function Logo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 56"
      role="img"
      aria-label="Seyam"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="75"
        y="40"
        textAnchor="middle"
        direction="rtl"
        fontFamily="Tajawal, 'Segoe UI', Tahoma, sans-serif"
        fontWeight="300"
        fontSize="44"
        fill="currentColor"
      >
        صيام
      </text>
    </svg>
  )
}
