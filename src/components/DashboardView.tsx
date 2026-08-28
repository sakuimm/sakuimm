import React from 'react';
import { Transaksi, ProgramKerja, OrgLevel, UserRole } from '../types';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  UploadCloud,
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
  // Aggregate Calculations
  const totalPemasukan = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Multiplier for Aggregate mode simulation
  const aggregateMultiplier = isAggregateMode ? (currentLevel === 'DPP' ? 15 : currentLevel === 'DPD' ? 5 : 2) : 1;
  const displayPemasukan = totalPemasukan * aggregateMultiplier;
  const displayPengeluaran = totalPengeluaran * aggregateMultiplier;
  const displaySaldo = displayPemasukan - displayPengeluaran;

  // Chart 1 Data: Kategori Proker
  const dataKategori = [
    { name: 'Kemahasiswaan', value: 3750000 * aggregateMultiplier, color: '#7A0C1E' },
    { name: 'Keagamaan', value: 450000 * aggregateMultiplier, color: '#0097A7' },
    { name: 'Kemasyarakatan', value: 1200000 * aggregateMultiplier, color: '#1D4ED8' },
  ];

  // Chart 2 Data: Jenis Transaksi (Operasional vs Inventaris)
  const dataJenisTrx = [
    { name: 'Operasional', value: 6050000 * aggregateMultiplier, color: '#7A0C1E' },
    { name: 'Inventaris', value: 1200000 * aggregateMultiplier, color: '#0097A7' },
  ];

  // Chart 3 Data: Tren Bulanan
  const dataTrenBulanan = [
    { bulan: 'Jan', pemasukan: 4200000, pengeluaran: 3100000 },
    { bulan: 'Feb', pemasukan: 3800000, pengeluaran: 2900000 },
    { bulan: 'Mar', pemasukan: 5100000, pengeluaran: 4200000 },
    { bulan: 'Apr', pemasukan: 4600000, pengeluaran: 3800000 },
    { bulan: 'Mei', pemasukan: 6200000, pengeluaran: 4900000 },
    { bulan: 'Jun', pemasukan: 5800000, pengeluaran: 4100000 },
    { bulan: 'Jul', pemasukan: 4900000, pengeluaran: 3600000 },
    { bulan: 'Agu', pemasukan: displayPemasukan, pengeluaran: displayPengeluaran },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Status Agregat */}
      {isAggregateMode && (
        <div className="bg-[#7A0C1E] text-white p-4 rounded-card flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20 text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Mode Roll-up Agregat Nasional/Wilayah Aktif</h4>
              <p className="text-xs text-slate-200">
                Menampilkan kalkulasi otomatis akumulasi data dari seluruh {currentLevel === 'DPP' ? '34 DPD, Cabang & Komisariat se-Indonesia' : 'Cabang & Komisariat turunan'}.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#0097A7] text-white font-bold text-xs rounded-full">
            Simulasi Multi-Level
          </span>
        </div>
      )}

      {/* Top Stat Cards (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Saldo */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
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
            <span>Real-time DB</span>
          </div>
        </div>

        {/* Card 2: Total Pemasukan */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
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
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
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

        {/* Card 4: Google Drive Sync Status */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Google Drive Queue
            </span>
            <div className="p-2 rounded-full bg-[#2D3748]/10 text-[#2D3748]">
              <UploadCloud className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#2D3748] tracking-tight mb-2 flex items-center gap-2">
            <span>4 / 5</span>
            <span className="text-xs font-semibold text-slate-400">Bukti Synced</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#F4A261]/15 text-[#9C5217] flex items-center gap-1">
              <Clock className="w-3 h-3" /> 1 Queue Pending
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Pie Chart Kategori Proker */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#81B29A]" />
              <span>Pengeluaran Kategori Proker</span>
            </h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataKategori}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataKategori.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {dataKategori.map((k) => (
              <div key={k.name} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: k.color }} />
                <span className="font-semibold text-slate-600 block truncate">{k.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Donut Chart Jenis Transaksi */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#F4A261]" />
              <span>Jenis Transaksi</span>
            </h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataJenisTrx}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataJenisTrx.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
            {dataJenisTrx.map((j) => (
              <div key={j.name} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: j.color }} />
                <span className="font-semibold text-slate-600 block">{j.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Bar Chart Tren Bulanan */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2D3748]" />
              <span>Tren Pemasukan vs Pengeluaran</span>
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataTrenBulanan}>
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Bar dataKey="pemasukan" fill="#2E7D32" name="Pemasukan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" fill="#C05621" name="Pengeluaran" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table 1: Ringkasan per Program Kerja (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-card p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D3748] text-base">Ringkasan Per Program Kerja</h3>
            <span className="text-xs text-slate-500 font-medium">Periode Agustus 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Nama Program Kerja</th>
                  <th className="py-2.5 px-3">Bidang</th>
                  <th className="py-2.5 px-3">Pemasukan</th>
                  <th className="py-2.5 px-3">Pengeluaran</th>
                  <th className="py-2.5 px-3">Surplus / Defisit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prokerList.map((pr) => {
                  const pem = pr.id === 'pr-1' ? 3750000 : pr.id === 'pr-4' ? 2400000 : 0;
                  const peng = pr.id === 'pr-1' ? 1850000 : pr.id === 'pr-2' ? 450000 : pr.id === 'pr-5' ? 1200000 : 0;
                  const diff = pem - peng;
                  return (
                    <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#2D3748]">{pr.namaProker}</td>
                      <td className="py-3 px-3 text-slate-500">{pr.bidangNama}</td>
                      <td className="py-3 px-3 text-[#81B29A] font-semibold">
                        Rp {pem.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3 text-[#F4A261] font-semibold">
                        Rp {peng.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            diff >= 0
                              ? 'bg-[#81B29A]/15 text-[#2D5A44]'
                              : 'bg-[#F4A261]/15 text-[#9C5217]'
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

        {/* Table 2: 10 Transaksi Terbaru */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2D3748] text-base">Transaksi Terbaru</h3>
              <button
                onClick={onNavigateToTransaksi}
                className="text-xs font-bold text-[#2D3748] hover:underline"
              >
                Lihat Semua →
              </button>
            </div>

            <div className="space-y-3">
              {transaksiList.slice(0, 4).map((trx) => (
                <div
                  key={trx.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#2D3748] line-clamp-1">{trx.keterangan}</p>
                    <p className="text-[10px] text-slate-400">{trx.tanggal} • {trx.bidangNama.split(' ')[1]}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-extrabold ${
                        trx.jenisNominal === 'pemasukan' ? 'text-[#81B29A]' : 'text-[#F4A261]'
                      }`}
                    >
                      {trx.jenisNominal === 'pemasukan' ? '+' : '-'}Rp {trx.nominal.toLocaleString('id-ID')}
                    </p>
                    {trx.uploadStatus === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#2D5A44] bg-[#81B29A]/15 px-1.5 py-0.2 rounded-full mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> GDrive Sync
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#9C5217] bg-[#F4A261]/15 px-1.5 py-0.2 rounded-full mt-0.5">
                        <Clock className="w-2.5 h-2.5" /> Queue Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {userRole !== 'tim_verifikasi_internal' && (
            <button
              onClick={onNavigateToTransaksi}
              className="w-full mt-4 py-2 bg-[#2D3748] hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
            >
              + Input Transaksi Nota Baru
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
