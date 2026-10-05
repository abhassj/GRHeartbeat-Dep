import PulseLine from '@/components/brand/PulseLine'
import { cx } from '@/lib/cx'
import { edgeSpikeSvg } from '@/lib/ecg'

/**
 * Masks one edge of its content into an ECG trace: flat, one sharp spike, flat.
 * - side 'bottom': a band whose bottom edge spikes down (final CTA band, footer top).
 * - side 'left': a panel whose left edge spikes outwards (hero video seam).
 * The content fills the whole box; the outer `depth` px on that side is cut away except
 * for the spike, so keep text out of it with padding.
 * `pulse` lays a PulseLine exactly along the edge; `pulseProps` tunes it.
 */
export default function EcgEdge({
  side = 'bottom',
  depth = 40,
  spikeWidth = 120,
  position = 0.5,
  pulse = false,
  pulseProps,
  as: Tag = 'div',
  className,
  innerClassName,
  children,
  ...props
}) {
  const left = side === 'left'
  const spike = edgeSpikeSvg({ width: spikeWidth, depth, side })
  // Centre the spike on `position`, matching how PulseLine centres its beats.
  // (Percentages in mask-position refer to container size minus mask size.)
  const at = `calc(${position * 100}% + ${((position - 0.5) * spikeWidth).toFixed(2)}px)`
  const image = `linear-gradient(#000 0 0), ${spike}`
  const maskPosition = left ? `right top, left ${at}` : `left top, ${at} bottom`
  const maskSize = left
    ? `calc(100% - ${depth - 1}px) 100%, ${depth}px ${spikeWidth}px`
    : `100% calc(100% - ${depth - 1}px), ${spikeWidth}px ${depth}px`

  const contentStyle = {
    maskImage: image,
    WebkitMaskImage: image,
    maskPosition,
    WebkitMaskPosition: maskPosition,
    maskSize,
    WebkitMaskSize: maskSize,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  }

  return (
    <Tag className={cx('relative', className)} {...props}>
      <div className={cx('relative size-full', innerClassName)} style={contentStyle}>
        {children}
      </div>
      {pulse && (
        <div
          className={cx('absolute', left ? 'inset-y-0 left-0' : 'inset-x-0 bottom-0')}
          style={left ? { width: depth } : { height: depth }}
        >
          <PulseLine
            shape="edge"
            baseline={left ? 'end' : 'start'}
            amplitude={1}
            beats={[position]}
            beatWidth={spikeWidth}
            vertical={left}
            className="size-full"
            {...pulseProps}
          />
        </div>
      )}
    </Tag>
  )
}
