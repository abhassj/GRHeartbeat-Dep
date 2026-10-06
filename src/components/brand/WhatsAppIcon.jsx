/** Simplified WhatsApp glyph (speech bubble + handset). Decorative: label the control instead. */
export default function WhatsAppIcon({ size = 20, className }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M3.6 20.4l1.2-4.2a8.6 8.6 0 1 1 3.1 3.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 7.6c-.3 0-.7.1-.9.5-.3.5-.6 1.3-.3 2.4.6 2.2 2.8 4.4 5 5 1.1.3 1.9 0 2.4-.3.4-.2.5-.6.5-.9v-.9c0-.2-.1-.3-.3-.4l-1.7-.8c-.2-.1-.4 0-.5.1l-.6.8c-.1.1-.3.2-.5.1a5.6 5.6 0 0 1-2.7-2.7c-.1-.2 0-.4.1-.5l.8-.6c.2-.1.2-.3.1-.5l-.8-1.7c-.1-.2-.2-.3-.4-.3z"
        fill="currentColor"
      />
    </svg>
  )
}
