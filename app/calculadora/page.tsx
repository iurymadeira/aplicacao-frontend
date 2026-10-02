import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { CompoundCalculator } from '@/components/tools/compound-calculator'

export const metadata: Metadata = {
  title: 'Calculadora de juros compostos',
  description: 'Simule aportes, taxas e prazos e veja quanto do seu patrimônio vem dos juros compostos.',
}

export default function CalculadoraPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ferramenta"
        title="Juros sobre juros, ao vivo."
        description="Mexa nos controles e passe o mouse no gráfico para ver o patrimônio ano a ano. Compare poupança, CDI e bolsa num clique."
      />
      <CompoundCalculator />
    </>
  )
}
