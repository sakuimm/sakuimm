import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel, AuditLog } from '../types';
import { storageService } from '../services/storageService';
import { User, ShieldCheck, History, Settings, Key, Mail, Building2, CheckCircle2, Lock, Save, Bell, Database } from 'lucide-react';

interface SettingsViewProps {
  userName: string;
  userRole: UserRole;
  userLevel: OrgLevel;
  onUpdateUser?: (name: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  userRole,
  userLevel,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'verifikasi' | 'log-activity' | 'keamanan'>('profil');
  const [nameInput, setNameInput] = useState(userName);
  const [emailInput, setEmailInput] = useState('bendahara@imm.or.id');
  const [orgInput, setOrgInput] = useState('PK IMM Teknik Mesin UI');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Security preferences states
  const [gdriveSync, setGdriveSync] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  useEffect(() => {
    setAuditLogs(storageService.getAuditLogs());
  }, [activeTab]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser(nameInput);
    }
    setToastMessage('Profil berhasil diperbarui!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'bendahara_umum': return 'Bendahara Umum (Full Access)';
      case 'tim_verifikasi_internal': return 'Tim Verifikasi Internal (Read-Only)';
      case 'super_admin': return 'Super Admin System';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Page Title & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Pengaturan Pengguna & Sistem</h2>
          <p className="text-xs text-slate-500">
            Manajemen Profil, Status Verifikasi Akun, Audit Log Activity, dan Keamanan
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('profil')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'profil'
                ? 'bg-[#7A0C1E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#7A0C1E]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profil Pengguna
          </button>
          <button
            onClick={() => setActiveTab('verifikasi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'verifikasi'
                ? 'bg-[#7A0C1E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#7A0C1E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi Akun
          </button>
          <button
            onClick={() => setActiveTab('log-activity')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'log-activity'
                ? 'bg-[#7A0C1E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#7A0C1E]'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Log Activity
          </button>
          <button
            onClick={() => setActiveTab('keamanan')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'keamanan'
                ? 'bg-[#7A0C1E] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#7A0C1E]'
            }`}
          >
            <Key className="w-3.5 h-3.5" /> Keamanan & Sync
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] font-bold text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* TAB 1: PROFIL PENGGUNA */}
      {activeTab === 'profil' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Card Showcase */}
          <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#7A0C1E] text-white font-black text-2xl flex items-center justify-center shadow-lg border-4 border-white">
              {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#2D3748]">{userName}</h3>
              <p className="text-xs text-slate-500 font-medium">{emailInput}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7A0C1E]/10 text-[#7A0C1E]">
                {getRoleBadge(userRole)}
              </span>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-xs text-left">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Level Pimpinan</span>
                <span className="font-bold text-[#2D3748]">Level {userLevel}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Organisasi</span>
                <span className="font-bold text-[#2D3748]">{orgInput}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status Akun</span>
                <span className="font-bold text-[#2E7D32] bg-[#2E7D32]/10 px-2 py-0.2 rounded-full text-[10px]">
                  Terverifikasi Active
                </span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#2D3748] pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-[#7A0C1E]" />
              <span>Edit Informasi Profil</span>
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Email Pengguna *
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Nama Pimpinan Organisasi
                  </label>
                  <input
                    type="text"
                    value={orgInput}
                    onChange={(e) => setOrgInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Peran / Akses Akun
                  </label>
                  <input
                    type="text"
                    value={getRoleBadge(userRole)}
                    disabled
                    className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#81B29A]" /> Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIKASI AKUN */}
      {activeTab === 'verifikasi' && (
        <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#2D3748] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#81B29A]" />
              <span>Status Verifikasi Akun Organisasi</span>
            </h3>
            <span className="px-3 py-1 bg-[#81B29A]/20 text-[#2D5A44] font-extrabold text-xs rounded-full">
              STATUS: TERVERIFIKASI RESMI
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#81B29A]/20 rounded-full text-[#2D5A44]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#2D3748]">Akun Pengelola Keuangan Terdaftar</h4>
                <p className="text-xs text-slate-500">
                  Akun ini telah mendapatkan pengesahan wewenang dari Pimpinan Induk (<span className="font-bold">KORKOM IMM Universitas Indonesia</span>).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">No. SK Pengesahan</span>
                <span className="font-extrabold text-[#2D3748]">SK-IMM/PK-TMUI/2026/042</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Tanggal Pengesahan</span>
                <span className="font-extrabold text-[#2D3748]">15 Januari 2026</span>
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block uppercase">Pemeriksa Wewenang</span>
                <span className="font-extrabold text-[#2D3748]">Ketua Umum KORKOM UI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOG ACTIVITY (AUDIT TRAIL LOGS) */}
      {activeTab === 'log-activity' && (
        <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-[#2D3748] flex items-center gap-2">
              <History className="w-5 h-5 text-[#F4A261]" />
              <span>Jejak Riwayat Aktivitas & Audit Log (Audit Trail Persisten)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">JSONB Snapshot Persisten</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Waktu (WIB)</th>
                  <th className="py-2.5 px-3">Pengguna / Actor</th>
                  <th className="py-2.5 px-3">Aksi</th>
                  <th className="py-2.5 px-3">Deskripsi Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-[#2D3748] whitespace-nowrap">{log.waktu}</td>
                    <td className="py-3 px-3 font-bold text-[#2D3748]">{log.actorNama}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#7A0C1E]/10 text-[#7A0C1E]">
                        {log.aksi}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{log.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: KEAMANAN & SYNC */}
      {activeTab === 'keamanan' && (
        <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-[#2D3748] pb-3 border-b border-slate-100 flex items-center gap-2">
            <Key className="w-5 h-5 text-[#7A0C1E]" />
            <span>Pengaturan Keamanan & Integrasi System</span>
          </h3>

          <div className="space-y-4 max-w-xl">
            {/* Toggle GDrive Sync */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="font-bold text-xs text-[#2D3748]">Sinkronisasi Otomatis Google Drive Queue</h4>
                <p className="text-[11px] text-slate-500 font-medium">Unggah foto nota digital secara latar belakang ke folder cloud drive</p>
              </div>
              <button
                onClick={() => setGdriveSync(!gdriveSync)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  gdriveSync ? 'bg-[#81B29A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    gdriveSync ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <h4 className="font-bold text-xs text-[#2D3748]">Notifikasi Email Laporan Keuangan</h4>
                <p className="text-[11px] text-slate-500 font-medium">Kirim rekapitulasi arus kas bulanan ke email pengguna</p>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  emailNotif ? 'bg-[#81B29A]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    emailNotif ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
