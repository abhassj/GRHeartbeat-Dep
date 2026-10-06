import { useRef, useState } from 'react'
import RhythmGame from '@/components/home/why/RhythmGame'
import RhythmMonitor from '@/components/home/why/RhythmMonitor'

/**
 * Lazy-loaded half of "Why it matters": the rhythm monitor and the tap game, sharing the
 * visitor's tap times (the monitor follows them while they tap). Fills the fixed-height
 * slot reserved by the section, so loading it causes no layout shift.
 */
export default function WhyItMattersInteractive() {
  const tapsRef = useRef([])
  const [tapBpm, setTapBpm] = useState(null)
  return (
    <div className="flex size-full flex-col gap-4">
      <RhythmMonitor tapsRef={tapsRef} tapBpm={tapBpm} />
      <RhythmGame tapsRef={tapsRef} onRateChange={setTapBpm} />
    </div>
  )
}
