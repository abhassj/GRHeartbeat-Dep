import { Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Heading from '@/components/ui/Heading'
import IconRing from '@/components/ui/IconRing'
import { getPhoto } from '@/data/photos'

/**
 * Team members, or — while the list is empty — a single calm empty-state card that points
 * people to the contact page. Phase 6 adds the hover-reveal role treatment.
 */
export default function TeamGrid({ team }) {
  if (!team.members.length) {
    const { title, text, cta } = team.emptyState
    return (
      <Card padding="lg" className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <IconRing icon={Users} size="lg" />
        <div className="flex-1">
          <Heading level={3}>{title}</Heading>
          <p className="mt-2 max-w-xl">{text}</p>
        </div>
        <Button to={cta.to} variant="secondary">
          {cta.label}
        </Button>
      </Card>
    )
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {team.members.map((member) => {
        const photo = getPhoto(member.photo)
        return (
          <li key={member.name}>
            <Card padding="none" className="overflow-hidden">
              {photo && (
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  alt={member.alt ?? photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="aspect-4/5 w-full object-cover"
                />
              )}
              <div className="p-5">
                <Heading level={3}>{member.name}</Heading>
                <p className="mt-1 text-sm text-navy">{member.role}</p>
              </div>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
