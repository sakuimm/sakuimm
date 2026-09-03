import React, { useState, useEffect } from 'react';
import { UserRole, OrgLevel, Transaksi, ProgramKerja, Organisasi } from './types';
import { OFFICIAL_IMM_BIDANG } from './data/mockData';
import { storageService } from './services/storageService';
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

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('bendahara_umum');
  const [currentLevel, setCurrentLevel] = useState<OrgLevel>('PK');
  const [userName, setUserName] = useState('Immawan Ahmad');
  const [userEmail, setUserEmail] = useState('bendahara@imm.or.id');
  const [activeTab, setActiveTab] = useState('buat-laporan');
  const [isAggregateMode, setIsAggregateMode] = useState(false);

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

    // Load saved user session
    const session = storageService.getUserSession();
    if (session && session.isLoggedIn) {
      setIsLoggedIn(true);
      setUserRole(session.userRole);
      setCurrentLevel(session.currentLevel);
      setUserName(session.userName);
      setUserEmail(session.userEmail);
    }
  }, []);

  const getOrgName = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PK IMM Teknik Mesin UI';
      case 'KORKOM': return 'KORKOM IMM Universitas Indonesia';
      case 'PC': return 'PC IMM Jakarta Selatan';
      case 'DPD': return 'DPD IMM DKI Jakarta';
      case 'DPP': return 'DPP IMM (Pusat)';
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
    const updated = storageService.addTransaksi(trx, userName);
    setTransaksiList(updated);
  };

  const handleAddProker = (proker: ProgramKerja) => {
    const updated = storageService.addProker(proker);
    setProkerList(updated);
  };

  const handleToggleStatusProker = (prokerId: string) => {
    const updated = storageService.toggleProkerStatus(prokerId);
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

  const handleRegisterOrgSuccess = async (namaOrg: string, level: OrgLevel, email: string, namaBendahara: string) => {
    await apiService.registerOrganisasi({
      namaOrganisasi: namaOrg,
      level,
      namaBendahara,
      email,
      password: 'password123'
    });
    setOrganisasiList(storageService.getOrganisasiList());
  };

  const handleUpdateUserName = (newName: string) => {
    setUserName(newName);
    storageService.saveUserSession({
      isLoggedIn: true,
      userRole,
      currentLevel,
      userName: newName,
      userEmail
    });
  };

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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentLevel={currentLevel}
          setCurrentLevel={(lvl) => {
            setCurrentLevel(lvl);
            storageService.saveUserSession({
              isLoggedIn: true,
              userRole,
              currentLevel: lvl,
              userName,
              userEmail
            });
          }}
          isAggregateMode={isAggregateMode}
          setIsAggregateMode={setIsAggregateMode}
          currentOrgName={getOrgName(currentLevel)}
        />

        {/* Dynamic View Routing */}
        <main className="p-6 md:p-8 pt-6 md:pt-8 max-w-7xl w-full mx-auto">
          {activeTab === 'buat-laporan' && (
            <BuatLaporanKeuanganView
              prokerList={prokerList}
              bidangList={OFFICIAL_IMM_BIDANG}
              transaksiList={transaksiList}
              userRole={userRole}
              onAddTransaksi={handleAddTransaksi}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              transaksiList={transaksiList}
              prokerList={prokerList}
              currentLevel={currentLevel}
              userRole={userRole}
              isAggregateMode={isAggregateMode}
              onNavigateToTransaksi={() => setActiveTab('buat-laporan')}
            />
          )}

          {activeTab === 'master-data' && (
            <MasterDataView
              bidangList={OFFICIAL_IMM_BIDANG}
              prokerList={prokerList}
              userRole={userRole}
              onAddProker={handleAddProker}
              onToggleStatusProker={handleToggleStatusProker}
            />
          )}

          {activeTab === 'laporan' && (
            <ReportsView
              transaksiList={transaksiList}
              currentLevel={currentLevel}
              isAggregateMode={isAggregateMode}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              userName={userName}
              userRole={userRole}
              userLevel={currentLevel}
              onUpdateUser={handleUpdateUserName}
            />
          )}

          {activeTab === 'verifikasi' && (
            <OrganizationVerificationView
              organisasiList={organisasiList}
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
