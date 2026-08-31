import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel } from '../types';
import { ShieldCheck, Lock, Mail, ArrowRight, Layers, Camera, CheckCircle2, FileCheck, Eye, EyeOff, FileText, Database, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, level: OrgLevel, email: string, name: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('bendahara@imm.or.id');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('bendahara_umum');
  const [level, setLevel] = useState<OrgLevel>('PK');
  const [nama, setNama] = useState('Immawan Ahmad');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide carousel interval every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, level, email, nama);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col justify-center items-center p-4 md:p-8 font-sans">
      {/* Main 2-Grid Split Card */}
      <div className="w-full max-w-6xl bg-white rounded-[28px] shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        
        {/* LAYOUT KIRI: Clean Form Panel (6 Cols on Desktop) */}
        <div className="lg:col-span-6 bg-white p-8 md:p-12 flex flex-col justify-between">
          {/* Top Brand Logo & Co-Branding Badge */}
          <div className="flex items-center justify-between">
            <img src="/logosakuimmnew.png" alt="SAKU IMM Logo" className="h-10 md:h-11 object-contain" />
            <img src="/bca-syariah-logo.png" alt="BCA Syariah Logo" className="h-7 md:h-8 object-contain" />
          </div>

          {/* Middle Form Area */}
          <div className="my-auto py-6 max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#7A0C1E] tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                Masuk ke sistem pencatatan keuangan IMM dengan memilih level & peran akun Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Level Organisasi Segmented Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Level Organisasi Pimpinan *
                </label>
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl">
                  {(['PK', 'KORKOM', 'PC', 'DPD', 'DPP'] as OrgLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                        level === lvl
                          ? 'bg-[#7A0C1E] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Peran Pengguna (Role Dropdown) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Peran Pengguna (Role) *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                >
                  <option value="bendahara_umum">Bendahara Umum (Full Access Input & Edit)</option>
                  <option value="tim_verifikasi_internal">Tim Verifikasi Internal (Read-Only Mode)</option>
                  <option value="super_admin">Super Admin System (Verifikasi Induk)</option>
                </select>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Pengguna *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                    placeholder="nama@imm.or.id"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <span>Masuk ke Dashboard IMM</span>
                <ArrowRight className="w-4 h-4 text-[#81B29A]" />
              </button>
            </form>
          </div>

          {/* Footer Copyright */}
          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>Copyright © 2026 IMM Finance • Rights Reserved</span>
            <div className="flex gap-3">
              <a href="#terms" className="hover:text-slate-600">Syarat & Ketentuan</a>
              <span>•</span>
              <a href="#privacy" className="hover:text-slate-600">Kebijakan Privasi</a>
            </div>
          </div>
        </div>

        {/* LAYOUT KANAN: Feature Showcase & Interactive 3-Slide Slider (6 Cols on Desktop) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#7A0C1E] via-[#600917] to-[#4A0712] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0097A7_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* SLIDE CONTENT DISPLAY */}
          <div className="relative z-10 space-y-4 my-auto py-4 min-h-[380px] flex flex-col justify-between transition-all duration-500">
            
            {/* SLIDE 0: Multi-Tenant 4 Level & Agregat Roll-up */}
            {activeSlide === 0 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Floating Cards Stack */}
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl max-w-xs transform -rotate-1 transition-all">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Ringkasan Saldo Kas</span>
                      <span className="text-[10px] font-extrabold text-[#0097A7] bg-[#0097A7]/20 px-2 py-0.5 rounded-full">Bulan Ini</span>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="w-11 h-11 rounded-full border-4 border-[#0097A7] border-t-[#2E7D32] flex items-center justify-center font-bold text-xs">
                        78%
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-white">Rp 28.450.000</div>
                        <div className="text-[10px] text-slate-200 mt-0.5">Kas Utama • 22 Bidang IMM</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 shadow-xl max-w-xs ml-auto transform rotate-2 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold text-[#0097A7] uppercase tracking-wider">Target Proker</span>
                      <span className="text-[10px] text-slate-200">25 Agu 2026</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Darul Arqam Dasar (DAD) XXVI</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-200 mt-2">
                      <span>Realisasi Dana</span>
                      <span className="font-bold text-[#0097A7]">Rp 12.500.000 <span className="text-slate-300 font-normal">/ 15M</span></span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div className="bg-[#0097A7] h-1.5 rounded-full" style={{ width: '83%' }} />
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div className="pt-4 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0097A7] text-white flex items-center justify-center shadow-md mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                    Pusat Terpadu Pencatatan & Pelaporan Keuangan IMM Transparan
                  </h2>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Sistem manajemen keuangan otonom terintegrasi dari Komisariat (PK), Cabang (PC), Daerah (DPD), hingga Pusat (DPP) dengan visibilitas agregat 360 derajat.
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 1: Digitalisasi Nota & Google Drive Watermarking */}
            {activeSlide === 1 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Floating Cards Stack */}
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl max-w-xs transform rotate-1 transition-all">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#0097A7]" /> Pencatatan Nota Digital
                      </span>
                      <span className="text-[9px] font-bold text-[#0097A7] bg-[#0097A7]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Drive Ready
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-white mt-2">Rp 2.400.000 <span className="text-[10px] font-bold text-[#0097A7]">+12%</span></div>
                    <div className="text-[10px] text-slate-200">Penjualan Merchandising IMM Batch 1</div>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 shadow-xl max-w-xs ml-auto transform -rotate-2 transition-all">
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="font-extrabold text-[#0097A7] uppercase tracking-wider">Sharp Pipe Watermark</span>
                      <span className="text-slate-200">Resmi IMM</span>
                    </div>
                    <div className="p-2 bg-[#600917]/80 rounded-lg border border-white/10 text-[10px] font-mono text-slate-100">
                      PROPERTI IMM - PK MESIN UI - 2026
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div className="pt-4 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0097A7] text-white flex items-center justify-center shadow-md mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                    Pencatatan Nota Digital & Watermarking Otomatis
                  </h2>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Kemudahan foto bukti kwitansi langsung via smartphone dengan kompresi otomatis dan stempel watermark resmi yang tersinkronisasi ke Google Drive Queue.
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 2: Audit Trail JSONB & Strict Role Access (RBAC) */}
            {activeSlide === 2 && (
              <div className="space-y-4 animate-fadeIn">
                {/* Floating Cards Stack */}
                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl max-w-xs transform -rotate-1 transition-all">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px]">
                      <span className="font-extrabold text-[#0097A7] uppercase tracking-wider">Control Hak Akses RBAC</span>
                      <span className="text-slate-200">Enforced</span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-100">Bendahara Umum</span>
                        <span className="font-bold text-[#0097A7] text-[10px]">Full Access</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-100">Tim Verifikasi</span>
                        <span className="font-bold text-[#C05621] text-[10px]">Read-Only</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 shadow-xl max-w-xs ml-auto transform rotate-1 transition-all">
                    <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                      <FileCheck className="w-3.5 h-3.5 text-[#0097A7]" /> Audit Trail JSONB Log
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg text-[9px] font-mono text-slate-200 truncate">
                      {`{ "data_before": {...}, "data_after": {...} }`}
                    </div>
                  </div>
                </div>

                {/* Text Description */}
                <div className="pt-4 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0097A7] text-white flex items-center justify-center shadow-md mb-2">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
                    Transparansi Audit Trail & Kontrol Hak Akses Ketat
                  </h2>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Pencatatan riwayat perubahan data berbasis snapshot JSONB serta pemisahan wewenang yang tegas antara pengelola kas dan tim verifikator.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* INTERACTIVE 3-BAR SLIDER INDICATOR */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2 rounded-full flex-1 transition-all duration-500 cursor-pointer ${
                    activeSlide === idx
                      ? 'bg-[#0097A7] shadow-md'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Pergi ke Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
