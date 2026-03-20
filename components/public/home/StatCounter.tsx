'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/** Animated count-up number, triggers when scrolled into view */
export function Num({ to, suf = '' }: { to: number; suf?: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const done = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        let s = 0
        const step = Math.max(1, Math.ceil(to / 50))
        const t = setInterval(() => { s = Math.min(s + step, to); setV(s); if (s >= to) clearInterval(t) }, 28)
      }
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])

  return <span ref={ref}>{v}{suf}</span>
}

/** 3D flip-in section number (e.g. "01", "02") */
export function Num3D({ n }: { n: string }) {
  return (
    <motion.div
      initial={{ rotateX: 90, opacity: 0 }}
      whileInView={{ rotateX: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: 'preserve-3d', perspective: 400, WebkitTextStroke: '1.5px #d4c5a9', color: 'transparent' }}
      className="font-display font-black text-[clamp(5rem,12vw,9rem)] leading-none select-none"
    >
      {n}
    </motion.div>
  )
}
