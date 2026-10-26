import { Transaksi, ProgramKerja, Organisasi, AuditLog, UserRole, OrgLevel } from '../types';
import { MOCK_TRANSAKSI, MOCK_PROKER, MOCK_ORGANISASI, MOCK_AUDIT_LOG } from '../data/mockData';

export const isDemoRoute = (): boolean => {
  return typeof window !== 'undefined' && window.location.pathname.startsWith('/demo');
};

const getKeys = () => {
  const isDemo = isDemoRoute();
  const prefix = isDemo ? 'sakuimm_demo_' : 'sakuimm_prod_';
  return {
    TRANSAKSI: `${prefix}transaksi_v1`,
    PROKER: `${prefix}proker_v1`,
    ORGANISASI: `${prefix}organisasi_v1`,
    AUDIT_LOG: `${prefix}audit_log_v1`,
    USER_SESSION: `${prefix}user_session_v1`,
    USER_PASSWORDS: `${prefix}user_passwords_v1`
  };
};

export const PROD_INITIAL_ORGANISASI: Organisasi[] = [
  { id: 'org-dpp', nama: 'DPP IMM (Dewan Pimpinan Pusat)', level: 'DPP', status: 'verified', email: 'dpp@imm.or.id' },
  { id: 'org-dpd', nama: 'DPD IMM DKI Jakarta', level: 'DPD', parentId: 'org-dpp', parentNama: 'DPP IMM (Dewan Pimpinan Pusat)', status: 'verified', email: 'dpd@imm.or.id' },
  { id: 'org-dpd-jatim', nama: 'DPD IMM Jawa Timur', level: 'DPD', parentId: 'org-dpp', parentNama: 'DPP IMM (Dewan Pimpinan Pusat)', status: 'verified', email: 'dpd.jatim@imm.or.id' },
  { id: 'org-pc', nama: 'PC IMM Jakarta Selatan', level: 'PC', parentId: 'org-dpd', parentNama: 'DPD IMM DKI Jakarta', status: 'verified', email: 'pc@imm.or.id' },
  { id: 'org-korkom', nama: 'KORKOM IMM Universitas Indonesia', level: 'KORKOM', parentId: 'org-pc', parentNama: 'PC IMM Jakarta Selatan', status: 'verified', email: 'korkom@imm.or.id' },
  { id: 'org-pk', nama: 'PK IMM Teknik Mesin Universitas Indonesia', level: 'PK', parentId: 'org-korkom', parentNama: 'KORKOM IMM Universitas Indonesia', status: 'verified', email: 'pk@imm.or.id' }
];

export interface UserSession {
  isLoggedIn: boolean;
  userRole: UserRole;
  currentLevel: OrgLevel;
  userName: string;
  userEmail: string;
  userOrgName?: string;
}

// Storage Service Wrapper for Local Persistence
export const storageService = {
  // Initialize default data if empty
  initData(): void {
    const keys = getKeys();
    const isDemo = isDemoRoute();

    if (!localStorage.getItem(keys.TRANSAKSI)) {
      localStorage.setItem(keys.TRANSAKSI, JSON.stringify(isDemo ? MOCK_TRANSAKSI : []));
    }
    if (!localStorage.getItem(keys.PROKER)) {
      localStorage.setItem(keys.PROKER, JSON.stringify(isDemo ? MOCK_PROKER : []));
    }
    if (!localStorage.getItem(keys.ORGANISASI)) {
      localStorage.setItem(keys.ORGANISASI, JSON.stringify(isDemo ? MOCK_ORGANISASI : PROD_INITIAL_ORGANISASI));
    }
    if (!localStorage.getItem(keys.AUDIT_LOG)) {
      localStorage.setItem(keys.AUDIT_LOG, JSON.stringify(isDemo ? MOCK_AUDIT_LOG : []));
    }
  },

  // Transaksi Handlers
  getTransaksiList(): Transaksi[] {
    this.initData();
    const keys = getKeys();
    try {
      const data = localStorage.getItem(keys.TRANSAKSI);
      return data ? JSON.parse(data) : (isDemoRoute() ? MOCK_TRANSAKSI : []);
    } catch {
      return isDemoRoute() ? MOCK_TRANSAKSI : [];
    }
  },

  saveTransaksiList(list: Transaksi[]): void {
    const keys = getKeys();
    localStorage.setItem(keys.TRANSAKSI, JSON.stringify(list));
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
      organisasiLevel: trx.organisasiLevel || 'PK',
      aksi: 'CREATE',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pencatatan ${trx.jenisNominal} Rp ${trx.nominal.toLocaleString('id-ID')} pada Proker "${trx.programKerjaNama}"`
    };
    this.addAuditLog(newAuditLog);

    return updated;
  },

  updateTransaksi(trx: Transaksi, actorNama: string): Transaksi[] {
    const current = this.getTransaksiList();
    const updated = current.map((t) => (t.id === trx.id ? { ...trx, statusRevisi: 'normal' as const } : t));
    this.saveTransaksiList(updated);

    this.addAuditLog({
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      transaksiId: trx.id,
      actorNama: `${actorNama} (${trx.organisasiNama})`,
      organisasiLevel: trx.organisasiLevel || 'PK',
      aksi: 'UPDATE',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pembaruan data transaksi "${trx.keterangan}" Rp ${trx.nominal.toLocaleString('id-ID')}`
    });

    return updated;
  },

  deleteTransaksi(id: string, actorNama: string): Transaksi[] {
    const current = this.getTransaksiList();
    const target = current.find((t) => t.id === id);
    const updated = current.filter((t) => t.id !== id);
    this.saveTransaksiList(updated);

    if (target) {
      this.addAuditLog({
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        transaksiId: id,
        actorNama,
        organisasiLevel: target.organisasiLevel || 'PK',
        aksi: 'DELETE',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Penghapusan permanen transaksi "${target.keterangan}" Rp ${target.nominal.toLocaleString('id-ID')}`
      });
    }

    return updated;
  },

  resubmitTransaksi(id: string, actorNama: string): Transaksi[] {
    const current = this.getTransaksiList();
    const target = current.find((t) => t.id === id);
    const updated = current.map((t) => (t.id === id ? { ...t, statusRevisi: 'disubmit_ulang' as const } : t));
    this.saveTransaksiList(updated);

    this.addAuditLog({
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      transaksiId: id,
      actorNama,
      organisasiLevel: target?.organisasiLevel || 'PK',
      aksi: 'RESUBMIT',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Submit ulang transaksi ID "${id}" pasca revisi`
    });

    return updated;
  },

  // Program Kerja Handlers
  getProkerList(): ProgramKerja[] {
    this.initData();
    const keys = getKeys();
    try {
      const data = localStorage.getItem(keys.PROKER);
      return data ? JSON.parse(data) : (isDemoRoute() ? MOCK_PROKER : []);
    } catch {
      return isDemoRoute() ? MOCK_PROKER : [];
    }
  },

  saveProkerList(list: ProgramKerja[]): void {
    const keys = getKeys();
    localStorage.setItem(keys.PROKER, JSON.stringify(list));
  },

  addProker(proker: ProgramKerja): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = [...current, proker];
    this.saveProkerList(updated);
    return updated;
  },

  updateProker(proker: ProgramKerja, actorNama?: string): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = current.map((p) => (p.id === proker.id ? proker : p));
    this.saveProkerList(updated);

    this.addAuditLog({
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      prokerId: proker.id,
      actorNama: actorNama || 'Pengurus IMM',
      aksi: 'UPDATE',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pembaruan data Program Kerja "${proker.namaProker}"`
    });

    return updated;
  },

  deleteProker(id: string, actorNama?: string): ProgramKerja[] {
    const current = this.getProkerList();
    const target = current.find((p) => p.id === id);
    
    // Proker yang sudah disubmit (Selesai) tidak bisa dihapus
    if (target?.statusLaporan === 'Selesai') {
      return current;
    }

    const updated = current.filter((p) => p.id !== id);
    this.saveProkerList(updated);

    // Cascade delete: Hapus seluruh transaksi yang terkait proker tersebut
    const currentTrx = this.getTransaksiList();
    const updatedTrx = currentTrx.filter((t) => t.programKerjaId !== id);
    this.saveTransaksiList(updatedTrx);

    if (target) {
      this.addAuditLog({
        id: `AL-${Math.floor(100 + Math.random() * 900)}`,
        prokerId: id,
        actorNama: actorNama || 'Pengurus IMM',
        aksi: 'DELETE',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Penghapusan Program Kerja "${target.namaProker}" beserta seluruh transaksi terkait`
      });
    }

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

  submitProkerLPJ(prokerId: string): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = current.map((p) => {
      if (p.id === prokerId) {
        return { ...p, statusLaporan: 'Selesai' as const };
      }
      return p;
    });
    this.saveProkerList(updated);
    return updated;
  },

  reopenProkerLPJ(prokerId: string, actorNama?: string): ProgramKerja[] {
    const current = this.getProkerList();
    const updated = current.map((p) => {
      if (p.id === prokerId) {
        return { ...p, statusLaporan: 'Belum' as const };
      }
      return p;
    });
    this.saveProkerList(updated);

    this.addAuditLog({
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      prokerId,
      actorNama: actorNama || 'Bendahara Umum',
      aksi: 'REOPEN_LPJ',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Penarikan kembali LPJ (Re-open) untuk proker ID "${prokerId}"`
    });

    return updated;
  },

  // Organisasi Handlers
  getOrganisasiList(): Organisasi[] {
    this.initData();
    const keys = getKeys();
    try {
      const data = localStorage.getItem(keys.ORGANISASI);
      return data ? JSON.parse(data) : (isDemoRoute() ? MOCK_ORGANISASI : PROD_INITIAL_ORGANISASI);
    } catch {
      return isDemoRoute() ? MOCK_ORGANISASI : PROD_INITIAL_ORGANISASI;
    }
  },

  saveOrganisasiList(list: Organisasi[]): void {
    const keys = getKeys();
    localStorage.setItem(keys.ORGANISASI, JSON.stringify(list));
  },

  addOrganisasi(org: Organisasi): Organisasi[] {
    const current = this.getOrganisasiList();
    const updated = [org, ...current];
    this.saveOrganisasiList(updated);

    // Auto-create Audit Log Entry
    const newAuditLog: AuditLog = {
      id: `AL-${Math.floor(100 + Math.random() * 900)}`,
      actorNama: `Pendaftar ${org.nama}`,
      aksi: 'REGISTER_ORG',
      waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      keterangan: `Pendaftaran organisasi baru level ${org.level}: "${org.nama}" dengan Induk "${org.parentNama || org.indukNama || '-'}"`
    };
    this.addAuditLog(newAuditLog);

    return updated;
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
    const keys = getKeys();
    try {
      const data = localStorage.getItem(keys.AUDIT_LOG);
      return data ? JSON.parse(data) : (isDemoRoute() ? MOCK_AUDIT_LOG : []);
    } catch {
      return isDemoRoute() ? MOCK_AUDIT_LOG : [];
    }
  },

  addAuditLog(entry: AuditLog): void {
    const keys = getKeys();
    const current = this.getAuditLogs();
    const updated = [entry, ...current];
    localStorage.setItem(keys.AUDIT_LOG, JSON.stringify(updated));
  },

  // User Session Handlers
  getUserSession(): UserSession | null {
    const keys = getKeys();
    try {
      const data = localStorage.getItem(keys.USER_SESSION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object' || !parsed.isLoggedIn) {
        return null;
      }
      return {
        isLoggedIn: true,
        userRole: parsed.userRole || 'bendahara_umum',
        currentLevel: parsed.currentLevel || 'PK',
        userName: (typeof parsed.userName === 'string' && parsed.userName.trim()) ? parsed.userName.trim() : 'Immawan Ahmad',
        userEmail: (typeof parsed.userEmail === 'string' && parsed.userEmail.trim()) ? parsed.userEmail.trim() : 'bendahara@imm.or.id',
        userOrgName: parsed.userOrgName || undefined
      };
    } catch {
      return null;
    }
  },

  saveUserSession(session: UserSession): void {
    const keys = getKeys();
    localStorage.setItem(keys.USER_SESSION, JSON.stringify(session));
  },

  clearUserSession(): void {
    const keys = getKeys();
    localStorage.removeItem(keys.USER_SESSION);
  },

  // Password Recovery & Management
  getUserPassword(email: string): string | null {
    const keys = getKeys();
    try {
      const raw = localStorage.getItem(keys.USER_PASSWORDS);
      if (!raw) return null;
      const map = JSON.parse(raw);
      return map[email.trim().toLowerCase()] || null;
    } catch {
      return null;
    }
  },

  updateUserPassword(email: string, newPassword: string): boolean {
    const keys = getKeys();
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const raw = localStorage.getItem(keys.USER_PASSWORDS);
      const map = raw ? JSON.parse(raw) : {};
      map[normalizedEmail] = newPassword;
      localStorage.setItem(keys.USER_PASSWORDS, JSON.stringify(map));

      // Also update matching organization in list if present
      const orgs = this.getOrganisasiList();
      const updatedOrgs = orgs.map((o) => {
        if (o.email?.toLowerCase() === normalizedEmail) {
          return { ...o, password: newPassword };
        }
        return o;
      });
      this.saveOrganisasiList(updatedOrgs);

      // Audit log entry for security traceability
      this.addAuditLog({
        id: `AL-RESET-${Math.floor(100 + Math.random() * 900)}`,
        actorNama: normalizedEmail,
        organisasiLevel: 'PK',
        aksi: 'UPDATE',
        waktu: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        keterangan: `Pengaturan ulang kata sandi (Reset Password) berhasil untuk akun: ${normalizedEmail}`
      });

      return true;
    } catch (err) {
      console.error('Failed to update password:', err);
      return false;
    }
  }
};
