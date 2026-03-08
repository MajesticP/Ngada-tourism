'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

type Photo = { id_foto: number; url: string; urutan: number }

export default function PhotoCarousel({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (photos.length === 0) return null

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent(i => (i + 1) % photos.length)

  return (
    <>
      {/* Main carousel */}
      <div className="relative h-[60vh] min-h-[400px] group">
        <Image
          src={photos[current].url}
          alt={`${alt} - foto ${current + 1}`}
          fill
          className="object-cover cursor-pointer"
          priority
          onClick={() => setLightbox(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

        {/* Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={22} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((p, i) => (
              <button
                key={p.id_foto}
                onClick={() => setCurrent(i)}
                className={`relative w-12 h-9 rounded-md overflow-hidden border-2 transition-all ${
                  i === current ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={p.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2"
            onClick={() => setLightbox(false)}
          >
            <X size={20} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-2"
            onClick={e => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh] px-16" onClick={e => e.stopPropagation()}>
            <Image
              src={photos[current].url}
              alt={`${alt} - foto ${current + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-2"
            onClick={e => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {current + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
