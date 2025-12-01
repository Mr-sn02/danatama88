# DANATAMA MAKMUR SEKURITAS - Next.js Minimal

Projek ini adalah Next.js versi paling sederhana supaya:

- Vercel bisa mendeteksi Next.js (ada `package.json` dengan dependency `next`)
- Tidak perlu konfigurasi rumit
- Cocok dipakai sebagai root project di Vercel

Struktur:
- `package.json`
- `next.config.mjs`
- `app/layout.js`
- `app/page.js`

Cara pakai dengan Vercel:
1. Buat repository GitHub baru.
2. Upload semua isi folder ini ke root repository.
3. Di Vercel, import repository tersebut.
4. Framework: Next.js (auto).
5. Root Directory: dikosongkan (biarkan default).
6. Deploy.
