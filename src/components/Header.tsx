import React from 'react';
import { OrgLevel } from '../types';
import { Building2, Layers, Filter } from 'lucide-react';

interface HeaderProps {
  currentLevel: OrgLevel;
  setCurrentLevel: (level: OrgLevel) => void;
  isAggregateMode: boolean;
  setIsAggregateMode: (mode: boolean) => void;
  currentOrgName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  setCurrentLevel,
  isAggregateMode,
  setIsAggregateMode,
  currentOrgName,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      {/* Left: Organization Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2D3748]/5 border border-slate-200 rounded-lg">
          <Building2 className="w-4 h-4 text-[#2D3748]" />
          <span className="text-xs font-bold text-[#2D3748]">{currentOrgName}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#2D3748] text-white">
            Level {currentLevel}
          </span>
        </div>

        {/* Level Switcher Demo Buttons */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <span className="text-[11px] font-semibold text-slate-400 px-2">Switch Level:</span>
          {(['PK', 'KORKOM', 'PC', 'DPD', 'DPP'] as OrgLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setCurrentLevel(lvl)}
              className={`px-2.5 py-1 font-semibold rounded-md transition-all ${
                currentLevel === lvl
                  ? 'bg-white text-[#2D3748] shadow-xs'
                  : 'text-slate-500 hover:text-[#2D3748]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Aggregate Mode Toggle (DPD / DPP / PC / KORKOM) */}
      <div className="flex items-center gap-4">
        {(currentLevel === 'DPD' || currentLevel === 'DPP' || currentLevel === 'PC' || currentLevel === 'KORKOM') && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Layers className="w-4 h-4 text-[#F4A261]" />
            <span className="text-xs font-semibold text-slate-600">Mode Agregat Turunan:</span>
            <button
              onClick={() => setIsAggregateMode(!isAggregateMode)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAggregateMode ? 'bg-[#81B29A]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAggregateMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-[#2D3748]">
              {isAggregateMode ? 'AKTIF (Roll-up)' : 'NONAKTIF (Mandiri)'}
            </span>
          </div>
        )}

        {/* Official BCA Syariah Co-Branding Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
          <img src="/bca-syariah-logo.png" alt="BCA Syariah Logo" className="h-6 md:h-7 object-contain" />
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Agustus 2026</span>
        </div>
      </div>
    </header>
  );
};
