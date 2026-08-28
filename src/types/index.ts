export type OrgLevel = 'PK' | 'PC' | 'DPD' | 'DPP';

export type UserRole = 'bendahara_umum' | 'tim_verifikasi_internal' | 'super_admin';

export type KategoriProker = 'Keagamaan' | 'Kemahasiswaan' | 'Kemasyarakatan';

export type JenisNominal = 'pemasukan' | 'pengeluaran';

export type JenisTransaksi = 'operasional' | 'inventaris';

export type UploadStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface User {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  organisasiId: string;
  organisasiNama: string;
  organisasiLevel: OrgLevel;
}

export interface Organisasi {
  id: string;
  nama: string;
  level: OrgLevel;
  parentId?: string;
  parentNama?: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface Bidang {
  id: string;
  nama: string;
  kode: string;
  isOfficial: boolean;
}

export interface ProgramKerja {
  id: string;
  bidangId: string;
  bidangNama: string;
  namaProker: string;
  kategori: KategoriProker;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  bidangId: string;
  bidangNama: string;
  programKerjaId: string;
  programKerjaNama: string;
  kategoriProker: KategoriProker;
  keterangan: string;
  jenisNominal: JenisNominal;
  nominal: number;
  jenisTransaksi: JenisTransaksi;
  buktiDriveFileId?: string;
  buktiDriveUrl?: string;
  uploadStatus: UploadStatus;
  organisasiNama: string;
  isDeleted?: boolean;
}

export interface AuditLog {
  id: string;
  transaksiId: string;
  actorNama: string;
  aksi: 'CREATE' | 'UPDATE' | 'SOFT_DELETE';
  waktu: string;
  keterangan: string;
}
