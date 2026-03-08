import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Wisata Ngada — Pesona Flores yang Menakjubkan',
  description: 'Temukan keindahan alam, budaya, dan tradisi Kabupaten Ngada, Flores, NTT. Jelajahi kampung adat, pantai eksotis, dan alam pegunungan yang memukau.',
  keywords: ['Ngada', 'Flores', 'wisata', 'Bajawa', 'Kampung Bena', 'Riung', 'NTT'],
  openGraph: {
    title: 'Wisata Ngada',
    description: 'Jelajahi pesona Kabupaten Ngada',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1b3924',
              color: '#fdf8f0',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
