'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: form.name,
          email: form.email,
          subjek: form.subject,
          pesan: form.message,
        }),
      })
      if (!res.ok) throw new Error('Gagal mengirim pesan')
      setSent(true)
    } catch {
      alert('Gagal mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail size={22} />,
      label: 'Email',
      value: 'ellvysgella@gmail.com',
      href: 'mailto:ellvysgella@gmail.com',
      color: 'bg-ngada-500',
    },
    {
      icon: <Phone size={22} />,
      label: 'Telepon / WhatsApp',
      value: '081339779571',
      href: 'https://wa.me/6281339779571',
      color: 'bg-forest-600',
    },
    {
      icon: <MapPin size={22} />,
      label: 'Alamat',
      value: 'Dinas Pariwisata Kab. Ngada\nJl. Soekarno-Hatta, Bajawa, NTT',
      href: 'https://maps.google.com/?q=Bajawa,Ngada,NTT',
      color: 'bg-terra-500',
    },
    {
      icon: <Clock size={22} />,
      label: 'Jam Operasional',
      value: 'Senin – Jumat\n08.00 – 16.00 WITA',
      href: null,
      color: 'bg-forest-700',
    },
  ]

  return (
    <main className="min-h-screen bg-ngada-50">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 bg-forest-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 to-forest-800/90" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-ngada-300 uppercase tracking-widest text-sm mb-3"
          >
            Hubungi Kami
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl mb-4"
          >
            Kontak &amp; Informasi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-lg max-w-xl mx-auto"
          >
            Ada pertanyaan tentang wisata Ngada? Kami siap membantu merencanakan perjalanan impian Anda.
          </motion.p>
        </div>
      </section>

      {/* ── CONTACT CARDS ──────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="bg-white rounded-2xl p-6 shadow-sm border border-ngada-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 h-full group"
                  >
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-forest-400 text-xs font-medium uppercase tracking-wider mb-1">{info.label}</p>
                      <p className="text-forest-900 font-medium text-sm leading-relaxed whitespace-pre-line">{info.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-ngada-100 flex flex-col gap-4 h-full">
                    <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center text-white`}>
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-forest-400 text-xs font-medium uppercase tracking-wider mb-1">{info.label}</p>
                      <p className="text-forest-900 font-medium text-sm leading-relaxed whitespace-pre-line">{info.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* ── FORM + MAP ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-ngada-100">
                <h2 className="font-display text-2xl text-forest-900 mb-2">Kirim Pesan</h2>
                <p className="text-forest-500 text-sm mb-7">
                  Isi formulir di bawah dan kami akan menghubungi Anda secepatnya.
                </p>

                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={32} className="text-forest-600" />
                    </div>
                    <h3 className="font-display text-xl text-forest-900">Pesan Terkirim!</h3>
                    <p className="text-forest-500 text-sm max-w-xs">
                      Pesan Anda telah terkirim. Tim kami akan segera merespons melalui email.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                      className="btn-outline mt-2"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-forest-700 mb-1.5">
                          Nama Lengkap <span className="text-terra-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Nama Anda"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-forest-700 mb-1.5">
                          Email <span className="text-terra-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="email@contoh.com"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">Subjek</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Pilih subjek...</option>
                        <option value="Informasi Wisata">Informasi Wisata</option>
                        <option value="Perencanaan Perjalanan">Perencanaan Perjalanan</option>
                        <option value="Kerjasama & Promosi">Kerjasama &amp; Promosi</option>
                        <option value="Saran & Masukan">Saran &amp; Masukan</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-forest-700 mb-1.5">
                        Pesan <span className="text-terra-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tulis pesan Anda di sini..."
                        className="input-field resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-60"
                    >
                      {loading ? (
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <><Send size={16} /> Kirim Pesan</>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map + Quick Contact */}
            <motion.div
              className="lg:col-span-2 flex flex-col gap-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Embedded Map */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-ngada-100 flex-1 min-h-[280px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31666.23948573937!2d121.01698!3d-8.66978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da8b6a1e2c6e5b1%3A0x3a4b5c6d7e8f9a0b!2sBajawa%2C%20Ngada%20Regency%2C%20East%20Nusa%20Tenggara!5e0!3m2!1sen!2sid!4v1699000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  className="min-h-[280px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Bajawa, Kabupaten Ngada"
                />
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/6281339779571?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20wisata%20Ngada."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#1db954] text-white rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">Chat via WhatsApp</p>
                  <p className="text-white/80 text-xs mt-0.5">Respon lebih cepat</p>
                </div>
                <Send size={18} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
