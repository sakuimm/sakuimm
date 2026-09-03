import React, { useState } from 'react';
import { Bidang, ProgramKerja, KategoriProker, UserRole } from '../types';
import { FolderKanban, Plus, CheckCircle, ShieldCheck, Lock, Calendar, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface MasterDataViewProps {
  bidangList: Bidang[];
  prokerList: ProgramKerja[];
  userRole: UserRole;
  onAddProker: (proker: ProgramKerja) => void;
  onToggleStatusProker?: (prokerId: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  bidangList,
  prokerList,
  userRole,
  onAddProker,
  onToggleStatusProker,
}) => {
  const [activeTab, setActiveTab] = useState<'proker' | 'bidang'>('proker');
  const [newProkerNama, setNewProkerNama] = useState('');
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[0]?.id || 'b1');
  const [kategori, setKategori] = useState<KategoriProker>('Kemahasiswaan');
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('02 - 04 September 2026');

  const handleCreateProker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProkerNama.trim()) return;

    const b = bidangList.find((item) => item.id === selectedBidangId);

    const newP: ProgramKerja = {
      id: `pr-${Math.floor(100 + Math.random() * 900)}`,
      bidangId: selectedBidangId,
      bidangNama: b?.nama || 'Bidang Organisasi',
      namaProker: newProkerNama,
      kategori,
      tanggalPelaksanaan: tanggalPelaksanaan || '02 - 04 September 2026',
      statusLaporan: 'Belum',
    };

    onAddProker(newP);
    setNewProkerNama('');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Manajemen Program Kerja IMM</h2>
          <p className="text-xs text-slate-500">
            Pengelolaan daftar Program Kerja per Bidang, Tanggal Pelaksanaan, dan Status Laporan Keuangan
          </p>
        </div>

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

      {activeTab === 'proker' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Tambah Program Kerja (Hidden for Read-Only Tim Verifikasi) */}
          {userRole !== 'tim_verifikasi_internal' ? (
            <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#81B29A]" />
                  <span>Tambah Program Kerja</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#81B29A]/15 text-[#2D5A44]">
                  Proker Form
                </span>
              </div>

              <form onSubmit={handleCreateProker} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Pilih Bidang IMM *
                  </label>
                  <select
                    value={selectedBidangId}
                    onChange={(e) => setSelectedBidangId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  >
                    {bidangList.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.kode} - {b.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Nama Program Kerja *
                  </label>
                  <input
                    type="text"
                    value={newProkerNama}
                    onChange={(e) => setNewProkerNama(e.target.value)}
                    placeholder="Contoh: Darul Arqam Dasar XXVII"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                {/* Tanggal Pelaksanaan Input (Sesuai instruksi screenshot: exp: 02 - 04 September 2026) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Tanggal Pelaksanaan *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tanggalPelaksanaan}
                      onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                      placeholder="Contoh: 02 - 04 September 2026"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Format contoh: 02 - 04 September 2026</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Kategori Proker *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriProker)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                    <option value="Kemasyarakatan">Kemasyarakatan</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  + Simpan Program Kerja
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
              <Lock className="w-8 h-8 text-slate-400" />
              <h4 className="font-bold text-xs text-[#2D3748]">Read-Only Mode</h4>
              <p className="text-[11px] text-slate-500">Tim Verifikasi tidak memiliki akses menambah proker baru.</p>
            </div>
          )}

          {/* List Program Kerja Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[#2D3748] text-base">Daftar Program Kerja & Status Laporan</h3>
              <span className="text-xs text-slate-500 font-medium">Total ({prokerList.length} Proker)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Nama Program Kerja</th>
                    <th className="py-2.5 px-3">Bidang Naungan</th>
                    <th className="py-2.5 px-3">Tanggal Pelaksanaan</th>
                    <th className="py-2.5 px-3">Status Laporan</th>
                    {userRole !== 'tim_verifikasi_internal' && <th className="py-2.5 px-3">Aksi Status</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prokerList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-extrabold text-[#2D3748]">
                        <p>{p.namaProker}</p>
                        <span className="text-[10px] font-normal text-slate-400">{p.kategori}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{p.bidangNama}</td>
                      <td className="py-3 px-3 text-slate-600 font-semibold">
                        {p.tanggalPelaksanaan || '02 - 04 September 2026'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.statusLaporan === 'Selesai'
                              ? 'bg-[#81B29A]/20 text-[#2D5A44]'
                              : 'bg-[#F4A261]/20 text-[#9C5217]'
                          }`}
                        >
                          {p.statusLaporan === 'Selesai' ? (
                            <><CheckCircle2 className="w-3 h-3" /> Selesai</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Belum</>
                          )}
                        </span>
                      </td>
                      {userRole !== 'tim_verifikasi_internal' && (
                        <td className="py-3 px-3">
                          <button
                            onClick={() => onToggleStatusProker && onToggleStatusProker(p.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-[#7A0C1E] hover:text-white text-[#2D3748] font-bold text-[10px] rounded-lg transition-all flex items-center gap-1"
                            title="Ubah Status Laporan"
                          >
                            <RefreshCw className="w-3 h-3" /> Switch Status
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: 22 Bidang Resmi IMM */
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#81B29A]" />
              <span>Daftar 22 Bidang Resmi IMM (Auto-Seeded)</span>
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#81B29A]/15 text-[#2D5A44]">
              Struktur Baku IMM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bidangList.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-[#7A0C1E] bg-[#7A0C1E]/10 px-2 py-0.5 rounded-full">
                    {b.kode}
                  </span>
                  <p className="text-xs font-bold text-[#2D3748] mt-1">{b.nama}</p>
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
