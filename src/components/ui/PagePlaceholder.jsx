import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'

// Stand-in body for pages that are not built yet.
export default function PagePlaceholder({ title, description }) {
  return (
    <Container as="section" className="py-20">
      <title>{`${title} | GR Heartbeat`}</title>
      {/* Each page supplies its own description (index.html has none, to avoid duplicates). */}
      {description && <meta name="description" content={description} />}
      <Eyebrow marker>Coming in a later phase</Eyebrow>
      <Heading level={1} className="mt-3">
        {title}
      </Heading>
      {description && <p className="mt-4 max-w-2xl text-lead">{description}</p>}
    </Container>
  )
}
