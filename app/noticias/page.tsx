import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { NewsFeed } from '@/components/news/news-feed'

export const metadata: Metadata = {
  title: 'Notícias',
  description: 'Mercado, economia, política, empresas e cripto — as notícias que mexem com o seu dinheiro.',
}

export default function NoticiasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Redação"
        title="O que mexe com o seu dinheiro hoje."
        description="Notícias de mercado, política econômica e empresas, explicadas para quem investe — e para quem está começando."
      />
      <NewsFeed />
    </>
  )
}
