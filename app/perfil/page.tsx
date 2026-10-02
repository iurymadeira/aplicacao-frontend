import type { Metadata } from 'next'
import { PageHeader } from '@/components/site/motion-kit'
import { ProfileQuiz } from '@/components/learn/profile-quiz'

export const metadata: Metadata = {
  title: 'Perfil de investidor',
  description: 'Responda 5 perguntas e descubra se você é conservador, moderado ou arrojado.',
}

export default function PerfilPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quiz · 5 perguntas"
        title="Que tipo de investidor é você?"
        description="Sem certo ou errado. Responda com sinceridade e veja uma carteira de exemplo para o seu perfil."
      />
      <ProfileQuiz />
    </>
  )
}
