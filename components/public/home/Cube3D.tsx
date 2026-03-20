'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FALLBACKS } from './types'

const SIZE = 220
const HALF = SIZE / 2

const FACES = [
  { label: 'Front',  rot: 'rotateY(0deg)' },
  { label: 'Right',  rot: 'rotateY(90deg)' },
  { label: 'Back',   rot: 'rotateY(180deg)' },
  { label: 'Left',   rot: 'rotateY(-90deg)' },
  { label: 'Top',    rot: 'rotateX(90deg)' },
  { label: 'Bottom', rot: 'rotateX(-90deg)' },
]

export default function Cube3D({ images }: { images: string[] }) {
  const rotY = useMotionValue(0)
  const rotX = useMotionValue(-8)
  const springY = useSpring(rotY, { stiffness: 40, damping: 18 })
  const springX = useSpring(rotX, { stiffness: 40, damping: 18 })
  const autoY   = useRef(0)
  const raf     = useRef<number>()
  const dragging = useRef(false)
  const lastX   = useRef(0)
  const lastY   = useRef(0)
  const vel     = useRef(0.25)

  useEffect(() => {
    const loop = () => {
      if (!dragging.current) { autoY.current += vel.current; rotY.set(autoY.current) }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true; lastX.current = e.clientX; lastY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastX.current
    const dy = e.clientY - lastY.current
    autoY.current += dx * 0.5
    rotY.set(autoY.current)
    rotX.set(Math.max(-30, Math.min(30, rotX.get() - dy * 0.3)))
    lastX.current = e.clientX; lastY.current = e.clientY
    vel.current = dx * 0.08
  }
  const onPointerUp = () => { dragging.current = false }

  return (
    <div
      className="select-none cursor-grab active:cursor-grabbing"
      style={{ width: SIZE, height: SIZE, perspective: 900 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      data-hover
    >
      <motion.div style={{ width: SIZE, height: SIZE, position: 'relative', transformStyle: 'preserve-3d', rotateY: springY, rotateX: springX }}>
        {FACES.map(({ rot, label }, i) => (
          <div
            key={label}
            style={{
              position: 'absolute', width: SIZE, height: SIZE,
              transform: `${rot} translateZ(${HALF}px)`,
              backfaceVisibility: 'hidden', overflow: 'hidden',
              borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            <img src={images[i] ?? FALLBACKS[i]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(0,0,0,0.2),transparent)' }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
