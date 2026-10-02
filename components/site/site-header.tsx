'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { navLinks } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { TickerTape } from './ticker-tape'

export function SiteHeader() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(latest > prev && latest > 200 && !open)
  })

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="sticky top-0 z-50 bg-background/90 backdrop-blur-md"
      >
        <TickerTape />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Logo />
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1" onPointerLeave={() => setHovered(null)}>
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onPointerEnter={() => setHovered(link.href)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cn(
                      'relative z-10 block rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      isActive(link.href) ? 'text-primary-foreground' : 'text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border-2 border-ink bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  {hovered === link.href && !isActive(link.href) && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-signal"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-signal shadow-[2px_2px_0_0_var(--ink)] transition-transform active:scale-90 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <motion.div className="h-1 origin-left bg-primary" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Menu móvel"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="grid-paper-dark fixed inset-0 z-40 flex flex-col justify-center bg-primary px-6 pt-24 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-baseline gap-3 text-4xl font-extrabold tracking-tight text-primary-foreground transition-colors hover:text-signal',
                      isActive(link.href) && 'text-signal',
                    )}
                  >
                    <span className="font-mono text-xs font-normal opacity-60">{String(i + 1).padStart(2, '0')}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
