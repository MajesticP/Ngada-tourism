export type WisataItem = {
  id_tempat_wisata: number
  nama_tempat_wisata: string
  alamat: string
  informasi1: string
  kategori: string
  kabupaten: { nama_kabupaten: string } | null
  galeri: { gambar: string | null; nama_galeri: string } | null
}

export const KAT_LABEL: Record<string, string> = {
  wisata_alam:   'Alam',
  wisata_budaya: 'Budaya',
  kampung_adat:  'Adat',
  wisata_bahari: 'Bahari',
  pulau_eksotis: 'Pulau',
  penginapan:    'Hotel',
  kuliner:       'Kuliner',
  religi:        'Religi',
}

export const FALLBACKS = [
  'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=85',
  'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=900&q=85',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85',
  'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=900&q=85',
]

export function getImg(w: WisataItem, i: number) {
  if (!w.galeri?.gambar) return FALLBACKS[i % FALLBACKS.length]
  return w.galeri.gambar.startsWith('http') ? w.galeri.gambar : `/uploads/${w.galeri.gambar}`
}
