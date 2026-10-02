import Link from 'next/link'
import { navLinks } from '@/lib/data'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Mercado em tempo real e educação financeira sem jargão. Cada centavo conta.
          </p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-2">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group inline-flex items-center gap-1 text-sm font-medium"
                >
                  <span className="bg-[linear-gradient(var(--primary),var(--primary))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-4 font-mono text-xs text-muted-foreground md:px-6">
          {'Cotações simuladas para fins de demonstração. Conteúdo educativo — não é recomendação de investimento.'}
        </p>
      </div>
    </footer>
  )
}
