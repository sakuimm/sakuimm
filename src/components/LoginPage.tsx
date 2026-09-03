import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel } from '../types';
import { RegisterOrganizationModal } from './RegisterOrganizationModal';
import { ShieldCheck, Lock, Mail, ArrowRight, Camera, CheckCircle2, FileCheck, Eye, EyeOff, User, Layers, RefreshCw, Building2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, level: OrgLevel, email: string, name: string) => void;
  onRegisterOrgSuccess?: (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterOrgSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('bendahara@imm.or.id');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('bendahara_umum');
  const [level, setLevel] = useState<OrgLevel>('PK');
  const [nama, setNama] = useState('Immawan Ahmad');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showRegisterOrgModal, setShowRegisterOrgModal] = useState(false);

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

  const uspSlides = [
    {
      title: "Transparan",
      tagline: "Akuntabilitas & Visibilitas Keuangan Real-Time",
      desc: "Sistem pencatatan keuangan otonom terintegrasi dengan visibilitas transparan dari Komisariat (PK), Cabang (PC), Daerah (DPD), hingga Pusat (DPP).",
      icon: ShieldCheck,
      cardTitle: "Kas Organisasi Transparan",
      cardValue: "Rp 28.450.000",
      cardSub: "Visibilitas 360° Real-time"
    },
    {
      title: "Akuntabel",
      tagline: "Pencatatan Nota Digital & Jejak Audit Terverifikasi",
      desc: "Digitalisasi kwitansi otomatis dengan stempel watermark resmi Sharp Pipe, snapshot Audit Trail JSONB, serta wewenang kontrol hak akses yang tegas.",
      icon: FileCheck,
      cardTitle: "Nota & Audit Trail",
      cardValue: "100% Verified",
      cardSub: "Enforced RBAC & Watermark"
    },
    {
      title: "Berkelanjutan",
      tagline: "Tata Kelola Kas Organisasi Terstruktur & Modern",
      desc: "Mendukung keberlanjutan program kerja organisasi IMM antar-generasi kepengurusan dengan pengelolaan arsip keuangan terdigitalisasi.",
      icon: RefreshCw,
      cardTitle: "Tata Kelola Berkelanjutan",
      cardValue: "22 Bidang Resmi",
      cardSub: "Integrasi Laporan & Proker"
    }
  ];

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
          <div className="my-auto py-6 max-w-md w-full mx-auto space-y-5">
            {/* Sign In vs Sign Up Segmented Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-[#7A0C1E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#7A0C1E]'
                }`}
              >
                Sign In (Masuk)
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#7A0C1E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#7A0C1E]'
                }`}
              >
                Sign Up (Daftar Akun)
              </button>
            </div>

            <div className="text-center space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#7A0C1E] tracking-tight">
                {authMode === 'signin' ? 'Selamat Datang Kembali' : 'Pendaftaran Akun Baru'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {authMode === 'signin'
                  ? 'Masukkan email dan kata sandi Anda untuk mengakses SAKU IMM.'
                  : 'Lengkapi data pimpinan & peran untuk mendaftar akun baru.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sign Up Only Inputs: Level, Role, Name */}
              {authMode === 'signup' && (
                <>
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

                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Nama Lengkap Pengguna *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                        placeholder="Contoh: Immawan Ahmad"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Both Sign In & Sign Up: Email Address */}
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

              {/* Both Sign In & Sign Up: Password */}
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
                <span>{authMode === 'signin' ? 'Masuk ke Dashboard IMM' : 'Daftar & Masuk ke Dashboard'}</span>
                <ArrowRight className="w-4 h-4 text-[#81B29A]" />
              </button>

              {/* Register New Organization Trigger Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowRegisterOrgModal(true)}
                  className="text-xs text-[#7A0C1E] hover:underline font-bold flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Building2 className="w-4 h-4 text-[#81B29A]" />
                  <span>Belum Terdaftar? Daftarkan Organisasi Baru (PK/PC/DPD)</span>
                </button>
              </div>
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

        {/* LAYOUT KANAN: Feature Showcase & Interactive USP 3-Slide Slider */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#7A0C1E] via-[#600917] to-[#4A0712] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#0097A7_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* SLIDE CONTENT DISPLAY */}
          <div className="relative z-10 space-y-4 my-auto py-4 min-h-[380px] flex flex-col justify-between transition-all duration-500">
            {uspSlides.map((slide, idx) => {
              if (activeSlide !== idx) return null;
              const SlideIcon = slide.icon;
              return (
                <div key={idx} className="space-y-4 animate-fadeIn">
                  {/* USP Badge Header */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-[#0097A7]">
                    <span>USP #{idx + 1}</span>
                    <span>•</span>
                    <span className="text-white">{slide.title}</span>
                  </div>

                  {/* Floating Card Stack */}
                  <div className="space-y-3 pt-2">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl max-w-xs transform -rotate-1 transition-all">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">{slide.cardTitle}</span>
                        <span className="text-[10px] font-extrabold text-[#0097A7] bg-[#0097A7]/20 px-2 py-0.5 rounded-full">SAKU IMM</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="w-11 h-11 rounded-full border-4 border-[#0097A7] border-t-[#2E7D32] flex items-center justify-center font-bold text-xs">
                          <SlideIcon className="w-5 h-5 text-[#0097A7]" />
                        </div>
                        <div>
                          <div className="text-base font-extrabold text-white">{slide.cardValue}</div>
                          <div className="text-[10px] text-slate-200 mt-0.5">{slide.cardSub}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Description */}
                  <div className="pt-4 space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                      {slide.title} — <span className="text-[#0097A7]">{slide.tagline}</span>
                    </h2>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INTERACTIVE 3-BAR SLIDER INDICATOR */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2">
              {uspSlides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full flex-1 transition-all duration-500 cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                    activeSlide === idx
                      ? 'bg-[#0097A7] shadow-md text-white'
                      : 'bg-white/20 hover:bg-white/40 text-slate-300'
                  }`}
                  title={`USP: ${slide.title}`}
                >
                  {slide.title}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* REGISTER ORGANIZATION MODAL */}
      {showRegisterOrgModal && (
        <RegisterOrganizationModal
          onClose={() => setShowRegisterOrgModal(false)}
          onRegisterSuccess={(namaOrg, lvl, emailBendahara, namaBendahara) => {
            setShowRegisterOrgModal(false);
            if (onRegisterOrgSuccess) {
              onRegisterOrgSuccess(namaOrg, lvl, emailBendahara, namaBendahara);
            }
          }}
        />
      )}
    </div>
  );
};
