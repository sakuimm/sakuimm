# PANDUAN DESAIN UI/UX & STYLE GUIDE
## SAKU IMM x BCA Syariah - Sistem Administrasi Keuangan Ikatan Mahasiswa Muhammadiyah
**Versi:** 2.0 (Official Bank Co-Branding Release)  
**Pendekatan Desain:** Modern Syariah Banking & Organization Dashboard (Ref: Official BCA Syariah Collaboration Mockup)  
**Aturan Warna:** IMM Crimson Maroon, BCA Syariah Cyan, & Financial Metric Accents  

---

## 1. PRINSIP DESAIN UTAMA

Panduan ini mengatur standar visual dan antarmuka pengguna (UI/UX) resmi untuk platform **SAKU IMM x BCA Syariah**. Berdasarkan acuan mockup kerjasama resmi dengan BCA Syariah, prinsip utama desain ini adalah:

1. **Warna Identitas Organisasi & Perbankan Syariah:** Menghadirkan warna khas **Crimson Maroon IMM (`#7A0C1E`)** pada Sidebar Navigasi & Tombol Utama, dipadukan dengan aksen **BCA Syariah Cyan (`#0097A7`)**.
2. **Kategori Warna Metrik Keuangan yang Tegas:**
   - **Saldo Kas & Saldo Akhir:** Biru Syariah / Royal Blue (`#1D4ED8`)
   - **Pemasukan Kas:** Hijau Positif (`#2E7D32`)
   - **Pengeluaran Kas:** Warm Red (`#C05621` / `#DC2626`)
3. **Penerapan Badge Co-Branding Resmi:** Menampilkan badge sinergi `SAKU IMM x BCA Syariah` pada Header aplikasi dan Halaman Login.
4. **Struktur Berbasis Kartu (Card-Based Layout):** Informasi dikelompokkan dalam kartu-kartu (*cards*) bersih dengan pembatas halus (`border border-slate-200`) dan sudut melengkung `rounded-xl`.
5. **Penggunaan Ikon Garis Clean (Lucide Icons):** Menggunakan ikon fungsional berukuran 16px - 20px tanpa emoticon dekoratif AI berlebihan.

---

## 2. PALET WARNA RESMI

Aplikasi menggunakan palet warna yang terintegrasi antara identitas resmi IMM dan BCA Syariah:

```
+-----------------------------------------------------------------------------------+
|  PRIMARY MAROON       |  SYARIAH CYAN        |  SALDO BLUE     |  PEMASUKAN GREEN |
|  IMM Deep Crimson     |  BCA Syariah Accent  |  Kas / Net      |  Pemasukan Kas   |
|  HEX: #7A0C1E         |  HEX: #0097A7        |  HEX: #1D4ED8   |  HEX: #2E7D32    |
+-----------------------------------------------------------------------------------+
```

### 2.1 Spesifikasi Warna Utama
| Jenis Warna | Kode Hex | Kelas Tailwind CSS | Fungsi & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary Maroon** | `#7A0C1E` | `bg-[#7A0C1E]`, `text-[#7A0C1E]` | Background Sidebar Navigasi Utama, Tombol Login CTA, Header Card utama. |
| **Maroon Pill Active** | `#9E142B` / `bg-white/20` | `bg-white/20`, `text-white` | Highlight item navigasi aktif di Sidebar. |
| **Syariah Cyan** | `#0097A7` | `text-[#0097A7]`, `bg-[#0097A7]` | Badge logo resmi BCA Syariah, aksen indikator perbankan. |
| **Saldo Blue** | `#1D4ED8` | `text-[#1D4ED8]`, `bg-[#1D4ED8]` | Nominal Saldo Kas, Saldo Akhir Periode, dan grafik saldo. |
| **Pemasukan Green** | `#2E7D32` | `text-[#2E7D32]`, `bg-[#2E7D32]` | Nominal Pemasukan Kas, tren positif, status *Approved/Verified*. |
| **Pengeluaran Red** | `#C05621` / `#DC2626` | `text-[#C05621]`, `bg-[#DC2626]` | Nominal Pengeluaran Kas, indikator defisit, status *Pending/Warning*. |

### 2.2 Warna Netral & Surface
| Komponen | Kode Hex | Kelas Tailwind CSS | Keterangan |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8F9FA` | `bg-[#F8F9FA]` | Latar belakang aplikasi (*Off-White*). |
| **Card Surface** | `#FFFFFF` | `bg-white` | Latar belakang kartu dashboard, form modal, dan tabel. |
| **Border Divider** | `#E2E8F0` | `border-slate-200` | Pembatas antar komponen dan baris tabel. |
| **Muted Subtitle** | `#64748B` | `text-slate-500` | Sub-label, keterangan metadata, dan timestamp. |

---

## 3. TIPOGRAFI & HIRARKI TEKS

- **Font Family:** `Plus Jakarta Sans`, `Inter`, Sans-Serif Modern.
- **Rendering:** Subpixel Antialiased.

```
Plus Jakarta Sans / Inter
├── Display Nominal : 28px - 32px | ExtraBold (800) --> Nominal Saldo & Metrik Utama
├── Heading 1 (H1)  : 22px - 24px | Bold (700)      --> Judul Halaman / Section
├── Heading 2 (H2)  : 16px - 18px | SemiBold (600)  --> Judul Kartu / Widget
├── Body Text       : 14px        | Regular (400)   --> Teks Pembacaan / Tabel
└── Label / Badge   : 11px - 12px | Medium/Bold     --> Badge Status & Subtitle
```

---

## 4. STANDAR KOMPONEN UI

### 4.1 Sidebar Navigasi Maroon
- **Latar Belakang:** Deep Maroon (`#7A0C1E`).
- **Header:** Logo Resmi `/sakuimmlogo.jpg` dengan pembatas halus `border-white/15`.
- **Navigasi Active Item:** Pill terkelompok `bg-white/20 text-white font-bold rounded-xl px-3 py-2.5 shadow-xs`.
- **Navigasi Inactive Item:** `text-white/80 hover:bg-white/10 hover:text-white transition-all`.

### 4.2 Kartu Ringkasan Metrik Dashboard
- **Saldo Kas Card:** Title `text-slate-500`, Nominal `text-[#1D4ED8] font-black`.
- **Pemasukan Card:** Title `text-slate-500`, Nominal `text-[#2E7D32] font-black`.
- **Pengeluaran Card:** Title `text-slate-500`, Nominal `text-[#C05621] font-black`.
- **Saldo Akhir Card:** Title `text-slate-500`, Nominal `text-[#1D4ED8] font-black`.

### 4.3 Badge Co-Branding (SAKU IMM x BCA Syariah)
Ditampilkan pada Header aplikasi dan Halaman Login.
