import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { MarketBoard } from '@/components/market/market-board'

export const metadata: Metadata = {
  title: 'Mercado',
  description: 'Cotações de ações, índices, câmbio, cripto e commodities atualizando ao vivo.',
}

export default function MercadoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ao vivo"
        title="O pregão inteiro numa tela só."
        description="Ações, índices, câmbio, cripto e commodities. Filtre, ordene e veja os preços piscarem a cada negócio."
      />
      <MarketBoard />
    </>
  )
}
