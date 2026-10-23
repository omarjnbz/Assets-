import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'ABOUT', path: '/about' },
  { label: 'PROJECTS', path: '/projects' },
]

const socialLinks = [
  { label: 'LINKEDIN', href: '#' },
  { label: 'GITHUB', href: '#' },
  { label: 'EMAIL', href: 'mailto:omarjnbz@gmail.com' },
  { label: 'X', href: '#' },
]

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  const socialRef = useRef<HTMLDivElement>(null)
  const locationsRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!overlayRef.current) return

    if (isOpen) {
      overlayRef.current.style.pointerEvents = 'auto'
      const tl = gsap.timeline()
      tlRef.current = tl

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )

      itemsRef.current.forEach((item, i) => {
        if (!item) return
        tl.fromTo(
          item,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.1 + i * 0.08
        )
      })

      if (socialRef.current) {
        tl.fromTo(
          socialRef.current.children,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
          0.3
        )
      }

      if (locationsRef.current) {
        tl.fromTo(
          locationsRef.current.children,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' },
          0.4
        )
      }
    } else {
      if (tlRef.current) {
        tlRef.current.kill()
      }
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.pointerEvents = 'none'
          }
        },
      })
    }
  }, [isOpen])

  const handleNavClick = () => {
    onClose()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99] opacity-0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.96)',
        pointerEvents: 'none',
      }}
    >
      <div className="h-full flex flex-col justify-between px-[22px] py-16">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={handleNavClick}>
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="10" cy="10" rx="10" ry="8" fill="#F1F1F1"/>
              <ellipse cx="22" cy="10" rx="10" ry="8" fill="#F1F1F1"/>
            </svg>
          </Link>
          <button
            onClick={onClose}
            className="swap-text-container font-medium text-nav-label text-light cursor-pointer"
          >
            <span className="swap-layer">CLOSE</span>
            <span className="swap-layer swap-clone">CLOSE</span>
          </button>
        </div>

        {/* Center nav links */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <div
              key={item.path}
              ref={(el) => { if (el) itemsRef.current[i] = el }}
            >
              <Link
                to={item.path}
                onClick={handleNavClick}
                className="block font-bold text-display-l text-light hover:text-red transition-colors duration-300 leading-none"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Bottom info */}
        <div className="flex justify-between items-end">
          <div ref={socialRef} className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="font-normal text-caption text-muted-text hover:text-light transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div ref={locationsRef} className="text-right">
            <div className="font-normal text-caption text-muted-text mb-2">
              GURGAON
            </div>
            <div className="font-normal text-caption text-muted-text">
              INDIA
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
