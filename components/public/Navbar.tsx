'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/wisata', label: 'Destinasi' },
  { href: '/lokasi', label: 'Peta Lokasi' },
  { href: '/contact', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'py-2' : 'py-5'
      }`}>
        <div className={`mx-4 md:mx-auto md:max-w-6xl rounded-2xl transition-all duration-700 px-6 ${
          scrolled
            ? 'bg-forest-950/90 backdrop-blur-xl shadow-2xl shadow-forest-950/50 border border-white/5'
            : 'bg-transparent'
        }`}>
          <nav className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-ngada-500 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-display font-black text-sm leading-none">N</span>
                </div>
              </div>
              <div className="leading-none">
                <span className="font-display text-white font-bold text-base tracking-tight block">Wisata Ngada</span>
                <span className="text-ngada-400 text-[10px] font-medium tracking-widest uppercase">Flores · NTT</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const active = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 block ${
                        active ? 'text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white/10 rounded-xl"
                          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/wisata"
                className="hidden md:inline-flex items-center gap-2 bg-ngada-500 hover:bg-ngada-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ngada-500/40"
              >
                Jelajahi →
              </Link>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-forest-950/98 backdrop-blur-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <span className="font-display text-white font-bold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-display text-4xl font-bold text-white/70 hover:text-white transition-colors py-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-8 pb-12">
              <Link
                href="/wisata"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-ngada-500 text-white text-center py-4 rounded-2xl font-bold text-lg"
              >
                Mulai Jelajahi →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
