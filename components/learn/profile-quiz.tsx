'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { MagneticButton, MagneticLink } from '@/components/site/magnetic'

const questions = [
  {
    q: 'Seus investimentos caíram 20% em um mês. O que você faz?',
    a: ['Vendo tudo na hora', 'Espero e observo', 'Compro mais, está barato'],
  },
  {
    q: 'Quando você vai precisar desse dinheiro?',
    a: ['Em até 1 ano', 'Entre 2 e 5 anos', 'Daqui a mais de 5 anos'],
  },
  {
    q: 'Quanto você entende de investimentos?',
    a: ['Quase nada', 'O básico de renda fixa', 'Já invisto em ações'],
  },
  {
    q: 'Qual frase combina mais com você?',
    a: ['Prefiro dormir tranquilo', 'Aceito algum risco por mais retorno', 'Quero o máximo de retorno possível'],
  },
  {
    q: 'Você já tem reserva de emergência?',
    a: ['Ainda não', 'Estou montando', 'Sim, completa'],
  },
]

const profiles = [
  {
    name: 'Conservador',
    text: 'Você valoriza segurança e previsibilidade. Foque em renda fixa com liquidez e construa sua base com calma.',
    alloc: [
      { label: 'Renda fixa pós', pct: 70 },
      { label: 'IPCA+', pct: 20 },
      { label: 'Ações/FIIs', pct: 10 },
    ],
  },
  {
    name: 'Moderado',
    text: 'Você aceita oscilações em troca de retorno maior no médio prazo. Equilíbrio é a palavra.',
    alloc: [
      { label: 'Renda fixa pós', pct: 40 },
      { label: 'IPCA+', pct: 25 },
      { label: 'Ações/FIIs', pct: 35 },
    ],
  },
  {
    name: 'Arrojado',
    text: 'Você tem estômago para volatilidade e horizonte longo. A bolsa pode ser a protagonista da carteira.',
    alloc: [
      { label: 'Renda fixa pós', pct: 20 },
      { label: 'IPCA+', pct: 15 },
      { label: 'Ações/FIIs', pct: 65 },
    ],
  },
]

const barColors = ['bg-primary', 'bg-signal', 'bg-ink']

export function ProfileQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [dir, setDir] = useState(1)

  const finished = step >= questions.length
  const score = answers.reduce((s, a) => s + a, 0)
  const profile = profiles[score <= 3 ? 0 : score <= 6 ? 1 : 2]

  const choose = (i: number) => {
    const next = [...answers]
    next[step] = i
    setAnswers(next)
    setDir(1)
    setTimeout(() => setStep((s) => s + 1), 220)
  }

  const back = () => {
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  const reset = () => {
    setDir(-1)
    setAnswers([])
    setStep(0)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-6 flex gap-2" aria-hidden="true">
        {questions.map((_, i) => (
          <div key={i} className="h-2 flex-1 overflow-hidden rounded-full border border-ink bg-card">
            <motion.div
              className="h-full bg-primary"
              initial={false}
              animate={{ width: i < step ? '100%' : '0%' }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            />
          </div>
        ))}
      </div>

      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" custom={dir}>
          {!finished ? (
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60, rotate: dir * 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: dir * -60, rotate: dir * -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col gap-6 rounded-3xl border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--ink)] md:p-8"
            >
              <p className="font-mono text-xs font-bold text-primary uppercase">
                Pergunta {step + 1} de {questions.length}
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-balance md:text-4xl">{questions[step].q}</h2>
              <div className="flex flex-col gap-3" role="radiogroup" aria-label={questions[step].q}>
                {questions[step].a.map((opt, i) => (
                  <motion.button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={answers[step] === i}
                    onClick={() => choose(i)}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'group flex items-center gap-4 rounded-2xl border-2 border-ink px-5 py-4 text-left text-lg font-semibold transition-colors',
                      answers[step] === i ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-signal',
                    )}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-current font-mono text-sm">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                ))}
              </div>
              {step > 0 && (
                <button type="button" onClick={back} className="group inline-flex w-fit items-center gap-2 font-mono text-xs font-bold uppercase">
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  Voltar
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="flex flex-col gap-6 rounded-3xl border-2 border-ink bg-primary p-6 text-primary-foreground shadow-[8px_8px_0_0_var(--ink)] md:p-8"
            >
              <p className="font-mono text-xs font-bold uppercase opacity-80">Seu perfil é</p>
              <motion.h2
                initial={{ letterSpacing: '0.3em', opacity: 0 }}
                animate={{ letterSpacing: '-0.04em', opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl font-extrabold md:text-7xl"
              >
                {profile.name}
              </motion.h2>
              <p className="text-lg leading-relaxed text-pretty opacity-90">{profile.text}</p>
              <div className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-card p-5 text-card-foreground">
                <p className="font-mono text-xs font-bold uppercase">Carteira sugerida (exemplo)</p>
                <div className="flex h-6 overflow-hidden rounded-full border-2 border-ink">
                  {profile.alloc.map((a, i) => (
                    <motion.div
                      key={a.label}
                      className={barColors[i]}
                      initial={{ width: 0 }}
                      animate={{ width: `${a.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 120, damping: 18 }}
                    />
                  ))}
                </div>
                <ul className="flex flex-wrap gap-4 font-mono text-sm">
                  {profile.alloc.map((a, i) => (
                    <li key={a.label} className="flex items-center gap-2">
                      <span className={cn('size-3 rounded-full border border-ink', barColors[i])} />
                      {a.label} <span className="font-bold">{a.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                <MagneticLink href="/aprender" variant="signal" label="Bora">
                  Ver trilhas recomendadas
                  <ArrowRight className="size-4" />
                </MagneticLink>
                <MagneticButton type="button" variant="outline" onClick={reset} label="De novo">
                  <RotateCcw className="size-4" />
                  Refazer
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
