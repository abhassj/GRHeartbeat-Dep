import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Heading from '@/components/ui/Heading'

// Placeholder 404. The flatline → beat version comes in Phase 5.
export default function NotFound() {
  return (
    <Container as="section" className="py-24 text-center">
      <title>Page not found | GR Heartbeat</title>
      <p className="font-display text-6xl font-extrabold text-pulse-red">404</p>
      <Heading level={1} className="mt-4 text-h2">
        We couldn&apos;t find that page
      </Heading>
      <p className="mt-3">It may have moved, or the link might be wrong.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/courses/sa">Browse SA courses</Button>
        <Button to="/" variant="secondary">
          Back home
        </Button>
      </div>
    </Container>
  )
}
