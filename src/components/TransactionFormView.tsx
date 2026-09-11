import React, { useState } from 'react';
import { Transaksi, ProgramKerja, Bidang, JenisNominal, JenisTransaksi, UserRole } from '../types';
import {
  Camera,
  Upload,
  CheckCircle2,
  History,
  PlusCircle,
  AlertCircle,
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Layers
} from 'lucide-react';

interface TransactionFormViewProps {
  transaksiList: Transaksi[];
  prokerList: ProgramKerja[];
  bidangList: Bidang[];
  userRole: UserRole;
  onAddTransaksi: (trx: Transaksi) => void;
}

export const TransactionFormView: React.FC<TransactionFormViewProps> = ({
  transaksiList,
  prokerList,
  bidangList,
  userRole,
  onAddTransaksi,
}) => {
  const [tanggal, setTanggal] = useState('2026-09-11');
  const [selectedProkerId, setSelectedProkerId] = useState(prokerList[0]?.id || 'pr-1');
  const [keterangan, setKeterangan] = useState('');
  const [jenisNominal, setJenisNominal] = useState<JenisNominal>('pengeluaran');
  const [nominalStr, setNominalStr] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState<string>('Konsumsi Peserta');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<Transaksi | null>(null);
  const [selectedReceiptPreview, setSelectedReceiptPreview] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter & Search states for history
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pemasukan' | 'pengeluaran'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // Selected Proker metadata
  const currentProker = prokerList.find((p) => p.id === selectedProkerId);

  // Handle format Rupiah on input
  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setNominalStr('');
      return;
    }
    const formatted = parseInt(rawVal, 10).toLocaleString('id-ID');
    setNominalStr(formatted);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoSelected(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(nominalStr.replace(/\D/g, ''));
    if (!num || num <= 0) return;

    const newTrx: Transaksi = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal,
      bidangId: currentProker?.bidangId || 'b1',
      bidangNama: currentProker?.bidangNama || 'Bidang Organisasi',
      programKerjaId: selectedProkerId,
      programKerjaNama: currentProker?.namaProker || 'Umum',
      kategoriProker: currentProker?.kategori || 'Kemahasiswaan',
      keterangan,
      jenisNominal,
      nominal: num,
      jenisTransaksi: jenisTransaksi.toLowerCase() as JenisTransaksi,
      buktiDriveFileId: `DRIVE-${Math.random().toString(36).substring(7)}`,
      uploadStatus: 'COMPLETED',
      organisasiNama: 'DPP IMM (Pusat)'
    };

    onAddTransaksi(newTrx);
    setKeterangan('');
    setNominalStr('');
    setPhotoSelected(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  // Filter history
  const filteredHistory = transaksiList.filter((trx) => {
    const matchFilter =
      historyFilter === 'all'
        ? true
        : historyFilter === 'pemasukan'
        ? trx.jenisNominal === 'pemasukan'
        : trx.jenisNominal === 'pengeluaran';

    const matchSearch =
      trx.keterangan.toLowerCase().includes(historySearch.toLowerCase()) ||
      trx.programKerjaNama.toLowerCase().includes(historySearch.toLowerCase()) ||
      trx.bidangNama.toLowerCase().includes(historySearch.toLowerCase());

    return matchFilter && matchSearch;
  });

  const totalMasuk = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalKeluar = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Input</span>
            <span>&gt;</span>
            <span className="text-[#7A0C1E] font-bold">Input Transaksi</span>
          </div>
          <h2 className="text-xl font-black text-[#2D3748] tracking-tight">
            Input & Pencatatan Transaksi Kas
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan nota transaksi pemasukan & pengeluaran dana berbasis bukti digital otentik.
          </p>
        </div>

        {showSuccessToast && (
          <div className="px-4 py-2.5 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] text-xs font-extrabold rounded-xl shadow-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Transaksi baru berhasil disimpan & bukti nota disinkronkan!</span>
          </div>
        )}
      </div>

      {/* Main 2-Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: FORMULIR INPUT TRANSAKSI (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-5">
          {userRole === 'tim_verifikasi_internal' ? (
            /* Mode Read-Only Protection */
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#2D3748] text-[#F4A261] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-[#F4A261]/20 text-[#9C5217]">
                  Mode Read-Only (Tim Verifikasi)
                </span>
                <h4 className="font-bold text-[#2D3748] text-sm mt-2">Wewenang Tim Verifikasi Internal</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sebagai Tim Verifikasi / Pimpinan Pengawas, Anda memiliki hak akses <span className="font-bold">Pantau & Audit Log</span> seluruh transaksi kas tanpa hak menambah/mengubah data transaksi.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                Pencatatan transaksi aktif dilakukan oleh <span className="font-bold text-[#7A0C1E]">Bendahara Umum</span>.
              </div>
            </div>
          ) : (
            /* Form Input Bendahara */
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#7A0C1E]/10 text-[#7A0C1E] flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2D3748]">Formulir Transaksi Baru</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#81B29A]/20 text-[#2D5A44]">
                  Terhubung Proker
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* 1. Pilih Program Kerja */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Program Kerja Sasaran <span className="text-[#7A0C1E]">*</span>
                  </label>
                  <select
                    value={selectedProkerId}
                    onChange={(e) => setSelectedProkerId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                  >
                    {prokerList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.namaProker} ({p.bidangNama})
                      </option>
                    ))}
                  </select>
                  {currentProker && (
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold">
                        {currentProker.bidangNama}
                      </span>
                      <span>•</span>
                      <span>Kategori: <strong className="text-slate-700">{currentProker.kategori}</strong></span>
                    </div>
                  )}
                </div>

                {/* 2. Tanggal Transaksi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Transaksi <span className="text-[#7A0C1E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 3. Jenis Nominal (Pemasukan / Pengeluaran Toggle) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jenis Arus Kas <span className="text-[#7A0C1E]">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setJenisNominal('pemasukan')}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        jenisNominal === 'pemasukan'
                          ? 'bg-[#2E7D32] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#2D3748]'
                      }`}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Pemasukan (+Kas)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJenisNominal('pengeluaran')}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        jenisNominal === 'pengeluaran'
                          ? 'bg-[#7A0C1E] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#2D3748]'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Pengeluaran (-Kas)</span>
                    </button>
                  </div>
                </div>

                {/* 4. Nominal Rupiah */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nominal Transaksi (Rp) <span className="text-[#7A0C1E]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-black text-slate-400">Rp</span>
                    <input
                      type="text"
                      value={nominalStr}
                      onChange={handleNominalChange}
                      placeholder="0"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 5. Kategori Alokasi */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Alokasi Anggaran
                  </label>
                  <select
                    value={jenisTransaksi}
                    onChange={(e) => setJenisTransaksi(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                  >
                    <option value="Operasional Kegiatan">Operasional Kegiatan</option>
                    <option value="Konsumsi Peserta">Konsumsi Peserta</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Sewa Perlengkapan">Sewa Perlengkapan & Tempat</option>
                    <option value="Inventaris & Aset">Inventaris & Aset Organisasi</option>
                    <option value="Kaderisasi & Pelatihan">Kaderisasi & Pelatihan</option>
                    <option value="Publikasi & Dokumentasi">Publikasi & Dokumentasi</option>
                    <option value="Kesekretariatan & ATK">Kesekretariatan & ATK</option>
                    <option value="Kontribusi / Sponsor">Kontribusi Peserta / Sponsor</option>
                  </select>
                </div>

                {/* 6. Keterangan Nota */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keterangan Transaksi / Nama Merchant <span className="text-[#7A0C1E]">*</span>
                  </label>
                  <textarea
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Contoh: Konsumsi peserta 3 hari - Indomaret Kramat Raya"
                    rows={2}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* 7. Upload / Kamera Foto Bukti Nota */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Foto Bukti Nota Kasir / Kuitansi Fisik
                  </label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-[#7A0C1E]/40 rounded-xl p-3 text-center bg-slate-50/50 hover:bg-slate-50 transition-all">
                    {photoSelected ? (
                      <div className="space-y-2">
                        <img
                          src={photoSelected}
                          alt="Preview Nota"
                          className="h-28 mx-auto rounded-lg object-contain border border-slate-200 shadow-xs"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[10px] font-bold text-[#2D5A44] bg-[#81B29A]/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Sharp IMM Watermark Ready
                          </span>
                          <button
                            type="button"
                            onClick={() => setPhotoSelected(null)}
                            className="text-[10px] text-red-600 font-bold hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-1 block py-2">
                        <div className="w-9 h-9 rounded-full bg-[#7A0C1E]/10 text-[#7A0C1E] mx-auto flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-[#2D3748]">Ambil Foto Kamera / Pilih Berkas</p>
                        <p className="text-[10px] text-slate-400">JPG, PNG maksimal 5MB • Kompresi Otomatis Sharp</p>
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
                  className="w-full py-3 bg-[#7A0C1E] hover:bg-[#600917] text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <Upload className="w-4 h-4 text-[#81B29A]" />
                  <span>Simpan Transaksi Kas</span>
                </button>
              </form>
            </>
          )}
        </div>

        {/* KOLOM KANAN: RIWAYAT TRANSAKSI & AUDIT TRAIL (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Transaksi
              </span>
              <p className="text-lg font-black text-[#2D3748] mt-0.5">
                {transaksiList.length}
              </p>
              <span className="text-[10px] text-slate-400">Semua Proker</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Pemasukan
              </span>
              <p className="text-lg font-black text-[#2E7D32] mt-0.5">
                Rp {totalMasuk.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium">Kas Masuk</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Pengeluaran
              </span>
              <p className="text-lg font-black text-[#C05621] mt-0.5">
                Rp {totalKeluar.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-orange-600 font-medium">Kas Keluar</span>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            
            {/* Title & Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-[#2D3748]">Riwayat Pencatatan Transaksi</h3>
                <p className="text-[11px] text-slate-500">Daftar transaksi yang baru saja dicatat dalam sistem</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    historyFilter === 'all' ? 'bg-[#7A0C1E] text-white shadow-xs' : 'text-slate-600 hover:text-[#2D3748]'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setHistoryFilter('pemasukan')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    historyFilter === 'pemasukan' ? 'bg-[#2E7D32] text-white shadow-xs' : 'text-slate-600 hover:text-[#2D3748]'
                  }`}
                >
                  Masuk
                </button>
                <button
                  onClick={() => setHistoryFilter('pengeluaran')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    historyFilter === 'pengeluaran' ? 'bg-[#7A0C1E] text-white shadow-xs' : 'text-slate-600 hover:text-[#2D3748]'
                  }`}
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari transaksi berdasarkan nama proker, keterangan, atau bidang..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Program Kerja / Keterangan</th>
                    <th className="py-2.5 px-3">Nominal</th>
                    <th className="py-2.5 px-3 text-center">Bukti Nota</th>
                    <th className="py-2.5 px-3 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                          {trx.tanggal}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-[#2D3748]">{trx.keterangan}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-semibold text-slate-600">{trx.programKerjaNama}</span>
                            <span>•</span>
                            <span className="uppercase">{trx.jenisTransaksi}</span>
                          </div>
                        </td>
                        <td
                          className={`py-3 px-3 font-black whitespace-nowrap ${
                            trx.jenisNominal === 'pemasukan' ? 'text-[#2E7D32]' : 'text-[#C05621]'
                          }`}
                        >
                          {trx.jenisNominal === 'pemasukan' ? '+' : '-'}Rp {trx.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedReceiptPreview('/sample-receipt-1.svg')}
                            className="p-1.5 bg-slate-100 hover:bg-[#7A0C1E] hover:text-white text-slate-700 rounded-lg transition-all"
                            title="Lihat Bukti Nota"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedAuditLog(trx)}
                            className="px-2 py-1 bg-slate-100 hover:bg-[#2D3748] hover:text-white text-[#2D3748] font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 mx-auto"
                            title="Lihat Log Audit Trail JSONB"
                          >
                            <History className="w-3 h-3 text-[#F4A261]" />
                            <span>Log</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">
                        Tidak ada transaksi yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Audit Log Modal / Drawer */}
          {selectedAuditLog && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-extrabold text-xs text-[#2D3748] flex items-center gap-2">
                  <History className="w-4 h-4 text-[#F4A261]" />
                  <span>Jejak Audit Trail JSONB: {selectedAuditLog.id}</span>
                </h4>
                <button
                  onClick={() => setSelectedAuditLog(null)}
                  className="text-xs text-slate-400 font-bold hover:text-[#2D3748]"
                >
                  Tutup ✕
                </button>
              </div>
              <div className="text-xs space-y-1.5 font-mono bg-[#2D3748] text-slate-200 p-3 rounded-xl">
                <p><span className="text-[#81B29A]">Actor:</span> Immawan Ahmad (Bendahara Umum)</p>
                <p><span className="text-[#81B29A]">Timestamp:</span> 2026-09-11 11:30:15 WIB</p>
                <p><span className="text-[#F4A261]">JSONB Payload:</span></p>
                <pre className="text-[10px] text-slate-300 bg-slate-900/70 p-2.5 rounded-lg overflow-x-auto">
{JSON.stringify(
  {
    transaksi_id: selectedAuditLog.id,
    proker_id: selectedAuditLog.programKerjaId,
    proker_nama: selectedAuditLog.programKerjaNama,
    nominal: selectedAuditLog.nominal,
    jenis_nominal: selectedAuditLog.jenisNominal,
    kategori_alokasi: selectedAuditLog.jenisTransaksi,
    google_drive_file_id: selectedAuditLog.buktiDriveFileId,
    sharp_compression: "COMPLETED (JPEG 85%, 1200px max, IMM Watermark applied)"
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

      {/* Modal Zoom Nota */}
      {selectedReceiptPreview && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex justify-center items-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-extrabold text-xs text-[#2D3748]">Bukti Nota Digital Terverifikasi</span>
              <button
                onClick={() => setSelectedReceiptPreview(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex justify-center">
              <img
                src={selectedReceiptPreview}
                alt="Nota Digital"
                className="max-h-96 object-contain rounded-lg shadow-xs"
              />
            </div>
            <p className="text-[10px] text-center text-slate-400 font-medium">
              Telah dibubuhi watermark digital Sharp Pipe & tersinkronisasi ke Google Drive DPP IMM
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
