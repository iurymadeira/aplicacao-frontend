'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowUpRight, BookOpen, CandlestickChart } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const portals = [
  {
    id: 'mercado',
    href: '/mercado',
    icon: CandlestickChart,
    kicker: 'Portal 1',
    title: 'Notícias & Mercado',
    text: 'Cotações ao vivo, decisões do Copom, política fiscal e o vaivém da bolsa. Para quem quer entender o cenário macro em tempo real.',
    links: ['Cotações', 'Economia', 'Notícias'],
    tone: 'bg-primary text-primary-foreground',
  },
  {
    id: 'aprender',
    href: '/aprender',
    icon: BookOpen,
    kicker: 'Portal 2',
    title: 'Educação Financeira',
    text: 'Trilhas para sair das dívidas, montar a reserva e começar a investir. Calculadoras e simuladores para tirar a teoria do papel.',
    links: ['Trilhas', 'Calculadora', 'Orçamento'],
    tone: 'bg-signal text-signal-foreground',
  },
]

export function TwoPortals() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <p className="font-mono text-xs font-bold tracking-wider text-primary uppercase">Dois portais, um objetivo</p>
        <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
          Acompanhe o mercado. Entenda o que ele significa para o seu bolso.
        </h2>
      </div>
      <div className="flex flex-col gap-4 md:h-[440px] md:flex-row" onPointerLeave={() => setActive(null)}>
        {portals.map((p) => {
          const Icon = p.icon
          const isActive = active === p.id
          const isOther = active !== null && !isActive
          return (
            <motion.div
              key={p.id}
              layout
              onPointerEnter={() => setActive(p.id)}
              animate={{ flexGrow: isActive ? 1.8 : isOther ? 0.7 : 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              className="md:basis-0"
            >
              <Link
                href={p.href}
                data-cursor-label="Entrar"
                className={cn(
                  'relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-3xl border-2 border-ink p-7 shadow-[6px_6px_0_0_var(--ink)] transition-shadow hover:shadow-[10px_10px_0_0_var(--ink)]',
                  p.tone,
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold tracking-wider uppercase opacity-70">{p.kicker}</span>
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0, scale: isActive ? 1.15 : 1 }}
                    className="flex size-12 items-center justify-center rounded-full border-2 border-current"
                  >
                    <ArrowUpRight className="size-5" />
                  </motion.span>
                </div>
                <div className="flex flex-col gap-4">
                  <Icon className="size-10" strokeWidth={1.5} />
                  <h3 className="text-4xl leading-none font-extrabold tracking-tight md:text-5xl">{p.title}</h3>
                  <motion.p
                    animate={{ opacity: isOther ? 0.4 : 1 }}
                    className="max-w-md leading-relaxed text-pretty opacity-90"
                  >
                    {p.text}
                  </motion.p>
                  <div className="flex flex-wrap gap-2">
                    {p.links.map((l, i) => (
                      <motion.span
                        key={l}
                        initial={false}
                        animate={{ y: isActive ? 0 : 6, opacity: isActive || active === null ? 1 : 0.5 }}
                        transition={{ delay: isActive ? i * 0.05 : 0 }}
                        className="rounded-full border-2 border-current px-3 py-1 font-mono text-xs font-bold"
                      >
                        {l}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
