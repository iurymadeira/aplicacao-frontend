import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2" aria-label="Tostão, página inicial">
      <span className="relative flex size-9 items-center justify-center rounded-full border-2 border-ink bg-signal font-mono text-sm font-bold text-ink shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(360deg)]">
        T$
      </span>
      <span className="text-2xl font-extrabold tracking-tight">
        tostão<span className="text-primary">.</span>
      </span>
    </Link>
  )
}
