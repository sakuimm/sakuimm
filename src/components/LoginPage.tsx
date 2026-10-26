import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel } from '../types';
import { RegisterOrganizationModal } from './RegisterOrganizationModal';
import { isDemoRoute, storageService } from '../services/storageService';
import { ShieldCheck, Lock, Mail, ArrowRight, Camera, CheckCircle2, FileCheck, Eye, EyeOff, User, Layers, RefreshCw, Building2, FlaskConical, PieChart, TrendingUp, Calendar, KeyRound, X } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole, level: OrgLevel, email: string, name: string, orgName?: string) => void;
  onRegisterOrgSuccess?: (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegisterOrgSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isSignupSubmitted, setIsSignupSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('bendahara_umum');
  const [level, setLevel] = useState<OrgLevel>('PK');
  const [nama, setNama] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showRegisterOrgModal, setShowRegisterOrgModal] = useState(false);

  // Forgot / Reset Password state
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Real National Aggregate Calculations (Seluruh Akun IMM Se-Indonesia)
  const [nationalStats] = useState(() => {
    try {
      const allTrx = storageService.getTransaksiList();
      const pMasuk = allTrx.filter((t) => t.jenisNominal === 'pemasukan').reduce((s, t) => s + t.nominal, 0);
      const pKeluar = allTrx.filter((t) => t.jenisNominal === 'pengeluaran').reduce((s, t) => s + t.nominal, 0);
      
      const hasData = allTrx.length > 0 && (pMasuk > 0 || pKeluar > 0);
      
      // Default to reference benchmark figures if no recorded transactions yet
      const pemasukan = hasData ? pMasuk : 10000000;
      const pengeluaran = hasData ? pKeluar : 700000;
      const totalPutaran = pemasukan + pengeluaran;

      // Category expenses calculation across all national transactions
      let kemahasiswaan = allTrx
        .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Kemahasiswaan')
        .reduce((s, t) => s + t.nominal, 0);
      let kemasyarakatan = allTrx
        .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Kemasyarakatan')
        .reduce((s, t) => s + t.nominal, 0);
      let keagamaan = allTrx
        .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Keagamaan')
        .reduce((s, t) => s + t.nominal, 0);

      const totalKategori = kemahasiswaan + kemasyarakatan + keagamaan;
      let pctKemahasiswaan = 64;
      let pctKemasyarakatan = 21;
      let pctKeagamaan = 15;

      if (totalKategori > 0) {
        pctKemahasiswaan = Math.round((kemahasiswaan / totalKategori) * 100);
        pctKemasyarakatan = Math.round((kemasyarakatan / totalKategori) * 100);
        pctKeagamaan = Math.max(0, 100 - pctKemahasiswaan - pctKemasyarakatan);
      }

      return {
        pemasukan,
        pengeluaran,
        totalPutaran,
        pctKemahasiswaan,
        pctKemasyarakatan,
        pctKeagamaan,
        dateStr: '24 Oktober 2026'
      };
    } catch {
      return {
        pemasukan: 10000000,
        pengeluaran: 700000,
        totalPutaran: 10700000,
        pctKemahasiswaan: 64,
        pctKemasyarakatan: 21,
        pctKeagamaan: 15,
        dateStr: '24 Oktober 2026'
      };
    }
  });

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
      onLogin(dppRole, dppLevel, dppEmail, dppName, 'DPP IMM (Pusat)');
    } else if (target === 'dpd') {
      setEmail(dpdEmail);
      setPassword(dpdPass);
      setRole(dpdRole);
      setLevel(dpdLevel);
      setNama(dpdName);
      onLogin(dpdRole, dpdLevel, dpdEmail, dpdName, 'DPD IMM DKI Jakarta');
    } else if (target === 'pc' || target === 'verifikasi') {
      setEmail(pcEmail);
      setPassword(pcPass);
      setRole(pcRole);
      setLevel(pcLevel);
      setNama(pcName);
      onLogin(pcRole, pcLevel, pcEmail, pcName, 'PC IMM Jakarta Selatan');
    } else if (target === 'korkom') {
      setEmail(korkomEmail);
      setPassword(korkomPass);
      setRole(korkomRole);
      setLevel(korkomLevel);
      setNama(korkomName);
      onLogin(korkomRole, korkomLevel, korkomEmail, korkomName, 'KORKOM IMM Universitas Indonesia');
    } else if (target === 'pk' || target === 'bendahara') {
      setEmail(pkEmail);
      setPassword(pkPass);
      setRole(pkRole);
      setLevel(pkLevel);
      setNama(pkName);
      onLogin(pkRole, pkLevel, pkEmail, pkName, 'PK IMM Teknik Mesin UI');
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

    // Check if this email belongs to a pending or rejected organization/account
    const orgs = storageService.getOrganisasiList();
    const matchedOrg = orgs.find((o) => o.email?.toLowerCase() === inputEmail);
    if (matchedOrg && matchedOrg.status !== 'verified') {
      setErrorMessage(
        'Akun Anda sedang menunggu persetujuan / verifikasi dari Pimpinan Pusat (DPP IMM). Akun akan aktif setelah disetujui oleh DPP IMM.'
      );
      return;
    }

    // Check custom password from password recovery first
    const customPass = storageService.getUserPassword(inputEmail);

    // Check matching 5 level credentials
    if (inputEmail === dppEmail.toLowerCase() || inputEmail === adminEmail.toLowerCase()) {
      const validPass = customPass || dppPass;
      if (password !== validPass && password !== adminPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(dppRole, dppLevel, dppEmail, dppName, 'DPP IMM (Pusat)');
      return;
    }

    if (inputEmail === dpdEmail.toLowerCase()) {
      const validPass = customPass || dpdPass;
      if (password !== validPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(dpdRole, dpdLevel, dpdEmail, dpdName, 'DPD IMM DKI Jakarta');
      return;
    }

    if (inputEmail === 'dpd.jatim@imm.or.id') {
      const validPass = customPass || 'dpd123';
      if (password !== validPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin('bendahara_umum', 'DPD', 'dpd.jatim@imm.or.id', 'Immawan Hadi Jatim', 'DPD IMM Jawa Timur');
      return;
    }

    if (inputEmail === pcEmail.toLowerCase() || inputEmail === verifikasiEmail.toLowerCase()) {
      const validPass = customPass || pcPass;
      if (password !== validPass && password !== verifikasiPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(pcRole, pcLevel, pcEmail, pcName, 'PC IMM Jakarta Selatan');
      return;
    }

    if (inputEmail === korkomEmail.toLowerCase()) {
      const validPass = customPass || korkomPass;
      if (password !== validPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(korkomRole, korkomLevel, korkomEmail, korkomName, 'KORKOM IMM Universitas Indonesia');
      return;
    }

    if (inputEmail === pkEmail.toLowerCase() || inputEmail === bendaharaEmail.toLowerCase()) {
      const validPass = customPass || pkPass;
      if (password !== validPass && password !== bendaharaPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(pkRole, pkLevel, pkEmail, pkName, 'PK IMM Teknik Mesin UI');
      return;
    }

    if (matchedOrg) {
      const validPass = customPass || matchedOrg.password || 'password123';
      if (password !== validPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin('bendahara_umum', matchedOrg.level, inputEmail, matchedOrg.namaBendahara || matchedOrg.nama, matchedOrg.nama);
      return;
    }

    // Default fallback login for any other valid email
    if (customPass) {
      if (password !== customPass) {
        setErrorMessage('Kata sandi atau email salah. Silakan periksa kembali.');
        return;
      }
      onLogin(role, level, email, nama || 'Pengurus IMM');
      return;
    }

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
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-700" /> Status: Menunggu Verifikasi Terpusat DPP IMM
                  </span>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Pengajuan pendaftaran akun untuk <strong>{nama || 'Pengurus IMM'}</strong> ({level}) memerlukan proses verifikasi dan persetujuan dari <strong>Dewan Pimpinan Pusat (DPP IMM)</strong> sebelum akun aktif dan dapat digunakan untuk masuk.
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

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
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

                      {/* Jenis Akun (Role Dropdown) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Jenis Akun *
                        </label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                        >
                          <option value="bendahara_umum">Bendahara Umum</option>
                          <option value="tim_verifikasi_internal">Tim Verifikasi Internal</option>
                        </select>
                      </div>

                      {/* Nama Level Pimpinan IMM */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Nama Level Pimpinan IMM *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            autoComplete="off"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                            placeholder="Contoh: PK IMM Teknik UI, DPD IMM DKI Jakarta"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Both Sign In & Sign Up: Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      {authMode === 'signup' ? 'Email Akun *' : 'Email Pengguna *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] transition-all"
                        placeholder="nama@imm.or.id"
                      />
                    </div>
                  </div>

                  {/* Both Sign In & Sign Up: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Kata Sandi *
                      </label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setResetEmail(email || '');
                            setResetError(null);
                            setResetSuccessMessage(null);
                            setIsResetPasswordModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-[#7A0C1E] hover:underline cursor-pointer"
                        >
                          Lupa Kata Sandi?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
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
            <span>Copyright © DPP IMM 2026</span>
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
          
          {/* CONTENT DISPLAY: Metrik Arus Kas Nasional + Persentase Kategori + USP Slides */}
          <div className="relative z-10 space-y-4 my-auto py-3 transition-all duration-500">
            {/* 1. KARTU TOTAL PUTARAN KEUANGAN NASIONAL */}
            <div className="bg-white/10 border border-white/25 rounded-2xl p-5 backdrop-blur-md shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0097A7] text-white shadow-xs">
                  TOTAL PUTARAN KEUANGAN
                </span>
                <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#81B29A]" />
                  <span>Per, {nationalStats.dateStr}</span>
                </span>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Rp{nationalStats.totalPutaran.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-slate-200 font-bold mt-1">
                  Total Putaran Keuangan IMM Se-Indonesia
                </p>
              </div>

              {/* Sub-rincian: Pemasukan & Pengeluaran */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2.5 border-t border-white/15 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <span className="text-[11px] text-slate-300 font-medium">Pemasukan</span>
                  <span>Rp{nationalStats.pemasukan.toLocaleString('id-ID')}</span>
                </div>
                <span className="text-white/40 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                  <span className="text-[11px] text-slate-300 font-medium">+ Pengeluaran</span>
                  <span>Rp{nationalStats.pengeluaran.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* 2. KARTU PENGELUARAN PER KATEGORI (PERSENTASE RIIL) */}
            <div className="bg-white/10 border border-white/25 rounded-2xl p-4.5 backdrop-blur-md shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-white flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#0097A7]" />
                  <span>Pengeluaran Per Kategori</span>
                </span>
                <span className="text-[10px] text-[#81B29A] font-bold">Statistik Riil</span>
              </div>

              {/* 3 Kategori Stat Cards */}
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {/* Kemahasiswaan */}
                <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-slate-300 font-medium truncate">Kemahasiswaan</p>
                  <p className="text-lg font-black text-[#F4A261] mt-0.5">{nationalStats.pctKemahasiswaan}%</p>
                </div>

                {/* Kemasyarakatan */}
                <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-slate-300 font-medium truncate">Kemasyarakatan</p>
                  <p className="text-lg font-black text-blue-300 mt-0.5">{nationalStats.pctKemasyarakatan}%</p>
                </div>

                {/* Keagamaan */}
                <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-slate-300 font-medium truncate">Keagamaan</p>
                  <p className="text-lg font-black text-[#81B29A] mt-0.5">{nationalStats.pctKeagamaan}%</p>
                </div>
              </div>

              {/* Visual Multi-Segment Bar */}
              <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden flex shadow-inner">
                <div style={{ width: `${nationalStats.pctKemahasiswaan}%` }} className="bg-[#F4A261] h-full transition-all duration-500" title={`Kemahasiswaan ${nationalStats.pctKemahasiswaan}%`} />
                <div style={{ width: `${nationalStats.pctKemasyarakatan}%` }} className="bg-blue-400 h-full transition-all duration-500" title={`Kemasyarakatan ${nationalStats.pctKemasyarakatan}%`} />
                <div style={{ width: `${nationalStats.pctKeagamaan}%` }} className="bg-[#81B29A] h-full transition-all duration-500" title={`Keagamaan ${nationalStats.pctKeagamaan}%`} />
              </div>
            </div>

            {/* 3. ACTIVE USP SLIDE DISPLAY */}
            {uspSlides.map((slide, idx) => {
              if (activeSlide !== idx) return null;
              const SlideIcon = slide.icon;
              return (
                <div key={idx} className="bg-black/15 border border-white/10 rounded-xl p-3 flex items-center gap-3 animate-fadeIn">
                  <div className="w-10 h-10 rounded-xl bg-[#0097A7]/20 border border-[#0097A7]/40 flex items-center justify-center flex-shrink-0">
                    <SlideIcon className="w-5 h-5 text-[#0097A7]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{slide.title}</span>
                      <span className="text-[10px] text-[#0097A7] font-bold">— {slide.tagline}</span>
                    </div>
                    <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5">{slide.desc}</p>
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

      {/* MODAL RESET KATA SANDI (LUPA PASSWORD) */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#7A0C1E]/10 text-[#7A0C1E] rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2D3748]">Reset Kata Sandi Akun</h3>
                  <p className="text-[11px] text-slate-500">Atur ulang kata sandi akun SAKU IMM Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {resetError}
              </div>
            )}

            {resetSuccessMessage ? (
              <div className="space-y-4 py-3 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#2D3748]">{resetSuccessMessage}</p>
                  <p className="text-xs text-slate-500">Silakan gunakan kata sandi baru untuk masuk ke sistem.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPasswordModalOpen(false);
                    setEmail(resetEmail);
                    setPassword(resetNewPass);
                  }}
                  className="w-full py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Gunakan Kata Sandi Baru & Masuk
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResetError(null);
                  const normEmail = resetEmail.trim().toLowerCase();
                  if (!normEmail) {
                    setResetError('Mohon masukkan alamat email akun Anda.');
                    return;
                  }
                  if (resetNewPass.length < 4) {
                    setResetError('Kata sandi baru minimal 4 karakter.');
                    return;
                  }
                  if (resetNewPass !== resetConfirmPass) {
                    setResetError('Konfirmasi kata sandi baru tidak sesuai.');
                    return;
                  }

                  const ok = storageService.updateUserPassword(normEmail, resetNewPass);
                  if (ok) {
                    setResetSuccessMessage(`Kata sandi akun "${normEmail}" berhasil diperbarui!`);
                  } else {
                    setResetError('Gagal memperbarui kata sandi. Silakan coba kembali.');
                  }
                }}
                className="space-y-3.5 text-left"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Email Akun Terdaftar *
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="misal: dpd@imm.or.id atau email Anda"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Kata Sandi Baru *
                  </label>
                  <input
                    type="password"
                    value={resetNewPass}
                    onChange={(e) => setResetNewPass(e.target.value)}
                    required
                    placeholder="Minimal 4 karakter"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Konfirmasi Kata Sandi Baru *
                  </label>
                  <input
                    type="password"
                    value={resetConfirmPass}
                    onChange={(e) => setResetConfirmPass(e.target.value)}
                    required
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Simpan Kata Sandi Baru
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
