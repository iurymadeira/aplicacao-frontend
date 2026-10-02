'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { formatPrice } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useLiveQuotes } from './use-live-quotes'

export function TickerTape() {
  const quotes = useLiveQuotes()
  const loop = [...quotes, ...quotes]

  return (
    <div className="group relative overflow-hidden border-y-2 border-ink bg-ink text-card" aria-label="Cotações em tempo real">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {loop.map((q, i) => {
          const up = q.change >= 0
          return (
            <div
              key={`${q.symbol}-${i}`}
              aria-hidden={i >= quotes.length}
              className="flex items-center gap-2 border-r border-card/15 px-5 py-2 font-mono text-xs whitespace-nowrap"
            >
              <span className="font-bold">{q.symbol}</span>
              <span
                className={cn(
                  'rounded px-1 tabular-nums transition-colors duration-500',
                  q.flash === 'up' && 'bg-primary',
                  q.flash === 'down' && 'bg-down',
                )}
              >
                {formatPrice(q, q.price)}
              </span>
              <span className={cn('flex items-center tabular-nums', up ? 'text-signal' : 'text-down')}>
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {up ? '+' : ''}
                {q.change.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
