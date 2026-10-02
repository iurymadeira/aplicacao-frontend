'use client'

import { motion } from 'motion/react'
import { useMemo, useState, type PointerEvent } from 'react'
import { candles } from '@/lib/data'

const W = 600
const H = 340
const PAD = 16

export function HeroChart() {
  const data = useMemo(() => candles(16, 48, 113200), [])
  const [hover, setHover] = useState<{ i: number; y: number } | null>(null)

  const min = Math.min(...data.map((d) => d.l))
  const max = Math.max(...data.map((d) => d.h))
  const step = (W - PAD * 2) / data.length
  const scaleY = (v: number) => PAD + (1 - (v - min) / (max - min)) * (H - PAD * 2)
  const invY = (y: number) => min + (1 - (y - PAD) / (H - PAD * 2)) * (max - min)

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    const i = Math.max(0, Math.min(data.length - 1, Math.floor((x - PAD) / step)))
    setHover({ i, y: Math.max(PAD, Math.min(H - PAD, y)) })
  }

  const active = hover ? data[hover.i] : data[data.length - 1]
  const first = data[0].o
  const pct = ((active.c - first) / first) * 100
  const fmt = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-ink text-card shadow-[8px_8px_0_0_var(--primary)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card/15 px-5 py-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-signal" />
          <span className="font-bold">IBOV</span>
          <span className="opacity-60">{'· 48 pregões'}</span>
        </div>
        <div className="flex gap-3 tabular-nums">
          <span>
            <span className="opacity-50">A </span>
            {fmt(active.o)}
          </span>
          <span>
            <span className="opacity-50">Máx </span>
            {fmt(active.h)}
          </span>
          <span>
            <span className="opacity-50">Mín </span>
            {fmt(active.l)}
          </span>
          <span>
            <span className="opacity-50">F </span>
            {fmt(active.c)}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-3 px-5 pt-4">
        <span className="font-mono text-4xl font-bold tabular-nums md:text-5xl">{fmt(active.c)}</span>
        <span className={`font-mono text-sm font-bold ${pct >= 0 ? 'text-signal' : 'text-down'}`}>
          {pct >= 0 ? '+' : ''}
          {pct.toFixed(2)}%
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="grid-paper-dark block h-auto w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        data-cursor
        role="img"
        aria-label="Gráfico de velas do Ibovespa. Passe o mouse para ver os valores de cada pregão."
      >
        {data.map((d, i) => {
          const x = PAD + i * step + step / 2
          const up = d.c >= d.o
          const near = hover ? Math.abs(hover.i - i) : 99
          const color = up ? 'var(--signal)' : 'var(--down)'
          const bodyTop = scaleY(Math.max(d.o, d.c))
          const bodyH = Math.max(2, Math.abs(scaleY(d.o) - scaleY(d.c)))
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: hover && near > 6 ? 0.35 : 1, y: 0 }}
              transition={{ delay: hover ? 0 : i * 0.015, duration: 0.35 }}
            >
              <line x1={x} x2={x} y1={scaleY(d.h)} y2={scaleY(d.l)} stroke={color} strokeWidth={1.5} />
              <rect
                x={x - step * 0.32}
                width={step * 0.64}
                y={bodyTop}
                height={bodyH}
                fill={up ? color : 'transparent'}
                stroke={color}
                strokeWidth={1.5}
                rx={1}
                style={{
                  transform: near === 0 ? 'scaleX(1.5)' : 'scaleX(1)',
                  transformOrigin: `${x}px center`,
                  transformBox: 'view-box',
                  transition: 'transform 0.2s',
                }}
              />
            </motion.g>
          )
        })}

        {hover && (
          <g pointerEvents="none">
            <line
              x1={PAD + hover.i * step + step / 2}
              x2={PAD + hover.i * step + step / 2}
              y1={0}
              y2={H}
              stroke="var(--card)"
              strokeOpacity={0.5}
              strokeDasharray="4 4"
            />
            <line x1={0} x2={W} y1={hover.y} y2={hover.y} stroke="var(--card)" strokeOpacity={0.5} strokeDasharray="4 4" />
            <rect x={W - 78} y={hover.y - 11} width={74} height={22} rx={4} fill="var(--primary)" />
            <text
              x={W - 41}
              y={hover.y + 4}
              textAnchor="middle"
              className="fill-card font-mono text-[11px] font-bold"
            >
              {fmt(invY(hover.y))}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
