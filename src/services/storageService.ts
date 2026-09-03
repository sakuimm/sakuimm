import { Transaksi, ProgramKerja, Organisasi, AuditLog, UserRole, OrgLevel } from '../types';
import { MOCK_TRANSAKSI, MOCK_PROKER, MOCK_ORGANISASI, MOCK_AUDIT_LOG } from '../data/mockData';

const KEYS = {
  TRANSAKSI: 'sakuimm_transaksi_v1',
  PROKER: 'sakuimm_proker_v1',
  ORGANISASI: 'sakuimm_organisasi_v1',
  AUDIT_LOG: 'sakuimm_audit_log_v1',
  USER_SESSION: 'sakuimm_user_session_v1'
};

export interface UserSession {
  isLoggedIn: boolean;
  userRole: UserRole;
  currentLevel: OrgLevel;
  userName: string;
  userEmail: string;
}

// Storage Service Wrapper for Local Persistence
export const storageService = {
  // Initialize default data if empty
  initData(): void {
    if (!localStorage.getItem(KEYS.TRANSAKSI)) {
      localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(MOCK_TRANSAKSI));
    }
    if (!localStorage.getItem(KEYS.PROKER)) {
      localStorage.setItem(KEYS.PROKER, JSON.stringify(MOCK_PROKER));
    }
    if (!localStorage.getItem(KEYS.ORGANISASI)) {
      localStorage.setItem(KEYS.ORGANISASI, JSON.stringify(MOCK_ORGANISASI));
    }
    if (!localStorage.getItem(KEYS.AUDIT_LOG)) {
      localStorage.setItem(KEYS.AUDIT_LOG, JSON.stringify(MOCK_AUDIT_LOG));
    }
  },

  // Transaksi Handlers
  getTransaksiList(): Transaksi[] {
    this.initData();
    try {
      const data = localStorage.getItem(KEYS.TRANSAKSI);
      return data ? JSON.parse(data) : MOCK_TRANSAKSI;
    } catch {
      return MOCK_TRANSAKSI;
    }
  },

  saveTransaksiList(list: Transaksi[]): void {
    localStorage.setItem(KEYS.TRANSAKSI, JSON.stringify(list));
  },

  addTransaksi(trx: Transaksi, actorNama: string): Transaksi[] {
    const current = this.getTransaksiList();
    const updated = [trx, ...current];
    this.saveTransaksiList(updated);

    // Auto-create Audit Log Entry
    const newAuditLog: AuditLog = {
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      transaksiId: trx.id,
      actorNama: `${actorNama} (${trx.organisasiNama})`,
      aksi: 'CREATE',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pencatatan ${trx.jenisNominal} Rp ${trx.nominal.toLocaleString('id-ID')} pada Proker "${trx.programKerjaNama}"`
    };
    this.addAuditLog(newAuditLog);

    return updated;
  },

  // Program Kerja Handlers
  getProkerList(): ProgramKerja[] {
    this.initData();
    try {
      const data = localStorage.getItem(KEYS.PROKER);
      return data ? JSON.parse(data) : MOCK_PROKER;
    } catch {
      return MOCK_PROKER;
    }
  },

  saveProkerList(list: ProgramKerja[]): void {
    localStorage.setItem(KEYS.PROKER, JSON.stringify(list));
  },

  addProker(proker: ProgramKerja): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = [...current, proker];
    this.saveProkerList(updated);
    return updated;
  },

  toggleProkerStatus(prokerId: string): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = current.map((p) => {
      if (p.id === prokerId) {
        const nextStatus: 'Belum' | 'Selesai' = p.statusLaporan === 'Selesai' ? 'Belum' : 'Selesai';
        return { ...p, statusLaporan: nextStatus };
      }
      return p;
    });
    this.saveProkerList(updated);
    return updated;
  },

  // Organisasi Handlers
  getOrganisasiList(): Organisasi[] {
    this.initData();
    try {
      const data = localStorage.getItem(KEYS.ORGANISASI);
      return data ? JSON.parse(data) : MOCK_ORGANISASI;
    } catch {
      return MOCK_ORGANISASI;
    }
  },

  saveOrganisasiList(list: Organisasi[]): void {
    localStorage.setItem(KEYS.ORGANISASI, JSON.stringify(list));
  },

  verifyOrganisasi(id: string): Organisasi[] {
    const current = this.getOrganisasiList();
    const updated = current.map((o) => (o.id === id ? { ...o, status: 'verified' as const } : o));
    this.saveOrganisasiList(updated);
    return updated;
  },

  rejectOrganisasi(id: string): Organisasi[] {
    const current = this.getOrganisasiList();
    const updated = current.map((o) => (o.id === id ? { ...o, status: 'rejected' as const } : o));
    this.saveOrganisasiList(updated);
    return updated;
  },

  // Audit Log Handlers
  getAuditLogs(): AuditLog[] {
    this.initData();
    try {
      const data = localStorage.getItem(KEYS.AUDIT_LOG);
      return data ? JSON.parse(data) : MOCK_AUDIT_LOG;
    } catch {
      return MOCK_AUDIT_LOG;
    }
  },

  addAuditLog(entry: AuditLog): void {
    const current = this.getAuditLogs();
    const updated = [entry, ...current];
    localStorage.setItem(KEYS.AUDIT_LOG, JSON.stringify(updated));
  },

  // User Session Handlers
  getUserSession(): UserSession | null {
    try {
      const data = localStorage.getItem(KEYS.USER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveUserSession(session: UserSession): void {
    localStorage.setItem(KEYS.USER_SESSION, JSON.stringify(session));
  },

  clearUserSession(): void {
    localStorage.removeItem(KEYS.USER_SESSION);
  }
};
