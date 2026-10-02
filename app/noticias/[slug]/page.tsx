import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { articles } from '@/lib/data'
import { ArticleCard, CategoryTag } from '@/components/site/article-card'
import { Reveal, SplitTitle } from '@/components/site/motion-kit'
import { ReadingBody } from '@/components/news/reading-progress'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  return article ? { title: article.title, description: article.dek } : {}
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)
  if (!article) notFound()
  const related = articles.filter((a) => a.slug !== slug).slice(0, 3)

  return (
    <article>
      <header className="grid-paper border-b-2 border-ink">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pt-10 pb-12 md:px-6">
          <Link
            href="/noticias"
            className="group inline-flex w-fit items-center gap-2 font-mono text-xs font-bold uppercase"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Notícias
          </Link>
          <CategoryTag category={article.category} />
          <SplitTitle
            text={article.title}
            className="text-4xl leading-[1] font-extrabold tracking-tighter md:text-6xl"
          />
          <p className="text-xl leading-relaxed text-pretty text-muted-foreground">{article.dek}</p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="flex size-8 items-center justify-center rounded-full border-2 border-ink bg-signal font-bold">
              {article.author
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </span>
            <span className="font-bold">{article.author}</span>
            <span aria-hidden="true">·</span>
            <span>{article.time}</span>
            <span aria-hidden="true">·</span>
            <span>{article.read} min de leitura</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border-2 border-ink shadow-[6px_6px_0_0_var(--ink)]">
            <Image src={article.image || '/placeholder.svg'} alt="" fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <ReadingBody minutes={article.read}>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-6">
            {article.body.map((p, i) => (
              <Reveal key={i} y={14}>
                <p
                  className={
                    i === 0
                      ? 'text-lg leading-relaxed first-letter:float-left first-letter:mr-3 first-letter:rounded-xl first-letter:border-2 first-letter:border-ink first-letter:bg-primary first-letter:px-3 first-letter:text-5xl first-letter:font-extrabold first-letter:text-primary-foreground'
                      : 'text-lg leading-relaxed'
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </ReadingBody>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Continue lendo</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </article>
  )
}
