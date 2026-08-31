import React, { useState } from 'react';
import { UserRole, OrgLevel, Transaksi, ProgramKerja, Organisasi } from './types';
import { OFFICIAL_IMM_BIDANG, MOCK_ORGANISASI, MOCK_PROKER, MOCK_TRANSAKSI } from './data/mockData';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TransactionFormView } from './components/TransactionFormView';
import { MasterDataView } from './components/MasterDataView';
import { ReportsView } from './components/ReportsView';
import { OrganizationVerificationView } from './components/OrganizationVerificationView';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default false: show SAKUIMM Login Page first
  const [userRole, setUserRole] = useState<UserRole>('bendahara_umum');
  const [currentLevel, setCurrentLevel] = useState<OrgLevel>('PK');
  const [userName, setUserName] = useState('Immawan Ahmad');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAggregateMode, setIsAggregateMode] = useState(false);

  // Dynamic Data States
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(MOCK_TRANSAKSI);
  const [prokerList, setProkerList] = useState<ProgramKerja[]>(MOCK_PROKER);
  const [organisasiList, setOrganisasiList] = useState<Organisasi[]>(MOCK_ORGANISASI);

  const getOrgName = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PK IMM Teknik Mesin UI';
      case 'KORKOM': return 'KORKOM IMM Universitas Indonesia';
      case 'PC': return 'PC IMM Jakarta Selatan';
      case 'DPD': return 'DPD IMM DKI Jakarta';
      case 'DPP': return 'DPP IMM (Pusat)';
    }
  };

  const handleLogin = (role: UserRole, level: OrgLevel, _email: string, name: string) => {
    setUserRole(role);
    setCurrentLevel(level);
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleVerifyOrg = (id: string) => {
    setOrganisasiList(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'verified' } : o))
    );
  };

  const handleRejectOrg = (id: string) => {
    setOrganisasiList(prev =>
      prev.map(o => (o.id === id ? { ...o, status: 'rejected' } : o))
    );
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
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
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
          isAggregateMode={isAggregateMode}
          setIsAggregateMode={setIsAggregateMode}
          currentOrgName={getOrgName(currentLevel)}
        />

        {/* Dynamic View Routing */}
        <main className="p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              transaksiList={transaksiList}
              prokerList={prokerList}
              currentLevel={currentLevel}
              userRole={userRole}
              isAggregateMode={isAggregateMode}
              onNavigateToTransaksi={() => setActiveTab('transaksi')}
            />
          )}

          {activeTab === 'transaksi' && (
            <TransactionFormView
              transaksiList={transaksiList}
              prokerList={prokerList}
              bidangList={OFFICIAL_IMM_BIDANG}
              userRole={userRole}
              onAddTransaksi={(trx) => setTransaksiList([trx, ...transaksiList])}
            />
          )}

          {activeTab === 'master-data' && (
            <MasterDataView
              bidangList={OFFICIAL_IMM_BIDANG}
              prokerList={prokerList}
              userRole={userRole}
              onAddProker={(p) => setProkerList([...prokerList, p])}
            />
          )}

          {activeTab === 'laporan' && (
            <ReportsView
              transaksiList={transaksiList}
              currentLevel={currentLevel}
              isAggregateMode={isAggregateMode}
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
