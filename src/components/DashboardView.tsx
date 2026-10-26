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

import { INDONESIAN_MONTH_NAMES, parseDateParts } from '../utils/dateUtils';

interface DashboardViewProps {
  transaksiList: Transaksi[];
  allTransaksiList?: Transaksi[];
  prokerList: ProgramKerja[];
  currentLevel: OrgLevel;
  userRole: UserRole;
  isAggregateMode: boolean;
  onNavigateToTransaksi: () => void;
  selectedBulan?: string;
  selectedTahun?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transaksiList,
  allTransaksiList,
  prokerList,
  currentLevel,
  userRole,
  isAggregateMode,
  onNavigateToTransaksi,
  selectedBulan = 'ALL',
  selectedTahun = '2026',
}) => {
  // Filter Subordinate Level Selector state for Pimpinan yang punya bawahan
  const [selectedSubordinateLevel, setSelectedSubordinateLevel] = useState<string>('ALL');

  // Filter active transactions and proker by selected level
  const activeTrx = selectedSubordinateLevel === 'ALL'
    ? transaksiList
    : transaksiList.filter((t) => (t.organisasiLevel || 'PK') === selectedSubordinateLevel);

  const activeProker = selectedSubordinateLevel === 'ALL'
    ? prokerList
    : prokerList.filter((p) => (p.organisasiLevel || 'PK') === selectedSubordinateLevel);

  // Real Aggregate Calculations
  const totalPemasukan = activeTrx
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = activeTrx
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  const displayPemasukan = totalPemasukan;
  const displayPengeluaran = totalPengeluaran;
  const displaySaldo = displayPemasukan - displayPengeluaran;

  // Dynamic Metric 1: vs Bulan Lalu (Pemasukan)
  const sourceList = allTransaksiList || transaksiList;
  const filteredSourceBySubLevel = selectedSubordinateLevel === 'ALL'
    ? sourceList
    : sourceList.filter((t) => (t.organisasiLevel || 'PK') === selectedSubordinateLevel);

  let prevMonth: number | null = null;
  let prevYear: number | null = null;

  if (selectedBulan !== 'ALL') {
    const currM = parseInt(selectedBulan, 10);
    const currY = selectedTahun !== 'ALL' ? parseInt(selectedTahun, 10) : 2026;
    prevMonth = currM === 1 ? 12 : currM - 1;
    prevYear = currM === 1 ? currY - 1 : currY;
  } else {
    // If 'ALL' months selected, compare against previous month based on current calendar month
    const now = new Date();
    const currM = now.getMonth() + 1;
    prevMonth = currM === 1 ? 12 : currM - 1;
    prevYear = selectedTahun !== 'ALL' ? parseInt(selectedTahun, 10) : now.getFullYear();
  }

  const prevMonthTrx = filteredSourceBySubLevel.filter((t) => {
    if (t.jenisNominal !== 'pemasukan') return false;
    const { month, year } = parseDateParts(t.tanggal);
    return month === prevMonth && (prevYear === null || year === null || year === prevYear);
  });

  const pemasukanBulanLalu = prevMonthTrx.reduce((sum, t) => sum + t.nominal, 0);

  let pemasukanBadgeText = '0%';
  let pemasukanBadgeClass = 'bg-slate-100 text-slate-500';

  if (pemasukanBulanLalu > 0) {
    const diffPct = Math.round(((displayPemasukan - pemasukanBulanLalu) / pemasukanBulanLalu) * 100);
    if (diffPct >= 0) {
      pemasukanBadgeText = `↑ +${diffPct}%`;
      pemasukanBadgeClass = 'bg-[#2E7D32]/10 text-[#2E7D32]';
    } else {
      pemasukanBadgeText = `↓ ${diffPct}%`;
      pemasukanBadgeClass = 'bg-[#C05621]/10 text-[#C05621]';
    }
  } else if (displayPemasukan > 0) {
    pemasukanBadgeText = '↑ +100%';
    pemasukanBadgeClass = 'bg-[#2E7D32]/10 text-[#2E7D32]';
  } else {
    pemasukanBadgeText = '0%';
    pemasukanBadgeClass = 'bg-slate-100 text-slate-500';
  }

  // Dynamic Metric 2: vs Target Anggaran (Pengeluaran)
  const totalTargetAnggaran = activeProker.reduce((sum, p) => sum + (p.targetAnggaran || 0), 0);

  let pengeluaranBadgeText = 'Fleksibel';
  let pengeluaranBadgeClass = 'bg-blue-50 text-[#1D4ED8]';

  if (totalTargetAnggaran > 0) {
    const variancePct = Math.round(((displayPengeluaran - totalTargetAnggaran) / totalTargetAnggaran) * 100);
    if (displayPengeluaran > totalTargetAnggaran) {
      pengeluaranBadgeText = `+${variancePct}%`;
      pengeluaranBadgeClass = 'bg-[#C05621]/10 text-[#C05621]'; // Melebihi target anggaran
    } else {
      pengeluaranBadgeText = `${variancePct}%`; // e.g. -25% vs target anggaran
      pengeluaranBadgeClass = 'bg-[#2E7D32]/10 text-[#2E7D32]'; // Aman dalam pagu anggaran
    }
  } else {
    pengeluaranBadgeText = 'Fleksibel';
    pengeluaranBadgeClass = 'bg-blue-50 text-[#1D4ED8]';
  }

  // Dynamic Chart 1 Data: Pengeluaran Per Kategori Proker
  const kemahasiswaanVal = activeTrx
    .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Kemahasiswaan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const keagamaanVal = activeTrx
    .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Keagamaan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const kemasyarakatanVal = activeTrx
    .filter((t) => t.jenisNominal === 'pengeluaran' && t.kategoriProker === 'Kemasyarakatan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalKategoriExpense = kemahasiswaanVal + keagamaanVal + kemasyarakatanVal;

  const dataKategori = [
    { name: 'Kemahasiswaan', value: kemahasiswaanVal, color: '#7A0C1E' },
    { name: 'Keagamaan', value: keagamaanVal, color: '#0097A7' },
    { name: 'Kemasyarakatan', value: kemasyarakatanVal, color: '#1D4ED8' },
  ];

  // Dynamic Chart 2 Data: Pengeluaran Per Bidang
  const bidangExpensesMap: Record<string, number> = {};
  activeTrx
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .forEach((t) => {
      const bNama = t.bidangNama || 'Umum';
      bidangExpensesMap[bNama] = (bidangExpensesMap[bNama] || 0) + t.nominal;
    });

  const chartColors = ['#7A0C1E', '#0097A7', '#1D4ED8', '#F4A261', '#2E7D32', '#C05621', '#4A5568'];

  const dataPengeluaranBidangRaw = Object.keys(bidangExpensesMap).map((bNama, index) => ({
    name: bNama,
    value: bidangExpensesMap[bNama],
    color: chartColors[index % chartColors.length]
  }));

  const totalBidangExpense = dataPengeluaranBidangRaw.reduce((sum, b) => sum + b.value, 0);

  const dataPengeluaranBidang = dataPengeluaranBidangRaw.length > 0
    ? dataPengeluaranBidangRaw
    : [{ name: 'Belum Ada Pengeluaran', value: 0, color: '#CBD5E1' }];

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
              <h4 className="font-extrabold text-base">
                {currentLevel === 'DPP'
                  ? 'Ikhtisar Keuangan (DPP IMM) | View Only'
                  : currentLevel === 'KORKOM'
                  ? 'Ikhtisar Keuangan (KORKOM IMM) | View Only'
                  : `Ikhtisar Keuangan (${currentLevel} IMM)`}
              </h4>
              <span className="px-2 py-0.5 bg-[#0097A7] text-white font-bold text-[10px] rounded-full">
                Privasi Terjaga
              </span>
              <span className="px-2 py-0.5 bg-white/20 text-white font-bold text-[10px] rounded-full">
                Periode: {selectedBulan !== 'ALL' ? `${INDONESIAN_MONTH_NAMES[parseInt(selectedBulan, 10) - 1]} ` : ''}{selectedTahun !== 'ALL' ? selectedTahun : 'Semua'}
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Pimpinan dapat memantau Total Pemasukan & Pengeluaran serta Grafik Pengeluaran Per Bidang dan Per Kategori secara agregat tanpa mengekspos nota detail individu.
            </p>
          </div>
        </div>

        {/* Filter Pimpinan yang punya bawahan */}
        {hasSubordinates && (
          <div className="bg-white/10 border border-white/20 p-2.5 rounded-xl flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#81B29A]" />
            <span className="text-xs font-bold whitespace-nowrap">Filter Level Pimpinan:</span>
            <select
              value={selectedSubordinateLevel}
              onChange={(e) => setSelectedSubordinateLevel(e.target.value)}
              className="px-2.5 py-1 bg-[#600917] border border-white/30 rounded-lg text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Pimpinan</option>
              {currentLevel === 'DPP' && <option value="DPD">Level DPD (Daerah)</option>}
              {(currentLevel === 'DPP' || currentLevel === 'DPD') && <option value="PC">Level PC (Cabang)</option>}
              {(currentLevel === 'DPP' || currentLevel === 'DPD' || currentLevel === 'PC') && <option value="KORKOM">Level KORKOM</option>}
              <option value="PK">Level PK (Komisariat)</option>
            </select>
          </div>
        )}
      </div>

      {/* Empty State Banner jika periode tidak memiliki transaksi */}
      {activeTrx.length === 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
            <span>
              Belum ada transaksi pada periode <strong>{selectedBulan !== 'ALL' ? INDONESIAN_MONTH_NAMES[parseInt(selectedBulan, 10) - 1] : 'Semua Bulan'} {selectedTahun}</strong>.
            </span>
          </div>
          <span className="text-[11px] text-amber-700">
            Pilih opsi <em>"Semua Bulan"</em> di header untuk melihat data kumulatif.
          </span>
        </div>
      )}

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
            <span className={`px-2 py-0.5 rounded-full font-bold ${pemasukanBadgeClass}`}>
              {pemasukanBadgeText}
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
            <span className={`px-2 py-0.5 rounded-full font-bold ${pengeluaranBadgeClass}`}>
              {pengeluaranBadgeText}
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
              <span>Pengeluaran Per Bidang</span>
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

        {/* Chart 2: PENGELUARAN PER KATEGORI (Keagamaan, Kemahasiswaan, Kemasyarakatan) */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#0097A7]" />
              <span>Pengeluaran Per Kategori</span>
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
            + Input Transaksi
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
              {activeProker.map((pr) => {
                const pTrx = activeTrx.filter((t) => t.programKerjaId === pr.id);
                const pem = pTrx
                  .filter((t) => t.jenisNominal === 'pemasukan')
                  .reduce((sum, t) => sum + t.nominal, 0);
                const peng = pTrx
                  .filter((t) => t.jenisNominal === 'pengeluaran')
                  .reduce((sum, t) => sum + t.nominal, 0);
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
