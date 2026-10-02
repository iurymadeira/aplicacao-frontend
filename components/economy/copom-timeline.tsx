'use client'

import { motion } from 'motion/react'
import { copomMeetings } from '@/lib/data'
import { cn } from '@/lib/utils'

export function CopomTimeline() {
  return (
    <section className="my-12 border-y-2 border-ink bg-ink text-card">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <p className="font-mono text-xs font-bold tracking-wider text-signal uppercase">Copom</p>
        <h2 className="mt-2 mb-10 max-w-xl text-4xl font-extrabold tracking-tight text-balance">
          A trajetória da Selic, reunião a reunião.
        </h2>
        <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          <motion.span
            aria-hidden="true"
            className="absolute top-6 right-0 left-0 hidden h-0.5 origin-left bg-card/30 lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
          {copomMeetings.map((m, i) => {
            const next = m.rate === null
            return (
              <motion.li
                key={m.date}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
                whileHover={{ y: -6 }}
                className="relative flex flex-col gap-3"
              >
                <span
                  className={cn(
                    'relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-card font-mono text-xs font-bold',
                    next ? 'bg-signal text-ink' : m.bps === 0 ? 'bg-card text-ink' : 'bg-primary text-primary-foreground',
                  )}
                >
                  {next && <span className="absolute inset-0 animate-ping rounded-full bg-signal/50" />}
                  <span className="relative">{m.date}</span>
                </span>
                <div>
                  <p className="font-mono text-2xl font-bold tabular-nums">
                    {next ? '?' : `${m.rate?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`}
                  </p>
                  <p className="text-sm opacity-70">
                    {m.decision}
                    {m.bps ? ` ${m.bps} bps` : ''}
                  </p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
