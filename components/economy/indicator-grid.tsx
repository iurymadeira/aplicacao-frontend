'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { indicators } from '@/lib/data'
import { CountUp, Reveal, Sparkline, TiltCard } from '@/components/site/motion-kit'

const explain: Record<string, string> = {
  Selic: 'Quando sobe, a renda fixa rende mais e o crédito fica mais caro. Bolsa tende a sofrer.',
  'IPCA 12m': 'Mede quanto seu dinheiro perdeu de poder de compra. Meta oficial: 3%.',
  PIB: 'Soma de tudo que o país produz. Crescimento forte ajuda lucros das empresas.',
  Desemprego: 'Mercado de trabalho aquecido sustenta consumo, mas pode pressionar a inflação.',
  Dólar: 'Afeta preço de importados, viagens e empresas exportadoras na bolsa.',
  CDI: 'Acompanha a Selic de perto. É a régua da maioria dos investimentos de renda fixa.',
}

export function IndicatorGrid() {
  const [flipped, setFlipped] = useState<string | null>(null)
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="mb-4 font-mono text-xs text-muted-foreground">{'Clique em um card para virar e ler a explicação.'}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {indicators.map((ind, i) => {
          const isFlipped = flipped === ind.label
          return (
            <Reveal key={ind.label} delay={i * 0.06}>
              <TiltCard intensity={6} className="rounded-3xl">
                <button
                  type="button"
                  onClick={() => setFlipped(isFlipped ? null : ind.label)}
                  aria-pressed={isFlipped}
                  data-cursor-label={isFlipped ? 'Voltar' : 'Virar'}
                  className="block h-56 w-full text-left [perspective:1000px]"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                    className="relative h-full w-full [transform-style:preserve-3d]"
                  >
                    <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border-2 border-ink bg-card p-5 shadow-[4px_4px_0_0_var(--ink)] [backface-visibility:hidden]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-xs font-bold uppercase">{ind.label}</p>
                          <p className="text-xs text-muted-foreground">{ind.note}</p>
                        </div>
                        <span className="rounded-full bg-signal px-2 py-0.5 font-mono text-[10px] font-bold">24m</span>
                      </div>
                      <p className="font-mono text-5xl font-bold tracking-tight">
                        {ind.unit === 'R$' && <span className="text-2xl">R$ </span>}
                        <CountUp value={ind.value} decimals={2} />
                        {ind.unit !== 'R$' && <span className="text-xl text-muted-foreground"> {ind.unit}</span>}
                      </p>
                      <Sparkline data={ind.history} className="h-10" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border-2 border-ink bg-primary p-5 text-primary-foreground shadow-[4px_4px_0_0_var(--ink)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="font-mono text-xs font-bold uppercase">O que é {ind.label}?</p>
                      <p className="text-lg leading-relaxed font-medium text-pretty">{explain[ind.label]}</p>
                      <span className="font-mono text-xs opacity-70">clique para voltar</span>
                    </div>
                  </motion.div>
                </button>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
