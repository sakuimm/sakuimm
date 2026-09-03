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
  const menuItems = [
    { id: 'buat-laporan', label: 'Buat Laporan Keuangan', icon: PlusCircle, isPrimaryFeature: true },
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'laporan', label: 'Laporan Keuangan', icon: FileSpreadsheet },
    { id: 'master-data', label: 'Program Kerja', icon: FolderKanban },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
    { id: 'verifikasi', label: 'Verifikasi Organisasi', icon: UserCheck, showBadge: true },
  ];

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
            Menu Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white font-bold shadow-xs'
                    : item.isPrimaryFeature
                    ? 'bg-white/10 text-white hover:bg-white/25 border border-white/20 font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive || item.isPrimaryFeature ? 'text-[#81B29A]' : 'text-white/60'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isPrimaryFeature && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-[#81B29A] text-[#2D3748]">
                    UTAMA
                  </span>
                )}
                {item.showBadge && !item.isPrimaryFeature && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#0097A7] text-white">
                    1
                  </span>
                )}
              </button>
            );
          })}
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
