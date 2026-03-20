'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ArrowRight, ArrowUpRight, MountainSnow, Waves, Users, Globe } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PhotoMosaic from '@/components/public/home/PhotoMosaic'
import FlipCard from '@/components/public/home/FlipCard'
import { Num, Num3D } from '@/components/public/home/StatCounter'
import { WisataItem, KAT_LABEL, getImg } from '@/components/public/home/types'

export default function HomePageClient({
  wisataData, kabupatenList, totalWisata, totalKampung, totalPulau,
}: {
  wisataData: WisataItem[]
  kabupatenList: { id_kabupaten: number; nama_kabupaten: string }[]
  totalWisata: number
  totalKampung: number
  totalPulau: number
}) {
  const heroRef = useRef<HTMLDivElement>(null)

  const cubeImages = wisataData.slice(0, 6).map((w, i) => getImg(w, i))
  const [featured, ...rest] = wisataData

  return (
    <>
      <main className="bg-[#fafaf8] text-stone-900 overflow-x-hidden" style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {/* grain overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '128px' }} />

        <Navbar />

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden bg-stone-950">
          <div className="absolute inset-0 z-0 scale-110">
            <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90" alt="Ngada" fill priority className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950" />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-72 z-0 overflow-hidden" style={{ perspective: 600 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.5 }}
              style={{ width: '200%', height: '100%', transform: 'rotateX(65deg) translateX(-25%) translateY(40%)', backgroundImage: 'linear-gradient(rgba(220,145,31,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(220,145,31,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-screen px-8 md:px-16 pt-36 pb-14">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-[0.3em]">
              <span className="w-1.5 h-1.5 rounded-full bg-ngada-400 animate-pulse" />
              Ngada · Flores · NTT · Indonesia
            </motion.div>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16 my-auto py-20">
              <div className="flex-1 max-w-2xl">
                <div className="overflow-hidden pb-3 mb-1">
                  <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-black text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.92] text-white">Jelajahi</motion.h1>
                </div>
                <div className="overflow-hidden pb-4 mb-8">
                  <motion.h1 initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-black text-[clamp(3.2rem,7vw,6.5rem)] leading-[0.92] text-ngada-400 italic">Pesona Ngada</motion.h1>
                </div>
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">
                  Kampung adat megalitik, gunung berapi aktif, dan pulau-pulau eksotis di jantung Flores.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-wrap gap-3">
                  <Link href="/wisata" data-hover className="inline-flex items-center gap-2 bg-ngada-500 hover:bg-ngada-400 text-white px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ngada-500/30">
                    Mulai Jelajahi <ArrowRight size={14} />
                  </Link>
                  <a href="#destinasi" data-hover className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:bg-white/5">
                    Lihat Destinasi
                  </a>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.85, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center gap-4">
                <PhotoMosaic images={cubeImages} />
              </motion.div>
            </div>

            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="flex flex-col items-center gap-2 text-white/20 text-[10px] uppercase tracking-[0.3em] w-fit mx-auto">
              Scroll
              <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-16 border-b border-stone-200">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-stone-200">
            {[
              { icon: MountainSnow, val: totalWisata,         suf: '+', label: 'Destinasi Wisata' },
              { icon: Globe,        val: kabupatenList.length, suf: '',  label: 'Kecamatan' },
              { icon: Users,        val: totalKampung,         suf: '',  label: 'Kampung Adat' },
              { icon: Waves,        val: totalPulau,           suf: '',  label: 'Pulau Eksotis' },
            ].map(({ icon: Icon, val, suf, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="px-0 md:px-10 first:pl-0 last:pr-0 group" data-hover>
                <Icon size={16} className="text-stone-400 mb-4 group-hover:text-ngada-500 transition-colors" />
                <p className="font-display font-black text-5xl text-stone-900 leading-none mb-2"><Num to={val} suf={suf} /></p>
                <p className="text-stone-400 text-xs uppercase tracking-[0.15em]">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── DESTINATIONS ─────────────────────────────────────── */}
        <section id="destinasi" className="py-24 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-14">
              <div className="flex items-end gap-6">
                <Num3D n="01" />
                <div className="mb-4">
                  <div className="overflow-hidden">
                    <motion.p initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-[10px] uppercase tracking-[0.25em] text-stone-400 mb-1">Destinasi Unggulan</motion.p>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-4xl text-stone-900 leading-none">Tempat Wisata Terbaik</motion.h2>
                  </div>
                </div>
              </div>
              <Link href="/wisata" data-hover className="hidden md:inline-flex items-center gap-2 border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
                Semua <ArrowUpRight size={13} />
              </Link>
            </div>

            {wisataData.length === 0 ? (
              <p className="text-stone-400 text-center py-20">Belum ada data wisata.</p>
            ) : (
              <>
                {featured && (
                  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-5">
                    <Link href={`/wisata/${featured.id_tempat_wisata}`} data-hover className="group relative block h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
                      <Image src={getImg(featured, 0)} alt={featured.nama_tempat_wisata} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/30 to-transparent" />
                      <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ngada-400 mb-3 block">{KAT_LABEL[featured.kategori] ?? 'Wisata'} · {featured.kabupaten?.nama_kabupaten}</span>
                        <h3 className="font-display text-4xl md:text-5xl text-white font-black leading-none mb-3">{featured.nama_tempat_wisata}</h3>
                        <p className="text-white/50 text-sm max-w-md line-clamp-2 mb-5">{featured.informasi1}</p>
                        <span className="inline-flex items-center gap-2 bg-white text-stone-900 px-5 py-2.5 rounded-full text-sm font-bold w-fit group-hover:bg-ngada-400 group-hover:text-white transition-colors">Lihat Detail <ArrowRight size={13} /></span>
                      </div>
                    </Link>
                  </motion.div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {rest.slice(0, 4).map((w, i) => (
                    <motion.div key={w.id_tempat_wisata} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }}>
                      <FlipCard w={w} idx={i + 1} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        <section className="bg-stone-950 py-28 px-8 md:px-16 overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, rotateY: 15, x: -40 }} whileInView={{ opacity: 1, rotateY: 0, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: 1000 }} className="relative">
              <div className="relative h-[480px] rounded-3xl overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                <Image src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=85" alt="Ngada" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent" />
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-8 -right-8 bg-ngada-500 text-white rounded-2xl p-6 shadow-2xl shadow-ngada-500/40" style={{ boxShadow: '0 20px 60px rgba(220,145,31,0.35)' }}>
                <p className="font-display text-4xl font-black">{totalWisata}+</p>
                <p className="text-white/70 text-xs mt-1 uppercase tracking-wider">Destinasi</p>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-8 -left-6 bg-[#fafaf8] rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-stone-900 text-xs font-bold uppercase tracking-widest">Flores · NTT</p>
              </motion.div>
            </motion.div>

            <div>
              <div className="flex items-end gap-5 mb-8"><Num3D n="02" /><span className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-5">Tentang</span></div>
              <div className="overflow-hidden pb-2 mb-1">
                <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-[clamp(2.5rem,5vw,4rem)] text-white leading-none">Warisan Budaya</motion.h2>
              </div>
              <div className="overflow-hidden pb-3 mb-8">
                <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-[clamp(2.5rem,5vw,4rem)] text-ngada-400 leading-none italic">Tak Ternilai.</motion.h2>
              </div>
              <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-white/45 leading-relaxed mb-10 text-[15px]">
                Kampung-kampung adat dengan rumah tradisional khas, ritual adat yang masih dijalankan, serta keindahan alam gunung berapi dan laut tak tertandingi menjadikan Ngada destinasi autentik yang patut dikunjungi.
              </motion.p>
              <div className="flex gap-10 mb-10 pb-10 border-b border-white/10">
                {[['11', 'Kecamatan'], ['9+', 'Wisata Unggulan'], ['100+', 'Tahun Tradisi']].map(([v, l]) => (
                  <div key={l}><p className="font-display text-3xl font-black text-ngada-400">{v}</p><p className="text-white/30 text-xs mt-0.5">{l}</p></div>
                ))}
              </div>
              <Link href="/wisata" data-hover className="group inline-flex items-center gap-3 bg-white hover:bg-ngada-400 text-stone-900 hover:text-white px-7 py-4 rounded-2xl font-bold text-sm w-fit transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                Jelajahi Semua Destinasi <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── KECAMATAN ─────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-16 border-b border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end gap-6 mb-12">
              <Num3D n="03" />
              <div className="mb-4">
                <div className="overflow-hidden">
                  <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-4xl text-stone-900 leading-none">Jelajahi per Kecamatan</motion.h2>
                </div>
              </div>
            </div>
            <motion.div className="flex flex-wrap gap-3" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
              {kabupatenList.map(kab => (
                <motion.div key={kab.id_kabupaten} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                  <Link href={`/wisata?kabupaten=${encodeURIComponent(kab.nama_kabupaten)}`} data-hover className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 text-sm font-medium hover:-translate-y-0.5 hover:shadow-lg">
                    <MapPin size={11} className="text-stone-400 group-hover:text-ngada-400 transition-colors" />
                    {kab.nama_kabupaten}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="py-24 px-8 md:px-16 bg-[#fafaf8]">
          <motion.div initial={{ opacity: 0, rotateX: 8, y: 40 }} whileInView={{ opacity: 1, rotateX: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: 1200 }} className="max-w-7xl mx-auto">
            <div className="bg-stone-950 rounded-3xl overflow-hidden relative" style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.18)' }}>
              <div className="absolute inset-0 overflow-hidden" style={{ perspective: 500 }}>
                <motion.div animate={{ rotateX: [0, 2, 0], rotateY: [0, 1, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', inset: '-20%', backgroundImage: 'linear-gradient(rgba(220,145,31,0.06) 1px, transparent 1px),linear-gradient(90deg,rgba(220,145,31,0.06) 1px,transparent 1px)', backgroundSize: '50px 50px', transform: 'rotateX(55deg) translateY(30%)' }} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-ngada-400/60 to-transparent" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-32 bg-ngada-400/10 blur-3xl" />
              <div className="relative z-10 p-14 md:p-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
                <div>
                  <div className="overflow-hidden pb-2 mb-1">
                    <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-[clamp(2.8rem,6vw,5.5rem)] text-white leading-none">Siap Berpetualang?</motion.h2>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h2 initial={{ y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="font-display font-black text-[clamp(2.8rem,6vw,5.5rem)] text-ngada-400 leading-none italic">Flores Menunggu.</motion.h2>
                  </div>
                  <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-white/35 mt-5 text-sm max-w-md leading-relaxed">
                    Dari puncak gunung berapi hingga kedalaman laut Riung — petualangan Anda di Ngada dimulai di sini.
                  </motion.p>
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col gap-3 flex-shrink-0">
                  <Link href="/wisata" data-hover className="group inline-flex items-center justify-center gap-2 bg-white text-stone-900 hover:bg-ngada-400 hover:text-white px-10 py-5 rounded-2xl font-black text-base transition-all hover:-translate-y-1 hover:shadow-2xl">
                    Lihat Destinasi <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/lokasi" data-hover className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white px-10 py-4 rounded-2xl font-semibold text-sm transition-all hover:bg-white/5">
                    <MapPin size={14} /> Peta Lokasi
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  )
}
