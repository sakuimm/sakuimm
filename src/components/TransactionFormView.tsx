import React, { useState } from 'react';
import { Transaksi, ProgramKerja, Bidang, JenisNominal, JenisTransaksi, UserRole } from '../types';
import { apiService } from '../services/apiService';
import { Camera, Upload, CheckCircle2, History, PlusCircle, AlertCircle, Image as ImageIcon, ShieldCheck, Lock, Edit3, Trash2, X, RotateCcw, Search } from 'lucide-react';

interface TransactionFormViewProps {
  transaksiList: Transaksi[];
  prokerList: ProgramKerja[];
  bidangList: Bidang[];
  userRole: UserRole;
  onAddTransaksi: (trx: Transaksi) => void;
  onUpdateTransaksi?: (trx: Transaksi) => void;
  onDeleteTransaksi?: (id: string) => void;
  onResubmitTransaksi?: (id: string) => void;
}

export const TransactionFormView: React.FC<TransactionFormViewProps> = ({
  transaksiList,
  prokerList,
  bidangList,
  userRole,
  onAddTransaksi,
  onUpdateTransaksi,
  onDeleteTransaksi,
  onResubmitTransaksi,
}) => {
  const [tanggal, setTanggal] = useState('2026-08-28');
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[1]?.id || 'b2');
  const [selectedProkerId, setSelectedProkerId] = useState(prokerList[0]?.id || 'pr-1');
  const [keterangan, setKeterangan] = useState('');
  const [jenisNominal, setJenisNominal] = useState<JenisNominal>('pengeluaran');
  const [nominalStr, setNominalStr] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState<JenisTransaksi>('operasional');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<Transaksi | null>(null);
  const [editingTransaksi, setEditingTransaksi] = useState<Transaksi | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleUpdateTransaksiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaksi || !onUpdateTransaksi) return;
    onUpdateTransaksi(editingTransaksi);
    setEditingTransaksi(null);
  };

  const handleDeleteTransaksiClick = (id: string, ket: string) => {
    if (!onDeleteTransaksi) return;
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus transaksi "${ket}"?`);
    if (confirmDelete) {
      onDeleteTransaksi(id);
    }
  };

  const handleResubmitTransaksiClick = (id: string) => {
    if (!onResubmitTransaksi) return;
    onResubmitTransaksi(id);
  };

  // Filter proker by selected bidang
  const filteredProker = prokerList.filter((p) => p.bidangId === selectedBidangId);
  const currentProker = prokerList.find((p) => p.id === selectedProkerId);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRawFile(file);
      setPhotoSelected(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(nominalStr.replace(/\D/g, ''));
    if (!num || num <= 0) return;

    const selectedBidang = bidangList.find((b) => b.id === selectedBidangId);

    let receiptUrl = photoSelected;
    let fileId = `DRIVE-${Math.random().toString(36).substring(7)}`;

    if (rawFile) {
      const uploadRes = await apiService.uploadReceiptFile(rawFile);
      receiptUrl = uploadRes.publicUrl;
      fileId = uploadRes.fileId;
    }

    const newTrx: Transaksi = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal,
      bidangId: selectedBidangId,
      bidangNama: selectedBidang?.nama || 'Bidang Kaderisasi',
      programKerjaId: selectedProkerId,
      programKerjaNama: currentProker?.namaProker || 'Umum',
      kategoriProker: currentProker?.kategori || 'Kemahasiswaan',
      keterangan,
      jenisNominal,
      nominal: num,
      jenisTransaksi,
      buktiDriveFileId: fileId,
      buktiDriveUrl: receiptUrl || undefined,
      uploadStatus: 'COMPLETED',
      organisasiNama: 'PK IMM Teknik Mesin UI'
    };

    onAddTransaksi(newTrx);
    setKeterangan('');
    setNominalStr('');
    setPhotoSelected(null);
    setRawFile(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'pemasukan' | 'pengeluaran'>('ALL');

  const totalPemasukan = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  const filteredTransaksiList = transaksiList.filter((t) => {
    const matchType = filterType === 'ALL' || t.jenisNominal === filterType;
    const matchSearch =
      t.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.programKerjaNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bidangNama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Input</span>
            <span>&gt;</span>
            <span className="text-[#7A0C1E] font-bold">Input Transaksi</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#2D3748] tracking-tight">Input & Pencatatan Transaksi Kas</h2>
          <p className="text-xs text-slate-500">Pencatatan nota transaksi pemasukan & pengeluaran dana berbasis bukti digital otentik.</p>
        </div>

        {/* Top Right Summary Metrics Cards (Image 4) */}
        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">TOTAL TRANSAKSI</span>
            <span className="text-sm font-black text-[#2D3748]">{transaksiList.length}</span>
            <span className="text-[9px] text-slate-400 block">Semua Proker</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">TOTAL PEMASUKAN</span>
            <span className="text-sm font-black text-[#2E7D32]">Rp {totalPemasukan.toLocaleString('id-ID')}</span>
            <span className="text-[9px] text-[#2E7D32] block font-bold">Kas Masuk</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center shadow-xs">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">TOTAL PENGELUARAN</span>
            <span className="text-sm font-black text-[#C05621]">Rp {totalPengeluaran.toLocaleString('id-ID')}</span>
            <span className="text-[9px] text-[#C05621] block font-bold">Kas Keluar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Input Transaksi or Read-Only Banner */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-card p-5 shadow-xs space-y-4">
          {userRole === 'tim_verifikasi_internal' ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2D3748] text-[#F4A261] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#F4A261]/20 text-[#9C5217]">
                  Mode Read-Only (Tim Verifikasi)
                </span>
                <h4 className="font-bold text-[#2D3748] text-sm mt-2">Wewenang Tim Verifikasi Internal</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sebagai Ketua Umum / Sekretaris Umum / Tim Verifikasi, Anda memiliki akses <span className="font-bold">Pantau & Audit Log</span> seluruh pencatatan transaksi nota tanpa hak mengubah data.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 font-medium">
                Pencatatan & pengubahan nota murni dilakukan oleh <span className="font-bold text-[#2D3748]">Bendahara Umum</span>.
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-[#2D3748] text-base flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#81B29A]" />
                  <span>Formulir Transaksi Baru</span>
                </h3>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#7A0C1E]/10 text-[#7A0C1E]">
                  Terhubung Proker
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dropdown Program Kerja (Dependent) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Program Kerja Sasaran *
              </label>
              <select
                value={selectedProkerId}
                onChange={(e) => setSelectedProkerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              >
                {filteredProker.length > 0 ? (
                  filteredProker.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaProker} ({p.kategori})
                    </option>
                  ))
                ) : (
                  <option value="">-- Bebas / Rutin Organisasi --</option>
                )}
              </select>
            </div>

            {/* Dropdown Bidang */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Bidang IMM
              </label>
              <select
                value={selectedBidangId}
                onChange={(e) => setSelectedBidangId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              >
                {bidangList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.kode} - {b.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Jenis Nominal Toggle (Eksklusif!) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Jenis Arus Kas *
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setJenisNominal('pemasukan')}
                  className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    jenisNominal === 'pemasukan'
                      ? 'bg-[#81B29A] text-[#2D3748] shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>+ Pemasukan (+Kas)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJenisNominal('pengeluaran')}
                  className={`py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    jenisNominal === 'pengeluaran'
                      ? 'bg-[#F4A261] text-[#2D3748] shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>- Pengeluaran (-Kas)</span>
                </button>
              </div>
            </div>

            {/* Nominal Rupiah */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Nominal Transaksi (Rp) *
              </label>
              <input
                type="text"
                value={nominalStr}
                onChange={(e) => setNominalStr(e.target.value)}
                placeholder="Rp 0"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Jenis Transaksi (Operasional / Inventaris) - Only shown for Pengeluaran */}
            {jenisNominal === 'pengeluaran' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Kategori Alokasi Anggaran
                </label>
                <select
                  value={jenisTransaksi}
                  onChange={(e) => setJenisTransaksi(e.target.value as JenisTransaksi)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
                >
                  <option value="operasional">Konsumsi Peserta / Operasional</option>
                  <option value="inventaris">Inventaris / Aset Organisasi</option>
                </select>
              </div>
            )}

            {/* Keterangan */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Keterangan Transaksi / Nama Merchant *
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Konsumsi peserta 3 hari - Indomaret Kramat Raya"
                rows={2}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#2D3748]"
              />
            </div>

            {/* Upload / Capture Kamera Native */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Foto Bukti Nota Kasir / Kuitansi Fisik
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition-all">
                {photoSelected ? (
                  <div className="space-y-2">
                    <img src={photoSelected} alt="Nota Preview" className="h-28 mx-auto rounded-md object-cover" />
                    <span className="text-[10px] font-bold text-[#81B29A] bg-[#81B29A]/15 px-2 py-0.5 rounded-full inline-block">
                      Watermark IMM Ready (Sharp Pipe)
                    </span>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-1 block">
                    <div className="w-8 h-8 rounded-full bg-[#7A0C1E]/10 text-[#7A0C1E] mx-auto flex items-center justify-center">
                      <Camera className="w-4 h-4 text-[#7A0C1E]" />
                    </div>
                    <p className="text-xs font-bold text-[#7A0C1E]">Ambil Foto Kamera / Pilih Berkas</p>
                    <p className="text-[10px] text-slate-400">JPG, PNG maksimal 5MB + Kompresi Otomatis Sharp</p>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Upload className="w-4 h-4 text-[#81B29A]" />
              <span>Simpan Transaksi Kas</span>
            </button>
          </form>
          </>
          )}
        </div>

        {/* Right Column: Daftar Transaksi & Audit Log Viewer (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-card p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-[#2D3748] text-base">Riwayat Pencatatan Transaksi</h3>
                <p className="text-xs text-slate-500">Daftar Transaksi Periode Berjalan</p>
              </div>

              {/* Filter Tabs: Semua | Masuk | Keluar (Image 4) */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilterType('ALL')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filterType === 'ALL'
                      ? 'bg-[#7A0C1E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#7A0C1E]'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('pemasukan')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filterType === 'pemasukan'
                      ? 'bg-[#2E7D32] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#2E7D32]'
                  }`}
                >
                  Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType('pengeluaran')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    filterType === 'pengeluaran'
                      ? 'bg-[#C05621] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#C05621]'
                  }`}
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Search Input for Transactions */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi berdasarkan nama proker, keterangan, atau bidang..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F9FA] text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Keterangan</th>
                    <th className="py-2.5 px-3">Bidang / Proker</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3">Status Drive</th>
                    <th className="py-2.5 px-3">Aksi Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransaksiList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-[#2D3748] whitespace-nowrap">
                        {trx.tanggal}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#2D3748]">
                        <p className="font-bold">{trx.keterangan}</p>
                        <span className="text-[10px] text-slate-400 uppercase">{trx.jenisTransaksi}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <p className="font-medium">{trx.programKerjaNama}</p>
                        <span className="text-[10px] font-bold text-slate-400">{trx.bidangNama}</span>
                      </td>
                      <td
                        className={`py-3 px-3 font-extrabold ${
                          trx.jenisNominal === 'pemasukan' ? 'text-[#81B29A]' : 'text-[#F4A261]'
                        }`}
                      >
                        {trx.jenisNominal === 'pemasukan' ? '+' : '-'}Rp {trx.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-3">
                        {trx.uploadStatus === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D5A44] bg-[#81B29A]/15 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Drive Synced
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#9C5217] bg-[#F4A261]/15 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Queue Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedAuditLog(trx)}
                            className="px-2 py-1 bg-slate-100 hover:bg-[#2D3748] hover:text-white text-[#2D3748] font-bold text-[10px] rounded-md transition-all flex items-center gap-1"
                            title="Lihat Audit Log"
                          >
                            <History className="w-3 h-3" /> Audit Log
                          </button>

                          {prokerList.find((p) => p.id === trx.programKerjaId)?.statusLaporan === 'Selesai' ? (
                            <span
                              className="px-2 py-0.5 text-[9px] font-bold text-slate-400 bg-slate-100 rounded inline-flex items-center gap-1 border border-slate-200"
                              title="LPJ Program Kerja ini sudah disubmit (Selesai). Transaksi terkunci."
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-400" /> LPJ Selesai (Terkunci)
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingTransaksi(trx)}
                                className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] rounded-md transition-all border border-amber-200"
                                title="Edit Transaksi"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteTransaksiClick(trx.id, trx.keterangan)}
                                className="p-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] rounded-md transition-all border border-red-200"
                                title="Hapus Transaksi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {trx.statusRevisi === 'revisi_diminta' && (
                            <button
                              onClick={() => handleResubmitTransaksiClick(trx.id)}
                              className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] rounded-md transition-all flex items-center gap-1 border border-emerald-300"
                              title="Submit Ulang Pasca Revisi"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-700" /> Submit Ulang
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Log Modal Preview */}
          {selectedAuditLog && (
            <div className="bg-white border border border-slate-200 rounded-card p-4 shadow-sm bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-xs text-[#2D3748] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#F4A261]" />
                  <span>Jejak Audit Log: {selectedAuditLog.id} ({selectedAuditLog.keterangan})</span>
                </h4>
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="text-xs text-slate-400 font-bold hover:text-[#2D3748]"
                >
                  Tutup ✕
                </button>
              </div>
              <div className="text-xs space-y-2 font-mono bg-[#2D3748] text-slate-200 p-3 rounded-lg">
                <p><span className="text-[#81B29A]">Actor User:</span> Immawan Ahmad (Bendahara Umum)</p>
                <p><span className="text-[#81B29A]">Action Timestamp:</span> 2026-08-28 09:30:12 WIB</p>
                <p><span className="text-[#F4A261]">JSON Payload Data:</span></p>
                <pre className="text-[10px] text-slate-300 bg-slate-900/60 p-2 rounded overflow-x-auto">
{JSON.stringify(
  {
    transaksi_id: selectedAuditLog.id,
    nominal: selectedAuditLog.nominal,
    jenis_nominal: selectedAuditLog.jenisNominal,
    soft_deleted: false,
    google_drive_status: selectedAuditLog.uploadStatus,
    watermark_stamp: "PROPERTI IMM - PK MESIN UI - 28/08/2026"
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT TRANSAKSI MODAL */}
      {editingTransaksi && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#7A0C1E]/10 text-[#7A0C1E]">
                  Edit Transaksi Kas
                </span>
                <h3 className="text-base font-extrabold text-[#2D3748] mt-1">Pembaruan Data Transaksi #{editingTransaksi.id}</h3>
              </div>
              <button
                onClick={() => setEditingTransaksi(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTransaksiSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tanggal Transaksi *
                </label>
                <input
                  type="date"
                  value={editingTransaksi.tanggal}
                  onChange={(e) => setEditingTransaksi({ ...editingTransaksi, tanggal: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Jenis Arus Kas *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditingTransaksi({ ...editingTransaksi, jenisNominal: 'pemasukan' })}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      editingTransaksi.jenisNominal === 'pemasukan'
                        ? 'bg-[#81B29A] text-[#2D3748] shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    + Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTransaksi({ ...editingTransaksi, jenisNominal: 'pengeluaran' })}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      editingTransaksi.jenisNominal === 'pengeluaran'
                        ? 'bg-[#F4A261] text-[#2D3748] shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    - Pengeluaran
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nominal Transaksi (Rp) *
                </label>
                <input
                  type="number"
                  value={editingTransaksi.nominal}
                  onChange={(e) => setEditingTransaksi({ ...editingTransaksi, nominal: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-[#2D3748]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Keterangan Transaksi *
                </label>
                <textarea
                  value={editingTransaksi.keterangan}
                  onChange={(e) => setEditingTransaksi({ ...editingTransaksi, keterangan: e.target.value })}
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaksi(null)}
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
    </div>
  );
};
