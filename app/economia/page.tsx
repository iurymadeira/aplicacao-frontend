import type { Metadata } from 'next'
import { articles } from '@/lib/data'
import { PageHeader, Reveal } from '@/components/site/motion-kit'
import { IndicatorGrid } from '@/components/economy/indicator-grid'
import { CopomTimeline } from '@/components/economy/copom-timeline'
import { ArticleCard } from '@/components/site/article-card'

export const metadata: Metadata = {
  title: 'Economia',
  description: 'Selic, inflação, PIB, câmbio e as decisões do Copom explicadas para o investidor.',
}

export default function EconomiaPage() {
  const macro = articles.filter((a) => a.category === 'Economia' || a.category === 'Política')
  return (
    <>
      <PageHeader
        eyebrow="Cenário macro"
        title="Juros, inflação e o humor de Brasília."
        description="Os indicadores que movem a renda fixa, a bolsa e o câmbio — e o que cada um significa para você."
      />
      <IndicatorGrid />
      <CopomTimeline />
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">Política econômica</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {macro.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.08}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
