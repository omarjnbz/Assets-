import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronUp, ArrowDown } from 'lucide-react'
import HeroCanvas, { type HeroCanvasHandle } from './HeroCanvas'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  onCtaClick: () => void
  onScrollProgress: (progress: number) => void
}

export default function HeroSection({ onCtaClick, onScrollProgress }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgImageRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HeroCanvasHandle>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  // Subtle mouse parallax (depth cue only — no glow)
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const lerpedPosRef = useRef({ x: 0.5, y: 0.5 })
  const parallaxRafRef = useRef<number>(0)

  // Mouse parallax loop
  useEffect(() => {
    const section = sectionRef.current
    const bgImage = bgImageRef.current
    if (!section || !bgImage) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      mousePosRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    const animate = () => {
      const target = mousePosRef.current
      const lerped = lerpedPosRef.current
      lerped.x += (target.x - lerped.x) * 0.06
      lerped.y += (target.y - lerped.y) * 0.06

      const parallaxX = (lerped.x - 0.5) * 16
      const parallaxY = (lerped.y - 0.5) * 12
      bgImage.style.transform = `translate(${parallaxX}px, ${parallaxY}px) scale(${
        bgImage.dataset.currentScale || '1'
      })`

      parallaxRafRef.current = requestAnimationFrame(animate)
    }

    section.addEventListener('mousemove', handleMouseMove)
    parallaxRafRef.current = requestAnimationFrame(animate)

    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(parallaxRafRef.current)
    }
  }, [])

  // Entrance + scroll animations
  useEffect(() => {
    const section = sectionRef.current
    const bgImage = bgImageRef.current
    const textGroup = textGroupRef.current
    const progressFill = progressFillRef.current
    if (!section || !bgImage || !textGroup || !progressFill) return

    // Entrance timeline
    const tl = gsap.timeline()

    tl.fromTo(
      bgImage,
      { scale: 1.04, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function () {
          bgImage.dataset.currentScale = String(gsap.getProperty(bgImage, 'scale'))
        },
      },
      0
    )

    const words = h1Ref.current?.querySelectorAll('.word-inner')
    if (words) {
      tl.fromTo(
        words,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12 },
        0.5
      )
    }

    tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1)
    tl.fromTo(descRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 1.2)
    tl.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5)

    // Scroll-triggered (pinned) timeline — drives the relight + zoom.
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: '+=120%',
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          onScrollProgress(self.progress)
          heroCanvasRef.current?.setScroll(self.progress)
          gsap.set(progressFill, { scaleX: self.progress })
        },
      },
    })

    // Subtle background zoom (the photo stays "normal" — no white wash).
    scrollTl.fromTo(
      bgImage,
      { scale: 1 },
      {
        scale: 1.04,
        ease: 'none',
        onUpdate: function () {
          bgImage.dataset.currentScale = String(gsap.getProperty(bgImage, 'scale'))
        },
      },
      0
    )

    scrollTl.fromTo(textGroup, { y: '0%' }, { y: '-30%', ease: 'none' }, 0)

    return () => {
      scrollTl.scrollTrigger?.kill()
      tl.kill()
      scrollTl.kill()
    }
  }, [onScrollProgress])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} className="hero-section" id="vision">
      {/* WebGL relit background (samples /hero.jpg, key light climbs on scroll) */}
      <HeroCanvas ref={heroCanvasRef} elementRef={bgImageRef} src="/hero-hq.jpg" className="hero-bg-image" />

      {/* Organic light-line: starts near her eye, curves down to the lower-left,
          with a soft light travelling along it. */}
      <svg className="hero-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <radialGradient id="heroLineGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(200, 236, 255, 0.95)" />
            <stop offset="100%" stopColor="rgba(200, 236, 255, 0)" />
          </radialGradient>
          <filter id="heroLineBlur" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        <path
          id="heroLinePath"
          className="hero-line-stroke"
          d="M63 27 C 58 44, 54 58, 44 70 C 36 79, 28 90, 22 112"
          fill="none"
          stroke="#cfeaff"
          strokeOpacity="0.3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
        />
        <circle r="1.3" fill="url(#heroLineGlow)" filter="url(#heroLineBlur)">
          <animateMotion dur="6.5s" repeatCount="indefinite" rotate="auto" calcMode="linear">
            <mpath href="#heroLinePath" />
          </animateMotion>
        </circle>
      </svg>

      {/* Content Overlay */}
      <div className="hero-content">
        {/* Main text group */}
        <div
          ref={textGroupRef}
          style={{
            position: 'absolute',
            left: '15%',
            top: '50%',
            transform: 'translateY(-60%)',
          }}
        >
          <h1 ref={h1Ref} className="hero-h1">
            <span className="word">
              <span className="word-inner">Empower</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner">your</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner">mental</span>
            </span>
            <br />
            <span className="word">
              <span className="word-inner">health</span>
            </span>{' '}
            <span className="word">
              <span className="word-inner">journey</span>
            </span>
          </h1>

          <button ref={ctaRef} className="hero-cta" onClick={onCtaClick} data-cursor-hover>
            <span className="dot" />
            <span>START YOUR JOURNEY</span>
          </button>
        </div>

        {/* Description - right side */}
        <p
          ref={descRef}
          className="hero-description"
          style={{
            position: 'absolute',
            right: '48px',
            top: '55%',
            transform: 'translateY(-50%)',
          }}
        >
          Amaterasu is a physics cognition lab working at the intersection of technology and nature
          to transform mental health.
        </p>

        {/* Scroll indicator - bottom left */}
        <div
          ref={scrollIndicatorRef}
          className="scroll-indicator"
          style={{
            position: 'absolute',
            left: '48px',
            bottom: '40px',
          }}
        >
          SCROLL TO EXPLORE
          <span className="arrow">
            <ArrowDown size={14} />
          </span>
        </div>

        {/* Scroll progress bar - bottom center */}
        <div className="scroll-progress-container">
          <div ref={progressFillRef} className="scroll-progress-fill" />
        </div>

        {/* Back to top - bottom right */}
        <button
          className="back-to-top"
          style={{
            position: 'absolute',
            right: '48px',
            bottom: '40px',
          }}
          onClick={scrollToTop}
          data-cursor-hover
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </section>
  )
}
