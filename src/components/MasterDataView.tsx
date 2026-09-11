import React, { useState, useMemo } from 'react';
import { Bidang, ProgramKerja, KategoriProker, UserRole } from '../types';
import {
  FolderKanban,
  Plus,
  CheckCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface MasterDataViewProps {
  bidangList: Bidang[];
  prokerList: ProgramKerja[];
  userRole: UserRole;
  onAddProker?: (proker: ProgramKerja) => void;
  onNavigateToInput?: () => void;
  onToggleStatusProker?: (prokerId: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  bidangList,
  prokerList,
  userRole,
  onNavigateToInput,
  onToggleStatusProker,
}) => {
  const [activeTab, setActiveTab] = useState<'proker' | 'bidang'>('proker');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');

  // Filtered proker list
  const filteredProkers = useMemo(() => {
    return prokerList.filter((p) => {
      const matchSearch =
        p.namaProker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bidangNama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.penanggungJawab && p.penanggungJawab.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchKategori = filterKategori === 'Semua' || p.kategori === filterKategori;
      const matchStatus = filterStatus === 'Semua' || (filterStatus === 'Selesai' ? p.statusLaporan === 'Selesai' : p.statusLaporan !== 'Selesai');

      return matchSearch && matchKategori && matchStatus;
    });
  }, [prokerList, searchTerm, filterKategori, filterStatus]);

  const totalSelesai = prokerList.filter((p) => p.statusLaporan === 'Selesai').length;
  const totalBelum = prokerList.length - totalSelesai;

  const formatRupiah = (val?: number) => {
    if (!val) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Program Kerja</span>
            <span>&gt;</span>
            <span className="text-[#7A0C1E] font-bold">Daftar Program Kerja</span>
          </div>
          <h2 className="text-xl font-black text-[#2D3748] tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-[#7A0C1E]" />
            <span>Daftar & Monitoring Program Kerja</span>
          </h2>
          <p className="text-xs text-slate-500">
            Daftar seluruh agenda program kerja per bidang naungan IMM, pemantauan status penyelesaian LPJ, serta struktur 22 bidang resmi.
          </p>
        </div>

        {/* Right Header Actions: Navigation button to Input & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {userRole !== 'tim_verifikasi_internal' && onNavigateToInput && (
            <button
              onClick={onNavigateToInput}
              className="px-4 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Program Kerja Baru</span>
            </button>
          )}

          {/* Tab Selector */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('proker')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'proker'
                  ? 'bg-[#7A0C1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#7A0C1E]'
              }`}
            >
              Daftar Program Kerja
            </button>
            <button
              onClick={() => setActiveTab('bidang')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'bidang'
                  ? 'bg-[#7A0C1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#7A0C1E]'
              }`}
            >
              22 Bidang Resmi IMM
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'proker' ? (
        <div className="space-y-4">
          {/* Metrics Summary Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Program Kerja</p>
                <p className="text-xl font-black text-[#2D3748] mt-0.5">{prokerList.length} Proker</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <FolderKanban className="w-5 h-5 text-[#7A0C1E]" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Laporan LPJ Selesai</p>
                <p className="text-xl font-black text-[#2D5A44] mt-0.5">{totalSelesai} Proker</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#81B29A]/20 text-[#2D5A44] flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#81B29A]" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Belum Laporan LPJ</p>
                <p className="text-xl font-black text-[#9C5217] mt-0.5">{totalBelum} Proker</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F4A261]/20 text-[#9C5217] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-[#F4A261]" />
              </div>
            </div>
          </div>

          {/* Full-width List Program Kerja Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama proker, bidang, atau penanggung jawab..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-semibold text-slate-500">Kategori:</span>
                </div>
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Kemahasiswaan">Kemahasiswaan</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Kemasyarakatan">Kemasyarakatan</option>
                </select>

                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[11px] font-semibold text-slate-500">Status:</span>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Selesai">LPJ Selesai</option>
                  <option value="Belum">Belum LPJ</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Nama Program Kerja</th>
                    <th className="py-3 px-4">Bidang Naungan</th>
                    <th className="py-3 px-4">Tanggal Pelaksanaan</th>
                    <th className="py-3 px-4">Estimasi / PIC</th>
                    <th className="py-3 px-4">Status Laporan</th>
                    {userRole !== 'tim_verifikasi_internal' && <th className="py-3 px-4 text-center">Aksi Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProkers.length > 0 ? (
                    filteredProkers.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-[#2D3748]">
                          <p className="text-xs font-bold text-[#2D3748]">{p.namaProker}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {p.kategori}
                            </span>
                            {p.deskripsi && (
                              <span className="text-[10px] text-slate-400 truncate max-w-xs" title={p.deskripsi}>
                                • {p.deskripsi}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-[#2D3748] text-xs font-medium">
                            <Layers className="w-3 h-3 text-[#7A0C1E]" />
                            {p.bidangNama}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {p.tanggalPelaksanaan || '02 - 04 September 2026'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {p.targetAnggaran ? (
                            <p className="font-bold text-[#7A0C1E]">{formatRupiah(p.targetAnggaran)}</p>
                          ) : (
                            <p className="text-slate-400">-</p>
                          )}
                          <p className="text-[10px] text-slate-400">{p.penanggungJawab || 'PIC: -'}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              p.statusLaporan === 'Selesai'
                                ? 'bg-[#81B29A]/20 text-[#2D5A44]'
                                : 'bg-[#F4A261]/20 text-[#9C5217]'
                            }`}
                          >
                            {p.statusLaporan === 'Selesai' ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" /> LPJ Selesai</>
                            ) : (
                              <><Clock className="w-3.5 h-3.5" /> Belum LPJ</>
                            )}
                          </span>
                        </td>
                        {userRole !== 'tim_verifikasi_internal' && (
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => onToggleStatusProker && onToggleStatusProker(p.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-[#7A0C1E] hover:text-white text-[#2D3748] font-bold text-[10px] rounded-lg transition-all inline-flex items-center gap-1.5"
                              title="Ubah Status Laporan"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Switch Status</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={userRole !== 'tim_verifikasi_internal' ? 6 : 5} className="py-8 text-center text-slate-400">
                        Tidak ada program kerja yang cocok dengan pencarian / filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom summary bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>Menampilkan {filteredProkers.length} dari {prokerList.length} total program kerja</span>
              {userRole !== 'tim_verifikasi_internal' && onNavigateToInput && (
                <button
                  onClick={onNavigateToInput}
                  className="text-[#7A0C1E] font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Tambah program kerja baru</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: 22 Bidang Resmi IMM */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#81B29A]" />
              <span>Daftar 22 Bidang Resmi IMM (Auto-Seeded)</span>
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#81B29A]/15 text-[#2D5A44]">
              Struktur Baku Tanfidz IMM
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Daftar 22 bidang ini terintegrasi secara nasional untuk memastikan keselarasan nomenklatur pelaporan dari tingkat Komisariat hingga Dewan Pimpinan Pusat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {bidangList.map((b) => (
              <div
                key={b.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-[#7A0C1E]/30 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-[#7A0C1E] bg-[#7A0C1E]/10 px-2 py-0.5 rounded-full">
                    {b.kode}
                  </span>
                  <p className="text-xs font-bold text-[#2D3748] mt-1.5">{b.nama}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-[#81B29A]" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
