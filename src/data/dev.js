// Development-only copy.
export const sampleBannerText = ({ courses, clients }) => {
  const parts = [courses && 'courses', clients && 'client logos'].filter(Boolean)
  return `Showing sample ${parts.join(' and ')} — real content pending`
}
