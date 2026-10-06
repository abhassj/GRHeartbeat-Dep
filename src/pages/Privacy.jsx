import PagePlaceholder from '@/components/ui/PagePlaceholder'
import { privacy } from '@/data/privacy'

// Placeholder until the client's POPIA privacy notice arrives (launch gate, Phase 8).
export default function Privacy() {
  return <PagePlaceholder title={privacy.title} description={privacy.description} />
}
