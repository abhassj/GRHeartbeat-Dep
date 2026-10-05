import { useParams } from 'react-router'
import PagePlaceholder from '@/components/ui/PagePlaceholder'
import NotFound from '@/pages/NotFound'
import { regions } from '@/data/regions'

export default function CoursesRegion() {
  const { region } = useParams()
  const config = regions[region]

  if (!config) return <NotFound />

  return (
    <PagePlaceholder
      title={`Courses: ${config.name}`}
      description={
        config.status === 'live'
          ? 'Course grid with category filters and search.'
          : `We're bringing GR Heartbeat to the ${config.name}. Register interest coming soon.`
      }
    />
  )
}
