'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

export function ReadingBody({ children, minutes }: { children: ReactNode; minutes: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const left = useTransform(progress, (p) => `${Math.max(0, Math.ceil(minutes * (1 - p)))} min restantes`)

  return (
    <div ref={ref} className="relative">
      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border-2 border-ink bg-card px-4 py-2 shadow-[3px_3px_0_0_var(--ink)]">
        <div className="h-2 w-28 overflow-hidden rounded-full bg-muted" aria-hidden="true">
          <motion.div className="h-full origin-left rounded-full bg-primary" style={{ scaleX: progress }} />
        </div>
        <motion.span className="font-mono text-xs font-bold whitespace-nowrap tabular-nums">{left}</motion.span>
      </div>
      {children}
    </div>
  )
}
