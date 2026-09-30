# 🚀 Modern Web Developer Dynamic Portfolio with Next.js & Neon / Supabase

Aplikasi Web Portofolio Programmer dinamis, estetik, berkecepatan tinggi, dan responsif. Dilengkapi dengan **Admin Dashboard** terautentikasi untuk mengelola seluruh konten halaman utama secara real-time.

---

## 🌟 Fitur Utama

1. **Desain Modern, Clean & Dark Theme Cyber Aesthetics**:
   - Glassmorphism UI dengan efek blur, glowing gradients, dan animasi interaktif.
   - Tipografi yang tajam dan nyaman dibaca.
   - Indikator ketersediaan kerja (*"Available for Work"* badge).

2. **Hero Interaktif & Live Code Terminal**:
   - Simulasi terminal interaktif dengan status deployment.
   - Kartu statistik angka dinamis (*Years Experience, Projects Completed, Satisfied Clients, Code Hours*).
   - Tombol unduh CV/Resume dan salin email instan (1-klik).

3. **Manajemen Proyek Dinamis (Projects Showcase)**:
   - Filter kategori (*All, Fullstack, Frontend, Backend, AI / Tools*).
   - Tautan langsung ke GitHub Repository dan Live Demo.
   - Modal pop-up detail proyek lengkap dengan arsitektur dan teknologi.

4. **Matriks Keahlian & Teknologi (Skills Matrix)**:
   - Filter kategori keahlian (*Frontend, Backend, Database & Cloud, DevOps & Tools, Architecture*).
   - Indikator bar tingkat penguasaan persentase (*Proficiency level*).

5. **Timeline Pengalaman Kerja & Pendidikan/Sertifikasi**:
   - Garis waktu bercahaya (*glowing timeline*) untuk rekam jejak karier dan sertifikasi (AWS, Meta, S.Kom).

6. **Testimoni & Rekomendasi Klien**:
   - Kartu testimoni dengan rating bintang, foto avatar, dan identitas perusahaan.

7. **Formulir Kontak Terintegrasi**:
   - Pengunjung dapat mengirim pesan langsung ke database.
   - Efek perayaan konfeti (*confetti animation*) saat pesan terkirim.

8. **Admin Dashboard Terautentikasi (`/admin` & `/login`)**:
   - Login aman dengan JWT (JOSE) dan enkripsi kata sandi Bcrypt.
   - **Editor Profil & Hero**: Ubah nama, gelar, tagline, bio, foto, kontak, dan statistik.
   - **CRUD Proyek**: Tambah, edit, hapus, dan atur status *Featured*.
   - **CRUD Keahlian / Skills**: Atur nama teknologi, kategori, ikon, dan persentase penguasaan.
   - **CRUD Pengalaman & Sertifikasi**: Kelola riwayat karier.
   - **CRUD Testimoni**: Kelola feedback klien.
   - **Kotak Masuk Pesan Pengunjung**: Baca pesan masuk, tandai status terbaca, balas via email, atau hapus.
   - **Kredensial & Reset**: Ganti kata sandi admin dan opsi reset data awal.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Database**: [Neon PostgreSQL](https://neon.tech/) / [Supabase PostgreSQL](https://supabase.com/)
- **ORM**: [Prisma ORM 7](https://www.prisma.io/) dengan `@prisma/adapter-pg`
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & CSS Glassmorphism
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: Secure JWT with [jose](https://github.com/panva/jose) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🔑 Kredensial Login Admin Default

Untuk mengelola konten portofolio:
- **URL Login**: `http://localhost:3000/login` atau klik tombol **Admin** di pojok kanan atas.
- **Email**: `admin@portfolio.dev`
- **Kata Sandi**: `adminpassword123`
*(Tersedia tombol "Isi Otomatis" di halaman login untuk pengujian cepat)*

---

## ⚙️ Panduan Menghubungkan Neon / Supabase PostgreSQL

Aplikasi ini sudah siap pakai secara lokal (dengan penyimpanan data lokal persisten) dan dapat langsung dihubungkan ke database cloud **Neon** atau **Supabase**:

### 1. Menggunakan Neon Database (Serverless PostgreSQL)
1. Buka [Neon Console](https://console.neon.tech/) dan buat proyek database baru.
2. Salin connection string PostgreSQL.
3. Buka file `.env` di root proyek dan tempel URL:
   ```env
   DATABASE_URL="postgresql://[username]:[password]@[endpoint].us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
4. Jalankan sinkronisasi tabel:
   ```bash
   npx prisma db push
   ```

### 2. Menggunakan Supabase
1. Buka [Supabase Dashboard](https://app.supabase.com/) dan buat proyek baru.
2. Buka menu **Project Settings > Database > Connection string**.
3. Buka file `.env` dan konfigurasikan:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
   ```
4. Jalankan sinkronisasi tabel:
   ```bash
   npx prisma db push
   ```

---

## 🚀 Cara Menjalankan Proyek

```bash
# 1. Jalankan development server
npm run dev

# 2. Buka browser di http://localhost:3000
```
