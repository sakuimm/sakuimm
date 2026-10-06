import React from 'react';
import { UserRole, OrgLevel } from '../types';
import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  FileSpreadsheet,
  Settings,
  LogOut,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userLevel: OrgLevel;
  userName: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  userLevel,
  userName,
  onLogout
}) => {
  const [isInputOpen, setIsInputOpen] = React.useState(true);

  return (
    <aside className="w-64 bg-[#7A0C1E] text-white flex flex-col justify-between h-screen sticky top-0 shadow-xl border-r border-[#600917]">
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
            MENU UTAMA
          </div>

          {/* Beranda */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#81B29A]' : 'text-white/60'}`} />
            <span className="truncate">Beranda</span>
          </button>

          {/* Input Group Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsInputOpen(!isInputOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'buat-laporan' || activeTab === 'input-proker'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlusCircle className={`w-4 h-4 ${activeTab === 'buat-laporan' || activeTab === 'input-proker' ? 'text-[#81B29A]' : 'text-white/60'}`} />
                <span className="truncate">Input</span>
              </div>
              <span className="text-xs text-white/60">{isInputOpen ? '▾' : '▸'}</span>
            </button>

            {isInputOpen && (
              <div className="pl-6 space-y-1">
                <button
                  onClick={() => setActiveTab('buat-laporan')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'buat-laporan'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'buat-laporan' ? 'bg-[#81B29A]' : 'bg-white/40'}`} />
                  <span>Input Transaksi</span>
                </button>

                <button
                  onClick={() => setActiveTab('input-proker')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'input-proker'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'input-proker' ? 'bg-[#81B29A]' : 'bg-white/40'}`} />
                  <span>Input Program Kerja</span>
                </button>
              </div>
            )}
          </div>

          {/* Program Kerja */}
          <button
            onClick={() => setActiveTab('master-data')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'master-data'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FolderKanban className={`w-4 h-4 ${activeTab === 'master-data' ? 'text-[#81B29A]' : 'text-white/60'}`} />
            <span className="truncate">Program Kerja</span>
          </button>

          {/* Laporan Keuangan */}
          <button
            onClick={() => setActiveTab('laporan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'laporan'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${activeTab === 'laporan' ? 'text-[#81B29A]' : 'text-white/60'}`} />
            <span className="truncate">Laporan Keuangan</span>
          </button>

          {/* Pengaturan */}
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'pengaturan'
                ? 'bg-white/20 text-white font-bold shadow-xs'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeTab === 'pengaturan' ? 'text-[#81B29A]' : 'text-white/60'}`} />
            <span className="truncate">Pengaturan</span>
          </button>

          {/* Verification (Non-PK) */}
          {userLevel !== 'PK' && (
            <button
              onClick={() => setActiveTab('verifikasi')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'verifikasi'
                  ? 'bg-white/20 text-white font-bold shadow-xs'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCheck className={`w-4 h-4 ${activeTab === 'verifikasi' ? 'text-[#81B29A]' : 'text-white/60'}`} />
                <span className="truncate">Approval User & Organisasi</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#0097A7] text-white">
                1
              </span>
            </button>
          )}
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
            title="Keluar"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
