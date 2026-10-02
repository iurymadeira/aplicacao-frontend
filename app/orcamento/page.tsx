import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { BudgetPlanner } from '@/components/tools/budget-planner'

export const metadata: Metadata = {
  title: 'Planejador de orçamento',
  description: 'Distribua sua renda com o método 50/30/20 e receba um diagnóstico do seu orçamento.',
}

export default function OrcamentoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Ferramenta"
        title="Seu salário, dividido em três potes."
        description="Necessidades, desejos e futuro. Ajuste os controles — os outros potes se reequilibram sozinhos — e veja sua nota."
      />
      <BudgetPlanner />
    </>
  )
}
