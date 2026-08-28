import React, { useState } from 'react';
import { Bidang, ProgramKerja, KategoriProker, UserRole } from '../types';
import { FolderKanban, Plus, CheckCircle, ShieldCheck, Lock } from 'lucide-react';

interface MasterDataViewProps {
  bidangList: Bidang[];
  prokerList: ProgramKerja[];
  userRole: UserRole;
  onAddProker: (proker: ProgramKerja) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  bidangList,
  prokerList,
  userRole,
  onAddProker,
}) => {
  const [activeTab, setActiveTab] = useState<'bidang' | 'proker'>('bidang');
  const [newProkerNama, setNewProkerNama] = useState('');
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[0]?.id || 'b1');
  const [kategori, setKategori] = useState<KategoriProker>('Kemahasiswaan');

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
    };

    onAddProker(newP);
    setNewProkerNama('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Master Data Organisasi IMM</h2>
          <p className="text-xs text-slate-500">
            Data acuan 22 Bidang Resmi IMM dan Manajemen Program Kerja per Bidang
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveTab('bidang')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'bidang'
                ? 'bg-[#2D3748] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#2D3748]'
            }`}
          >
            22 Bidang Resmi IMM
          </button>
          <button
            onClick={() => setActiveTab('proker')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              activeTab === 'proker'
                ? 'bg-[#2D3748] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#2D3748]'
            }`}
          >
            Daftar Program Kerja
          </button>
        </div>
      </div>

      {activeTab === 'bidang' ? (
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#81B29A]" />
              <span>Daftar 22 Bidang Resmi IMM (Auto-Seeded)</span>
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#81B29A]/15 text-[#2D5A44]">
              Seeder Verifikasi Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {bidangList.map((b) => (
              <div
                key={b.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-[#2D3748] bg-[#2D3748]/10 px-1.5 py-0.5 rounded">
                    {b.kode}
                  </span>
                  <p className="text-xs font-bold text-[#2D3748] mt-1">{b.nama}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-[#81B29A]" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Create Proker (Hidden for Tim Verifikasi) */}
          {userRole !== 'tim_verifikasi_internal' && (
            <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F4A261]" />
                <span>Tambah Program Kerja Baru</span>
              </h3>

              <form onSubmit={handleCreateProker} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Pilih Bidang IMM
                  </label>
                  <select
                    value={selectedBidangId}
                    onChange={(e) => setSelectedBidangId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748]"
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
                    Nama Program Kerja
                  </label>
                  <input
                    type="text"
                    value={newProkerNama}
                    onChange={(e) => setNewProkerNama(e.target.value)}
                    placeholder="Contoh: Darul Arqam Dasar XXVII"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Kategori Wajib Proker
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriProker)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748]"
                  >
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                    <option value="Kemasyarakatan">Kemasyarakatan</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2D3748] hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
                >
                  + Simpan Proker Baru
                </button>
              </form>
            </div>
          )}

          {/* List Proker Table */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-card p-5 shadow-xs">
            <h3 className="font-bold text-[#2D3748] text-base mb-4">Daftar Program Kerja Aktif</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Nama Program Kerja</th>
                    <th className="py-2.5 px-3">Bidang Naungan</th>
                    <th className="py-2.5 px-3">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prokerList.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-[#2D3748]">{p.namaProker}</td>
                      <td className="py-3 px-3 text-slate-500">{p.bidangNama}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#2D3748]/10 text-[#2D3748]">
                          {p.kategori}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
