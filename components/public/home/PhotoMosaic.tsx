'use client'

import { motion } from 'framer-motion'
import { FALLBACKS } from './types'

const CARDS = [
  { rotate: '-6deg',  x: '0%',   y: '0%',   z: 4, delay: 0.1,  scale: 1.05 },
  { rotate:  '5deg',  x: '55%',  y: '-12%', z: 3, delay: 0.2,  scale: 1 },
  { rotate: '-3deg',  x: '25%',  y: '52%',  z: 5, delay: 0.35, scale: 0.95 },
  { rotate:  '8deg',  x: '72%',  y: '38%',  z: 2, delay: 0.45, scale: 0.9 },
]

const FLOAT = [
  { y: [0, -10, 0], duration: 4.2 },
  { y: [0,   8, 0], duration: 3.8 },
  { y: [0,  -6, 0], duration: 5.1 },
  { y: [0,   9, 0], duration: 4.6 },
]

export default function PhotoMosaic({ images }: { images: string[] }) {
  return (
    <div
      className="relative select-none"
      style={{ width: 340, height: 340 }}
    >
      {CARDS.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 24 }}
          animate={{ opacity: 1, scale: c.scale, y: 0 }}
          transition={{ delay: c.delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            left: c.x,
            top:  c.y,
            zIndex: c.z,
            rotate: c.rotate,
          }}
        >
          <motion.div
            animate={{ y: FLOAT[i].y }}
            transition={{ duration: FLOAT[i].duration, repeat: Infinity, ease: 'easeInOut' }}
            className="group"
          >
            {/* polaroid-style card */}
            <div
              className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
              style={{
                width:  i === 0 ? 160 : i === 2 ? 150 : 130,
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <img
                src={images[i] ?? FALLBACKS[i]}
                alt=""
                className="w-full object-cover"
                style={{ height: i === 0 ? 140 : 110, display: 'block' }}
              />
              {/* thin label strip */}
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-white/40 text-[9px] uppercase tracking-widest font-medium">Ngada</span>
                <span className="w-1.5 h-1.5 rounded-full bg-ngada-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* subtle glow behind */}
      <div
        className="absolute inset-0 -z-10 blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle at 50% 50%, #dc911f 0%, transparent 70%)' }}
      />
    </div>
  )
}
