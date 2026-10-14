import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel, Transaksi, ProgramKerja, Organisasi } from './types';
import { OFFICIAL_IMM_BIDANG } from './data/mockData';
import { storageService, isDemoRoute } from './services/storageService';
import { apiService } from './services/apiService';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { BuatLaporanKeuanganView } from './components/BuatLaporanKeuanganView';
import { MasterDataView } from './components/MasterDataView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { OrganizationVerificationView } from './components/OrganizationVerificationView';
import { FlaskConical } from 'lucide-react';

import { InputProkerView } from './components/InputProkerView';
import { TransactionFormView } from './components/TransactionFormView';

export function App() {
  const initialSession = typeof window !== 'undefined' ? storageService.getUserSession() : null;

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('tab') === 'login') return false;
      if (p.get('tab')) return true;
      if (window.location.pathname.startsWith('/demo')) return true;
      if (initialSession && initialSession.isLoggedIn) return true;
    }
    return false;
  });
  const [userRole, setUserRole] = useState<UserRole>(initialSession?.userRole || 'bendahara_umum');
  const [currentLevel, setCurrentLevel] = useState<OrgLevel>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const lvl = p.get('level') as OrgLevel | null;
      if (lvl) return lvl;
    }
    return initialSession?.currentLevel || 'PK';
  });
  const [userName, setUserName] = useState<string>(initialSession?.userName || 'Immawan Ahmad');
  const [userEmail, setUserEmail] = useState<string>(initialSession?.userEmail || 'bendahara@imm.or.id');
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('tab') || 'dashboard';
    }
    return 'dashboard';
  });
  const [isAggregateMode, setIsAggregateMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Agustus 2026');

  // Dynamic Data States (Loaded & Saved via StorageService & ApiService)
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [prokerList, setProkerList] = useState<ProgramKerja[]>([]);
  const [organisasiList, setOrganisasiList] = useState<Organisasi[]>([]);

  // Restore Session & Persistent Data on Mount
  useEffect(() => {
    storageService.initData();

    // Load data from persistent storage / API layer
    setTransaksiList(storageService.getTransaksiList());
    setProkerList(storageService.getProkerList());
    setOrganisasiList(storageService.getOrganisasiList());

    // Support query params for direct rendering / testing
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const levelParam = params.get('level') as OrgLevel | null;

    if (tabParam === 'login') {
      setIsLoggedIn(false);
      return;
    }

    // Load saved user session
    const session = storageService.getUserSession();
    if (session && session.isLoggedIn) {
      setIsLoggedIn(true);
      setUserRole(session.userRole || 'bendahara_umum');
      setCurrentLevel(levelParam || session.currentLevel || 'PK');
      setUserName(session.userName || 'Immawan Ahmad');
      setUserEmail(session.userEmail || 'bendahara@imm.or.id');
      setActiveTab(tabParam || 'dashboard');
    } else if (tabParam) {
      setIsLoggedIn(true);
      setActiveTab(tabParam);
      if (levelParam) setCurrentLevel(levelParam);
    } else if (levelParam) {
      setCurrentLevel(levelParam);
    }
  }, []);

  const getOrgName = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PK IMM Teknik Mesin UI';
      case 'KORKOM': return 'KORKOM IMM Universitas Indonesia';
      case 'PC': return 'PC IMM Jakarta Selatan';
      case 'DPD': return 'DPD IMM DKI Jakarta';
      case 'DPP': return 'DPP IMM (Pusat)';
      default: return 'Pimpinan IMM';
    }
  };

  const handleLogin = (role: UserRole, level: OrgLevel, email: string, name: string) => {
    const finalName = name || 'Immawan Ahmad';
    const finalEmail = email || 'bendahara@imm.or.id';
    
    setUserRole(role);
    setCurrentLevel(level);
    setUserName(finalName);
    setUserEmail(finalEmail);
    setIsLoggedIn(true);
    setActiveTab('dashboard');

    // Save Persistent Session
    storageService.saveUserSession({
      isLoggedIn: true,
      userRole: role,
      currentLevel: level,
      userName: finalName,
      userEmail: finalEmail
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    storageService.clearUserSession();
  };

  const handleAddTransaksi = (trx: Transaksi) => {
    const trxWithLevel: Transaksi = {
      ...trx,
      organisasiLevel: trx.organisasiLevel || currentLevel,
      organisasiNama: trx.organisasiNama || getOrgName(currentLevel)
    };
    const updated = storageService.addTransaksi(trxWithLevel, userName);
    setTransaksiList(updated);
  };

  const handleUpdateTransaksi = (trx: Transaksi) => {
    const updated = storageService.updateTransaksi(trx, userName);
    setTransaksiList(updated);
  };

  const handleDeleteTransaksi = (id: string) => {
    const updated = storageService.deleteTransaksi(id, userName);
    setTransaksiList(updated);
  };

  const handleResubmitTransaksi = (id: string) => {
    const updated = storageService.resubmitTransaksi(id, userName);
    setTransaksiList(updated);
  };

  const handleAddProker = (proker: ProgramKerja) => {
    const prokerWithLevel: ProgramKerja = {
      ...proker,
      organisasiLevel: proker.organisasiLevel || currentLevel,
      organisasiNama: proker.organisasiNama || getOrgName(currentLevel)
    };
    const updated = storageService.addProker(prokerWithLevel);
    setProkerList(updated);
  };

  const handleUpdateProker = (proker: ProgramKerja) => {
    const updated = storageService.updateProker(proker, userName);
    setProkerList(updated);
  };

  const handleDeleteProker = (id: string) => {
    const updated = storageService.deleteProker(id, userName);
    setProkerList(updated);
    setTransaksiList(storageService.getTransaksiList());
  };

  const handleToggleStatusProker = (prokerId: string) => {
    const updated = storageService.toggleProkerStatus(prokerId);
    setProkerList(updated);
  };

  const handleSubmitProkerLPJ = (prokerId: string) => {
    const updated = storageService.submitProkerLPJ(prokerId);
    setProkerList(updated);
  };

  const handleReopenProkerLPJ = (prokerId: string) => {
    const updated = storageService.reopenProkerLPJ(prokerId, userName);
    setProkerList(updated);
  };

  const handleVerifyOrg = async (id: string) => {
    const updated = await apiService.verifyOrganisasi(id, userName);
    setOrganisasiList(updated);
  };

  const handleRejectOrg = async (id: string) => {
    const updated = await apiService.rejectOrganisasi(id, userName);
    setOrganisasiList(updated);
  };

  const handleRegisterOrgSuccess = async (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string, indukNama?: string) => {
    await apiService.registerOrganisasi({
      namaOrganisasi: namaOrg,
      level,
      parentOrgId: indukNama,
      namaBendahara,
      email,
      password: 'password123'
    });
    setOrganisasiList(storageService.getOrganisasiList());
  };

  const handleUpdateUser = (newName: string, newEmail?: string, newOrg?: string) => {
    setUserName(newName);
    if (newEmail) setUserEmail(newEmail);
    storageService.saveUserSession({
      isLoggedIn: true,
      userRole,
      currentLevel,
      userName: newName,
      userEmail: newEmail || userEmail,
      userOrgName: newOrg
    });
  };

  // Level-based data isolation & aggregation filtering logic
  const ORG_ORDER: Record<OrgLevel, number> = {
    DPP: 1,
    DPD: 2,
    PC: 3,
    KORKOM: 4,
    PK: 5,
  };

  // Strict Own Level Isolation for Operational Views (Input Transaksi kas & Daftar Proker)
  const ownProkerList = prokerList.filter((p) => (p.organisasiLevel || 'PK') === currentLevel);
  const ownTransaksiList = transaksiList.filter((t) => (t.organisasiLevel || 'PK') === currentLevel);

  // Aggregate / Roll-up Data for Dashboard & Reports
  const aggregateProkerList = prokerList.filter((p) => {
    const pLevel = p.organisasiLevel || 'PK';
    if (isAggregateMode) {
      return ORG_ORDER[pLevel] >= ORG_ORDER[currentLevel];
    }
    return pLevel === currentLevel;
  });

  const aggregateTransaksiList = transaksiList.filter((t) => {
    const tLevel = t.organisasiLevel || 'PK';
    if (isAggregateMode) {
      return ORG_ORDER[tLevel] >= ORG_ORDER[currentLevel];
    }
    return tLevel === currentLevel;
  });

  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegisterOrgSuccess={handleRegisterOrgSuccess}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        userLevel={currentLevel}
        userName={userName}
        onLogout={handleLogout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {isDemoRoute() && (
          <div className="bg-amber-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-200" />
              <span>🧪 DEMO SANDBOX MODE — Anda sedang menggunakan versi simulasi dengan data mock. Data di halaman ini tidak memengaruhi data real.</span>
            </div>
            <a href="/" className="bg-white text-amber-900 px-3 py-1 rounded-lg font-extrabold hover:bg-amber-50 transition-all text-[11px]">
              Buka Real App (/)
            </a>
          </div>
        )}

        {/* Top Header */}
        <Header
          currentLevel={currentLevel}
          isAggregateMode={isAggregateMode}
          setIsAggregateMode={setIsAggregateMode}
          currentOrgName={getOrgName(currentLevel)}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Dynamic View Routing */}
        <main className="p-4 sm:p-6 md:p-8 pt-4 sm:pt-6 md:pt-8 max-w-7xl w-full mx-auto">
          {activeTab === 'buat-laporan' && (
            <TransactionFormView
              transaksiList={ownTransaksiList}
              prokerList={ownProkerList}
              bidangList={OFFICIAL_IMM_BIDANG}
              userRole={userRole}
              onAddTransaksi={handleAddTransaksi}
              onUpdateTransaksi={handleUpdateTransaksi}
              onDeleteTransaksi={handleDeleteTransaksi}
              onResubmitTransaksi={handleResubmitTransaksi}
            />
          )}

          {activeTab === 'input-proker' && (
            <InputProkerView
              bidangList={OFFICIAL_IMM_BIDANG}
              onAddProker={handleAddProker}
              onNavigateToList={() => setActiveTab('master-data')}
              userRole={userRole}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              transaksiList={aggregateTransaksiList}
              prokerList={aggregateProkerList}
              currentLevel={currentLevel}
              userRole={userRole}
              isAggregateMode={isAggregateMode}
              onNavigateToTransaksi={() => setActiveTab('buat-laporan')}
            />
          )}

          {activeTab === 'master-data' && (
            <MasterDataView
              bidangList={OFFICIAL_IMM_BIDANG}
              prokerList={ownProkerList}
              transaksiList={ownTransaksiList}
              currentLevel={currentLevel}
              userRole={userRole}
              onAddProker={handleAddProker}
              onUpdateProker={handleUpdateProker}
              onDeleteProker={handleDeleteProker}
              onSubmitProkerLPJ={handleSubmitProkerLPJ}
              onReopenProkerLPJ={handleReopenProkerLPJ}
              onToggleStatusProker={handleToggleStatusProker}
              onNavigateToInputProker={() => setActiveTab('input-proker')}
            />
          )}

          {activeTab === 'laporan' && (
            <ReportsView
              transaksiList={aggregateTransaksiList}
              currentLevel={currentLevel}
              isAggregateMode={isAggregateMode}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              userName={userName}
              userRole={userRole}
              userLevel={currentLevel}
              userEmail={userEmail}
              currentOrgName={getOrgName(currentLevel)}
              isAggregateMode={isAggregateMode}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'verifikasi' && currentLevel !== 'PK' && (
            <OrganizationVerificationView
              organisasiList={organisasiList}
              userLevel={currentLevel}
              onVerify={handleVerifyOrg}
              onReject={handleRejectOrg}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
