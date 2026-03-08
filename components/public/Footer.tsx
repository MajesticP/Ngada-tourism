import Link from 'next/link'
import { MapPin, Instagram, Facebook, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-ngada-500 flex items-center justify-center">
                <MapPin size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display text-xl font-semibold leading-none block">Wisata Ngada</span>
                <span className="text-ngada-300 text-xs">Flores, NTT</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Portal resmi pariwisata Kabupaten Ngada. Temukan keindahan alam, budaya, dan keunikan Flores yang tak terlupakan.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-ngada-200">Navigasi</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/wisata', label: 'Semua Destinasi' },
                { href: '/wisata?kategori=Budaya', label: 'Wisata Budaya' },
                { href: '/wisata?kategori=Alam', label: 'Wisata Alam' },
                { href: '/wisata?kategori=Bahari', label: 'Wisata Bahari' },
                { href: '/contact', label: 'Kontak Kami' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-ngada-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4 text-ngada-200">Kontak</h4>
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Dinas Pariwisata Kabupaten Ngada<br />
              Jl. Soekarno-Hatta, Bajawa, NTT
            </p>
            <p className="text-white/60 text-sm mb-4">
              📞 081339779571<br />
              ✉️ ellvysgella@gmail.com
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/50 hover:text-ngada-300 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-white/50 hover:text-ngada-300 transition-colors"><Facebook size={20} /></a>
              <a href="mailto:ellvysgella@gmail.com" className="text-white/50 hover:text-ngada-300 transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} Wisata Ngada. Hak cipta dilindungi.</p>
          <Link href="/admin/login" className="hover:text-white/70 transition-colors">Admin Panel</Link>
        </div>
      </div>
    </footer>
  )
}
