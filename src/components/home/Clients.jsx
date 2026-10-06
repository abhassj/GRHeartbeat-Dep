import ClientLogo from '@/components/media/ClientLogo'
import Marquee from '@/components/motion/Marquee'
import Reveal from '@/components/motion/Reveal'
import Heading from '@/components/ui/Heading'
import Section from '@/components/ui/Section'
import { home } from '@/data/home'
import { getClients } from '@/lib/clients'

/**
 * 4.8 Clients: two marquee rows in opposite directions at different speeds (pause on hover
 * and focus; a static wrapped grid under reduced motion). Not rendered at all while there
 * are no clients — production today; development shows neutral placeholder tiles.
 */
export default function Clients() {
  const clients = getClients()
  if (!clients.length) return null
  const half = Math.ceil(clients.length / 2)
  const rows = [clients.slice(0, half), clients.slice(half)].filter((row) => row.length)

  return (
    <Section tone="surface" spacing="compact" aria-labelledby="clients-heading">
      <Reveal>
        <Heading id="clients-heading" level={2} className="text-center text-h3">
          {home.clients.heading}
        </Heading>
      </Reveal>
      <div className="mt-10 space-y-6">
        {rows.map((row, index) => (
          <Marquee
            key={index}
            duration={index ? 46 : 34}
            reverse={index === 1}
            label={home.clients.heading}
            loopGroup="clients"
          >
            {row.map((client) => (
              <ClientLogo key={client.id ?? client.name} client={client} />
            ))}
          </Marquee>
        ))}
      </div>
    </Section>
  )
}
