'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { brl } from '@/lib/data'
import { MagneticLink } from '@/components/site/magnetic'

const YEARS = 20
const RATE = 0.10

export function CoinStackTeaser() {
  const [monthly, setMonthly] = useState(300)
  const months = YEARS * 12
  const r = Math.pow(1 + RATE, 1 / 12) - 1
  const total = monthly * ((Math.pow(1 + r, months) - 1) / r)
  const invested = monthly * months
  const stacks = Array.from({ length: YEARS }, (_, y) => {
    const m = (y + 1) * 12
    return monthly * ((Math.pow(1 + r, m) - 1) / r)
  })
  const maxStack = 2000 * ((Math.pow(1 + r, months) - 1) / r)

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
      <div className="grid gap-10 overflow-hidden rounded-3xl border-2 border-ink bg-signal p-6 shadow-[8px_8px_0_0_var(--ink)] md:p-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs font-bold tracking-wider uppercase">Juros compostos em 1 gesto</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance md:text-5xl">
            Arraste e veja seu tostão virar patrimônio.
          </h2>
          <label className="flex flex-col gap-3">
            <span className="flex items-baseline justify-between font-mono text-sm">
              <span>Aporte mensal</span>
              <span className="text-2xl font-bold tabular-nums">{brl(monthly, 0)}</span>
            </span>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              aria-label="Aporte mensal"
            />
          </label>
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-ink bg-card p-4">
              <dt className="font-mono text-xs text-muted-foreground">Você investe</dt>
              <dd className="font-mono text-xl font-bold tabular-nums">{brl(invested, 0)}</dd>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-ink p-4 text-card">
              <dt className="font-mono text-xs opacity-70">Em {YEARS} anos vira</dt>
              <dd className="font-mono text-xl font-bold text-signal tabular-nums">{brl(total, 0)}</dd>
            </div>
          </dl>
          <MagneticLink href="/calculadora" variant="ink" label="Simular">
            Abrir calculadora completa
            <ArrowRight className="size-4" />
          </MagneticLink>
        </div>
        <div className="flex h-72 items-end gap-1 self-end md:h-80" aria-hidden="true">
          {stacks.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <motion.div
                className="w-full rounded-t-md border-2 border-b-0 border-ink bg-primary"
                animate={{ height: `${Math.max(2, (v / maxStack) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 140, damping: 18, delay: i * 0.015 }}
              />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 font-mono text-xs text-muted-foreground">{'Simulação com rentabilidade hipotética de 10% a.a., sem impostos.'}</p>
    </section>
  )
}
