'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { articles, type Category } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ArticleCard } from '@/components/site/article-card'

const categories: (Category | 'Tudo')[] = ['Tudo', 'Mercado', 'Economia', 'Política', 'Empresas', 'Cripto', 'Educação']

export function NewsFeed() {
  const [cat, setCat] = useState<(typeof categories)[number]>('Tudo')
  const list = articles.filter((a) => cat === 'Tudo' || a.category === cat)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:px-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Editorias">
        {categories.map((c) => {
          const count = c === 'Tudo' ? articles.length : articles.filter((a) => a.category === c).length
          return (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold shadow-[2px_2px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--ink)] active:translate-y-0 active:shadow-none',
                cat === c ? 'bg-ink text-card' : 'bg-card',
              )}
            >
              {c}
              <span
                className={cn(
                  'rounded-full px-1.5 font-mono text-[10px]',
                  cat === c ? 'bg-signal text-ink' : 'bg-muted',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((a, i) => (
            <motion.div
              key={a.slug}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, delay: i * 0.03 }}
            >
              <ArticleCard article={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
