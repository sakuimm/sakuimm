import React, { useState } from 'react';
import { Transaksi, ProgramKerja, OrgLevel, UserRole } from '../types';
import { OFFICIAL_IMM_BIDANG } from '../data/mockData';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  PieChart as PieIcon,
  TrendingUp,
  Filter,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface DashboardViewProps {
  transaksiList: Transaksi[];
  prokerList: ProgramKerja[];
  currentLevel: OrgLevel;
  userRole: UserRole;
  isAggregateMode: boolean;
  onNavigateToTransaksi: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transaksiList,
  prokerList,
  currentLevel,
  userRole,
  isAggregateMode,
  onNavigateToTransaksi,
}) => {
  // Filter Subordinate Level Selector state for Pimpinan yang punya bawahan
  const [selectedSubordinateLevel, setSelectedSubordinateLevel] = useState<string>('ALL');

  // Aggregate Calculations
  const totalPemasukan = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Multiplier for Aggregate mode simulation
  const aggregateMultiplier = isAggregateMode
    ? (selectedSubordinateLevel === 'ALL'
        ? (currentLevel === 'DPP' ? 15 : currentLevel === 'DPD' ? 5 : 2)
        : selectedSubordinateLevel === 'PK' ? 1.5 : selectedSubordinateLevel === 'PC' ? 3 : 2)
    : 1;

  const displayPemasukan = totalPemasukan * aggregateMultiplier;
  const displayPengeluaran = totalPengeluaran * aggregateMultiplier;
  const displaySaldo = displayPemasukan - displayPengeluaran;

  // Chart 1 Data: Pie Chart Pengeluaran Per Kategori Proker
  const dataKategori = [
    { name: 'Kemahasiswaan', value: 3750000 * aggregateMultiplier, color: '#7A0C1E' },
    { name: 'Keagamaan', value: 450000 * aggregateMultiplier, color: '#0097A7' },
    { name: 'Kemasyarakatan', value: 1200000 * aggregateMultiplier, color: '#1D4ED8' },
  ];

  // Chart 2 Data: Pie Chart Pengeluaran Per Bidang (Instruksi screenshot: Ganti bar chart tren dengan pie chart pengeluaran per bidang)
  const dataPengeluaranBidang = [
    { name: 'Kader (KDR)', value: 1850000 * aggregateMultiplier, color: '#7A0C1E' },
    { name: 'Tabligh & Keislaman (TKK)', value: 450000 * aggregateMultiplier, color: '#0097A7' },
    { name: 'Sosial & Pemas. (SPM)', value: 1200000 * aggregateMultiplier, color: '#1D4ED8' },
    { name: 'Media & Komunikasi (MED)', value: 1200000 * aggregateMultiplier, color: '#F4A261' },
    { name: 'Ekonomi & Kewirausahaan (EKW)', value: 750000 * aggregateMultiplier, color: '#2E7D32' },
  ];

  const hasSubordinates = currentLevel !== 'PK';

  return (
    <div className="space-y-6">
      {/* Banner Status Agregat & Privasi Pimpinan */}
      <div className="bg-[#7A0C1E] text-white p-5 rounded-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 text-white">
            <ShieldCheck className="w-6 h-6 text-[#81B29A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base">Dashboard Ringkasan Beranda ({currentLevel})</h4>
              <span className="px-2 py-0.5 bg-[#0097A7] text-white font-bold text-[10px] rounded-full">
                Privasi Terjaga
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Pimpinan tingkat atas dapat memantau Total Pemasukan & Pengeluaran serta Pie Chart Pengeluaran Per Kategori/Bidang secara agregat tanpa mengekspos nota detail individu.
            </p>
          </div>
        </div>

        {/* Filter Pimpinan yang punya bawahan */}
        {hasSubordinates && (
          <div className="bg-white/10 border border-white/20 p-2.5 rounded-xl flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#81B29A]" />
            <span className="text-xs font-bold whitespace-nowrap">Filter Level Bawahan:</span>
            <select
              value={selectedSubordinateLevel}
              onChange={(e) => setSelectedSubordinateLevel(e.target.value)}
              className="px-2.5 py-1 bg-[#600917] border border-white/30 rounded-lg text-xs font-bold text-white focus:outline-none"
            >
              <option value="ALL">Keseluruhan Bawahan (Aggregated)</option>
              {currentLevel === 'DPP' && <option value="DPD">Level DPD (Daerah)</option>}
              {(currentLevel === 'DPP' || currentLevel === 'DPD') && <option value="PC">Level PC (Cabang)</option>}
              {(currentLevel === 'DPP' || currentLevel === 'DPD' || currentLevel === 'PC') && <option value="KORKOM">Level KORKOM</option>}
              <option value="PK">Level PK (Komisariat)</option>
            </select>
          </div>
        )}
      </div>

      {/* Top Stat Cards (3 Clean Cards: Total Saldo, Total Pemasukan, Total Pengeluaran) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Saldo */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Saldo Periode Berjalan
            </span>
            <div className="p-2 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1D4ED8] tracking-tight mb-2">
            Rp {displaySaldo.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#1D4ED8]/10 text-[#1D4ED8]">
              Kas Akumulatif
            </span>
            <span>Real-time Agregat</span>
          </div>
        </div>

        {/* Card 2: Total Pemasukan */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="p-2 rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2E7D32] tracking-tight mb-2">
            Rp {displayPemasukan.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#2E7D32]/10 text-[#2E7D32]">
              ↑ 15%
            </span>
            <span className="text-slate-500">vs bulan lalu</span>
          </div>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="p-2 rounded-full bg-[#C05621]/10 text-[#C05621]">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#C05621] tracking-tight mb-2">
            Rp {displayPengeluaran.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#C05621]/10 text-[#C05621]">
              ↓ 5%
            </span>
            <span className="text-slate-500">vs target anggaran</span>
          </div>
        </div>
      </div>

      {/* Middle Visualizations: 2 Pie Charts (Per Bidang & Per Kategori) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: PIE CHART PENGELUARAN PER BIDANG (Instruksi screenshot!) */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#7A0C1E]" />
              <span>Pie Chart Pengeluaran Per Bidang</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              22 Bidang IMM
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPengeluaranBidang}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataPengeluaranBidang.map((entry, index) => (
                    <Cell key={`cell-bidang-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-xs">
            {dataPengeluaranBidang.map((b) => (
              <div key={b.name} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: b.color }} />
                <span className="font-bold text-slate-700 block truncate">{b.name}</span>
                <span className="text-[11px] font-extrabold text-[#7A0C1E]">
                  Rp {(b.value / 1000).toLocaleString('id-ID')}k
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: PIE CHART PENGELUARAN PER KATEGORI (Keagamaan, Kemahasiswaan, Kemasyarakatan) */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#0097A7]" />
              <span>Pie Chart Pengeluaran Per Kategori</span>
            </h3>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0097A7]/15 text-[#0097A7]">
              Agregat Privasi
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataKategori}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataKategori.map((entry, index) => (
                    <Cell key={`cell-kat-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {dataKategori.map((k) => (
              <div key={k.name} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: k.color }} />
                <span className="font-bold text-slate-700 block truncate">{k.name}</span>
                <span className="text-[11px] font-extrabold text-[#0097A7]">
                  Rp {(k.value / 1000).toLocaleString('id-ID')}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Ringkasan per Program Kerja */}
      <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-[#2D3748] text-base">Ringkasan Anggaran Program Kerja</h3>
            <p className="text-xs text-slate-500">Rekapitulasi surplus/defisit kas per program kerja aktif</p>
          </div>
          <button
            onClick={onNavigateToTransaksi}
            className="px-3.5 py-1.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            + Buat Laporan Keuangan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-3">Nama Program Kerja</th>
                <th className="py-3 px-3">Bidang Naungan</th>
                <th className="py-3 px-3">Jadwal Pelaksanaan</th>
                <th className="py-3 px-3">Pemasukan</th>
                <th className="py-3 px-3">Pengeluaran</th>
                <th className="py-3 px-3">Surplus / Defisit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prokerList.map((pr) => {
                const pem = pr.id === 'pr-1' ? 3750000 : pr.id === 'pr-4' ? 2400000 : 0;
                const peng = pr.id === 'pr-1' ? 1850000 : pr.id === 'pr-2' ? 450000 : pr.id === 'pr-5' ? 1200000 : 0;
                const diff = pem - peng;
                return (
                  <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-extrabold text-[#2D3748]">{pr.namaProker}</td>
                    <td className="py-3 px-3 text-slate-600 font-medium">{pr.bidangNama}</td>
                    <td className="py-3 px-3 text-slate-500">{pr.tanggalPelaksanaan || '02 - 04 Sept 2026'}</td>
                    <td className="py-3 px-3 text-[#2E7D32] font-bold">
                      Rp {pem.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-[#C05621] font-bold">
                      Rp {peng.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          diff >= 0
                            ? 'bg-[#81B29A]/20 text-[#2D5A44]'
                            : 'bg-[#F4A261]/20 text-[#9C5217]'
                        }`}
                      >
                        {diff >= 0 ? `Surplus (+Rp ${diff.toLocaleString('id-ID')})` : `Defisit (-Rp ${Math.abs(diff).toLocaleString('id-ID')})`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
