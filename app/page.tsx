import { ArrowRight } from 'lucide-react'
import { articles } from '@/lib/data'
import { HomeHero } from '@/components/home/home-hero'
import { TwoPortals } from '@/components/home/two-portals'
import { LiveMovers } from '@/components/home/live-movers'
import { CoinStackTeaser } from '@/components/home/coin-stack-teaser'
import { ArticleCard } from '@/components/site/article-card'
import { MagneticLink } from '@/components/site/magnetic'
import { Reveal } from '@/components/site/motion-kit'

export default function HomePage() {
  const [lead, ...rest] = articles
  return (
    <>
      <HomeHero />
      <TwoPortals />
      <LiveMovers />
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs font-bold tracking-wider text-primary uppercase">Últimas</p>
            <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">Na mesa de operações</h2>
          </div>
          <MagneticLink href="/noticias" variant="outline" label="Todas">
            Todas as notícias
            <ArrowRight className="size-4" />
          </MagneticLink>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2 lg:row-span-2">
            <ArticleCard article={lead} large />
          </Reveal>
          {rest.slice(0, 2).map((a, i) => (
            <Reveal key={a.slug} delay={0.1 * (i + 1)}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>
      <CoinStackTeaser />
    </>
  )
}
