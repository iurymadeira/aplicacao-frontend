import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/site/motion-kit'
import { MagneticLink } from '@/components/site/magnetic'
import { TrackList } from '@/components/learn/track-list'

export const metadata: Metadata = {
  title: 'Aprender',
  description: 'Trilhas de educação financeira do básico ao avançado: orçamento, renda fixa, ações, FIIs e macroeconomia.',
}

export default function AprenderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Educação financeira"
        title="Do primeiro salário à independência financeira."
        description="Trilhas curtas e diretas. Marque cada aula concluída e acompanhe seu progresso."
      >
        <div className="flex flex-wrap gap-3">
          <MagneticLink href="/perfil" variant="signal" label="Quiz">
            Descobrir meu perfil
            <ArrowRight className="size-4" />
          </MagneticLink>
          <MagneticLink href="/glossario" variant="outline" label="ABC">
            Abrir glossário
          </MagneticLink>
        </div>
      </PageHeader>
      <TrackList />
    </>
  )
}
