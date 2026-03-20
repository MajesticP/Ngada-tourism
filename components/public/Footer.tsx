import Link from 'next/link'
import { ArrowUpRight, Instagram, Facebook, Mail, Phone } from 'lucide-react'

const quickLinks = [
  { href: '/wisata', label: 'Semua Destinasi' },
  { href: '/wisata?kategori=kampung_adat', label: 'Kampung Adat' },
  { href: '/wisata?kategori=wisata_alam', label: 'Wisata Alam' },
  { href: '/wisata?kategori=pulau_eksotis', label: 'Pulau Eksotis' },
  { href: '/lokasi', label: 'Peta Lokasi' },
  { href: '/contact', label: 'Kontak Kami' },
]

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white overflow-hidden relative">
      {/* Big decorative background text */}
      <div className="absolute inset-0 flex items-end pointer-events-none select-none overflow-hidden">
        <span className="font-display font-black text-[18vw] leading-none text-white/[0.03] whitespace-nowrap -mb-8 translate-y-4">
          NGADA
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Top CTA strip */}
        <div className="border-b border-white/10 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-ngada-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">Siap Berpetualang?</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Temukan Flores<br />
              <span className="text-ngada-400 italic">yang Sesungguhnya.</span>
            </h2>
          </div>
          <Link
            href="/wisata"
            className="group flex items-center gap-3 bg-ngada-500 hover:bg-ngada-400 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ngada-500/30 flex-shrink-0"
          >
            Jelajahi Destinasi
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand col */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-ngada-500 rounded-xl rotate-12 group-hover:rotate-45 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-display font-black text-lg">N</span>
                </div>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-white block leading-none">Wisata Ngada</span>
                <span className="text-ngada-400 text-xs tracking-widest uppercase">Flores · NTT</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-8">
              Portal resmi pariwisata Kabupaten Ngada. Temukan keindahan alam, budaya megalitik, dan keunikan Flores yang tak terlupakan.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Mail, href: 'mailto:ellvysgella@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-ngada-500 border border-white/10 hover:border-ngada-500 flex items-center justify-center text-white/50 hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links col */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Navigasi</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-ngada-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Kontak</h4>
            <div className="space-y-4">
              <p className="text-white/60 text-sm leading-relaxed">
                Dinas Pariwisata Kabupaten Ngada<br />
                Jl. Soekarno-Hatta, Bajawa<br />
                Nusa Tenggara Timur
              </p>
              <a href="tel:081339779571" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-ngada-500/20 flex items-center justify-center transition-colors">
                  <Phone size={13} className="text-ngada-400" />
                </div>
                081339779571
              </a>
              <a href="mailto:ellvysgella@gmail.com" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-ngada-500/20 flex items-center justify-center transition-colors">
                  <Mail size={13} className="text-ngada-400" />
                </div>
                ellvysgella@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© {new Date().getFullYear()} Wisata Ngada. Semua hak cipta dilindungi.</p>
          <Link href="/admin/login" className="hover:text-white/60 transition-colors">
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  )
}
