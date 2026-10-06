// Development-only copy.
export const sampleBannerText = ({ courses, clients, trust }) => {
  const parts = [courses && 'courses', clients && 'client logos', trust && 'accreditations'].filter(
    Boolean,
  )
  const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]
  return `Showing sample ${list} — real content pending`
}
