'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, PlayCircle } from 'lucide-react'
import { useState } from 'react'
import { tracks, type Track } from '@/lib/data'
import { cn } from '@/lib/utils'

const levels: (Track['level'] | 'Todos')[] = ['Todos', 'Iniciante', 'Intermediário', 'Avançado']
const levelTone: Record<Track['level'], string> = {
  Iniciante: 'bg-signal text-ink',
  Intermediário: 'bg-primary text-primary-foreground',
  Avançado: 'bg-ink text-card',
}

export function TrackList() {
  const [level, setLevel] = useState<(typeof levels)[number]>('Todos')
  const [open, setOpen] = useState<string | null>(tracks[0].slug)
  const [done, setDone] = useState<Record<string, boolean>>({})

  const list = tracks.filter((t) => level === 'Todos' || t.level === level)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 md:px-6">
      <div className="flex flex-wrap gap-2">
        {levels.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            aria-pressed={level === l}
            className={cn(
              'rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-all hover:-rotate-2',
              level === l ? 'bg-ink text-card' : 'bg-card',
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <motion.ul layout className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {list.map((t) => {
            const isOpen = open === t.slug
            const completed = t.lessons.filter((_, i) => done[`${t.slug}-${i}`]).length
            const pct = (completed / t.lessons.length) * 100
            const total = t.lessons.reduce((s, l) => s + l.minutes, 0)
            return (
              <motion.li
                key={t.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--ink)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : t.slug)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-signal/30 md:p-6"
                >
                  <div className="relative flex size-14 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="var(--muted)" strokeWidth="4" />
                      <motion.circle
                        cx="18"
                        cy="18"
                        r="15"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={false}
                        animate={{ pathLength: pct / 100 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      />
                    </svg>
                    <span className="font-mono text-xs font-bold">{Math.round(pct)}%</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase', levelTone[t.level])}>
                        {t.level}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {t.lessons.length} aulas · {total} min
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold tracking-tight md:text-2xl">{t.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{t.blurb}</p>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0">
                    <ChevronDown className="size-6" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <ol className="flex flex-col gap-2 border-t-2 border-ink p-5 md:p-6">
                        {t.lessons.map((lesson, i) => {
                          const key = `${t.slug}-${i}`
                          const isDone = Boolean(done[key])
                          return (
                            <motion.li
                              key={key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <button
                                type="button"
                                onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                                aria-pressed={isDone}
                                className={cn(
                                  'group/lesson flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all hover:translate-x-1',
                                  isDone ? 'border-ink bg-primary text-primary-foreground' : 'border-border bg-background hover:border-ink',
                                )}
                              >
                                <motion.span
                                  animate={{ scale: isDone ? [1, 1.4, 1] : 1, rotate: isDone ? 360 : 0 }}
                                  transition={{ duration: 0.4 }}
                                  className={cn(
                                    'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                                    isDone ? 'border-signal bg-signal text-ink' : 'border-ink',
                                  )}
                                >
                                  {isDone ? <Check className="size-4" /> : <PlayCircle className="size-4" />}
                                </motion.span>
                                <span className={cn('flex-1 font-medium', isDone && 'line-through decoration-2')}>
                                  {lesson.title}
                                </span>
                                <span className="font-mono text-xs opacity-70">{lesson.minutes} min</span>
                              </button>
                            </motion.li>
                          )
                        })}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
