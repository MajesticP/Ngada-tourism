'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronDown, ArrowRight, Users, Camera, Mountain, Waves, TreePine } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

type WisataItem = {
  id_tempat_wisata: number
  nama_tempat_wisata: string
  alamat: string
  informasi1: string
  kecamatan: { nama_kecamatan: string } | null
  galeri: { gambar: string | null; nama_galeri: string } | null
}

const IMAGE_FALLBACKS = [
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
]

const CATEGORY_ICONS = [
  <Users key="u" size={14} />,
  <Waves key="w" size={14} />,
  <Mountain key="m" size={14} />,
  <TreePine key="t" size={14} />,
]
const CATEGORY_COLORS = ['bg-terra-500', 'bg-forest-500', 'bg-ngada-500', 'bg-forest-600']

const stats = [
  { label: 'Tempat Wisata', value: '30+', icon: <Camera size={22} /> },
  { label: 'Kecamatan', value: '11', icon: <MapPin size={22} /> },
  { label: 'Kampung Adat', value: '8', icon: <Users size={22} /> },
  { label: 'Pulau Eksotis', value: '17', icon: <Waves size={22} /> },
]

export default function HomePageClient({ wisataData }: { wisataData: WisataItem[] }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const layer2Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const layer3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%'])

  const [visibleWisata, setVisibleWisata] = useState(wisataData)

  // No category filter needed since DB has no category field — show all
  useEffect(() => {
    setVisibleWisata(wisataData)
  }, [wisataData])

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Layer 1 — sky (slowest) */}
        <motion.div className="absolute inset-0 z-0" style={{ y: layer1Y }}>
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=90"
            alt="Sky"
            fill
            priority
            className="object-cover object-top scale-110"
          />
        </motion.div>

        {/* Layer 2 — dark gradient overlay */}
        <motion.div className="absolute inset-0 z-10" style={{ y: layer2Y }}>
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/40 via-transparent to-forest-950/90" />
        </motion.div>

        {/* Layer 3 — fog/mist strip (faster) */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-64 z-20" style={{ y: layer3Y }}>
          <div className="w-full h-full bg-gradient-to-t from-forest-950/80 via-forest-950/30 to-transparent" />
        </motion.div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-[8%] w-16 h-16 rounded-full bg-ngada-400/20 backdrop-blur-sm border border-ngada-300/30"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 right-[10%] w-24 h-24 rounded-full bg-forest-400/15 backdrop-blur-sm border border-forest-300/20"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/3 left-[15%] w-10 h-10 rounded-full bg-terra-400/20 backdrop-blur-sm border border-terra-300/30"
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative z-30 text-center text-white px-6 max-w-5xl mx-auto"
          style={{ y: contentY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm mb-6"
          >
            <MapPin size={14} className="text-ngada-300" />
            <span className="text-ngada-100">Kabupaten Ngada, Flores — NTT</span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Jelajahi
            <span className="block text-ngada-300 italic">Pesona Ngada</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Kampung adat megalitik, gunung berapi aktif, pulau-pulau eksotis, dan
            budaya yang hidup — semuanya menunggu Anda di jantung Flores.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link href="/wisata" className="btn-primary text-base px-8 py-4">
              Mulai Jelajahi →
            </Link>
            <a
              href="#wisata"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm font-medium"
            >
              Lihat Destinasi
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-white/60 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <section className="bg-forest-800 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp} custom={i} className="text-center text-white">
                <div className="flex justify-center mb-3 text-ngada-300">{stat.icon}</div>
                <div className="text-3xl font-display font-bold text-ngada-200">{stat.value}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED WISATA ───────────────────────────────────────────────── */}
      <section id="wisata" className="py-24 px-6 bg-ngada-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.p variants={fadeUp} className="text-ngada-500 font-medium tracking-widest uppercase text-sm mb-3">
              Destinasi Unggulan
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-title mb-4">
              Tempat Wisata Terbaik
            </motion.h2>
            <motion.p variants={fadeUp} className="text-forest-600 max-w-xl mx-auto text-lg">
              Dari kampung adat bersejarah hingga laut yang tak terjamah — setiap sudut Ngada menyimpan keajaiban.
            </motion.p>
          </motion.div>

          {wisataData.length === 0 ? (
            <div className="text-center py-12 text-forest-400">
              <p className="font-display text-2xl mb-2">Belum ada data wisata</p>
              <p className="text-sm">Tambahkan destinasi melalui halaman admin</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key="all"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {visibleWisata.map((w, i) => {
                  const imgSrc = w.galeri?.gambar
                    ? `/uploads/${w.galeri.gambar}`
                    : IMAGE_FALLBACKS[i % IMAGE_FALLBACKS.length]
                  const icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length]
                  const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]

                  return (
                    <motion.div
                      key={w.id_tempat_wisata}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                      {/* ✅ FIX: Use real id_tempat_wisata from DB */}
                      <Link href={`/wisata/${w.id_tempat_wisata}`} className="card-wisata block group">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={imgSrc}
                            alt={w.nama_tempat_wisata}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                          <span className={`absolute top-4 left-4 badge text-white ${color}`}>
                            {icon}
                            {w.kecamatan?.nama_kecamatan ?? 'Ngada'}
                          </span>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-1 text-ngada-400 text-xs mb-2">
                            <MapPin size={11} />
                            <span>{w.kecamatan?.nama_kecamatan ?? '—'}</span>
                          </div>
                          <h3 className="font-display text-xl text-forest-900 mb-2 group-hover:text-ngada-600 transition-colors">
                            {w.nama_tempat_wisata}
                          </h3>
                          <p className="text-forest-600 text-sm leading-relaxed line-clamp-2">{w.informasi1}</p>
                          <div className="mt-4 flex items-center gap-1 text-ngada-500 text-sm font-medium">
                            Lihat Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="text-center mt-12">
            <Link href="/wisata" className="btn-outline inline-flex items-center gap-2">
              Lihat Semua Wisata <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT BANNER ──────────────────────────────────────────────────── */}
      <section id="tentang" className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-forest-950/75" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="text-ngada-300 uppercase tracking-widest text-sm mb-4">
              Tentang Ngada
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Warisan Budaya yang{' '}
              <em className="text-ngada-300">Tak Ternilai</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/75 text-lg leading-relaxed mb-8">
              Kabupaten Ngada menyimpan warisan budaya megalitik yang masih hidup dan lestari.
              Kampung-kampung adat dengan rumah tradisional khas, ritual adat yang masih
              dijalankan, serta keindahan alam gunung berapi dan laut yang tak tertandingi
              menjadikan Ngada sebagai destinasi wisata autentik yang patut dikunjungi.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link href="/wisata" className="btn-primary">
                Mulai Perjalanan Anda
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── KECAMATAN STRIP ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-10 text-center"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} className="section-title mb-3">Jelajahi per Kecamatan</motion.h2>
            <motion.p variants={fadeUp} className="text-forest-600">11 kecamatan, masing-masing dengan keunikannya sendiri</motion.p>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center">
            {["Bajawa","Riung","Golewa","Soa","Aimere","Boawae","Jerebu'u","Riung Barat","Bajawa Utara","Golewa Barat","Golewa Selatan"].map((kec, i) => (
              <motion.div
                key={kec}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/wisata?kecamatan=${encodeURIComponent(kec)}`}
                  className="px-5 py-2.5 rounded-full border-2 border-forest-200 text-forest-700 hover:border-forest-600 hover:bg-forest-600 hover:text-white transition-all duration-300 text-sm font-medium block"
                >
                  {kec}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
