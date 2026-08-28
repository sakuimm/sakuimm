# PANDUAN DESAIN UI/UX & STYLE GUIDE
## Sistem Pencatatan & Pelaporan Keuangan Ikatan Mahasiswa Muhammadiyah (IMM)
**Versi:** 1.0  
**Pendekatan Desain:** Clean, Minimalist, Dashboard Portal Modern (Ref: Supplier & Vendor Management Portal)  
**Aturan Warna:** 3 Warna Flat Pastel (Primer, Sekunder, Aksen) - *Zero Gradient*  

---

## 1. PRINSIP DESAIN UTAMA

Panduan ini mengatur standar visual dan antarmuka pengguna (UI/UX) untuk aplikasi Pencatatan Keuangan IMM. Berdasarkan inspirasi tampilan portal manajemen modern yang bersih dan terstruktur, prinsip utama desain ini adalah:

1. **Struktur Berbasis Kartu (Card-Based Layout):** Informasi dikelompokkan dalam kartu-kartu (*cards*) dengan batas tegas (`border: 1px solid #E2E8F0`) dan sudut melengkung halus (`rounded-xl` / `12px`).
2. **Kesesuaian 3 Warna Pastel Flat:** Tidak ada gradasi warna (*no gradients*). Seluruh elemen UI berbasis warna flat pastel yang lembut dan nyaman dipandang dalam waktu lama.
3. **Penggunaan Ikon Kontekstual & Tanpa Emoticon Berlebihan:** Menghindari penggunaan emoticon dekoratif berlebihan. Menggunakan ikon garis bersih (Lucide Icons) yang fungsional dan relevan dengan konteks keuangan.
4. **Keterbacaan & Hirarki Tipografi Jelas:** Penggunaan font sans-serif modern dengan bobot kontras tegas untuk memisahkan judul, label, dan angka nominal nominal.

---

## 2. PALET WARNA (3 WARNA FLAT PASTEL)

Aplikasi ini menggunakan sistem 3 warna utama berjenis **Flat Pastel** yang dipadukan dengan warna netral latar belakang.

```
+-----------------------------------------------------------------------+
|  WARNA PRIMER        |  WARNA SEKUNDER      |  WARNA AKSEN            |
|  Soft Dark Slate     |  Pastel Sage Green   |  Pastel Warm Peach      |
|  HEX: #2D3748        |  HEX: #81B29A        |  HEX: #F4A261           |
+-----------------------------------------------------------------------+
```

### 2.1 Spesifikasi Warna Utama
| Jenis Warna | Kode Hex | Kelas Tailwind CSS | Fungsi & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Warna Primer** | `#2D3748` | `bg-slate-800`, `text-slate-800` | Teks utama, judul halaman, sidebar active item, tombol utama (*Primary CTA*), border struktur. |
| **Warna Sekunder** | `#81B29A` | `bg-[#81B29A]`, `text-[#81B29A]` | Indikator positif (Pemasukan, Surplus), badge status *Verified/Approved*, grafik tren naik. |
| **Warna Aksen** | `#F4A261` | `bg-[#F4A261]`, `text-[#F4A261]` | Indikator pengeluaran, status *Pending/Warning*, badge sorotan, highlight notifikasi, aksen grafik. |

### 2.2 Warna Netral & Pendukung (Background & Surfaces)
| Komponen | Kode Hex | Kelas Tailwind CSS | Keterangan |
| :--- | :--- | :--- | :--- |
| **Canvas / Body Background** | `#F8F9FA` | `bg-[#F8F9FA]` | Latar belakang aplikasi (Soft Off-White/Light Gray). |
| **Card Surface** | `#FFFFFF` | `bg-white` | Latar belakang kartu dashboard, modal, dan form. |
| **Border / Divider** | `#E2E8F0` | `border-slate-200` | Garis pembatas kartu, baris tabel, dan input field. |
| **Muted Text / Subtitle** | `#718096` | `text-slate-500` | Teks deskripsi, label sekunder, dan timestamp. |

---

## 3. TIPOGRAFI & HIRARKI TEKS

- **Font Family:** `Plus Jakarta Sans` atau `Inter` (Sans-Serif Modern)
- **Aturan Rendering:** Clear subpixel antialiased.

```
Plus Jakarta Sans / Inter
├── Display Metric : 28px - 32px | Bold (700)     --> Nilai Nominal Saldo / Metric
├── Heading 1 (H1) : 22px - 24px | SemiBold (600) --> Judul Halaman / Section Utama
├── Heading 2 (H2) : 16px - 18px | SemiBold (600) --> Judul Kartu / Widget
├── Body Text      : 14px        | Regular (400)  --> Teks Pembacaan / Baris Tabel
└── Small / Label  : 12px        | Medium (500)   --> Sub-label, Status Badge, Metadata
```

---

## 4. STANDAR KOMPONEN UI (SESUAI DESAIN PORTAL)

### 4.1 Layout Sidebar Navigasi
- **Ukuran:** Width `240px` (Desktop), collapsible pada layar mobile PWA.
- **Navigasi Item:**
  - Standard Item: Text `#718096`, Icon size 20px.
  - Active Item: Background `#2D3748` (Primer) dengan teks putih `#FFFFFF` dan sudut melengkung `rounded-lg` (8px).
  - Sub-brand Badge: Logo IMM di bagian atas dengan font SemiBold.

### 4.2 Kartu Metric Dashboard (Stat Cards)
Setiap stat card menyajikan indikator angka kunci (contoh: Total Saldo, Pemasukan, Pengeluaran):
- **Bentuk:** `bg-white`, `border border-slate-200`, `rounded-xl` (12px), `p-5`.
- **Tata Letak:**
  - Baris Atas: Label Metrik (`text-slate-500 text-sm`) di kiri; Icon lingkaran pastel (`bg-[#F4A261]/15` atau `bg-[#81B29A]/15`) di kanan atas.
  - Baris Tengah: Nominal besar (`text-slate-800 text-2xl font-bold`).
  - Baris Bawah: Sub-label tren kecil dengan pill pastel (misal: `↑ 12% dari bulan lalu` dalam badge pastel sage green).

### 4.3 Badge Status (Pills)
Digunakan pada tabel transaksi dan verifikasi organisasi:
- **Status Verified / Approved:** `bg-[#81B29A]/15`, `text-[#2D5A44]`, `border border-[#81B29A]/30`, `rounded-full` (9999px).
- **Status Pending:** `bg-[#F4A261]/15`, `text-[#9C5217]`, `border border-[#F4A261]/30`, `rounded-full`.
- **Status Rejected:** `bg-red-50`, `text-red-700`, `border border-red-200`, `rounded-full`.

### 4.4 Tabel & Daftar Transaksi
- **Header Tabel:** `bg-[#F8F9FA]`, `text-slate-600 font-semibold text-xs uppercase tracking-wider`, `py-3 px-4`.
- **Baris Data:** `border-b border-slate-100 hover:bg-slate-50/80 transition-colors`.
- **Format Currency:** Nominal pemasukan diberi warna hijau pastel (`text-[#2E7D32]`), nominal pengeluaran diberi warna peach/merah pastel (`text-[#C62828]`).

### 4.5 Grafik & Visualisasi (Recharts)
- **Donut Chart (Kategori Transaksi):**
  - Segment Operasional: Warna Primer (`#2D3748`).
  - Segment Inventaris: Warna Aksen (`#F4A261`).
- **Bar Chart (Tren Bulanan Pemasukan vs Pengeluaran):**
  - Batang Pemasukan: Warna Sekunder (`#81B29A`).
  - Batang Pengeluaran: Warna Aksen (`#F4A261`).

---

## 5. PEDOMAN PENGGUNAAN IKON & EMOTICON

Untuk menjaga profesionalitas dan estetika aplikasi keuangan organisasi, aturan penggunaan ikon dan emoticon ditetapkan sebagai berikut:

### 5.1 Larangan Emoticon AI Dekoratif Berlebihan
❌ **DILARANG:** Penggunaan emoticon AI seperti 🚀, ✨, 🔥, 💡, ⚡ secara bertumpuk pada judul, tombol, atau teks penjelasan dokumen/aplikasi.

### 5.2 Ikon Kontekstual Standar (Lucide Icons)
✅ **DIPERBOLEHKAN:** Mengunakan Lucide Icons berukuran 16px - 20px sesuai fungsinya:
- `LayoutDashboard` -> Navigasi Dashboard
- `Receipt` -> Input Transaksi / Nota
- `ArrowUpRight` -> Indikator Pemasukan
- `ArrowDownLeft` -> Indikator Pengeluaran
- `Building2` -> Organisasi (DPP/DPD/PC/PK)
- `FileSpreadsheet` -> Ekspor Laporan Excel
- `History` -> Audit Log & Riwayat Perubahan

---

## 6. CONTOH KODE TAIWIND CSS (SNIPPETS)

### 6.1 Custom Tailwind Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        pastel: {
          primary: '#2D3748',   // Soft Dark Slate
          secondary: '#81B29A', // Pastel Sage Green
          accent: '#F4A261',    // Pastel Warm Peach
          bg: '#F8F9FA',        // Off-White Canvas
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      }
    },
  },
}
```

### 6.2 Component Stat Card Snippet
```tsx
export function StatCard({ label, value, trend, type }: StatCardProps) {
  const isPositive = type === 'pemasukan';
  return (
    <div className="bg-white border border-slate-200 rounded-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-full ${isPositive ? 'bg-[#81B29A]/15 text-[#81B29A]' : 'bg-[#F4A261]/15 text-[#F4A261]'}`}>
          {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
        </div>
      </div>
      <div className="text-slate-800 text-2xl font-bold tracking-tight mb-2">
        {value}
      </div>
      <div className="flex items-center gap-1 text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${isPositive ? 'bg-[#81B29A]/15 text-[#2D5A44]' : 'bg-[#F4A261]/15 text-[#9C5217]'}`}>
          {trend}
        </span>
        <span className="text-slate-400">vs bulan lalu</span>
      </div>
    </div>
  );
}
```
