import { Transaksi, ProgramKerja, Organisasi, AuditLog, UserRole, OrgLevel } from '../types';
import { storageService } from './storageService';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    nama: string;
    email: string;
    role: UserRole;
    organisasiId: string;
    level: OrgLevel;
  };
}

export interface RegisterOrgPayload {
  namaOrganisasi: string;
  level: OrgLevel;
  parentOrgId?: string;
  namaBendahara: string;
  email: string;
  password: string;
}

export interface DashboardSummaryResponse {
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
  totalPutaran: number;
  prokerCount: number;
  transaksiCount: number;
  isRollup: boolean;
}

export const apiService = {
  /**
   * POST /api/v1/auth/login
   */
  async login(email: string, _pass: string, role: UserRole, level: OrgLevel, name?: string): Promise<LoginResponse> {
    const user = {
      id: `usr-${Math.floor(100 + Math.random() * 900)}`,
      nama: name || 'Immawan Ahmad',
      email: email || 'bendahara@imm.or.id',
      role,
      organisasiId: `org-${level.toLowerCase()}-01`,
      level
    };

    const token = `jwt_sakuimm_${user.id}_${Date.now()}`;
    storageService.saveUserSession({
      isLoggedIn: true,
      userRole: role,
      currentLevel: level,
      userName: user.nama,
      userEmail: user.email
    });

    return {
      accessToken: token,
      user
    };
  },

  /**
   * POST /api/v1/organisasi/register
   * Registers a new organization with pending verification status
   */
  async registerOrganisasi(payload: RegisterOrgPayload): Promise<Organisasi> {
    const newOrg: Organisasi = {
      id: `ORG-${Math.floor(1000 + Math.random() * 9000)}`,
      nama: payload.namaOrganisasi,
      level: payload.level,
      status: 'pending',
      tanggalPendaftaran: new Date().toISOString().split('T')[0],
      indukNama: payload.parentOrgId || 'PIMPINAN INDUK'
    };

    const currentOrgs = storageService.getOrganisasiList();
    const updatedOrgs = [newOrg, ...currentOrgs];
    storageService.saveOrganisasiList(updatedOrgs);

    // Audit Log Entry
    storageService.addAuditLog({
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      actorNama: `${payload.namaBendahara} (${payload.namaOrganisasi})`,
      aksi: 'REGISTER_ORG',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pendaftaran organisasi baru level ${payload.level}: "${payload.namaOrganisasi}"`
    });

    return newOrg;
  },

  /**
   * PATCH /api/v1/organisasi/:id/verify
   */
  async verifyOrganisasi(id: string, verifierName: string): Promise<Organisasi[]> {
    const updated = storageService.verifyOrganisasi(id);
    const org = updated.find((o) => o.id === id);

    if (org) {
      storageService.addAuditLog({
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        actorNama: verifierName,
        aksi: 'VERIFY_ORG',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Persetujuan pengesahan organisasi "${org.nama}"`
      });
    }

    return updated;
  },

  /**
   * PATCH /api/v1/organisasi/:id/reject
   */
  async rejectOrganisasi(id: string, verifierName: string): Promise<Organisasi[]> {
    const updated = storageService.rejectOrganisasi(id);
    const org = updated.find((o) => o.id === id);

    if (org) {
      storageService.addAuditLog({
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        actorNama: verifierName,
        aksi: 'REJECT_ORG',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Penolakan pendaftaran organisasi "${org.nama}"`
      });
    }

    return updated;
  },

  /**
   * GET /api/v1/transaksi
   */
  async getTransaksi(): Promise<Transaksi[]> {
    return storageService.getTransaksiList();
  },

  /**
   * POST /api/v1/transaksi
   */
  async createTransaksi(trx: Transaksi, actorNama: string): Promise<Transaksi[]> {
    return storageService.addTransaksi(trx, actorNama);
  },

  /**
   * DELETE /api/v1/transaksi/:id (Soft Delete)
   */
  async softDeleteTransaksi(id: string, actorNama: string): Promise<Transaksi[]> {
    const current = storageService.getTransaksiList();
    const target = current.find((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    storageService.saveTransaksiList(updated);

    if (target) {
      storageService.addAuditLog({
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        transaksiId: id,
        actorNama,
        aksi: 'SOFT_DELETE',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Penghapusan transaksi (soft delete) "${target.keterangan}" Rp ${target.nominal.toLocaleString('id-ID')}`
      });
    }

    return updated;
  },

  /**
   * GET /api/v1/dashboard/summary (Simulates Dynamic Closure Table Roll-up Aggregation Query)
   */
  async getDashboardSummary(level: OrgLevel, isAggregateMode: boolean): Promise<DashboardSummaryResponse> {
    const transaksi = storageService.getTransaksiList();
    const prokers = storageService.getProkerList();

    const rawPemasukan = transaksi
      .filter((t) => t.jenisNominal === 'pemasukan')
      .reduce((sum, t) => sum + t.nominal, 0);

    const rawPengeluaran = transaksi
      .filter((t) => t.jenisNominal === 'pengeluaran')
      .reduce((sum, t) => sum + t.nominal, 0);

    // Roll-up Multiplier based on Closure Table ancestry depth
    const multiplier = isAggregateMode ? (level === 'DPP' ? 15 : level === 'DPD' ? 5 : 2) : 1;
    const pemasukan = rawPemasukan * multiplier;
    const pengeluaran = rawPengeluaran * multiplier;
    const saldo = pemasukan - pengeluaran;

    return {
      pemasukan,
      pengeluaran,
      saldo,
      totalPutaran: pemasukan + pengeluaran,
      prokerCount: prokers.length * (isAggregateMode ? 4 : 1),
      transaksiCount: transaksi.length * multiplier,
      isRollup: isAggregateMode
    };
  }
};
