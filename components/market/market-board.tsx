'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowDownUp, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatPrice, series, type Asset } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Sparkline } from '@/components/site/motion-kit'
import { useLiveQuotes } from '@/components/site/use-live-quotes'

const kinds: (Asset['kind'] | 'Todos')[] = ['Todos', 'Ação', 'Índice', 'Câmbio', 'Cripto', 'Commodity']
type SortKey = 'symbol' | 'price' | 'change'

export function MarketBoard() {
  const quotes = useLiveQuotes(1400)
  const [kind, setKind] = useState<(typeof kinds)[number]>('Todos')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'change', dir: -1 })
  const [selected, setSelected] = useState('PETR4')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return quotes
      .filter((a) => kind === 'Todos' || a.kind === kind)
      .filter((a) => !q || a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const va = a[sort.key]
        const vb = b[sort.key]
        return (typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)) * sort.dir
      })
  }, [quotes, kind, query, sort])

  const current = quotes.find((q) => q.symbol === selected) ?? quotes[0]
  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: -1 }))

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:px-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Classe de ativo" className="flex flex-wrap gap-1 rounded-full border-2 border-ink bg-card p-1">
            {kinds.map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                  kind === k ? 'text-primary-foreground' : 'hover:text-primary',
                )}
              >
                {kind === k && (
                  <motion.span
                    layoutId="kind-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative">{k}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-full border-2 border-ink bg-card px-4 py-2 focus-within:shadow-[3px_3px_0_0_var(--primary)]">
            <Search className="size-4 text-muted-foreground" />
            <span className="sr-only">Buscar ativo</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ticker…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground md:w-40"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-[6px_6px_0_0_var(--ink)]">
          <table className="w-full text-left">
            <thead className="border-b-2 border-ink bg-ink text-card">
              <tr className="font-mono text-xs uppercase">
                <SortHeader label="Ativo" onClick={() => toggleSort('symbol')} active={sort.key === 'symbol'} />
                <th className="hidden px-4 py-3 font-normal md:table-cell">Tendência</th>
                <SortHeader label="Preço" onClick={() => toggleSort('price')} active={sort.key === 'price'} right />
                <SortHeader label="Var." onClick={() => toggleSort('change')} active={sort.key === 'change'} right />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((q) => {
                  const up = q.change >= 0
                  return (
                    <motion.tr
                      key={q.symbol}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                      onClick={() => setSelected(q.symbol)}
                      className={cn(
                        'cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-signal/40',
                        selected === q.symbol && 'bg-signal/60',
                      )}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelected(q.symbol)}
                          className="flex flex-col text-left"
                          aria-pressed={selected === q.symbol}
                        >
                          <span className="font-mono text-sm font-bold">{q.symbol}</span>
                          <span className="text-xs text-muted-foreground">{q.name}</span>
                        </button>
                      </td>
                      <td className="hidden w-32 px-4 py-3 md:table-cell">
                        <Sparkline
                          data={series(q.symbol.length * 31 + q.name.length, 24, 10, 0.04)}
                          stroke={up ? 'var(--up)' : 'var(--down)'}
                          fill={false}
                          className="h-6"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 transition-colors duration-500',
                            q.flash === 'up' && 'bg-primary text-primary-foreground',
                            q.flash === 'down' && 'bg-down text-card',
                          )}
                        >
                          {formatPrice(q, q.price)}
                        </span>
                      </td>
                      <td className={cn('px-4 py-3 text-right font-mono text-sm font-bold tabular-nums', up ? 'text-up' : 'text-down')}>
                        {up ? '+' : ''}
                        {q.change.toFixed(2)}%
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-8 text-center text-muted-foreground">Nenhum ativo encontrado.</p>}
        </div>
      </div>

      <AssetDetail asset={current} />
    </div>
  )
}

function SortHeader({ label, onClick, active, right }: { label: string; onClick: () => void; active: boolean; right?: boolean }) {
  return (
    <th className={cn('px-4 py-3 font-normal', right && 'text-right')}>
      <button
        type="button"
        onClick={onClick}
        className={cn('inline-flex items-center gap-1 uppercase transition-colors hover:text-signal', active && 'text-signal')}
      >
        {label}
        <ArrowDownUp className="size-3" />
      </button>
    </th>
  )
}

function AssetDetail({ asset }: { asset: ReturnType<typeof useLiveQuotes>[number] }) {
  const [range, setRange] = useState<'1S' | '1M' | '6M' | '1A'>('1M')
  const lengths = { '1S': 7, '1M': 30, '6M': 60, '1A': 90 }
  const data = useMemo(
    () => series(asset.symbol.charCodeAt(0) + asset.symbol.length * 13 + lengths[range], lengths[range], asset.price, 0.025),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset.symbol, range],
  )
  const up = asset.change >= 0

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={asset.symbol}
          initial={{ opacity: 0, rotateY: -20, x: 20 }}
          animate={{ opacity: 1, rotateY: 0, x: 0 }}
          exit={{ opacity: 0, rotateY: 20, x: -20 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-5 rounded-3xl border-2 border-ink bg-primary p-6 text-primary-foreground shadow-[6px_6px_0_0_var(--ink)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase opacity-70">
                {asset.kind} · {asset.sector}
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight">{asset.symbol}</h2>
              <p className="text-sm opacity-80">{asset.name}</p>
            </div>
            <span
              className={cn(
                'rounded-full border-2 border-ink px-3 py-1 font-mono text-sm font-bold',
                up ? 'bg-signal text-ink' : 'bg-down text-card',
              )}
            >
              {up ? '+' : ''}
              {asset.change.toFixed(2)}%
            </span>
          </div>
          <p className="font-mono text-4xl font-bold tabular-nums">{formatPrice(asset, asset.price)}</p>
          <div className="rounded-2xl border-2 border-ink bg-ink p-3">
            <Sparkline key={range} data={data} stroke="var(--signal)" className="h-36" />
          </div>
          <div className="flex gap-2" role="group" aria-label="Período">
            {(Object.keys(lengths) as (keyof typeof lengths)[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={cn(
                  'flex-1 rounded-full border-2 border-ink py-1.5 font-mono text-xs font-bold transition-all hover:-translate-y-0.5',
                  range === r ? 'bg-signal text-ink' : 'bg-card text-ink',
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs leading-relaxed opacity-80">
            Clique em qualquer linha da tabela para trocar o ativo em destaque.
          </p>
        </motion.div>
      </AnimatePresence>
    </aside>
  )
}
