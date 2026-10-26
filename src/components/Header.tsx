import React from 'react';
import { OrgLevel } from '../types';
import { Building2, Layers, Filter, Menu, Calendar } from 'lucide-react';

interface HeaderProps {
  currentLevel: OrgLevel;
  isAggregateMode: boolean;
  setIsAggregateMode: (mode: boolean) => void;
  currentOrgName: string;
  selectedBulan?: string;
  selectedTahun?: string;
  onBulanChange?: (bulan: string) => void;
  onTahunChange?: (tahun: string) => void;
  // Backward compatibility
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  isAggregateMode,
  setIsAggregateMode,
  currentOrgName,
  selectedBulan = 'ALL',
  selectedTahun = '2026',
  onBulanChange,
  onTahunChange,
  onToggleMobileMenu,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-20 shadow-xs gap-3">
      {/* Left: Mobile Toggle & Organization Title Badge */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#7A0C1E] md:hidden transition-colors flex-shrink-0"
          title="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Org Title & Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2D3748]/5 border border-slate-200 rounded-xl min-w-0">
          <Building2 className="w-4 h-4 text-[#2D3748] flex-shrink-0" />
          <span className="text-xs font-bold text-[#2D3748] truncate max-w-[140px] sm:max-w-[240px] md:max-w-none">
            {currentOrgName}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2D3748] text-white flex-shrink-0">
            Level {currentLevel}
          </span>
        </div>
      </div>

      {/* Right Controls: Aggregate Toggle, BCA Co-Branding, and Interactive Calendar Filter */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
        {/* Aggregate Mode Toggle (DPD / DPP / PC / KORKOM) */}
        {(currentLevel === 'DPD' || currentLevel === 'DPP' || currentLevel === 'PC' || currentLevel === 'KORKOM') && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-[#F4A261] flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">Mode Agregat:</span>
            <button
              onClick={() => setIsAggregateMode(!isAggregateMode)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAggregateMode ? 'bg-[#81B29A]' : 'bg-slate-300'
              }`}
              title="Toggle Mode Agregat Roll-up"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAggregateMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-[11px] font-bold text-[#2D3748]">
              {isAggregateMode ? 'AKTIF' : 'MANDIRI'}
            </span>
          </div>
        )}

        {/* Official BCA Syariah Co-Branding Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-xl shadow-xs">
          <img src="/bca-syariah-cobranding.png" alt="BCA Syariah x SAKU IMM" className="h-7 md:h-8 object-contain" />
        </div>

        {/* Dual Filter: Bulan dan Tahun */}
        <div className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-slate-700 hover:border-[#7A0C1E]/40 transition-colors shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#7A0C1E] flex-shrink-0" />
          
          {/* Filter Bulan */}
          <select
            value={selectedBulan}
            onChange={(e) => onBulanChange && onBulanChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#2D3748] focus:outline-none cursor-pointer"
            title="Pilih Filter Bulan"
          >
            <option value="ALL">Semua Bulan</option>
            <option value="1">Januari</option>
            <option value="2">Februari</option>
            <option value="3">Maret</option>
            <option value="4">April</option>
            <option value="5">Mei</option>
            <option value="6">Juni</option>
            <option value="7">Juli</option>
            <option value="8">Agustus</option>
            <option value="9">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>

          <span className="text-slate-300 font-normal">/</span>

          {/* Filter Tahun */}
          <select
            value={selectedTahun}
            onChange={(e) => onTahunChange && onTahunChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#2D3748] focus:outline-none cursor-pointer"
            title="Pilih Filter Tahun"
          >
            <option value="ALL">Semua Tahun</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>
    </header>
  );
};
