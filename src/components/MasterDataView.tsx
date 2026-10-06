import React, { useState } from 'react';
import { Bidang, ProgramKerja, KategoriProker, UserRole, Transaksi, OrgLevel } from '../types';
import { DetailLaporanProkerView } from './DetailLaporanProkerView';
import { PrintableProkerReportModal } from './PrintableProkerReportModal';
import { exportService } from '../services/exportService';
import { FolderKanban, Plus, CheckCircle, ShieldCheck, Lock, Calendar, CheckCircle2, Clock, Eye, FileText, Edit3, Trash2, X } from 'lucide-react';

interface MasterDataViewProps {
  bidangList: Bidang[];
  prokerList: ProgramKerja[];
  transaksiList?: Transaksi[];
  currentLevel?: OrgLevel;
  userRole: UserRole;
  onAddProker: (proker: ProgramKerja) => void;
  onUpdateProker?: (proker: ProgramKerja) => void;
  onDeleteProker?: (prokerId: string) => void;
  onSubmitProkerLPJ?: (prokerId: string) => void;
  onReopenProkerLPJ?: (prokerId: string) => void;
  onToggleStatusProker?: (prokerId: string) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  bidangList,
  prokerList,
  transaksiList = [],
  currentLevel = 'PK',
  userRole,
  onAddProker,
  onUpdateProker,
  onDeleteProker,
  onSubmitProkerLPJ,
  onReopenProkerLPJ,
  onToggleStatusProker,
}) => {
  const [activeTab, setActiveTab] = useState<'proker' | 'bidang'>('proker');
  const [newProkerNama, setNewProkerNama] = useState('');
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[0]?.id || 'b1');
  const [kategori, setKategori] = useState<KategoriProker>('Kemahasiswaan');
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('02 - 04 September 2026');

  // Edit Proker Modal State
  const [editingProker, setEditingProker] = useState<ProgramKerja | null>(null);

  // Modal / Detail View States
  const [selectedProkerForDetail, setSelectedProkerForDetail] = useState<ProgramKerja | null>(null);
  const [selectedProkerForPrint, setSelectedProkerForPrint] = useState<ProgramKerja | null>(null);

  const getOrgName = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PK IMM Teknik Mesin UI';
      case 'KORKOM': return 'KORKOM IMM Universitas Indonesia';
      case 'PC': return 'PC IMM Jakarta Selatan';
      case 'DPD': return 'DPD IMM DKI Jakarta';
      case 'DPP': return 'DPP IMM (Pusat)';
    }
  };

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

  const handleUpdateProkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProker || !onUpdateProker) return;
    onUpdateProker(editingProker);
    setEditingProker(null);
  };

  const handleDeleteProkerClick = (id: string, nama: string) => {
    if (!onDeleteProker) return;
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus Program Kerja "${nama}"? Data transaksi terkait juga perlu diperiksa.`);
    if (confirmDelete) {
      onDeleteProker(id);
    }
  };

  const handleExportExcel = () => {
    exportService.exportProkerSummaryToExcel(prokerList, transaksiList, currentLevel);
  };

  // Render Full Detail Laporan Kegiatan View if selected
  if (selectedProkerForDetail) {
    // Keep updated reference from prokerList
    const activeProker = prokerList.find(p => p.id === selectedProkerForDetail.id) || selectedProkerForDetail;

    return (
      <>
        <DetailLaporanProkerView
          proker={activeProker}
          transaksiList={transaksiList}
          currentLevel={currentLevel}
          currentOrgName={getOrgName(currentLevel)}
          onBack={() => setSelectedProkerForDetail(null)}
          onOpenPrintModal={(p) => setSelectedProkerForPrint(p)}
          onExportExcel={handleExportExcel}
          onSubmitLPJ={onSubmitProkerLPJ}
          onReopenLPJ={onReopenProkerLPJ}
        />

        {selectedProkerForPrint && (
          <PrintableProkerReportModal
            proker={selectedProkerForPrint}
            transaksiList={transaksiList}
            currentLevel={currentLevel}
            currentOrgName={getOrgName(currentLevel)}
            onClose={() => setSelectedProkerForPrint(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Manajemen Program Kerja IMM</h2>
          <p className="text-xs text-slate-500">
            Pengelolaan daftar Program Kerja per Bidang, Tanggal Pelaksanaan, dan Laporan Keuangan
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
                  <span>Formulir Pendaftaran Proker</span>
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#7A0C1E]/10 text-[#7A0C1E]">
                  Wajib Isi Tanda *
                </span>
              </div>

              <form onSubmit={handleCreateProker} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    PILIH BIDANG IMM *
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
                  <p className="text-[10px] text-slate-400 mt-1">Sesuai standar struktur baku 22 Bidang Tanfidz IMM</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    NAMA PROGRAM KERJA *
                  </label>
                  <input
                    type="text"
                    value={newProkerNama}
                    onChange={(e) => setNewProkerNama(e.target.value)}
                    placeholder="Contoh: Darul Arqam Dasar (DAD) XXVI"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  />
                </div>

                {/* Tanggal Pelaksanaan Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    TANGGAL PELAKSANAAN *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tanggalPelaksanaan}
                      onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                      placeholder="02 - 04 September 2026"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Format: DD - DD Bulan YYYY</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    KATEGORI KEGIATAN *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriProker)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                  >
                    <option value="Kemahasiswaan">Kemahasiswaan</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kemasyarakatan">Kemasyarakatan</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Trikompetensi Dasar IMM</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    + Daftarkan Program Kerja
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProkerNama('');
                      setTanggalPelaksanaan('02 - 04 September 2026');
                    }}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
                  >
                    Reset
                  </button>
                </div>
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
              <h3 className="font-bold text-[#2D3748] text-base">Daftar Program Kerja & Status LPJ</h3>
              <span className="text-xs text-slate-500 font-medium">Total ({prokerList.length} Proker)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Nama Program Kerja</th>
                    <th className="py-2.5 px-3">Bidang Naungan</th>
                    <th className="py-2.5 px-3">Tanggal Pelaksanaan</th>
                    <th className="py-2.5 px-3">Status LPJ</th>
                    <th className="py-2.5 px-3">Aksi Laporan Keuangan</th>
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
                            <><CheckCircle2 className="w-3 h-3" /> LPJ Selesai</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Belum LPJ</>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedProkerForDetail(p)}
                            className="px-2.5 py-1.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-xs active:scale-95"
                            title="Lihat Detail Laporan Keuangan Kegiatan"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#81B29A]" />
                            <span>Lihat Detail</span>
                          </button>

                          {userRole !== 'tim_verifikasi_internal' && (
                            <>
                              <button
                                onClick={() => setEditingProker(p)}
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg transition-all border border-amber-200"
                                title="Edit Program Kerja"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteProkerClick(p.id, p.namaProker)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-lg transition-all border border-red-200"
                                title="Hapus Program Kerja"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
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

      {/* EDIT PROGRAM KERJA MODAL */}
      {editingProker && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7A0C1E]/10 text-[#7A0C1E]">
                  Edit Program Kerja
                </span>
                <h3 className="text-base font-extrabold text-[#2D3748] mt-1">Ubah Data Agenda Proker</h3>
              </div>
              <button
                onClick={() => setEditingProker(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProkerSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nama Program Kerja *
                </label>
                <input
                  type="text"
                  value={editingProker.namaProker}
                  onChange={(e) => setEditingProker({ ...editingProker, namaProker: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tanggal Pelaksanaan *
                </label>
                <input
                  type="text"
                  value={editingProker.tanggalPelaksanaan || ''}
                  onChange={(e) => setEditingProker({ ...editingProker, tanggalPelaksanaan: e.target.value })}
                  placeholder="02 - 04 September 2026"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Kategori Kegiatan *
                </label>
                <select
                  value={editingProker.kategori}
                  onChange={(e) => setEditingProker({ ...editingProker, kategori: e.target.value as KategoriProker })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                >
                  <option value="Kemahasiswaan">Kemahasiswaan</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Kemasyarakatan">Kemasyarakatan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={editingProker.penanggungJawab || ''}
                  onChange={(e) => setEditingProker({ ...editingProker, penanggungJawab: e.target.value })}
                  placeholder="Nama PIC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Deskripsi Program Kerja
                </label>
                <textarea
                  value={editingProker.deskripsi || ''}
                  onChange={(e) => setEditingProker({ ...editingProker, deskripsi: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProker(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PROKER REPORT MODAL */}
      {selectedProkerForPrint && (
        <PrintableProkerReportModal
          proker={selectedProkerForPrint}
          transaksiList={transaksiList}
          currentLevel={currentLevel}
          currentOrgName={getOrgName(currentLevel)}
          onClose={() => setSelectedProkerForPrint(null)}
        />
      )}
    </div>
  );
};
