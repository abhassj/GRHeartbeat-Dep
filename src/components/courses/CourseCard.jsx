import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import TiltCard from '@/components/motion/TiltCard'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import { courseLabels } from '@/data/course-labels'
import { courseUrl, getCategory } from '@/lib/courses'

/**
 * Course card: category badge, title, navy meta line (duration · NQF level) and an arrow
 * that slides on hover. The whole card is the link. Tilts with a mouse (TiltCard).
 */
export default function CourseCard({ course, headingLevel = 3 }) {
  const category = getCategory(course.category)
  const meta = [course.duration, course.nqfLevel ? courseLabels.nqf(course.nqfLevel) : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <TiltCard className="h-full rounded-card">
      <Card
        as={Link}
        to={courseUrl(course)}
        interactive
        tone="white"
        className="flex h-full flex-col shadow-card"
      >
        {category && <Badge tone="red">{category.title}</Badge>}
        <Heading
          level={headingLevel}
          className="mt-4 line-clamp-3 transition-colors duration-200 group-hover:text-pulse-red"
        >
          {course.title}
        </Heading>
        {meta && <p className="mt-2 text-sm font-semibold text-navy">{meta}</p>}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-pulse-red">
          {courseLabels.viewCourse}
          <ArrowRight
            aria-hidden
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </Card>
    </TiltCard>
  )
}
