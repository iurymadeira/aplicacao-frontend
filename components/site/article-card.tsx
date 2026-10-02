import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { Article } from '@/lib/data'
import { cn } from '@/lib/utils'
import { TiltCard } from './motion-kit'

export function CategoryTag({ category, className }: { category: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-[11px] font-bold tracking-wider uppercase',
        category === 'Educação' ? 'bg-signal text-ink' : 'bg-card text-ink',
        className,
      )}
    >
      {category}
    </span>
  )
}

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <TiltCard intensity={large ? 4 : 7} className="rounded-3xl">
      <Link
        href={`/noticias/${article.slug}`}
        data-cursor-label="Ler"
        className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-ink bg-card shadow-[4px_4px_0_0_var(--ink)] transition-shadow hover:shadow-[8px_8px_0_0_var(--primary)]"
      >
        <div className={cn('relative overflow-hidden border-b-2 border-ink', large ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
          <Image
            src={article.image || '/placeholder.svg'}
            alt=""
            fill
            sizes={large ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 100vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          />
          <CategoryTag category={article.category} className="absolute top-3 left-3" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3
            className={cn(
              'font-extrabold tracking-tight text-balance transition-colors group-hover:text-primary',
              large ? 'text-3xl leading-tight md:text-4xl' : 'text-xl leading-snug',
            )}
          >
            {article.title}
          </h3>
          {large && <p className="leading-relaxed text-pretty text-muted-foreground">{article.dek}</p>}
          <div className="mt-auto flex items-center gap-3 pt-2 font-mono text-xs text-muted-foreground">
            <span>{article.time}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.read} min
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}
