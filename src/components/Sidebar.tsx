import React from 'react';
import { UserRole, OrgLevel } from '../types';
import {
  LayoutDashboard,
  Receipt,
  FolderKanban,
  FileSpreadsheet,
  Building2,
  LogOut,
  ShieldCheck,
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
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'transaksi', label: 'Transaksi Harian', icon: Receipt },
    { id: 'master-data', label: 'Master Data (22 Bidang)', icon: FolderKanban },
    { id: 'laporan', label: 'Laporan & Ekspor', icon: FileSpreadsheet },
    { id: 'verifikasi', label: 'Verifikasi Organisasi', icon: UserCheck, showBadge: true },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <img src="/sakuimm-logo.png" alt="SAKU IMM Logo" className="h-10 object-contain" />
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2D3748] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#2D3748]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#81B29A]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.showBadge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F4A261]/20 text-[#9C5217]">
                    1
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-slate-100 bg-[#F8F9FA]/50">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#2D3748] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#2D3748] truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 capitalize truncate">
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
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
