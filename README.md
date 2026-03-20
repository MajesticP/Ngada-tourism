# 🌴 Ngada Tourism

Sistem Informasi Wisata Kabupaten Ngada, Nusa Tenggara Timur.

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `NEXTAUTH_SECRET` | JWT secret — generate with `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### 3. Setup database

```bash
# Push schema to your MySQL database
npm run db:push
```

### 4. Run

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🔐 Admin Panel

Buka [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Insert admin user ke database:

```sql
INSERT INTO admin (username, password)
VALUES ('admin', '$2b$10$...bcrypt_hashed_password...');
```

Atau gunakan script seed jika tersedia: `npm run db:seed`

---

## 📁 Struktur Proyek

```
app/
  api/          — API routes (wisata, auth, upload, pesan, foto, kabupaten)
  admin/        — Admin panel (protected by JWT middleware)
  wisata/       — Halaman publik daftar & detail wisata
  lokasi/       — Peta lokasi wisata
  fasilitas/    — Info fasilitas
  contact/      — Halaman kontak
components/
  public/
    home/       — Sub-komponen HomePageClient (Cursor, Cube3D, FlipCard, dll)
  admin/
    wisata-form/ — Sub-komponen WisataForm (InfoDasar, Foto, Lokasi, Fasilitas)
lib/
  auth.ts       — JWT helper (jose)
  db.ts         — Prisma singleton
  validations.ts — Zod schemas
prisma/
  schema.prisma — Database schema (source of truth)
```
