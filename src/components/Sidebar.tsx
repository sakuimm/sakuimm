import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  FolderPlus,
  FolderKanban,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userLevel: OrgLevel;
  userName: string;
  pendingVerificationCount?: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  userLevel,
  userName,
  pendingVerificationCount = 0,
  onLogout
}) => {
  const isInputChildActive = activeTab === 'input-transaksi' || activeTab === 'input-proker';
  const isProkerActive = activeTab === 'program-kerja' || activeTab === 'master-data';
  const [isInputOpen, setIsInputOpen] = useState(true);

  // Auto-expand Input group if one of its children is active
  useEffect(() => {
    if (isInputChildActive) {
      setIsInputOpen(true);
    }
  }, [isInputChildActive]);

  return (
    <aside className="w-64 bg-[#7A0C1E] text-white flex flex-col justify-between h-screen sticky top-0 shadow-xl border-r border-[#600917] select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-white/15 flex items-center justify-center">
          <div className="bg-white px-4 py-3.5 rounded-2xl shadow-lg border border-white/20 w-full flex items-center justify-center min-h-[72px]">
            <img src="/logosakuimmnew.png" alt="SAKU IMM Logo" className="h-11 md:h-12 w-auto max-w-full object-contain" />
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-white/50 uppercase tracking-wider">
            Menu Utama
          </div>

          {/* 1. Beranda */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#81B29A]' : 'text-white/60'}`} />
              <span className="truncate">Beranda</span>
            </div>
          </button>

          {/* 2. Menu Induk: Input (Expandable Group) */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsInputOpen(!isInputOpen);
                if (!isInputChildActive) {
                  setActiveTab('input-transaksi');
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isInputChildActive
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlusCircle className={`w-4 h-4 ${isInputChildActive ? 'text-[#81B29A]' : 'text-white/60'}`} />
                <span className="truncate">Input</span>
              </div>
              <div className="text-white/60">
                {isInputOpen ? (
                  <ChevronDown className="w-4 h-4 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform" />
                )}
              </div>
            </button>

            {/* Submenu Children (Input Transaksi & Input Program Kerja) */}
            {isInputOpen && (
              <div className="ml-4 pl-3 border-l-2 border-white/20 space-y-1 py-1 animate-fade-in">
                {/* Submenu 1: Input Transaksi */}
                <button
                  onClick={() => setActiveTab('input-transaksi')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'input-transaksi'
                      ? 'bg-white text-[#7A0C1E] font-black shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ReceiptText className={`w-3.5 h-3.5 ${activeTab === 'input-transaksi' ? 'text-[#7A0C1E]' : 'text-[#81B29A]'}`} />
                  <span className="truncate">Input Transaksi</span>
                </button>

                {/* Submenu 2: Input Program Kerja */}
                <button
                  onClick={() => setActiveTab('input-proker')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'input-proker'
                      ? 'bg-white text-[#7A0C1E] font-black shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FolderPlus className={`w-3.5 h-3.5 ${activeTab === 'input-proker' ? 'text-[#7A0C1E]' : 'text-[#81B29A]'}`} />
                  <span className="truncate">Input Program Kerja</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Program Kerja (Dedicated Menu) */}
          <button
            onClick={() => setActiveTab('program-kerja')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isProkerActive
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderKanban className={`w-4 h-4 ${isProkerActive ? 'text-[#81B29A]' : 'text-white/60'}`} />
              <span className="truncate">Program Kerja</span>
            </div>
          </button>

          {/* 4. Laporan Keuangan */}
          <button
            onClick={() => setActiveTab('laporan')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'laporan'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className={`w-4 h-4 ${activeTab === 'laporan' ? 'text-[#81B29A]' : 'text-white/60'}`} />
              <span className="truncate">Laporan Keuangan</span>
            </div>
          </button>

          {/* 4. Pengaturan */}
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'pengaturan' || activeTab === 'verifikasi'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className={`w-4 h-4 ${activeTab === 'pengaturan' || activeTab === 'verifikasi' ? 'text-[#81B29A]' : 'text-white/60'}`} />
              <span className="truncate">Pengaturan</span>
            </div>
            {Boolean(pendingVerificationCount && pendingVerificationCount > 0) && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#0097A7] text-white">
                {pendingVerificationCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-white/15 bg-[#600917]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/20">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-white text-[#7A0C1E] font-black text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-white/70 capitalize truncate">
                {userRole === 'bendahara_umum'
                  ? 'Bendahara Umum'
                  : userRole === 'tim_verifikasi_internal'
                  ? 'Tim Verifikasi'
                  : 'Super Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Keluar dari Aplikasi SAKU IMM"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/15 rounded-lg transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
