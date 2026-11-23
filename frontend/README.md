# Manajemen Produk — Tugas 4

Aplikasi manajemen produk menggunakan **React, TypeScript, Vite, React Router, Tailwind CSS, dan Express REST API**. Frontend menyediakan daftar produk, CRUD, halaman detail, dan halaman 404. Data produk dimuat dan disimpan melalui backend.

Gunakan Node.js **22.12 atau lebih baru** dan npm.

## Menjalankan aplikasi

Jalankan backend dan frontend di terminal terpisah.

### Backend

Dari folder `tugas3-react-pemweb`, siapkan `.env` dengan `DATABASE_URL` PostgreSQL, lalu jalankan:

```sh
npm ci
npx prisma migrate dev
npm run dev
```

API berjalan di `http://localhost:3000`.

### Frontend

Dari folder `tugas3-react-pemweb/frontend`, siapkan alamat backend dan jalankan:

```sh
cp .env.example .env.local
npm ci
npm run dev
```

Pastikan `VITE_API_BASE_URL=http://localhost:3000` di `.env.local`. Buka alamat Vite yang ditampilkan, biasanya `http://127.0.0.1:5173`.

## Fitur aplikasi

- Konfigurasi React dan TypeScript dengan pemeriksaan tipe `strict`.
- Vite sebagai development server dan build tool.
- React Router dengan nested route serta layout yang menggunakan `Outlet`.
- Tailwind CSS v4 melalui PostCSS, CSS Modules, dan token tema.
- Contoh setiap tingkat Atomic Design: `Button`, `ProductCard`, `ProductGrid`, `PageLayout`, dan `ProductsPage`.
- CRUD produk melalui REST API backend, dengan pemisahan model, parameter, source, dan repository.
- Halaman daftar dengan pilihan grid/list, pencarian, dan preferensi tampilan.
- Halaman detail produk pada `/products/:id` dan halaman 404 untuk URL yang tidak dikenal.
- ESLint, Prettier, unit test, dan konfigurasi tes browser Playwright.

Halaman daftar memuat data dari backend saat dibuka. Operasi tambah, edit, dan hapus juga dikirim ke API; jika backend tidak tersedia, aplikasi menampilkan pesan error dan tidak menyimpan perubahan produk secara lokal. Preferensi tampilan grid/list tetap disimpan di `localStorage`.

## Struktur proyek

```text
app/
  entry.tsx             # Entry browser dan BrowserRouter
  globals.css           # Import Tailwind dan CSS global
  routes.tsx            # Deklarasi route
  page.tsx              # Pembungkus halaman root
  products/page.tsx      # Pembungkus halaman produk
src/
  components/
    atoms/              # Button
    molecules/          # ProductCard
    organisms/          # ProductGrid
    templates/          # PageLayout dan Outlet
    pages/              # State serta koordinasi halaman
  data/product/
    model/
    param/
    source/
    repository/
  styles/
  types/
  utils/
tests/
```

Alur props: `ProductsPage → ProductGrid → ProductCard → Button`. Callback berjalan kembali menuju pemilik state.

Folder `app` tetap menggunakan Vite. Nama `page.tsx` tidak otomatis membentuk route; daftarkan setiap URL di `app/routes.tsx`. Route `/` mengarahkan ke `/products`, sedangkan URL yang belum dikenali menampilkan halaman 404. Hosting produksi perlu mendukung fallback SPA ke `index.html`.

## Menjalankan dengan backend

Jalankan backend Express dari folder utama repository, lalu siapkan URL API untuk frontend:

```sh
cp .env.example .env.local
```

Sesuaikan alamat backend di `.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Backend menyediakan endpoint produk pada `/products`, sehingga URL di atas akan dipakai untuk seluruh operasi CRUD. Restart Vite setelah mengubah konfigurasi. Backend harus aktif dan mengizinkan origin frontend melalui CORS.

Response yang diharapkan adalah **array langsung**:

```json
[{ "id": 1, "name": "Pulpen", "price": 5000 }]
```

Jika backend menggunakan format lain, misalnya `{ "data": [...] }`, sesuaikan pemetaan di repository. Variabel `VITE_*` masuk ke aplikasi browser, jadi jangan menyimpan token atau secret privat di dalamnya. Berkas `.env.local` tidak ikut dipublikasikan.

## Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan aplikasi untuk pengembangan |
| `npm run typecheck` | Memeriksa tipe TypeScript |
| `npm run lint` | Memeriksa aturan kode |
| `npm test` | Menjalankan unit test |
| `npm run build` | Memeriksa tipe dan membuat build produksi |
| `npm run preview` | Melihat hasil build secara lokal |
| `npm run test:e2e` | Menjalankan tes browser |
| `npm run format` | Memformat berkas dengan Prettier |

Tes browser menggunakan Google Chrome yang terpasang dan memerlukan port 5173 yang belum dipakai. Request API pada tes di-mock, sehingga tidak memerlukan backend aktif.

## Mengembangkan tugas

Gunakan komponen yang tersedia sebagai contoh, lalu tambahkan fitur sesuai kebutuhan tugas. Pertahankan pemisahan tanggung jawab komponen, gunakan props/callback dengan jelas, dan tempatkan state bersama di atas halaman yang memakainya.

Mahasiswa harus dapat menjelaskan kode yang dikumpulkan, termasuk bagian yang dibuat dengan bantuan AI. Sesuaikan README pada repository tugas dengan fitur dan cara menjalankan aplikasi masing-masing.
