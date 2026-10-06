import { cx } from '@/lib/cx'
import Container from '@/components/ui/Container'
import Eyebrow from '@/components/ui/Eyebrow'
import Heading from '@/components/ui/Heading'

/** One chapter of the styleguide, with an anchor id for the jump nav. */
export default function SgSection({ id, index, title, flush = false, children }) {
  return (
    <section
      id={id}
      className={cx('border-t border-line pt-16 sm:pt-20', !flush && 'pb-16 sm:pb-20')}
    >
      <Container>
        <Eyebrow>{String(index).padStart(2, '0')}</Eyebrow>
        <Heading level={2} className="mt-2 mb-10">
          {title}
        </Heading>
        {children}
      </Container>
    </section>
  )
}
