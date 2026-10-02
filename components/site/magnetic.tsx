'use client'

import Link from 'next/link'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ReactNode, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

function useMagnet(strength = 0.35) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(my, { stiffness: 220, damping: 15, mass: 0.4 })

  const onPointerMove = (e: PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }
  return { ref, x, y, onPointerMove, onPointerLeave }
}

const variants = {
  primary: 'bg-primary text-primary-foreground border-ink',
  signal: 'bg-signal text-signal-foreground border-ink',
  outline: 'bg-card text-foreground border-ink',
  ink: 'bg-ink text-card border-ink',
}

const fills = {
  primary: 'bg-ink',
  signal: 'bg-primary',
  outline: 'bg-signal',
  ink: 'bg-primary',
}

const fillText = {
  primary: 'group-hover/mag:text-card',
  signal: 'group-hover/mag:text-primary-foreground',
  outline: 'group-hover/mag:text-ink',
  ink: 'group-hover/mag:text-primary-foreground',
}

type Variant = keyof typeof variants

function Inner({ children, variant, className }: { children: ReactNode; variant: Variant; className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-2 px-6 py-3 text-sm font-semibold shadow-[3px_3px_0_0_var(--ink)] transition-shadow duration-200 group-hover/mag:shadow-[5px_5px_0_0_var(--ink)] group-active/mag:shadow-[0_0_0_0_var(--ink)]',
        variants[variant],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 translate-y-full rounded-full transition-transform duration-300 ease-out group-hover/mag:translate-y-0',
          fills[variant],
        )}
      />
      <span className={cn('relative z-10 inline-flex items-center gap-2 transition-colors duration-300', fillText[variant])}>
        {children}
      </span>
    </span>
  )
}

export function MagneticLink({
  href,
  children,
  variant = 'primary',
  className,
  label,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  label?: string
}) {
  const m = useMagnet()
  return (
    <motion.div
      ref={m.ref}
      style={{ x: m.x, y: m.y }}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      className="inline-block"
    >
      <Link href={href} className="group/mag inline-block rounded-full outline-offset-4" data-cursor-label={label}>
        <Inner variant={variant} className={className}>
          {children}
        </Inner>
      </Link>
    </motion.div>
  )
}

export function MagneticButton({
  children,
  variant = 'primary',
  className,
  label,
  ...props
}: {
  children: ReactNode
  variant?: Variant
  className?: string
  label?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  const m = useMagnet()
  return (
    <motion.div
      ref={m.ref}
      style={{ x: m.x, y: m.y }}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      className="inline-block"
    >
      <button
        {...props}
        className="group/mag inline-block rounded-full outline-offset-4 disabled:pointer-events-none disabled:opacity-50"
        data-cursor-label={label}
      >
        <Inner variant={variant} className={className}>
          {children}
        </Inner>
      </button>
    </motion.div>
  )
}
