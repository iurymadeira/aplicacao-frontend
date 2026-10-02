'use client'

import { AnimatePresence, motion } from 'motion/react'
import { formatPrice, series } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Sparkline } from '@/components/site/motion-kit'
import { useLiveQuotes } from '@/components/site/use-live-quotes'

export function LiveMovers() {
  const quotes = useLiveQuotes(1500).filter((q) => q.kind === 'Ação')
  const sorted = [...quotes].sort((a, b) => b.change - a.change)
  const gainers = sorted.slice(0, 4)
  const losers = sorted.slice(-4).reverse()

  return (
    <section className="border-y-2 border-ink bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs font-bold tracking-wider text-primary uppercase">Ao vivo</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance">Quem sobe e quem cai agora</h2>
          <p className="leading-relaxed text-muted-foreground">
            As listas se reorganizam sozinhas a cada negócio. Observe as posições trocarem de lugar.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <MoverList title="Maiores altas" items={gainers} />
          <MoverList title="Maiores baixas" items={losers} />
        </div>
      </div>
    </section>
  )
}

function MoverList({ title, items }: { title: string; items: ReturnType<typeof useLiveQuotes> }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-xs font-bold tracking-wider uppercase">{title}</h3>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((q) => {
            const up = q.change >= 0
            return (
              <motion.li
                key={q.symbol}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                className={cn(
                  'grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-2xl border-2 border-ink bg-background px-4 py-3 transition-colors duration-500',
                  q.flash === 'up' && 'bg-primary/15',
                  q.flash === 'down' && 'bg-down/15',
                )}
              >
                <span className="font-mono text-sm font-bold">{q.symbol}</span>
                <Sparkline
                  data={series(q.symbol.charCodeAt(0) * 7 + q.symbol.length, 20, 10, 0.05)}
                  stroke={up ? 'var(--up)' : 'var(--down)'}
                  fill={false}
                  className="h-6"
                />
                <div className="flex flex-col items-end font-mono text-xs tabular-nums">
                  <span>{formatPrice(q, q.price)}</span>
                  <span className={cn('font-bold', up ? 'text-up' : 'text-down')}>
                    {up ? '+' : ''}
                    {q.change.toFixed(2)}%
                  </span>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
