import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { GlossaryBrowser } from '@/components/learn/glossary-browser'

export const metadata: Metadata = {
  title: 'Glossário financeiro',
  description: 'Os termos do mercado financeiro explicados em linguagem simples.',
}

export default function GlossarioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dicionário"
        title="Financês traduzido para português."
        description="Selic, CDI, P/L, liquidez… Busque qualquer termo ou deixe a sorte escolher um para você aprender hoje."
      />
      <GlossaryBrowser />
    </>
  )
}
