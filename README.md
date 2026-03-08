# 🏝️ Wisata Ngada — Next.js Tourism Portal

Portal pariwisata digital **Kabupaten Ngada, Flores, NTT** — dibangun dengan Next.js 15, Tailwind CSS, Prisma, dan NextAuth.

---

## 🚀 Fitur

### User Interface (Publik)
- **Landing page** dengan hero parallax, animasi Framer Motion, dan kartu wisata interaktif
- **Filter & pencarian** destinasi wisata real-time (nama, kecamatan, kategori)
- **Halaman detail** wisata dengan link Google Maps dan wisata terkait
- **Navigasi kecamatan** — jelajahi wisata per kecamatan

### Admin Dashboard (Login Required)
- **Dashboard** dengan statistik ringkasan + bar chart wisata per kecamatan
- **Manajemen Tempat Wisata** — CRUD lengkap dengan search
- **Manajemen Galeri** — kelola foto + monitor penggunaan
- **Manajemen Kecamatan** — inline edit tanpa halaman baru
- **Manajemen Lokasi GPS** — input koordinat lat/lng + link Google Maps
- **Perlindungan hapus** — tidak bisa hapus data yang masih digunakan

---

## 🛠️ Setup

### 1. Clone & Install
```bash
git clone <repo>
cd ngada-tourism
npm install
```

### 2. Konfigurasi Environment
```bash
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL="mysql://root:password@localhost:3306/ngada_tourism"
NEXTAUTH_SECRET="random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Inisialisasi Database
Jalankan `schema.sql` di MySQL Anda:
```bash
mysql -u root -p < schema.sql
```

Atau gunakan Prisma:
```bash
npx prisma db push
npx prisma generate
```

### 4. Upload Foto
Salin folder gambar dari proyek PHP lama ke:
```
public/uploads/
```

### 5. Jalankan
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Username: `admin`
- Password: `admin123` ← **ubah setelah login pertama!**

---

## 📁 Struktur Proyek

```
ngada-tourism/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── wisata/
│   │   ├── page.tsx               # Daftar wisata
│   │   └── [id]/page.tsx          # Detail wisata
│   ├── admin/
│   │   ├── layout.tsx             # Layout admin (auth guard)
│   │   ├── login/page.tsx         # Login admin
│   │   ├── dashboard/page.tsx     # Dashboard + stats + chart
│   │   ├── wisata/page.tsx        # CRUD wisata
│   │   ├── galeri/page.tsx        # CRUD galeri
│   │   ├── kecamatan/page.tsx     # CRUD kecamatan (inline)
│   │   └── lokasi/page.tsx        # CRUD lokasi GPS (inline)
│   └── api/
│       ├── wisata/route.ts        # GET, POST
│       ├── wisata/[id]/route.ts   # GET, PUT, DELETE
│       ├── galeri/[id]/route.ts
│       ├── kecamatan/[id]/route.ts
│       └── lokasi/[id]/route.ts
├── components/
│   ├── public/                    # Navbar, Footer, WisataGrid
│   └── admin/                     # Sidebar, Topbar, Forms, Managers
├── lib/
│   ├── db.ts                      # Prisma client singleton
│   └── auth.ts                    # NextAuth config
├── prisma/schema.prisma           # Database schema
├── schema.sql                     # SQL schema + seed data
└── middleware.ts                  # Route protection
```

## 🗄️ Database Schema

| Tabel | Kolom |
|-------|-------|
| `admin` | id_admin, username, password (bcrypt) |
| `kecamatan` | id_kecamatan, nama_kecamatan |
| `lokasi` | id_lokasi, nama_lokasi, lat, lng |
| `galeri` | id_galeri, nama_galeri, gambar, keterangan |
| `tempat_wisata` | id, nama, alamat, informasi1, id_kecamatan, id_lokasi, id_galeri, timestamps |

## 🔐 Keamanan
- Password admin di-hash dengan bcrypt
- JWT session via NextAuth
- Middleware proteksi semua route `/admin/*`
- Validasi server-side di semua API
- Proteksi hapus data yang masih berelasi

## 📦 Stack
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animasi)
- **Prisma** (ORM)
- **MySQL**
- **NextAuth v5** (auth)
- **Recharts** (chart dashboard)
- **Lucide React** (icons)
- **React Hot Toast** (notifikasi)
