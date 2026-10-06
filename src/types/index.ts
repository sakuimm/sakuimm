export type OrgLevel = 'PK' | 'KORKOM' | 'PC' | 'DPD' | 'DPP';

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
  indukNama?: string;
  status: 'verified' | 'pending' | 'rejected';
  tanggalPendaftaran?: string;
  alasanPenolakan?: string;
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
  tanggalPelaksanaan?: string;
  statusLaporan?: 'Belum' | 'Selesai' | 'Revisi';
  penanggungJawab?: string;
  tanggalDibuat?: string;
  deskripsi?: string;
  targetAnggaran?: number;
  catatanRevisi?: string;
  organisasiLevel?: OrgLevel;
  organisasiNama?: string;
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
  organisasiLevel?: OrgLevel;
  isDeleted?: boolean;
  statusRevisi?: 'normal' | 'revisi_diminta' | 'disubmit_ulang';
  catatanRevisi?: string;
}

export interface AuditLog {
  id: string;
  transaksiId?: string;
  prokerId?: string;
  actorNama: string;
  organisasiLevel?: OrgLevel;
  aksi: 'CREATE' | 'UPDATE' | 'DELETE' | 'SOFT_DELETE' | 'RESUBMIT' | 'REGISTER_ORG' | 'VERIFY_ORG' | 'REJECT_ORG' | 'REOPEN_LPJ';
  waktu: string;
  keterangan: string;
}

export const ORG_LEVEL_ORDER: Record<OrgLevel, number> = {
  DPP: 1,
  DPD: 2,
  PC: 3,
  KORKOM: 4,
  PK: 5
};

export const getTargetChildLevel = (parentLevel: OrgLevel): OrgLevel | null => {
  switch (parentLevel) {
    case 'DPP': return 'DPD';
    case 'DPD': return 'PC';
    case 'PC': return 'KORKOM';
    case 'KORKOM': return 'PK';
    case 'PK': return null;
  }
};

export const getParentLevel = (childLevel: OrgLevel): OrgLevel | null => {
  switch (childLevel) {
    case 'PK': return 'KORKOM';
    case 'KORKOM': return 'PC';
    case 'PC': return 'DPD';
    case 'DPD': return 'DPP';
    case 'DPP': return null;
  }
};

