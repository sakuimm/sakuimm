import { Bidang, Organisasi, ProgramKerja, Transaksi, AuditLog } from '../types';

// Seeder 22 Bidang Resmi IMM (Sesuai Hasil Wawancara User)
export const OFFICIAL_IMM_BIDANG: Bidang[] = [
  { id: 'b1', kode: 'ORG', nama: 'Organisasi', isOfficial: true },
  { id: 'b2', kode: 'KDR', nama: 'Kader', isOfficial: true },
  { id: 'b3', kode: 'HPKP', nama: 'Hikmah, Politik, dan Kebijakan Publik', isOfficial: true },
  { id: 'b4', kode: 'KPK', nama: 'Kajian dan Pengembangan Keilmuan', isOfficial: true },
  { id: 'b5', kode: 'RSTEK', nama: 'Riset dan Teknologi', isOfficial: true },
  { id: 'b6', kode: 'PBPA', nama: 'Pendidikan Bahasa dan Potensi Akademik', isOfficial: true },
  { id: 'b7', kode: 'PJPT', nama: 'Pengembangan Jaringan Perguruan Tinggi', isOfficial: true },
  { id: 'b8', kode: 'SPM', nama: 'Sosial dan Pemberdayaan Masyarakat', isOfficial: true },
  { id: 'b9', kode: 'EKW', nama: 'Ekonomi dan Kewirausahaan', isOfficial: true },
  { id: 'b10', kode: 'IMM', nama: 'Immawati', isOfficial: true },
  { id: 'b11', kode: 'TKK', nama: 'Tabligh dan Kajian Keislaman', isOfficial: true },
  { id: 'b12', kode: 'MED', nama: 'Media dan Komunikasi', isOfficial: true },
  { id: 'b13', kode: 'ORKEP', nama: 'Olahraga dan Kepemudaan', isOfficial: true },
  { id: 'b14', kode: 'SBP', nama: 'Seni, Budaya, dan Pariwisata', isOfficial: true },
  { id: 'b15', kode: 'LH', nama: 'Lingkungan Hidup', isOfficial: true },
  { id: 'b16', kode: 'KES', nama: 'Kesehatan', isOfficial: true },
  { id: 'b17', kode: 'MRT', nama: 'Maritim', isOfficial: true },
  { id: 'b18', kode: 'AGR', nama: 'Agraria', isOfficial: true },
  { id: 'b19', kode: 'HAM', nama: 'Hukum dan HAM', isOfficial: true },
  { id: 'b20', kode: 'BTN', nama: 'Buruh, Tani, dan Nelayan', isOfficial: true },
  { id: 'b21', kode: 'ESDM', nama: 'Energi dan Sumber Daya Mineral', isOfficial: true },
  { id: 'b22', kode: 'HLN', nama: 'Hubungan Luar Negeri', isOfficial: true }
];

export const MOCK_ORGANISASI: Organisasi[] = [
  { id: 'org-dpp', nama: 'DPP IMM (Dewan Pimpinan Pusat)', level: 'DPP', status: 'verified' },
  { id: 'org-dpd', nama: 'DPD IMM DKI Jakarta', level: 'DPD', parentId: 'org-dpp', parentNama: 'DPP IMM', status: 'verified' },
  { id: 'org-pc', nama: 'PC IMM Jakarta Selatan', level: 'PC', parentId: 'org-dpd', parentNama: 'DPD IMM DKI Jakarta', status: 'verified' },
  { id: 'org-korkom', nama: 'KORKOM IMM Universitas Indonesia', level: 'KORKOM', parentId: 'org-pc', parentNama: 'PC IMM Jakarta Selatan', status: 'verified' },
  { id: 'org-pk', nama: 'PK IMM Teknik Mesin Universitas Indonesia', level: 'PK', parentId: 'org-korkom', parentNama: 'KORKOM IMM Universitas Indonesia', status: 'verified' },
  { id: 'org-pending-1', nama: 'PK IMM Fakultas Hukum Universitas Pancasila', level: 'PK', parentId: 'org-korkom', parentNama: 'KORKOM IMM Universitas Indonesia', status: 'pending' },
];

export const MOCK_PROKER: ProgramKerja[] = [
  { id: 'pr-1', bidangId: 'b2', bidangNama: 'Kader', namaProker: 'Darul Arqam Dasar (DAD) XXVI', kategori: 'Kemahasiswaan' },
  { id: 'pr-2', bidangId: 'b11', bidangNama: 'Tabligh dan Kajian Keislaman', namaProker: 'Kajian Rutin Selasa Subuh', kategori: 'Keagamaan' },
  { id: 'pr-3', bidangId: 'b8', bidangNama: 'Sosial dan Pemberdayaan Masyarakat', namaProker: 'Bakti Sosial & Pengobatan Gratis', kategori: 'Kemasyarakatan' },
  { id: 'pr-4', bidangId: 'b9', bidangNama: 'Ekonomi dan Kewirausahaan', namaProker: 'Penjualan Merchandising IMM', kategori: 'Kemahasiswaan' },
  { id: 'pr-5', bidangId: 'b12', bidangNama: 'Media dan Komunikasi', namaProker: 'Pelatihan Desain & Website', kategori: 'Kemahasiswaan' },
];

export const MOCK_TRANSAKSI: Transaksi[] = [
  {
    id: 'TRX-1001',
    tanggal: '2026-08-25',
    bidangId: 'b2',
    bidangNama: 'Kader',
    programKerjaId: 'pr-1',
    programKerjaNama: 'Darul Arqam Dasar (DAD) XXVI',
    kategoriProker: 'Kemahasiswaan',
    keterangan: 'Penerimaan Biaya Pendaftaran Peserta DAD (25 Orang)',
    jenisNominal: 'pemasukan',
    nominal: 3750000,
    jenisTransaksi: 'operasional',
    buktiDriveFileId: '1AbCdEfGhIjKlMnOpQ',
    buktiDriveUrl: 'https://drive.google.com/file/d/sample-1',
    uploadStatus: 'COMPLETED',
    organisasiNama: 'PK IMM Teknik Mesin UI'
  },
  {
    id: 'TRX-1002',
    tanggal: '2026-08-26',
    bidangId: 'b2',
    bidangNama: 'Kader',
    programKerjaId: 'pr-1',
    programKerjaNama: 'Darul Arqam Dasar (DAD) XXVI',
    kategoriProker: 'Kemahasiswaan',
    keterangan: 'Sewa Gedung & Konsumsi Pemateri DAD Hari Ke-1',
    jenisNominal: 'pengeluaran',
    nominal: 1850000,
    jenisTransaksi: 'operasional',
    buktiDriveFileId: '2BcDeFgHiJkLmNoPqR',
    buktiDriveUrl: 'https://drive.google.com/file/d/sample-2',
    uploadStatus: 'COMPLETED',
    organisasiNama: 'PK IMM Teknik Mesin UI'
  },
  {
    id: 'TRX-1003',
    tanggal: '2026-08-27',
    bidangId: 'b11',
    bidangNama: 'Tabligh dan Kajian Keislaman',
    programKerjaId: 'pr-2',
    programKerjaNama: 'Kajian Rutin Selasa Subuh',
    kategoriProker: 'Keagamaan',
    keterangan: 'Honorarium Penceramah & Snack Peserta Kajian',
    jenisNominal: 'pengeluaran',
    nominal: 450000,
    jenisTransaksi: 'operasional',
    buktiDriveFileId: '3CdEfGhIjKlMnOpQrS',
    buktiDriveUrl: 'https://drive.google.com/file/d/sample-3',
    uploadStatus: 'COMPLETED',
    organisasiNama: 'PK IMM Teknik Mesin UI'
  },
  {
    id: 'TRX-1004',
    tanggal: '2026-08-27',
    bidangId: 'b9',
    bidangNama: 'Ekonomi dan Kewirausahaan',
    programKerjaId: 'pr-4',
    programKerjaNama: 'Penjualan Merchandising IMM',
    kategoriProker: 'Kemahasiswaan',
    keterangan: 'Hasil Penjualan Kaos & PDH IMM Batch 1',
    jenisNominal: 'pemasukan',
    nominal: 2400000,
    jenisTransaksi: 'operasional',
    buktiDriveFileId: '4DeFgHiJkLmNoPqRsT',
    buktiDriveUrl: 'https://drive.google.com/file/d/sample-4',
    uploadStatus: 'COMPLETED',
    organisasiNama: 'PK IMM Teknik Mesin UI'
  },
  {
    id: 'TRX-1005',
    tanggal: '2026-08-28',
    bidangId: 'b12',
    bidangNama: 'Media dan Komunikasi',
    programKerjaId: 'pr-5',
    programKerjaNama: 'Pelatihan Desain & Website',
    kategoriProker: 'Kemahasiswaan',
    keterangan: 'Pembelian Printer & Scanner Inventaris Sekretariat',
    jenisNominal: 'pengeluaran',
    nominal: 1200000,
    jenisTransaksi: 'inventaris',
    uploadStatus: 'PENDING',
    organisasiNama: 'PK IMM Teknik Mesin UI'
  }
];

export const MOCK_AUDIT_LOG: AuditLog[] = [
  {
    id: 'AL-101',
    transaksiId: 'TRX-1002',
    actorNama: 'Immawan Ahmad (Bendahara Umum)',
    aksi: 'CREATE',
    waktu: '2026-08-26 14:22:05',
    keterangan: 'Pencatatan transaksi baru sebesar Rp 1.850.000 (Pengeluaran DAD)'
  },
  {
    id: 'AL-102',
    transaksiId: 'TRX-1005',
    actorNama: 'Immawan Ahmad (Bendahara Umum)',
    aksi: 'CREATE',
    waktu: '2026-08-28 09:15:30',
    keterangan: 'Pencatatan inventaris baru printer & scanner (Bukti Drive PENDING)'
  }
];
