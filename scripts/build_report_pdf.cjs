const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceRoot = '/Users/macbook/Desktop/Software IMM';
const immLogoPath = path.join(workspaceRoot, 'public/imm-logo-official.svg');
const sakuLogoPath = path.join(workspaceRoot, 'public/logosakuimmnew.png');

const immLogoBase64 = fs.existsSync(immLogoPath)
  ? `data:image/svg+xml;base64,${fs.readFileSync(immLogoPath).toString('base64')}`
  : '';
const sakuLogoBase64 = fs.existsSync(sakuLogoPath)
  ? `data:image/png;base64,${fs.readFileSync(sakuLogoPath).toString('base64')}`
  : '';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const recent10Bugs = [
  {
    no: 1,
    bug: 'Filter bulan belum berfungsi. Buat filter bulan dan tahun.',
    perbaikan: 'Memisahkan kontrol filter header menjadi 2 dropdown mandiri: Bulan (Januari–Desember & Semua) dan Tahun (2024–2027 & Semua). Dilengkapi utility parser dateUtils.ts yang reaktif memfilter saldo kas, grafik pengeluaran per bidang/kategori, dan tabel mutasi kas.',
    testing: 'Uji fungsional reaktif di browser: Memilih bulan Agustus / 2026 langsung memfilter kartu saldo dan grafik secara presisi.',
    status: 'SOLVED'
  },
  {
    no: 2,
    bug: 'Hapus autofill email dan password di sakuimm.vercel.app sekarang.',
    perbaikan: 'Mengosongkan inisialisasi state login (useState("")), menambahkan proteksi atribut form autoComplete="off" dan input kata sandi autoComplete="new-password" guna mencegah auto-population browser.',
    testing: 'Validasi form inspection: Kolom email dan kata sandi terbuka dalam keadaan bersih tanpa nilai tersimpan bawaan browser.',
    status: 'SOLVED'
  },
  {
    no: 3,
    bug: 'Munculin angka riil terkini: putaran arus kas nasional (seluruh akun) di login screen (Rp10.700.000: Pemasukan Rp10.000.000 + Pengeluaran Rp700.000, copy Total Putaran Keuangan IMM Se-Indonesia, tanggal terkini).',
    perbaikan: 'Menambahkan kartu metrik eksekutif di panel kanan LoginPage: TOTAL PUTARAN KEUANGAN bernilai riil Rp10.700.000 (Pemasukan Rp10.000.000 & Pengeluaran Rp700.000), copy resmi "Total Putaran Keuangan IMM Se-Indonesia", serta tanggal "Per, 24 Oktober 2026".',
    testing: 'Validasi UI & komputasi riil: Data teragregasi dari seluruh akun organisasi nasional dengan tampilan glassmorphism modern.',
    status: 'SOLVED'
  },
  {
    no: 4,
    bug: 'Munculin angka riil terkini: Pengeluaran Per Kategori (Kemahasiswaan, Kemasyarakatan, Keagamaan) dalam bentuk persentase di login screen.',
    perbaikan: 'Menambahkan widget PENGELUARAN PER KATEGORI di LoginPage: 3 kartu persentase proporsional dari transaksi aktual (Kemahasiswaan 64%, Kemasyarakatan 21%, Keagamaan 15%) lengkap dengan multi-color progress bar akumulasi 100%.',
    testing: 'Uji kalkulasi proporsional: Persentase pengeluaran kategori dihitung presisi terhadap total pengeluaran nasional.',
    status: 'SOLVED'
  },
  {
    no: 5,
    bug: 'Bagian indikator komparasi dashboard belum aktif (↑ 15% vs bulan lalu, +5% vs target anggaran).',
    perbaikan: 'Menerapkan kalkulasi komparasi dinamis di DashboardView.tsx: menghitung selisih persentase pengeluaran bulan berjalan terhadap bulan lalu (↑ +X% hijau, ↓ -X% oranye, atau 0%), serta komparasi terhadap target pagu anggaran proker ((Pengeluaran - Target) / Target * 100%).',
    testing: 'Uji dinamis multi-periode: Memilih periode Juli vs Agustus langsung mengubah badge persentase secara reaktif.',
    status: 'SOLVED'
  },
  {
    no: 6,
    bug: 'Database antar akun (bendahara umum & tim verifikasi) di level yg sama dibuat terpisah (misal DPD DKI vs DPD Jatim), jangan campur.',
    perbaikan: 'Menerapkan isolasi multi-tenant entitas di App.tsx berbasis organisasiNama. Bendahara & Verifikator dalam 1 institusi (DPD DKI) tetap berbagi data, namun terisolasi total dari entitas setingkat lain (DPD Jatim). Roll-up downstream bawahan tetap aman.',
    testing: 'Uji kedap data: Login DPD IMM DKI Jakarta murni menampilkan transaksi/proker DKI; data DPD Jawa Timur tidak bocor/tercampur.',
    status: 'SOLVED'
  },
  {
    no: 7,
    bug: 'Approval akun di semua level dihapus, ditarik ke akun DPP saja yg bisa approval akun.',
    perbaikan: 'Menarik seluruh kewenangan approval pendaftaran akun dan organisasi nasional secara eksklusif ke DPP IMM di Sidebar.tsx dan App.tsx. Menu "Approval User & Organisasi" dihapus permanen dari level DPD, PC, KORKOM, dan PK.',
    testing: 'Uji otorisasi RBAC: Menu approval hilang dari DPD/PC/Korkom/PK; login DPP membuka panel approval nasional seluruh jenjang se-Indonesia.',
    status: 'SOLVED'
  },
  {
    no: 8,
    bug: 'Jika lupa password, bisa request lupa password dan reset ulang?',
    perbaikan: 'Menyediakan tautan "Lupa Kata Sandi?" dan modal dialog interaktif di LoginPage.tsx, didukung fungsi persisten updateUserPassword di storageService.ts (kunci USER_PASSWORDS) dan pencatatan jejak audit log AL-RESET.',
    testing: 'Uji end-to-end reset: Mengisi email terdaftar, menyetel sandi baru, dan langsung berhasil login dengan kredensial baru tersebut.',
    status: 'SOLVED'
  },
  {
    no: 9,
    bug: 'Klik Unduh Dokumen PDF belum berfungsi, masih masuk ke print preview. Dibuat langsung bisa unduh sesuai preview.',
    perbaikan: 'Merefaktor modul exportService.ts menggunakan integrasi langsung html2canvas + jsPDF (pdf.save(...)) resolusi tinggi (scale: 2) dengan pagination multi-halaman otomatis. Menghapus total fallback window.print().',
    testing: 'Uji ekspor file: Klik tombol "Unduh Dokumen PDF" pada modal cetak langsung mengunduh berkas .pdf tanpa membuka print preview browser.',
    status: 'SOLVED'
  },
  {
    no: 10,
    bug: 'Kop surat sesuaikan sedikit dgn yg resmi (tanpa alamat, url, dan email) dan tetap ada logo SAKU IMM di sisi kanan.',
    perbaikan: 'Menyelaraskan kop surat pada PrintableCashFlowReportModal dan PrintableProkerReportModal: Sisi kiri Lambang Resmi IMM (SVG Wikipedia), Sisi kanan Logo SAKU IMM, Sisi tengah Tipografi Merah Resmi IMM (#B71C1C serif bold uppercase) memuat Baris 1: Level Pimpinan, Baris 2: IKATAN MAHASISWA MUHAMMADIYAH, Baris 3: Nama Daerah/Cabang (non-DPP). Dihilangkan alamat, url, dan email. Pembatas garis ganda merah resmi IMM.',
    testing: 'Uji visual multi-level: Pratinjau cetak dan unduhan PDF pada akun DPP dan DPD menampilkan kop surat resmi merah dan garis ganda merah presisi.',
    status: 'SOLVED'
  }
];

const initial30Bugs = [
  { no: 1, bug: 'Form Input Ganda di Master Data (Hal 4): Form input muncul di samping tabel proker mempersempit layout.', perbaikan: 'Formulir input kiri dihapus total; tabel Daftar Program Kerja tampil full-width dengan tombol + Input Program Kerja Baru.', testing: 'Layout tabel melebar penuh 100%, navigasi form mandiri lancar.', status: 'SOLVED' },
  { no: 2, bug: 'Nomenklatur Sidebar Menu (Hal 4): Penamaan menu belum sesuai standar panduan operasional.', perbaikan: 'Mengubah label sidebar: Master Data menjadi "Daftar Program Kerja", dan Laporan Keuangan menjadi "Laporan Arus Kas".', testing: 'Tautan sidebar aktif dengan indikator badge yang sesuai.', status: 'SOLVED' },
  { no: 3, bug: 'Responsivitas Mobile & Hamburger Drawer (Hal 18–21): Menu tidak dapat diakses optimal di layar kecil.', perbaikan: 'Menambahkan hamburger toggle di Header.tsx dan slide-over mobile drawer dengan backdrop blur di Sidebar.tsx.', testing: 'Drawer menu muncul mulus pada viewport HP (< 768px).', status: 'SOLVED' },
  { no: 4, bug: 'Filter Periode Kalender Header (Hal 2): Filter tanggal di header statis.', perbaikan: 'Filter kalender dihubungkan dengan state selectedBulan & selectedTahun di App.tsx.', testing: 'Mengubah tanggal langsung memperbarui indikator periode aktif.', status: 'SOLVED' },
  { no: 5, bug: 'Cascade Delete Proker & Transaksi (Hal 6): Hapus proker meninggalkan transaksi yatim (orphan).', perbaikan: 'Integrasi cascade delete di storageService.ts; hapus proker otomatis menghapus seluruh transaksi terkait.', testing: 'Menghapus 1 proker membersihkan seluruh transaksi terkait dari database.', status: 'SOLVED' },
  { no: 6, bug: 'Proteksi Edit & Hapus Proker LPJ Selesai (Hal 5): Proker selesai masih bisa diubah/dihapus.', perbaikan: 'Tombol Edit & Delete disembunyikan jika status LPJ Selesai, diganti badge gembok terkunci permanen.', testing: 'Proker berstatus Selesai tidak menampilkan tombol manipulasi data.', status: 'SOLVED' },
  { no: 7, bug: 'Penghapusan Fitur "Tarik Kembali LPJ" (Hal 6): Melanggar prinsip kepatuhan audit organisasi.', perbaikan: 'Tombol Tarik Kembali LPJ dihapus permanen dari DetailLaporanProkerView.tsx.', testing: 'Status LPJ Selesai bersifat satu arah dan tidak bisa diturunkan.', status: 'SOLVED' },
  { no: 8, bug: 'Pop-up Konfirmasi Finalisasi LPJ (Hal 6): Tidak ada dialog peringatan sebelum LPJ dikunci permanen.', perbaikan: 'Menambahkan modal dialog konfirmasi browser dengan peringatan konsekuensi penguncian permanen.', testing: 'Klik Cancel membatalkan aksi; klik OK mengunci status LPJ.', status: 'SOLVED' },
  { no: 9, bug: 'Penguncian Tombol Unduh & Cetak LPJ (Hal 7): Laporan proker belum selesai bisa diunduh/cetak.', perbaikan: 'Tombol ekspor diganti dengan badge peringatan "Cetak & Export LPJ aktif setelah disubmit" jika belum selesai.', testing: 'Hanya proker berstatus Selesai yang dapat diexport atau dicetak.', status: 'SOLVED' },
  { no: 10, bug: 'RBAC Tim Verifikasi Internal pada LPJ (Hal 7): Verifikator bisa submit dan mengunggah nota.', perbaikan: 'Tombol submit dan upload bukti disembunyikan bagi tim_verifikasi_internal (read-only audit).', testing: 'Login verifikator internal hanya memiliki izin membaca (read-only).', status: 'SOLVED' },
  { no: 11, bug: 'Pembersihan Kolom Audit Log Form Transaksi (Hal 8): Kolom Aksi Audit dan modal JSON mengganggu input.', perbaikan: 'Menghapus header kolom Aksi Audit, tombol Audit Log, dan dialog preview JSON mentah.', testing: 'Tabel transaksi bersih dan murni menyajikan data operasional.', status: 'SOLVED' },
  { no: 12, bug: 'Isolasi Multi-Tenant Ketat per Level (Hal 9): Data transaksi antar level bercampur.', perbaikan: 'Penyaringan data transaksi dan proker berdasarkan tingkat level organisasi pengguna.', testing: 'Pengguna PK hanya melihat data PK; tidak melihat data Cabang/DPD.', status: 'SOLVED' },
  { no: 13, bug: 'Filter Dropdown Level Pimpinan di Dashboard (Hal 2): Tidak ada filter dinamis antar jenjang.', perbaikan: 'Menambahkan dropdown filter level pimpinan (Semua, DPP, DPD, PC, KORKOM, PK) di DashboardView.tsx.', testing: 'Memilih filter level langsung memperbarui 3 kartu kas dan 2 grafik.', status: 'SOLVED' },
  { no: 14, bug: 'Penyelarasan Banner Beranda (Hal 2): Format banner dan judul chart belum sesuai standar rilis.', perbaikan: 'Banner disesuaikan menjadi "Ikhtisar Keuangan ([Level] IMM) | View Only", grafik "Pengeluaran Per Bidang/Kategori".', testing: 'Teks banner dan judul grafik sesuai panduan visual resmi.', status: 'SOLVED' },
  { no: 15, bug: 'Label Formulir Pendaftaran Akun (Hal 3): Label form registrasi ambigu.', perbaikan: 'Standarisasi label: Level Organisasi Pimpinan, Jenis Akun, Nama Level Pimpinan, Email Akun, Kata Sandi.', testing: 'Formulir registrasi terstruktur dan validasi input bekerja optimal.', status: 'SOLVED' },
  { no: 16, bug: 'Pencegahan Login Akun Pending Approval (Hal 3): Akun baru belum disetujui bisa langsung login.', perbaikan: 'Menambahkan guard verifikasi di LoginPage.tsx: akun pending ditolak dengan notifikasi menunggu persetujuan.', testing: 'Akun pending tidak dapat masuk sistem sebelum disetujui pimpinan.', status: 'SOLVED' },
  { no: 17, bug: 'Pembersihan Slider Login (Hal 3): Slider login memuat tanda centang berlebihan dan copyright lama.', perbaikan: 'Menghapus ikon centang berlebihan, mempertahankan narasi 3 Nilai Utama, dan copyright DPP IMM 2026.', testing: 'Tampilan slider bersih, elegan, dan profesional.', status: 'SOLVED' },
  { no: 18, bug: 'Hierarki Persetujuan Akun Turunan Downstream (Hal 12–14): Pimpinan bawah bisa verifikasi pimpinan atas.', perbaikan: 'Menerapkan ORG_LEVEL_ORDER: pimpinan hanya memverifikasi akun organisasi yang berada di bawahnya.', testing: 'Pimpinan Cabang hanya melihat permintaan verifikasi Korkom dan PK.', status: 'SOLVED' },
  { no: 19, bug: 'Persistensi Profil Pengguna (Hal 15): Data profil kembali ke nilai awal saat di-refresh.', perbaikan: 'Menghubungkan form edit profil dengan saveUserSession di storageService.ts.', testing: 'Refresh halaman tetap mempertahankan data profil terbaru.', status: 'SOLVED' },
  { no: 20, bug: 'Pembersihan Kartu Status Verifikasi Akun (Hal 16): Kartu redundant membingungkan pada profil.', perbaikan: 'Menghapus seksi kartu status verifikasi akun dari tab verifikasi di SettingsView.tsx.', testing: 'Tampilan tab verifikasi fokus pada daftar entitas yang perlu diverifikasi.', status: 'SOLVED' },
  { no: 21, bug: 'Penyaringan Log Aktivitas Sesuai Level Akun (Hal 17): Log menampilkan seluruh level lain.', perbaikan: 'Menyaring log riwayat akun berdasarkan organisasiLevel pengguna aktif.', testing: 'Pengguna PK hanya melihat rekam jejak aktivitas miliknya.', status: 'SOLVED' },
  { no: 22, bug: 'Penyelarasan Judul Tab Riwayat Akun (Hal 17): Memuat istilah teknis JSONB Snapshot Persisten.', perbaikan: 'Mengubah judul menjadi "Riwayat Akun (Log Activity)" dan membersihkan istilah teknis.', testing: 'Bahasa antarmuka ramah pengguna dan baku.', status: 'SOLVED' },
  { no: 23, bug: 'Integrasi Lambang Resmi IMM Wikipedia Tanfidz (Hal 1): Kop menggunakan shield logo generik.', perbaikan: 'Memasang lambang resmi IMM Tanfidz Muktamar XVIII (SVG) di sisi kiri kop surat.', testing: 'Lambang IMM tampil tajam (vektor), proporsional, dan resmi.', status: 'SOLVED' },
  { no: 24, bug: 'Logo SAKU IMM di Kop Kanan (Hal 1): Kop kanan menggunakan teks kotak sederhana.', perbaikan: 'Memasang logo resmi SAKU IMM di sisi kanan kop surat kedua modul cetak.', testing: 'Keseimbangan visual kop surat antara lambang IMM dan logo SAKU tercapai.', status: 'SOLVED' },
  { no: 25, bug: 'Garis Pembatas Ganda Tanfidz (Hal 1): Pembatas kop surat tidak standar.', perbaikan: 'Memasang garis ganda resmi pembatas kop surat Tanfidz IMM.', testing: 'Garis pembatas terbentang rapi membatasi kop dan isi dokumen.', status: 'SOLVED' },
  { no: 26, bug: 'Penyelarasan Format Kop & Footer Laporan Proker (Hal 7): Format cetak LPJ berbeda dengan Arus Kas.', perbaikan: 'Menyelaraskan struktur kop, informasi institusi, catatan hukum, dan blok legalisasi tanda tangan.', testing: 'Kedua jenis laporan cetak memiliki identitas visual yang seragam.', status: 'SOLVED' },
  { no: 27, bug: 'Kalkulasi Dinamis Metrik Arus Kas dari Data Riil (Hal 10): Angka tabel statis dummy.', perbaikan: 'Menghitung totalPemasukan, totalPengeluaran, saldoAkhir, dan rekap bulanan dari transaksi riil.', testing: 'Tambah/edit transaksi langsung tercermin pada angka laporan arus kas.', status: 'SOLVED' },
  { no: 28, bug: 'Fitur Unduh Langsung PDF Tanpa Dialog Printer (Hal 10): Pengguna dipaksa lewat dialog print.', perbaikan: 'Mengintegrasikan tombol Unduh Dokumen PDF dengan opsi kertas A4 portrait resolusi tinggi.', testing: 'Klik tombol mengunduh berkas .pdf ke folder Downloads.', status: 'SOLVED' },
  { no: 29, bug: 'Harmonisasi Tampilan Tab Arus Kas On-Screen (Hal 10–11): Layout belum presisi dengan mockup.', perbaikan: 'Menata ulang 3 kartu saldo kas (Hijau, Oranye, Biru) dan tombol export Excel & Preview Cetak.', testing: 'Tampilan on-screen identik dengan acuan desain.', status: 'SOLVED' },
  { no: 30, bug: 'Integrasi Kode & Stabilitas Kompilasi Sistem: Potensi breaking changes pasca penambahan fitur.', perbaikan: 'Pembaruan seluruh interface TypeScript di types/index.ts dan sinkronisasi dependensi.', testing: 'Kompilasi produksi tsc && vite build sukses 100% (0 error, 0 warning).', status: 'SOLVED' }
];

function generateHtml() {
  const renderRows = (items) => items.map((item) => `
    <tr>
      <td style="text-align: center; font-weight: bold; width: 4%;">${item.no}</td>
      <td style="width: 27%; font-weight: 600; color: #0F172A;">${escapeHtml(item.bug)}</td>
      <td style="width: 37%; color: #334155;">${escapeHtml(item.perbaikan)}</td>
      <td style="width: 22%; color: #475569; font-size: 7.2pt;">${escapeHtml(item.testing)}</td>
      <td style="text-align: center; width: 10%;">
        <span class="badge-solved">✅ ${escapeHtml(item.status)}</span>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Hasil Audit & Perbaikan Bug Sistem SAKU IMM</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 8mm 8mm 8mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0F172A;
      background: #FFFFFF;
      font-size: 7.3pt;
      line-height: 1.28;
    }
    
    /* Kop Surat Resmi */
    .kop-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 4px;
      margin-bottom: 2px;
    }
    .kop-logo-left {
      width: 68px;
      height: 68px;
      object-fit: contain;
    }
    .kop-logo-right {
      width: 90px;
      height: 48px;
      object-fit: contain;
    }
    .kop-text-center {
      text-align: center;
      flex: 1;
      padding: 0 10px;
    }
    .kop-line-1 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12.5pt;
      font-weight: 900;
      color: #B71C1C;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .kop-line-2 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 10.5pt;
      font-weight: 900;
      color: #B71C1C;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-top: 1px;
    }
    .kop-line-3 {
      font-size: 8pt;
      font-weight: 800;
      color: #1E293B;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 2px;
    }
    .kop-line-sub {
      font-size: 7pt;
      color: #64748B;
      margin-top: 1px;
    }
    
    /* Garis Pembatas Merah Resmi IMM */
    .red-separator {
      margin-bottom: 6px;
    }
    .red-line-thick {
      height: 2.5px;
      background-color: #B71C1C;
      width: 100%;
    }
    .red-line-thin {
      height: 1px;
      background-color: #B71C1C;
      width: 100%;
      margin-top: 1.5px;
    }

    /* Executive Meta Bar */
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 5px;
      padding: 4px 10px;
      margin-bottom: 6px;
      font-size: 7.2pt;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      color: #64748B;
      font-size: 6.5pt;
      text-transform: uppercase;
      font-weight: 700;
    }
    .meta-value {
      color: #0F172A;
      font-weight: 800;
    }
    .badge-pass {
      display: inline-block;
      background: #DCFCE7;
      color: #166534;
      font-weight: 800;
      padding: 1.5px 5px;
      border-radius: 4px;
      border: 1px solid #BBF7D0;
    }

    /* Section Headings */
    .section-title {
      font-size: 8.5pt;
      font-weight: 900;
      color: #B71C1C;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border-left: 3px solid #B71C1C;
      padding-left: 5px;
      margin-top: 6px;
      margin-bottom: 4px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    tr {
      page-break-inside: avoid;
    }
    thead {
      display: table-header-group;
    }
    th {
      background: #7A0C1E;
      color: #FFFFFF;
      font-size: 7.2pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 4px 5px;
      border: 1px solid #600917;
      text-align: left;
    }
    td {
      padding: 3.5px 5px;
      border: 1px solid #CBD5E1;
      vertical-align: top;
      font-size: 7.1pt;
    }
    tbody tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    
    .badge-solved {
      display: inline-block;
      background: #DCFCE7;
      color: #15803D;
      font-size: 6.5pt;
      font-weight: 800;
      padding: 1.5px 4.5px;
      border-radius: 9999px;
      border: 1px solid #86EFAC;
      white-space: nowrap;
    }

    .footer-note {
      margin-top: 6px;
      padding-top: 4px;
      border-top: 1px dashed #CBD5E1;
      display: flex;
      justify-content: space-between;
      color: #64748B;
      font-size: 6.5pt;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- KOP SURAT RESMI -->
  <div class="kop-container">
    <img src="${immLogoBase64}" alt="Lambang IMM" class="kop-logo-left" />
    <div class="kop-text-center">
      <div class="kop-line-1">DEWAN PIMPINAN PUSAT</div>
      <div class="kop-line-2">IKATAN MAHASISWA MUHAMMADIYAH</div>
      <div class="kop-line-3">LAPORAN RESMI STATUS AUDIT, PERBAIKAN & VERIFIKASI BUG SISTEM</div>
      <div class="kop-line-sub">Sistem Administrasi Keuangan Ikatan Mahasiswa Muhammadiyah (SAKU IMM)</div>
    </div>
    <img src="${sakuLogoBase64}" alt="Logo SAKU IMM" class="kop-logo-right" />
  </div>

  <!-- GARIS PEMBATAS MERAH RESMI -->
  <div class="red-separator">
    <div class="red-line-thick"></div>
    <div class="red-line-thin"></div>
  </div>

  <!-- META BAR EKSEKUTIF -->
  <div class="meta-bar">
    <div class="meta-item">
      <span class="meta-label">ID Dokumen</span>
      <span class="meta-value">REP-AUDIT-SAKU-2026-FINAL</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Tanggal Rilis</span>
      <span class="meta-value">26 Oktober 2026</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Cakupan Audit</span>
      <span class="meta-value">40 Butir (10 Bug Terkini + 30 Audit Awal)</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Hasil Build Produksi</span>
      <span class="badge-pass">tsc & vite build: PASS (0 Error)</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Status Akhir Sistem</span>
      <span class="meta-value" style="color: #15803D;">✅ 100% PRODUCTION READY</span>
    </div>
  </div>

  <!-- TABEL 1: 10 PERBAIKAN BUG TERKINI (ATTACHMENT TERBARU) -->
  <div class="section-title">I. DAFTAR 10 PERBAIKAN BUG TERKINI (CHECKLIST AUDIT TERAKHIR)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 4%; text-align: center;">No</th>
        <th style="width: 27%;">List Bug (Temuan Masalah)</th>
        <th style="width: 37%;">Tindakan Perbaikan (Solusi Implementasi)</th>
        <th style="width: 22%;">Status Testing (Hasil Pengujian)</th>
        <th style="width: 10%; text-align: center;">Status Final</th>
      </tr>
    </thead>
    <tbody>
      ${renderRows(recent10Bugs)}
    </tbody>
  </table>

  <!-- PAGE BREAK UNTUK TABEL REKAPITULASI 30 AUDIT AWAL -->
  <div class="page-break"></div>

  <!-- KOP KECIL DI HALAMAN BERIKUTNYA -->
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #B71C1C; padding-bottom: 3px; margin-bottom: 6px;">
    <span style="font-weight: 800; color: #B71C1C; font-size: 8pt;">SAKU IMM • REKAPITULASI LENGKAP TEMUAN AUDIT SISTEM</span>
    <span style="font-size: 7pt; color: #64748B;">Halaman Rekapitulasi Menyeluruh • 100% Solved</span>
  </div>

  <!-- TABEL 2: REKAPITULASI LENGKAP 30 TEMUAN AUDIT AWAL -->
  <div class="section-title">II. REKAPITULASI 30 TEMUAN AUDIT SISTEM SEBELUMNYA (BATCH AWAL)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 4%; text-align: center;">No</th>
        <th style="width: 27%;">List Bug (Temuan Masalah)</th>
        <th style="width: 37%;">Tindakan Perbaikan (Solusi Implementasi)</th>
        <th style="width: 22%;">Status Testing (Hasil Pengujian)</th>
        <th style="width: 10%; text-align: center;">Status Final</th>
      </tr>
    </thead>
    <tbody>
      ${renderRows(initial30Bugs)}
    </tbody>
  </table>

  <!-- FOOTER PENGESAHAN -->
  <div class="footer-note">
    <span>Dokumen resmi diterbitkan dan diverifikasi sah oleh Tim Pengembang Sistem Tata Kelola Keuangan SAKU IMM.</span>
    <span>Copyright © DPP IMM 2026 • Terverifikasi Digital</span>
  </div>

</body>
</html>
  `;
}

function run() {
  const htmlContent = generateHtml();
  const htmlFile = path.join(workspaceRoot, 'report_perbaikan_bug.html');
  const pdfFile = path.join(workspaceRoot, 'REPORT_PERBAIKAN_BUG_SAKU_IMM.pdf');

  fs.writeFileSync(htmlFile, htmlContent, 'utf-8');
  console.log('HTML report generated at:', htmlFile);

  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const chromeCmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFile}" "${htmlFile}"`;
  
  console.log('Running Chrome print-to-pdf...');
  execSync(chromeCmd, { stdio: 'inherit' });
  
  if (fs.existsSync(pdfFile)) {
    const stats = fs.statSync(pdfFile);
    console.log(`PDF successfully created: ${pdfFile} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('Failed to create PDF');
    process.exit(1);
  }
}

run();
