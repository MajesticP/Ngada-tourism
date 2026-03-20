'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)
  const tx = useSpring(mx, { stiffness: 120, damping: 22 })
  const ty = useSpring(my, { stiffness: 120, damping: 22 })
  const [big, setBig] = useState(false)
  const [click, setClick] = useState(false)

  useEffect(() => {
    const move  = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    const over  = (e: MouseEvent) => setBig(!!(e.target as HTMLElement).closest('a,button,[data-hover]'))
    const down  = () => setClick(true)
    const up    = () => setClick(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  return (
    <motion.div className="fixed inset-0 z-[9999] pointer-events-none" style={{ x: tx, y: ty }}>
      <motion.div
        className="absolute rounded-full border border-stone-800/50 -translate-x-1/2 -translate-y-1/2"
        animate={{ width: big ? 48 : click ? 14 : 30, height: big ? 48 : click ? 14 : 30, opacity: big ? 0.5 : 0.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
      <div className="absolute w-1.5 h-1.5 rounded-full bg-stone-800 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  )
}
