'use client'

import { motion } from 'motion/react'
import { useMemo, useState, type PointerEvent } from 'react'
import { brl } from '@/lib/data'
import { cn } from '@/lib/utils'

const presets = [
  { label: 'Poupança', rate: 6.2 },
  { label: 'CDI 100%', rate: 10.4 },
  { label: 'IPCA+ 6%', rate: 10.5 },
  { label: 'Bolsa (hist.)', rate: 12 },
]

const W = 600
const H = 280

export function CompoundCalculator() {
  const [initial, setInitial] = useState(1000)
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(10.4)
  const [years, setYears] = useState(15)
  const [hover, setHover] = useState<number | null>(null)

  const points = useMemo(() => {
    const r = Math.pow(1 + rate / 100, 1 / 12) - 1
    const out: { year: number; total: number; invested: number }[] = []
    let total = initial
    for (let y = 0; y <= years; y++) {
      out.push({ year: y, total, invested: initial + monthly * 12 * y })
      for (let m = 0; m < 12; m++) total = total * (1 + r) + monthly
    }
    return out
  }, [initial, monthly, rate, years])

  const last = points[points.length - 1]
  const max = last.total || 1
  const x = (i: number) => (i / Math.max(1, points.length - 1)) * W
  const y = (v: number) => H - (v / max) * (H - 20)
  const totalPath = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.total)}`).join(' ')
  const investedPath = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.invested)}`).join(' ')
  const shown = hover !== null ? points[hover] : last
  const interest = shown.total - shown.invested

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left) / r.width) * (points.length - 1))
    setHover(Math.max(0, Math.min(points.length - 1, i)))
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.5fr]">
      <form className="flex flex-col gap-6 self-start rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--ink)]" onSubmit={(e) => e.preventDefault()}>
        <Field label="Valor inicial" value={brl(initial, 0)}>
          <input type="range" min={0} max={50000} step={500} value={initial} onChange={(e) => setInitial(+e.target.value)} aria-label="Valor inicial" />
        </Field>
        <Field label="Aporte mensal" value={brl(monthly, 0)}>
          <input type="range" min={0} max={5000} step={50} value={monthly} onChange={(e) => setMonthly(+e.target.value)} aria-label="Aporte mensal" />
        </Field>
        <Field label="Rentabilidade anual" value={`${rate.toLocaleString('pt-BR')}%`}>
          <input type="range" min={1} max={20} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} aria-label="Rentabilidade anual" />
          <div className="flex flex-wrap gap-2 pt-1">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setRate(p.rate)}
                className={cn(
                  'rounded-full border-2 border-ink px-3 py-1 font-mono text-[11px] font-bold transition-transform hover:-translate-y-0.5 active:scale-95',
                  rate === p.rate ? 'bg-primary text-primary-foreground' : 'bg-background',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Prazo" value={`${years} anos`}>
          <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(+e.target.value)} aria-label="Prazo em anos" />
        </Field>
      </form>

      <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-ink p-6 text-card shadow-[6px_6px_0_0_var(--primary)]">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label={hover !== null ? `Ano ${shown.year} · total` : 'Total acumulado'} value={brl(shown.total, 0)} highlight />
          <Stat label="Você investiu" value={brl(shown.invested, 0)} />
          <Stat label="Juros ganhos" value={brl(interest, 0)} />
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-card/15" aria-hidden="true">
          <motion.div
            className="h-full rounded-full bg-signal"
            animate={{ width: `${shown.total ? (interest / shown.total) * 100 : 0}%` }}
            transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          />
        </div>
        <p className="font-mono text-xs opacity-70">
          {`${shown.total ? Math.round((interest / shown.total) * 100) : 0}% do patrimônio veio dos juros compostos`}
        </p>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="grid-paper-dark h-auto w-full touch-none rounded-2xl"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          data-cursor
          role="img"
          aria-label={`Gráfico de crescimento: em ${years} anos o total chega a ${brl(last.total, 0)}`}
        >
          <motion.path key={`area-${years}`} d={`${totalPath} L${W},${H} L0,${H} Z`} fill="var(--signal)" fillOpacity={0.25} animate={{ d: `${totalPath} L${W},${H} L0,${H} Z` }} />
          <motion.path key={`line-${years}`} d={totalPath} fill="none" stroke="var(--signal)" strokeWidth={3} animate={{ d: totalPath }} />
          <motion.path key={`inv-${years}`} d={`${investedPath} L${W},${H} L0,${H} Z`} fill="var(--primary)" fillOpacity={0.6} animate={{ d: `${investedPath} L${W},${H} L0,${H} Z` }} />
          {hover !== null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="var(--card)" strokeDasharray="4 4" strokeOpacity={0.6} />
              <circle cx={x(hover)} cy={y(points[hover].total)} r={7} fill="var(--signal)" stroke="var(--ink)" strokeWidth={2} />
              <circle cx={x(hover)} cy={y(points[hover].invested)} r={5} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
            </g>
          )}
        </svg>
        <div className="flex gap-4 font-mono text-xs">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-signal" /> Total com juros
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-primary" /> Valor investido
          </span>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <motion.span key={value} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-lg font-bold tabular-nums">
          {value}
        </motion.span>
      </div>
      {children}
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs opacity-70">{label}</span>
      <span className={cn('font-mono text-xl font-bold tabular-nums md:text-2xl', highlight && 'text-signal')}>{value}</span>
    </div>
  )
}
