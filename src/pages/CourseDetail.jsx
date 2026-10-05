import { useParams } from 'react-router'
import PagePlaceholder from '@/components/ui/PagePlaceholder'
import NotFound from '@/pages/NotFound'
import { regions } from '@/data/regions'

export default function CourseDetail() {
  const { region, slug } = useParams()
  const config = regions[region]

  if (!config) return <NotFound />

  return (
    <PagePlaceholder
      title="Course detail"
      description={`Detail page for "${slug}" in ${config.name}: facts panel, outcomes, requirements and enquiry CTAs.`}
    />
  )
}
