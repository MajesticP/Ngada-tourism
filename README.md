# 🌴 Ngada Tourism — Sistem Informasi Wisata Ngada, NTT

A full-stack tourism information web app for **Kabupaten Ngada, Nusa Tenggara Timur**, built with Next.js 15, Prisma ORM, MySQL (Aiven), and Cloudinary.

---

## ✨ Features

- **Public site** — browse destinations, view photos, filter by kabupaten, interactive Leaflet map of NTT with clickable pins
- **Admin panel** — manage wisata, kabupaten, galleries, messages, and admins
- **Leaflet map** — shows all GPS-tagged destinations across NTT with popups containing photo, address, and description
- **Image uploads** — via Cloudinary
- **Authentication** — JWT-based admin login with bcrypt password hashing
- **Dashboard** — charts and stats via Recharts

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| ORM | Prisma 5 |
| Database | MySQL (Aiven Cloud) |
| Image Storage | Cloudinary |
| Auth | JWT via `jose` + bcryptjs |
| Map | Leaflet.js (CDN) |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## ⚙️ Requirements

- **Node.js** v18.18 or higher
- **npm** v9 or higher
- A **MySQL** database (Aiven free tier works)
- A **Cloudinary** account (free tier works)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

> This also runs `prisma generate` automatically via the `postinstall` script.

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://user:password@host:port/dbname?ssl-mode=REQUIRED"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 4. Push database schema

```bash
npm run db:push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
ngada-tourism/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx          # Home
│   │   ├── wisata/           # Destination list & detail
│   │   ├── lokasi/           # Interactive map page
│   │   └── contact/          # Contact form
│   ├── admin/
│   │   ├── login/            # Admin login
│   │   └── (protected)/      # Dashboard, wisata CRUD, messages
│   └── api/                  # REST API routes
├── components/
│   ├── public/               # Public-facing components
│   └── admin/                # Admin panel components
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   └── auth.ts               # Auth utilities
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

---

## 🗄️ Database Models

| Model | Description |
|---|---|
| `TempatWisata` | Tourism destination |
| `Kabupaten` | District / Kabupaten |
| `Lokasi` | GPS coordinates + location name |
| `Galeri` | Gallery entry (cover image) |
| `Foto` | Individual photos per destination |
| `Pesan` | Contact messages |
| `Admin` | Admin users |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables from your `.env` in the Vercel dashboard
4. Change `NEXTAUTH_URL` to your Vercel deployment URL (e.g. `https://ngada-tourism.vercel.app`)
5. Click **Deploy**

---

## 🔐 Default Admin

After seeding or first setup, log in at `/admin/login`. Create your first admin by running:

```bash
node fix-password.js
```

---

## 📄 License

This project was built for academic/government purposes for Kabupaten Ngada, NTT, Indonesia.
