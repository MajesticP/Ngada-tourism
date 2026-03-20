'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight } from 'lucide-react'
import { WisataItem, KAT_LABEL, getImg } from './types'

export default function FlipCard({ w, idx }: { w: WisataItem; idx: number }) {
  const [flipped, setFlipped] = useState(false)
  const img = getImg(w, idx)
  const kat = KAT_LABEL[w.kategori] ?? 'Wisata'

  return (
    <div
      className="h-80 cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      data-hover
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 16, overflow: 'hidden' }}>
          <Image src={img} alt={w.nama_tempat_wisata} fill className="object-cover" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{kat}</span>
            <h3 className="font-display text-lg text-white font-bold leading-tight mt-1">{w.nama_tempat_wisata}</h3>
          </div>
        </div>

        {/* Back */}
        <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 16, transform: 'rotateY(180deg)', background: '#0a0a0a', overflow: 'hidden' }}>
          <div className="flex flex-col justify-between h-full p-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ngada-400">{kat}</span>
              <h3 className="font-display text-xl text-white font-bold leading-tight mt-2">{w.nama_tempat_wisata}</h3>
              {w.kabupaten && (
                <p className="text-white/40 text-xs mt-1 flex items-center gap-1"><MapPin size={9} />{w.kabupaten.nama_kabupaten}</p>
              )}
              <p className="text-white/50 text-xs mt-4 leading-relaxed line-clamp-4">{w.informasi1}</p>
            </div>
            <Link
              href={`/wisata/${w.id_tempat_wisata}`}
              className="inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-ngada-300 transition-colors w-fit"
            >
              Lihat Detail <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
