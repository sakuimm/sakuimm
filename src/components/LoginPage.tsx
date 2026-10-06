import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel } from '../types';
import { RegisterOrganizationModal } from './RegisterOrganizationModal';
import { isDemoRoute } from '../services/storageService';
import { ShieldCheck, Lock, Mail, ArrowRight, Camera, CheckCircle2, FileCheck, Eye, EyeOff, User, Layers, RefreshCw, Building2, FlaskConical } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, level: OrgLevel, email: string, name: string) => void;
  onRegisterOrgSuccess?: (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterOrgSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isSignupSubmitted, setIsSignupSubmitted] = useState(false);
  const [email, setEmail] = useState('bendahara@imm.or.id');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('bendahara_umum');
  const [level, setLevel] = useState<OrgLevel>('PK');
  const [nama, setNama] = useState('Immawan Ahmad');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showRegisterOrgModal, setShowRegisterOrgModal] = useState(false);

  // Read configured credentials from .env for all 5 IMM Leadership Levels
  const dppEmail = import.meta.env.VITE_CREDENTIALS_DPP_EMAIL || 'dpp@imm.or.id';
  const dppPass = import.meta.env.VITE_CREDENTIALS_DPP_PASSWORD || 'admin123';
  const dppName = import.meta.env.VITE_CREDENTIALS_DPP_NAME || 'Pimpinan Pusat (DPP IMM)';
  const dppRole = (import.meta.env.VITE_CREDENTIALS_DPP_ROLE as UserRole) || 'super_admin';
  const dppLevel = (import.meta.env.VITE_CREDENTIALS_DPP_LEVEL as OrgLevel) || 'DPP';

  const dpdEmail = import.meta.env.VITE_CREDENTIALS_DPD_EMAIL || 'dpd@imm.or.id';
  const dpdPass = import.meta.env.VITE_CREDENTIALS_DPD_PASSWORD || 'dpd123';
  const dpdName = import.meta.env.VITE_CREDENTIALS_DPD_NAME || 'Pimpinan Daerah (DPD IMM DKI Jakarta)';
  const dpdRole = (import.meta.env.VITE_CREDENTIALS_DPD_ROLE as UserRole) || 'bendahara_umum';
  const dpdLevel = (import.meta.env.VITE_CREDENTIALS_DPD_LEVEL as OrgLevel) || 'DPD';

  const pcEmail = import.meta.env.VITE_CREDENTIALS_PC_EMAIL || 'pc@imm.or.id';
  const pcPass = import.meta.env.VITE_CREDENTIALS_PC_PASSWORD || 'pc123';
  const pcName = import.meta.env.VITE_CREDENTIALS_PC_NAME || 'Pimpinan Cabang (PC IMM Jakarta Selatan)';
  const pcRole = (import.meta.env.VITE_CREDENTIALS_PC_ROLE as UserRole) || 'tim_verifikasi_internal';
  const pcLevel = (import.meta.env.VITE_CREDENTIALS_PC_LEVEL as OrgLevel) || 'PC';

  const korkomEmail = import.meta.env.VITE_CREDENTIALS_KORKOM_EMAIL || 'korkom@imm.or.id';
  const korkomPass = import.meta.env.VITE_CREDENTIALS_KORKOM_PASSWORD || 'korkom123';
  const korkomName = import.meta.env.VITE_CREDENTIALS_KORKOM_NAME || 'Koordinator Komisariat (KORKOM IMM UI)';
  const korkomRole = (import.meta.env.VITE_CREDENTIALS_KORKOM_ROLE as UserRole) || 'bendahara_umum';
  const korkomLevel = (import.meta.env.VITE_CREDENTIALS_KORKOM_LEVEL as OrgLevel) || 'KORKOM';

  const pkEmail = import.meta.env.VITE_CREDENTIALS_PK_EMAIL || 'pk@imm.or.id';
  const pkPass = import.meta.env.VITE_CREDENTIALS_PK_PASSWORD || 'pk123';
  const pkName = import.meta.env.VITE_CREDENTIALS_PK_NAME || 'Pimpinan Komisariat (PK IMM Teknik Mesin UI)';
  const pkRole = (import.meta.env.VITE_CREDENTIALS_PK_ROLE as UserRole) || 'bendahara_umum';
  const pkLevel = (import.meta.env.VITE_CREDENTIALS_PK_LEVEL as OrgLevel) || 'PK';

  // Backward Compatibility Credentials
  const bendaharaEmail = import.meta.env.VITE_CREDENTIALS_BENDAHARA_EMAIL || 'bendahara@imm.or.id';
  const bendaharaPass = import.meta.env.VITE_CREDENTIALS_BENDAHARA_PASSWORD || 'password123';
  const bendaharaName = import.meta.env.VITE_CREDENTIALS_BENDAHARA_NAME || 'Immawan Ahmad (Bendahara Umum)';
  const bendaharaRole = (import.meta.env.VITE_CREDENTIALS_BENDAHARA_ROLE as UserRole) || 'bendahara_umum';
  const bendaharaLevel = (import.meta.env.VITE_CREDENTIALS_BENDAHARA_LEVEL as OrgLevel) || 'PK';

  const verifikasiEmail = import.meta.env.VITE_CREDENTIALS_VERIFIKASI_EMAIL || 'verifikasi@imm.or.id';
  const verifikasiPass = import.meta.env.VITE_CREDENTIALS_VERIFIKASI_PASSWORD || 'password123';
  const verifikasiName = import.meta.env.VITE_CREDENTIALS_VERIFIKASI_NAME || 'Immawati Fatimah (Tim Verifikasi)';
  const verifikasiRole = (import.meta.env.VITE_CREDENTIALS_VERIFIKASI_ROLE as UserRole) || 'tim_verifikasi_internal';
  const verifikasiLevel = (import.meta.env.VITE_CREDENTIALS_VERIFIKASI_LEVEL as OrgLevel) || 'PC';

  const adminEmail = import.meta.env.VITE_CREDENTIALS_ADMIN_EMAIL || 'admin@imm.or.id';
  const adminPass = import.meta.env.VITE_CREDENTIALS_ADMIN_PASSWORD || 'password123';
  const adminName = import.meta.env.VITE_CREDENTIALS_ADMIN_NAME || 'Admin Pusat IMM (Super Admin)';
  const adminRole = (import.meta.env.VITE_CREDENTIALS_ADMIN_ROLE as UserRole) || 'super_admin';
  const adminLevel = (import.meta.env.VITE_CREDENTIALS_ADMIN_LEVEL as OrgLevel) || 'DPP';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-slide carousel interval every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickLogin = (target: 'dpp' | 'dpd' | 'pc' | 'korkom' | 'pk' | 'bendahara' | 'verifikasi' | 'admin') => {
    setErrorMessage(null);
    if (target === 'dpp' || target === 'admin') {
      setEmail(dppEmail);
      setPassword(dppPass);
      setRole(dppRole);
      setLevel(dppLevel);
      setNama(dppName);
      onLogin(dppRole, dppLevel, dppEmail, dppName);
    } else if (target === 'dpd') {
      setEmail(dpdEmail);
      setPassword(dpdPass);
      setRole(dpdRole);
      setLevel(dpdLevel);
      setNama(dpdName);
      onLogin(dpdRole, dpdLevel, dpdEmail, dpdName);
    } else if (target === 'pc' || target === 'verifikasi') {
      setEmail(pcEmail);
      setPassword(pcPass);
      setRole(pcRole);
      setLevel(pcLevel);
      setNama(pcName);
      onLogin(pcRole, pcLevel, pcEmail, pcName);
    } else if (target === 'korkom') {
      setEmail(korkomEmail);
      setPassword(korkomPass);
      setRole(korkomRole);
      setLevel(korkomLevel);
      setNama(korkomName);
      onLogin(korkomRole, korkomLevel, korkomEmail, korkomName);
    } else if (target === 'pk' || target === 'bendahara') {
      setEmail(pkEmail);
      setPassword(pkPass);
      setRole(pkRole);
      setLevel(pkLevel);
      setNama(pkName);
      onLogin(pkRole, pkLevel, pkEmail, pkName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (authMode === 'signup') {
      if (!email || !password || !nama) {
        setErrorMessage('Mohon lengkapi seluruh data pendaftaran.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Kata sandi minimal 4 karakter.');
        return;
      }
      if (onRegisterOrgSuccess) {
        onRegisterOrgSuccess(nama, level, email, nama);
      }
      setIsSignupSubmitted(true);
      return;
    }

    const inputEmail = email.trim().toLowerCase();

    // Check matching 5 level credentials
    if (inputEmail === dppEmail.toLowerCase() || inputEmail === adminEmail.toLowerCase()) {
      if (password !== dppPass && password !== adminPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(dppRole, dppLevel, dppEmail, dppName);
      return;
    }

    if (inputEmail === dpdEmail.toLowerCase()) {
      if (password !== dpdPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(dpdRole, dpdLevel, dpdEmail, dpdName);
      return;
    }

    if (inputEmail === pcEmail.toLowerCase() || inputEmail === verifikasiEmail.toLowerCase()) {
      if (password !== pcPass && password !== verifikasiPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(pcRole, pcLevel, pcEmail, pcName);
      return;
    }

    if (inputEmail === korkomEmail.toLowerCase()) {
      if (password !== korkomPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(korkomRole, korkomLevel, korkomEmail, korkomName);
      return;
    }

    if (inputEmail === pkEmail.toLowerCase() || inputEmail === bendaharaEmail.toLowerCase()) {
      if (password !== pkPass && password !== bendaharaPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(pkRole, pkLevel, pkEmail, pkName);
      return;
    }

    // Default fallback login for any other valid email
    if (password.length < 4) {
      setErrorMessage('Kata sandi minimal 4 karakter.');
      return;
    }
    onLogin(role, level, email, nama || 'Pengurus IMM');
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
      tagline: "Pertanggungjawaban Keuangan Sah & Digital",
      desc: "Setiap transaksi program kerja semua bidang, tercatat dan dilengkapi bukti, sehingga pengelolaan keuangan dapat dipertanggungjawabkan.",
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
            {isDemoRoute() && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 mb-2">
                <FlaskConical className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">DEMO SANDBOX MODE</span>
                  <p className="text-[11px] text-amber-700">
                    Data simulasi aktif. Untuk versi Real App tanpa mock data, <a href="/" className="underline font-bold">buka Aplikasi Utama (/)</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Sign In vs Sign Up Segmented Tab Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setIsSignupSubmitted(false);
                  setAuthMode('signin');
                }}
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
                onClick={() => {
                  setIsSignupSubmitted(false);
                  setAuthMode('signup');
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#7A0C1E] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#7A0C1E]'
                }`}
              >
                Sign Up (Daftar Akun)
              </button>
            </div>

            {isSignupSubmitted ? (
              <div className="space-y-4 py-4 text-center animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#7A0C1E]">
                    Pengajuan Akun Berhasil Terkirim!
                  </h2>
                  <p className="text-xs text-slate-500">
                    Permohonan akun baru telah terdaftar di sistem SAKU IMM.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left text-xs text-amber-800 space-y-2">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-700" /> Status: Menunggu Verifikasi Organisasi
                  </span>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Pengajuan pendaftaran akun untuk <strong>{nama || 'Pengurus IMM'}</strong> ({level}) memerlukan proses verifikasi dan persetujuan dari pimpinan di atasnya ({level === 'PK' ? 'KORKOM / PC' : level === 'KORKOM' ? 'PC' : level === 'PC' ? 'DPD' : 'DPP'}) sebelum akun dapat digunakan untuk masuk.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignupSubmitted(false);
                    setAuthMode('signin');
                  }}
                  className="w-full py-3.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Kembali ke Halaman Masuk (Sign In)</span>
                  <ArrowRight className="w-4 h-4 text-[#81B29A]" />
                </button>
              </div>
            ) : (
              <>
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

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-bold text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                    <Lock className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Sign Up Only Inputs: Level, Role, Name */}
                  {authMode === 'signup' && (
                    <>
                      {/* Level Organisasi Segmented Picker */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Level Organisasi Pimpinan *
                        </label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
                          {(['PK', 'KORKOM', 'PC', 'DPD'] as OrgLevel[]).map((lvl) => (
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
                    <span>{authMode === 'signin' ? 'Masuk ke Dashboard IMM' : 'KIRIM PENGAJUAN AKUN'}</span>
                    <ArrowRight className="w-4 h-4 text-[#81B29A]" />
                  </button>

                  {/* Quick Login 1-Klik Per Level Pimpinan (5 Level IMM) - ONLY IN DEMO MODE */}
                  {authMode === 'signin' && isDemoRoute() && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 mt-3">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                        <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                        <span>⚡ Quick Login Demo 1-Klik (5 Level Pimpinan)</span>
                      </p>
                      <div className="grid grid-cols-5 gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('dpp')}
                          className="px-1.5 py-1.5 bg-white hover:bg-[#7A0C1E] hover:text-white border border-slate-200 rounded-lg text-[10px] font-bold text-[#7A0C1E] transition-all text-center flex flex-col items-center justify-center shadow-2xs active:scale-95"
                        >
                          <span>DPP</span>
                          <span className="text-[8px] opacity-75 font-normal">Level 1</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('dpd')}
                          className="px-1.5 py-1.5 bg-white hover:bg-[#7A0C1E] hover:text-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all text-center flex flex-col items-center justify-center shadow-2xs active:scale-95"
                        >
                          <span>DPD</span>
                          <span className="text-[8px] opacity-75 font-normal">Level 2</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('pc')}
                          className="px-1.5 py-1.5 bg-white hover:bg-[#7A0C1E] hover:text-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all text-center flex flex-col items-center justify-center shadow-2xs active:scale-95"
                        >
                          <span>PC</span>
                          <span className="text-[8px] opacity-75 font-normal">Level 3</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('korkom')}
                          className="px-1.5 py-1.5 bg-white hover:bg-[#7A0C1E] hover:text-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all text-center flex flex-col items-center justify-center shadow-2xs active:scale-95"
                        >
                          <span>KORKOM</span>
                          <span className="text-[8px] opacity-75 font-normal">Level 4</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickLogin('pk')}
                          className="px-1.5 py-1.5 bg-white hover:bg-[#7A0C1E] hover:text-white border border-slate-200 rounded-lg text-[10px] font-bold text-[#7A0C1E] transition-all text-center flex flex-col items-center justify-center shadow-2xs active:scale-95"
                        >
                          <span>PK</span>
                          <span className="text-[8px] opacity-75 font-normal">Level 5</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Register New Organization Trigger Button */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignupSubmitted(false);
                        setAuthMode('signup');
                      }}
                      className="text-xs text-[#7A0C1E] hover:underline font-bold flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Building2 className="w-4 h-4 text-[#81B29A]" />
                      <span>Belum Terdaftar? Daftarkan Organisasi Baru (PK/PC/DPD)</span>
                    </button>
                  </div>
                </form>
              </>
            )}
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
          
          {/* SLIDE CONTENT DISPLAY - Murni Fokus pada 3 USP SAKU IMM */}
          <div className="relative z-10 space-y-6 my-auto py-4 min-h-[380px] flex flex-col justify-center transition-all duration-500">
            {uspSlides.map((slide, idx) => {
              if (activeSlide !== idx) return null;
              const SlideIcon = slide.icon;
              return (
                <div key={idx} className="space-y-5 animate-fadeIn">
                  {/* Prominent Feature Icon with Glow */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/25 flex items-center justify-center shadow-lg backdrop-blur-md">
                      <SlideIcon className="w-8 h-8 text-[#0097A7]" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        {slide.title}
                      </h2>
                      <p className="text-xs font-bold text-[#0097A7] tracking-wide mt-0.5">
                        {slide.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-lg">
                    {slide.desc}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 pt-2 border-t border-white/15">
                    {idx === 0 && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Visibilitas keuangan berjenjang (PK, KORKOM, PC, DPD, DPP)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Privasi terjaga dengan pemisahan akses data agregat & detail</span>
                        </div>
                      </>
                    )}
                    {idx === 1 && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Verifikasi kuitansi dan nota digital tersertifikasi</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Audit Trail log sistem untuk setiap perubahan transaksi</span>
                        </div>
                      </>
                    )}
                    {idx === 2 && (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Standarisasi 22 Bidang Resmi IMM seluruh Indonesia</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#81B29A] flex-shrink-0" />
                          <span>Pewarisan arsip keuangan rapi antar-generasi kepengurusan</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* INTERACTIVE 3-BAR SLIDER INDICATOR (Transparan, Akuntabel, Berkelanjutan) */}
          <div className="relative z-10 pt-4 border-t border-white/15">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>3 Nilai Utama SAKU IMM</span>
              <span className="text-[#0097A7]">Slide {activeSlide + 1} dari 3</span>
            </div>
            <div className="flex items-center gap-2">
              {uspSlides.map((slide, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-3 rounded-full flex-1 transition-all duration-300 cursor-pointer flex items-center justify-center text-[11px] font-extrabold ${
                    activeSlide === idx
                      ? 'bg-[#0097A7] shadow-md text-white ring-2 ring-white/30'
                      : 'bg-white/20 hover:bg-white/40 text-slate-300'
                  }`}
                  title={`Lihat: ${slide.title}`}
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
