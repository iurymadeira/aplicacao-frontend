'use client'

import { useEffect, useState } from 'react'
import { assets as baseAssets, type Asset } from '@/lib/data'

export type LiveAsset = Asset & { flash: 'up' | 'down' | null; tick: number }

export function useLiveQuotes(interval = 1800) {
  const [quotes, setQuotes] = useState<LiveAsset[]>(() => baseAssets.map((a) => ({ ...a, flash: null, tick: 0 })))

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) =>
        prev.map((q) => {
          if (Math.random() > 0.35) return { ...q, flash: null }
          const delta = (Math.random() - 0.5) * 0.004
          const price = q.price * (1 + delta)
          const base = q.price / (1 + q.change / 100)
          return {
            ...q,
            price,
            change: ((price - base) / base) * 100,
            flash: delta >= 0 ? 'up' : 'down',
            tick: q.tick + 1,
          }
        }),
      )
    }, interval)
    return () => clearInterval(id)
  }, [interval])

  return quotes
}
