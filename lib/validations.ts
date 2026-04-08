import { z } from 'zod'

export const wisataSchema = z.object({
  nama_tempat_wisata: z.string().min(2, 'Nama minimal 2 karakter').max(200),
  alamat:             z.string().min(5, 'Alamat minimal 5 karakter'),
  informasi1:         z.string().min(10, 'Deskripsi minimal 10 karakter'),
  kategori:           z.enum([
    'wisata_alam', 'wisata_budaya', 'kampung_adat',
    'wisata_bahari', 'pulau_eksotis', 'penginapan', 'kuliner', 'religi',
  ]).default('wisata_alam'),
  id_kabupaten:       z.number().int().positive().nullable().optional(),
  galeri_nama:        z.string().max(150).nullable().optional(),
  galeri_gambar:      z.string().max(512).nullable().optional(),
  galeri_keterangan:  z.string().nullable().optional(),
  lat:                z.number().min(-90).max(90).nullable().optional(),
  lng:                z.number().min(-180).max(180).nullable().optional(),
  akses_jalan:        z.string().max(100).nullable().optional(),
  parkir:             z.string().max(100).nullable().optional(),
  toilet:             z.string().max(50).nullable().optional(),
  jarak_atm:          z.string().max(100).nullable().optional(),
  jarak_rs:           z.string().max(100).nullable().optional(),
  spot_foto:          z.string().max(100).nullable().optional(),
  atm_lat:            z.number().min(-90).max(90).nullable().optional(),
  atm_lng:            z.number().min(-180).max(180).nullable().optional(),
  rs_lat:             z.number().min(-90).max(90).nullable().optional(),
  rs_lng:             z.number().min(-180).max(180).nullable().optional(),
})

export type WisataInput = z.infer<typeof wisataSchema>
