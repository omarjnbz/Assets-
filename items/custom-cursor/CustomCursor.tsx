import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/motion'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor-hover]'

function isInteractive(node: EventTarget | null) {
  return node instanceof Element && node.closest(INTERACTIVE) !== null
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    if (prefersReducedMotion()) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const ctx = gsap.context(() => {
      gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 1 })

      // quickTo reuses one tween instead of a per-event tween, and rides GSAP's
      // ticker rather than a second requestAnimationFrame loop.
      const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' })
      const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' })

      const onMove = (e: PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }

      // Scale, not width/height -- the old version wrote layout properties on
      // every frame. Guarding on relatedTarget stops the flicker when the
      // pointer crosses between a control's own children.
      const onOver = (e: PointerEvent) => {
        if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) {
          gsap.to(cursor, { scale: 5, duration: 0.4, ease: 'power3.out' })
        }
      }

      const onOut = (e: PointerEvent) => {
        if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) {
          gsap.to(cursor, { scale: 1, duration: 0.4, ease: 'power3.out' })
        }
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerover', onOver)
      document.addEventListener('pointerout', onOut)

      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerover', onOver)
        document.removeEventListener('pointerout', onOut)
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[300] pointer-events-none rounded-full bg-light hidden md:block"
      style={{
        width: '8px',
        height: '8px',
        opacity: 0,
        mixBlendMode: 'difference',
      }}
    />
  )
}
