'use client'

import { motion } from 'motion/react'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { brl } from '@/lib/data'
import { cn } from '@/lib/utils'
import { MagneticButton } from '@/components/site/magnetic'

type Key = 'needs' | 'wants' | 'save'

const buckets: { key: Key; label: string; ideal: number; color: string; swatch: string; hint: string }[] = [
  { key: 'needs', label: 'Necessidades', ideal: 50, color: 'var(--primary)', swatch: 'bg-primary', hint: 'Aluguel, contas, mercado, transporte, saúde.' },
  { key: 'wants', label: 'Desejos', ideal: 30, color: 'var(--signal)', swatch: 'bg-signal', hint: 'Lazer, delivery, streaming, compras.' },
  { key: 'save', label: 'Futuro', ideal: 20, color: 'var(--ink)', swatch: 'bg-ink', hint: 'Reserva, investimentos, quitar dívidas.' },
]

export function BudgetPlanner() {
  const [income, setIncome] = useState(4500)
  const [split, setSplit] = useState<Record<Key, number>>({ needs: 60, wants: 30, save: 10 })

  const update = (key: Key, value: number) => {
    setSplit((prev) => {
      const others = (Object.keys(prev) as Key[]).filter((k) => k !== key)
      const remaining = 100 - value
      const otherTotal = others.reduce((s, k) => s + prev[k], 0) || 1
      const next = { ...prev, [key]: value }
      let assigned = 0
      others.forEach((k, i) => {
        const v = i === others.length - 1 ? remaining - assigned : Math.round((prev[k] / otherTotal) * remaining)
        next[k] = Math.max(0, v)
        assigned += next[k]
      })
      return next
    })
  }

  const circumference = 2 * Math.PI * 70
  let offset = 0
  const score = 100 - buckets.reduce((s, b) => s + Math.abs(split[b.key] - b.ideal), 0)

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--ink)]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Renda líquida mensal</span>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-background px-4 py-3 focus-within:shadow-[3px_3px_0_0_var(--primary)]">
            <span className="font-mono text-muted-foreground">R$</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={income}
              onChange={(e) => setIncome(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent font-mono text-2xl font-bold outline-none"
            />
          </div>
        </label>

        {buckets.map((b) => (
          <div key={b.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-2 font-semibold">
                <span className={cn('size-3 rounded-full border border-ink', b.swatch)} />
                {b.label}
              </span>
              <span className="font-mono text-sm tabular-nums">
                <span className="font-bold">{split[b.key]}%</span>
                <span className="text-muted-foreground"> · {brl((income * split[b.key]) / 100, 0)}</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={split[b.key]}
              onChange={(e) => update(b.key, Number(e.target.value))}
              aria-label={`${b.label} em porcentagem`}
            />
            <p className="text-xs text-muted-foreground">
              {b.hint} Ideal: {b.ideal}%.
            </p>
          </div>
        ))}

        <MagneticButton type="button" variant="outline" onClick={() => setSplit({ needs: 50, wants: 30, save: 20 })} label="50/30/20">
          <RotateCcw className="size-4" />
          Aplicar regra 50/30/20
        </MagneticButton>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-3xl border-2 border-ink bg-signal p-6 shadow-[6px_6px_0_0_var(--ink)]">
        <div className="relative size-64">
          <svg viewBox="0 0 180 180" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="90" cy="90" r="70" fill="none" stroke="var(--card)" strokeWidth="26" />
            {buckets.map((b) => {
              const len = (split[b.key] / 100) * circumference
              const el = (
                <motion.circle
                  key={b.key}
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke={b.color}
                  strokeWidth="26"
                  initial={false}
                  animate={{ strokeDasharray: `${len} ${circumference - len}`, strokeDashoffset: -offset }}
                  transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                />
              )
              offset += len
              return el
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xs uppercase">Nota</span>
            <motion.span key={score} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="font-mono text-5xl font-bold tabular-nums">
              {Math.max(0, score)}
            </motion.span>
            <span className="font-mono text-xs">de 100</span>
          </div>
        </div>
        <div className="w-full rounded-2xl border-2 border-ink bg-card p-5">
          <h3 className="mb-2 text-lg font-extrabold">Diagnóstico</h3>
          <p className="leading-relaxed text-pretty">
            {split.save >= 20
              ? `Excelente! Guardando ${brl((income * split.save) / 100, 0)} por mês você monta uma reserva de 6 meses em cerca de ${Math.ceil((income * split.needs * 6) / 100 / Math.max(1, (income * split.save) / 100))} meses.`
              : split.save >= 10
                ? 'Bom começo. Tente cortar um pouco dos desejos para chegar a 20% destinados ao futuro.'
                : 'Atenção: menos de 10% para o futuro deixa você vulnerável a imprevistos. Revise os gastos com desejos.'}
          </p>
        </div>
      </div>
    </div>
  )
}
