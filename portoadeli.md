# Portoadeli Design System & Style Specification

Dokumen ini merangkumi spesifikasi lengkap sistem desain, variabel CSS, tipografi, tata letak, komponen interaktif, dan animasi yang digunakan dalam proyek **Portoadeli** (Portofolio Adly Fahreza).

---

## 1. Konsep & Filosofi Desain

Proyek ini menggunakan gaya desain **minimalis-editorial yang bersih dan flat**, sangat terinspirasi dari estetika digital Nike. Karakteristik utama dari sistem desain ini meliputi:
- **Tanpa Bayangan (Zero Shadows & Flat Elevation):** Secara default, seluruh container, kartu, dan tombol dibuat flat (`box-shadow: none`). Efek elevasi dicapai murni melalui ketebalan garis batas (*borders*) dan kontras warna latar.
- **Kontras Tipografi Ekstrim:** Penggunaan kombinasi font sans-serif tebal bertipe display (*caps lock*) dengan font monospace teknis yang bersih.
- **Gaya Terminal Interaktif:** Integrasi nuansa Linux shell/terminal dengan tab simulasi interaktif yang mengeksekusi aksi nyata secara visual.
- **Pembatas Tipis (*Hairlines*):** Struktur layout dipisahkan oleh border 1px padat dengan warna abu-abu lembut dibanding garis pemisah dekoratif yang tebal.

---

## 2. Palet Warna (Color System)

Seluruh token warna dideklarasikan sebagai variabel kustom CSS (`:root`) pada berkas `Layout.astro` dan dipadukan dengan utility classes Tailwind CSS.

### Warna Utama & Canvas

| Nama Variabel | Kode Warna | Penggunaan |
| :--- | :--- | :--- |
| `--ink` | `#111111` | Warna teks utama, header, tombol primer, border hover, dan aksen gelap. |
| `--canvas` / `--bg` | `#ffffff` | Latar belakang halaman utama, modal, dan bagian isi kartu. |
| `--soft-cloud` | `#f5f5f5` | Latar belakang elemen sekunder, tag tidak aktif, bar navigasi atas, dan track scrollbar. |
| `--hairline` | `#cacacb` | Garis pembatas (border) 1px di sekitar kartu, baris, dan kolom. |
| `--hairline-soft` | `#e5e5e5` | Garis pembatas yang lebih lembut untuk visual pemisah horizontal. |
| `--sale` | `#d30005` | Aksen warna merah (warisan) untuk penyorotan penting. |

### Swatch Warna Aksesori (Legacy Compatibility & Bento Backgrounds)
Warna pastel lembut ini digunakan secara spesifik untuk mewarnai latar belakang item di dalam Bento Grid atau elemen dekoratif tertentu:

*   **Pink (`--pink`):** `#fce4ec` (Latar belakang kategori Backend/Bento item)
*   **Yellow (`--yellow`):** `#fffde7` (Latar belakang pesan galat/warning)
*   **Mint (`--mint`):** `#e0f7ee` (Aksen sukses, baris persentase skill, tag kontribusi)
*   **Lavender (`--lav`):** `#ede7f6` (Aksen musik player, bento item Frontend)
*   **Peach (`--peach`):** `#fff3e0`
*   **Sky (`--sky`):** `#e1f5fe`

---

## 3. Tipografi (Typography)

Sistem ini memuat empat rumpun huruf (*font families*) yang disajikan melalui Google Fonts untuk mendukung nuansa editorial dan teknis secara bersamaan:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space Mono:ital,wght@0,400;0,700;1,400&family=Bebas Neue&family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
```

### Penerapan Rumpun Huruf
1.  **`Inter` (Sans-Serif):** Font default untuk seluruh isi teks web, deskripsi, paragraf, serta label teks standar.
2.  **`Bebas Neue` (Display Sans):** Digunakan khusus untuk judul besar seperti nama profil (`Adly Fahreza`) dan judul bagian (`✦ PROJECTS`, `✦ LANGUAGES`, dll.) dalam format huruf besar (*uppercase*) dengan *line-height* ketat (`0.85` hingga `1.0`).
3.  **`Space Mono` (Monospace):** Digunakan untuk data statistik, perintah terminal, prompt shell (`adeli@portfolio`), penanda status (`#OPENTOWORK`), teks navigasi, serta tautan aksi interaktif.
4.  **`Outfit` (Modern Sans):** Dipakai pada teks aksen, tombol RUN terminal, dan judul statistik/grafik untuk memperkuat kesan premium modern.

---

## 4. Tata Letak & Struktur Layout

### Pembungkus Utama (Main Container)
Menggunakan batas lebar maksimal `6xl` dengan padding responsif:
```html
<div id="portfolio-container" class="max-w-6xl mx-auto px-4 py-8">
```

### Grid Bento (`.bento-grid`)
Tata letak bento responsif membagi ruang menjadi 6 kolom di desktop, 4 kolom di tablet, dan 2 kolom di perangkat seluler:
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 1fr;
  gap: 12px;
  align-items: stretch;
}
@media (max-width: 1024px) { .bento-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 640px) { .bento-grid { grid-template-columns: repeat(2, 1fr); } }
```

### Galeri Masonry (`#gallery-grid`)
Menghasilkan susunan galeri gambar berbasis kolom dinamis tanpa baris tetap:
```css
#gallery-grid {
  columns: 3;
  column-gap: 12px;
}
@media(max-width:768px) { #gallery-grid { columns: 2; } }
@media(max-width:480px) { #gallery-grid { columns: 1; } }
```

---

## 5. Komponen Utama & Interaksi Visual

### A. Bento Item & Card (`.bb`, `.bb-sm`, `.bb-static`)
Elemen pembungkus kartu bergaya flat dengan ujung tumpul (*rounded border*):
-   **`.bb`:** `border: 1px solid var(--hairline); box-shadow: none; border-radius: 12px;`
-   **`.bb-sm`:** `border: 1px solid var(--hairline); box-shadow: none; border-radius: 8px;`
-   **Hover effect:** Tidak ada pergeseran bayangan atau translasi (`transform: none; box-shadow: none;`). Pada hover, hanya warna batas yang bertransisi ke `--ink` (`border-color: var(--ink)`).

### B. Tombol Tag & Tab (`.tag`, `.tab-btn`)
-   **`.tag`:** Tombol pil dengan transisi penuh. Default berlatar `--soft-cloud` dan berbatasan `--hairline`. Pada hover, warna berbalik penuh (*inverted*):
    ```css
    .tag:hover {
      background: var(--ink);
      color: var(--canvas);
    }
    ```
-   **`.tab-btn` (Tombol Tab Aktif/Nonaktif):**
    Pill tab sempurna dengan efek translasi dan bayangan lembut khusus pada keadaan melayang:
    ```css
    .tab-btn {
      border: var(--border);
      padding: 0 24px;
      height: 40px;
      border-radius: 9999px;
      background: var(--canvas);
      color: var(--ink);
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .tab-btn:hover:not(.active) {
      background: var(--soft-cloud);
      border-color: var(--ink);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(17, 17, 17, 0.08);
    }
    .tab-btn.active {
      background: var(--ink);
      color: var(--canvas);
      border-color: var(--ink);
      box-shadow: 0 4px 12px rgba(17, 17, 17, 0.15);
    }
    ```

### C. Animasi Garis Bawah Navigasi (`.nav-link`)
Navigasi bar menggunakan efek gambar garis bawah (*underdraw animation*) yang membesar dari lebar `0` ke `100%`:
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1.5px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.nav-link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### D. Modal Efek Membal (Spring Modals)
Modal dialog interaktif (seperti form kontak/pesan) menggunakan kombinasi efek blur backdrop dan transisi skala membal (*spring transition*):
```css
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 46, 0.4);
  backdrop-filter: blur(0px);
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), backdrop-filter 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.modal-overlay.active {
  display: flex;
  opacity: 1;
  backdrop-filter: blur(4px);
}
.modal-content {
  border: var(--border);
  border-radius: 12px;
  background: var(--bg);
  padding: 2rem;
  transform: scale(0.92) translateY(12px);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-overlay.active .modal-content {
  transform: scale(1) translateY(0);
}
```

### E. Now Playing Widget (Estetika Retro Audio)
Komponen pemutar musik memiliki aksen bayangan retro padat tanpa blur:
-   **Tombol Kontrol (`.np-playbtn`, `.np-skipbtn`):** Menggunakan offset padat berlatar Lavender (`--lav`) atau Ink (`--ink`):
    ```css
    .np-playbtn {
      box-shadow: 2px 2px 0 var(--lav);
    }
    .np-playbtn:hover {
      box-shadow: 4px 4px 0 var(--lav);
      transform: translate(-1px, -1px);
    }
    ```

---

## 6. Gaya Halaman Khusus: Tampilan CV (Curriculum Vitae)

Saat pengguna menekan tombol **"SEE CV"**, portofolio menyembunyikan kolom modular standar dan mengubah antarmuka menjadi lembar cetak resume bersih.

### Aturan Pelepasan Gap (Gap & Radius Strip)
Ketika kelas `.cv-page-active` disematkan ke elemen `body`, layout dinetralkan agar menyerupai selembar dokumen fisik (0px gap, ujung kotak tegas):
```css
body.cv-page-active main {
  margin: 0px !important;
  padding: 0px !important;
}
body.cv-page-active #portfolio-container {
  padding: 0px !important;
  margin: 0px auto !important;
}
body.cv-page-active #cv-rendering-container {
  margin-top: 0px !important;
  border-radius: 0px !important;
}
```

### Animasi Muncul Bertahap (Staggered Fade-in)
Elemen di dalam resume (`.cv-animate-item`) dimunculkan secara beruntun (*staggered*) dengan delay bertingkat dari elemen ke-1 hingga elemen ke-8:
```css
body.cv-page-active .cv-animate-item {
  animation: cvFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
body.cv-page-active .cv-animate-item:nth-child(1) { animation-delay: 0.05s; }
body.cv-page-active .cv-animate-item:nth-child(2) { animation-delay: 0.1s; }
body.cv-page-active .cv-animate-item:nth-child(3) { animation-delay: 0.15s; }
body.cv-page-active .cv-animate-item:nth-child(4) { animation-delay: 0.2s; }
body.cv-page-active .cv-animate-item:nth-child(5) { animation-delay: 0.25s; }
body.cv-page-active .cv-animate-item:nth-child(6) { animation-delay: 0.3s; }
body.cv-page-active .cv-animate-item:nth-child(7) { animation-delay: 0.35s; }
body.cv-page-active .cv-animate-item:nth-child(8) { animation-delay: 0.4s; }
```

---

## 7. Daftar Pustaka Animasi (CSS Keyframes)

| Nama Animasi | Efek Visual | Kecepatan & Iterasi |
| :--- | :--- | :--- |
| `shimmer` | Efek memantulkan cahaya horizontal pada elemen skeleton loading (`.sk`). | `1.5s infinite linear` |
| `fadeUp` | Efek memudarkan masuk sambil mendorong ke atas setinggi 16px (`.fi`). | `0.45s forwards ease` |
| `cvFadeInUp` | Efek memudarkan masuk khusus lembar CV setinggi 16px. | `0.6s cubic-bezier(0.16, 1, 0.3, 1)` |
| `mq` | Gulir teks tak terbatas dari kanan ke kiri untuk widget Marquee (`.mq`). | `24s linear infinite` |
| `xpPulse` | Denyutan bayangan berpendar lembut pada progress bar level / XP. | `2.4s ease-in-out infinite` |
| `eq` | Gerakan naik-turun batang equalizer grafis pada audio widget. | `0.6s ease-in-out infinite alternate` |
| `spin` | Putaran piringan hitam (vinyl) pemutar musik. | `4s linear infinite` |
| `popUp` | Efek membesar membal ke atas untuk gambar galeri yang selesai dimuat. | `0.6s cubic-bezier(0.16, 1, 0.3, 1)` |
| `tabFadeIn` | Transisi memudarkan masuk konten tab baru dari posisi bawah. | `0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards` |
| `tabFadeOutUp` | Transisi memudarkan keluar konten tab lama ke posisi atas. | `0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards` |
| `drawCheck` | Menggambar garis centang hijau SVG secara alami menggunakan offset stroke. | `0.4s ease forwards` |
