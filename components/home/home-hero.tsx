'use client'

import { motion } from 'motion/react'
import { ArrowRight, GraduationCap } from 'lucide-react'
import { MagneticLink } from '@/components/site/magnetic'
import { SplitTitle } from '@/components/site/motion-kit'
import { HeroChart } from './hero-chart'

export function HomeHero() {
  return (
    <section className="grid-paper border-b-2 border-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col gap-7">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink bg-card px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase"
          >
            <span className="size-2 animate-pulse rounded-full bg-down" />
            Pregão aberto · B3
          </motion.p>
          <SplitTitle
            text="Cada centavo tem uma história. Aprenda a ler todas."
            className="text-5xl leading-[0.92] font-extrabold tracking-tighter sm:text-6xl md:text-7xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            O Tostão junta o termômetro do mercado — cotações, Copom, bolsa — com aulas diretas sobre como investir,
            poupar e planejar. Notícia e educação, lado a lado.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticLink href="/mercado" label="Ao vivo">
              Ver o mercado
              <ArrowRight className="size-4" />
            </MagneticLink>
            <MagneticLink href="/aprender" variant="signal" label="Bora">
              <GraduationCap className="size-4" />
              Começar a aprender
            </MagneticLink>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, rotate: 3, y: 30 }}
          animate={{ opacity: 1, rotate: 0, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroChart />
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {'↖ passe o mouse no gráfico para ver cada pregão'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
