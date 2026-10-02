'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Search, Shuffle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { glossary } from '@/lib/data'
import { cn } from '@/lib/utils'
import { MagneticButton } from '@/components/site/magnetic'

const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = strip(text).indexOf(strip(query))
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-signal px-0.5 text-ink">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function GlossaryBrowser() {
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState<string | null>(null)
  const [spotlight, setSpotlight] = useState<string | null>(null)

  const letters = useMemo(() => Array.from(new Set(glossary.map((g) => strip(g.term)[0].toUpperCase()))).sort(), [])
  const list = glossary.filter((g) => {
    if (letter && strip(g.term)[0].toUpperCase() !== letter) return false
    if (!query) return true
    return strip(g.term).includes(strip(query)) || strip(g.def).includes(strip(query))
  })

  const shuffle = () => {
    const pick = glossary[Math.floor(Math.random() * glossary.length)]
    setQuery('')
    setLetter(null)
    setSpotlight(pick.term)
    requestAnimationFrame(() => document.getElementById(`term-${strip(pick.term)}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-full border-2 border-ink bg-card px-5 py-3 shadow-[3px_3px_0_0_var(--ink)] focus-within:shadow-[5px_5px_0_0_var(--primary)]">
          <Search className="size-5 text-muted-foreground" />
          <span className="sr-only">Buscar termo</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSpotlight(null)
            }}
            placeholder="Buscar: CDI, dividendos, liquidez…"
            className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
          />
        </label>
        <MagneticButton type="button" variant="signal" onClick={shuffle} label="Sorte">
          <Shuffle className="size-4" />
          Termo aleatório
        </MagneticButton>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por letra">
        <LetterButton active={letter === null} onClick={() => setLetter(null)}>
          A–Z
        </LetterButton>
        {letters.map((l) => (
          <LetterButton key={l} active={letter === l} onClick={() => setLetter(letter === l ? null : l)}>
            {l}
          </LetterButton>
        ))}
      </div>

      <motion.dl layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((g) => (
            <motion.div
              key={g.term}
              id={`term-${strip(g.term)}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: spotlight === g.term ? 1.04 : 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4, rotate: -0.6 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className={cn(
                'group flex flex-col gap-2 rounded-3xl border-2 border-ink p-5 shadow-[4px_4px_0_0_var(--ink)] transition-colors',
                spotlight === g.term ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-signal/40',
              )}
            >
              <dt className="flex items-center justify-between gap-2 text-xl font-extrabold tracking-tight">
                <Highlight text={g.term} query={query} />
                <span className="font-mono text-xs opacity-50">{strip(g.term)[0].toUpperCase()}</span>
              </dt>
              <dd className={cn('text-sm leading-relaxed', spotlight === g.term ? 'opacity-90' : 'text-muted-foreground')}>
                <Highlight text={g.def} query={query} />
              </dd>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.dl>
      {list.length === 0 && (
        <p className="rounded-3xl border-2 border-dashed border-ink p-10 text-center text-muted-foreground">
          Nenhum termo encontrado. Tente outra palavra.
        </p>
      )}
    </div>
  )
}

function LetterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex h-9 min-w-9 items-center justify-center rounded-xl border-2 border-ink px-2 font-mono text-sm font-bold transition-all hover:-translate-y-1 hover:rotate-3',
        active ? 'bg-ink text-card' : 'bg-card',
      )}
    >
      {children}
    </button>
  )
}
