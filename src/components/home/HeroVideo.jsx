import { useEffect, useRef, useState } from 'react'
import { getPhoto } from '@/data/photos'
import { useLoopGate } from '@/hooks/useLoops'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useMotionPaused, useReducedMotionSafe } from '@/hooks/useReducedMotionSafe'
import { cx } from '@/lib/cx'

const prefersData = () => {
  const connection = navigator.connection
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '')
}

/** Resolves once the page has loaded and painted, so the video never competes with LCP. */
const afterFirstPaint = (callback) => {
  let frame
  const go = () => (frame = requestAnimationFrame(() => (frame = requestAnimationFrame(callback))))
  if (document.readyState === 'complete') go()
  else window.addEventListener('load', go, { once: true })
  return () => {
    window.removeEventListener('load', go)
    cancelAnimationFrame(frame)
  }
}

/**
 * Decorative hero video. The poster <img> is always rendered (it is the LCP element); the
 * video uses preload="none" and starts only after the page has loaded, then fades in over
 * the poster. The loop seam is hidden by crossfading two players (loopCrossfadeMs).
 * Poster only when: no sources, reduced motion, or the visitor saves data / is on 2G —
 * then the poster gets a slow Ken Burns zoom (unless reduced). Pauses off-screen and when
 * the visitor pauses motion.
 */
export default function HeroVideo({ config, className }) {
  const reduced = useReducedMotionSafe()
  const paused = useMotionPaused()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const frame = useRef(null)
  const stack = useRef(null)
  const [saveData] = useState(prefersData)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const controller = useRef(null)

  const fallback = getPhoto(config.fallbackPhoto)
  const poster = config.poster ?? fallback
  const canPlay = config.sources.length > 0 && !reduced && !saveData
  const kenBurns = !canPlay && !reduced
  const position = desktop ? config.objectPosition.desktop : config.objectPosition.mobile
  // Video and Ken Burns zoom are decorative loops in the hero group (see lib/loops.js).
  const turn = useLoopGate(frame, { group: 'hero', active: (canPlay && armed) || kenBurns })

  useEffect(() => (canPlay ? afterFirstPaint(() => setArmed(true)) : undefined), [canPlay])

  // Crossfading loop between two players: when the front one is `fade` seconds from its end,
  // the back one restarts and fades in on top, then they swap roles.
  useEffect(() => {
    if (!armed) return
    const videos = [...stack.current.querySelectorAll('video')]
    const fade = config.loopCrossfadeMs / 1000
    let front = 0
    let fading = false
    let raf = 0
    let timer = 0
    let running = false
    let primed = false

    const tick = () => {
      const current = videos[front]
      // Fetch the second player halfway through the first loop (usually from cache by then),
      // so the page never downloads the video twice in parallel.
      if (!primed && current.duration && current.currentTime > current.duration / 2) {
        primed = true
        videos[1].preload = 'auto'
      }
      if (!fading && current.duration && current.currentTime >= current.duration - fade) {
        fading = true
        const next = videos[1 - front]
        next.currentTime = 0
        next.style.transition = 'none'
        next.style.opacity = '0'
        next.style.zIndex = '2'
        current.style.zIndex = '1'
        next.play().catch(() => {})
        requestAnimationFrame(() => {
          next.style.transition = `opacity ${fade}s linear`
          next.style.opacity = '1'
        })
        timer = setTimeout(
          () => {
            current.pause()
            current.style.opacity = '0'
            front = 1 - front
            fading = false
          },
          fade * 1000 + 60,
        )
      }
      raf = requestAnimationFrame(tick)
    }

    const onPlaying = () => setVisible(true)
    videos[0].style.opacity = '1'
    videos[0].addEventListener('playing', onPlaying, { once: true })

    controller.current = {
      play() {
        if (running) return
        running = true
        videos[front].play().catch(() => {})
        raf = requestAnimationFrame(tick)
      },
      pause() {
        running = false
        cancelAnimationFrame(raf)
        clearTimeout(timer)
        fading = false
        videos.forEach((v) => v.pause())
        videos[front].style.opacity = '1'
        videos[front].style.zIndex = '2'
        videos[1 - front].style.opacity = '0'
      },
    }
    return () => {
      controller.current?.pause()
      controller.current = null
      videos[0].removeEventListener('playing', onPlaying)
    }
  }, [armed, config.loopCrossfadeMs])

  // Play only while the hero has the loop turn (on screen, no other loop bigger) and the
  // visitor has not paused motion.
  useEffect(() => {
    if (!armed || !controller.current) return
    if (turn && !paused) controller.current.play()
    else controller.current.pause()
  }, [armed, turn, paused])

  return (
    <div
      ref={frame}
      data-loop="hero"
      data-running={String(turn && !paused && ((canPlay && armed) || kenBurns))}
      className={cx('relative size-full overflow-hidden bg-grey-100', className)}
    >
      {poster && (
        <img
          src={poster.src}
          srcSet={poster.srcSet}
          sizes="(min-width: 1024px) 50vw, 100vw"
          alt=""
          width={poster.width}
          height={poster.height}
          fetchPriority="high"
          decoding="async"
          className={cx(
            'absolute inset-0 size-full object-cover',
            kenBurns && turn && 'animate-ken-burns',
          )}
          style={{ objectPosition: position }}
        />
      )}
      {canPlay && armed && (
        <div
          ref={stack}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {[0, 1].map((index) => (
            <video
              key={index}
              muted
              playsInline
              preload="none"
              disablePictureInPicture
              tabIndex={-1}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: position, opacity: index === 0 ? 1 : 0 }}
            >
              {config.sources.map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
            </video>
          ))}
        </div>
      )}
    </div>
  )
}
