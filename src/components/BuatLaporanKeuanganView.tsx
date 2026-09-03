import React, { useState } from 'react';
import { ProgramKerja, Transaksi, Bidang, UserRole, JenisNominal, JenisTransaksi } from '../types';
import { PrintableProkerReportModal } from './PrintableProkerReportModal';
import {
  FileSpreadsheet,
  PlusCircle,
  FolderCheck,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  Search,
  Filter,
  X,
  Camera,
  Upload,
  Printer
} from 'lucide-react';

interface BuatLaporanKeuanganViewProps {
  prokerList: ProgramKerja[];
  bidangList: Bidang[];
  transaksiList: Transaksi[];
  userRole: UserRole;
  onAddTransaksi: (trx: Transaksi) => void;
}

export const BuatLaporanKeuanganView: React.FC<BuatLaporanKeuanganViewProps> = ({
  prokerList,
  bidangList,
  transaksiList,
  userRole,
  onAddTransaksi,
}) => {
  const [selectedProkerForInput, setSelectedProkerForInput] = useState<ProgramKerja | null>(null);
  const [selectedProkerForPrint, setSelectedProkerForPrint] = useState<ProgramKerja | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBidangId, setFilterBidangId] = useState<string>('ALL');

  // Modal Form States
  const [tanggal, setTanggal] = useState('2026-09-03');
  const [keterangan, setKeterangan] = useState('');
  const [jenisNominal, setJenisNominal] = useState<JenisNominal>('pengeluaran');
  const [nominalStr, setNominalStr] = useState('');
  const [jenisTransaksi, setJenisTransaksi] = useState<JenisTransaksi>('operasional');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter proker by search & bidang
  const filteredProkerList = prokerList.filter((p) => {
    const matchSearch = p.namaProker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.bidangNama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBidang = filterBidangId === 'ALL' || p.bidangId === filterBidangId;
    return matchSearch && matchBidang;
  });

  const handleOpenForm = (proker: ProgramKerja) => {
    setSelectedProkerForInput(proker);
    setKeterangan('');
    setNominalStr('');
    setPhotoSelected(null);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoSelected(URL.createObjectURL(file));
    }
  };

  const handleSubmitTransaksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProkerForInput) return;

    const num = parseFloat(nominalStr.replace(/\D/g, ''));
    if (!num || num <= 0) return;

    const newTrx: Transaksi = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal,
      bidangId: selectedProkerForInput.bidangId,
      bidangNama: selectedProkerForInput.bidangNama,
      programKerjaId: selectedProkerForInput.id,
      programKerjaNama: selectedProkerForInput.namaProker,
      kategoriProker: selectedProkerForInput.kategori,
      keterangan,
      jenisNominal,
      nominal: num,
      jenisTransaksi,
      buktiDriveFileId: `DRIVE-${Math.random().toString(36).substring(7)}`,
      uploadStatus: 'COMPLETED',
      organisasiNama: 'PK IMM Teknik Mesin UI'
    };

    onAddTransaksi(newTrx);
    setSelectedProkerForInput(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Feature Header */}
      <div className="bg-gradient-to-r from-[#7A0C1E] to-[#600917] text-white p-6 rounded-card shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-[#81B29A] mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fitur Utama SAKU IMM
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Buat Laporan Keuangan Program Kerja</h2>
          <p className="text-xs text-slate-200 mt-1 max-w-2xl">
            Pilih Program Kerja sasaran terlebih dahulu dari daftar di bawah, lalu klik <span className="font-bold text-[#81B29A]">INPUT TRANSAKSI</span> atau <span className="font-bold text-[#81B29A]">CETAK LAPORAN PDF</span>.
          </p>
        </div>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] font-bold text-xs rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Transaksi berhasil ditambahkan ke Program Kerja & tersinkronkan dengan laporan keuangan!</span>
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-xs font-bold hover:underline">Tutup</button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-card p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nama Program Kerja atau Bidang..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2D3748] focus:outline-none focus:border-[#7A0C1E]"
          />
        </div>

        {/* Bidang Selector Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Filter Bidang:</span>
          <select
            value={filterBidangId}
            onChange={(e) => setFilterBidangId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none"
          >
            <option value="ALL">Semua 22 Bidang IMM</option>
            {bidangList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.kode} - {b.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid List DAFTAR PROGRAM KERJA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProkerList.map((proker) => {
          // Calculate specific stats for this proker
          const prokerTrxList = transaksiList.filter((t) => t.programKerjaId === proker.id);
          const totalPem = prokerTrxList
            .filter((t) => t.jenisNominal === 'pemasukan')
            .reduce((sum, t) => sum + t.nominal, 0);
          const totalPeng = prokerTrxList
            .filter((t) => t.jenisNominal === 'pengeluaran')
            .reduce((sum, t) => sum + t.nominal, 0);
          const diff = totalPem - totalPeng;

          return (
            <div
              key={proker.id}
              className="bg-white border border-slate-200 rounded-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#7A0C1E]/10 text-[#7A0C1E]">
                    {proker.bidangNama}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      proker.statusLaporan === 'Selesai'
                        ? 'bg-[#81B29A]/20 text-[#2D5A44]'
                        : 'bg-[#F4A261]/20 text-[#9C5217]'
                    }`}
                  >
                    Laporan: {proker.statusLaporan || 'Belum'}
                  </span>
                </div>

                {/* Proker Title */}
                <div>
                  <h3 className="font-extrabold text-[#2D3748] text-base leading-snug">{proker.namaProker}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{proker.tanggalPelaksanaan || 'Jadwal Belum Diset'}</span>
                  </div>
                </div>

                {/* Realisasi Financial Card */}
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-[#2E7D32]" /> Pemasukan</span>
                    <span className="font-bold text-[#2E7D32]">Rp {totalPem.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1"><ArrowDownLeft className="w-3.5 h-3.5 text-[#C05621]" /> Pengeluaran</span>
                    <span className="font-bold text-[#C05621]">Rp {totalPeng.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between font-bold">
                    <span>Saldo Proker</span>
                    <span className={diff >= 0 ? 'text-[#2D5A44]' : 'text-[#9C5217]'}>
                      Rp {diff.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: INPUT TRANSAKSI & CETAK LAPORAN */}
              <div className="space-y-2">
                {userRole === 'tim_verifikasi_internal' ? (
                  <div className="p-2 bg-slate-100 rounded-xl text-center text-[10px] text-slate-500 font-bold flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> Read-Only Mode (Tim Verifikasi)
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenForm(proker)}
                    className="w-full py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md active:scale-[0.99]"
                  >
                    <PlusCircle className="w-4 h-4 text-[#81B29A]" />
                    <span>INPUT TRANSAKSI</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedProkerForPrint(proker)}
                  className="w-full py-2 bg-slate-100 hover:bg-[#2D3748] hover:text-white text-[#2D3748] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Laporan PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL FORM INPUT TRANSAKSI TERKUNCI PER PROKER */}
      {selectedProkerForInput && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#81B29A]/20 text-[#2D5A44]">
                  Terkunci ke Program Kerja
                </span>
                <h3 className="text-base font-extrabold text-[#2D3748] mt-1">Input Transaksi Laporan Keuangan</h3>
              </div>
              <button
                onClick={() => setSelectedProkerForInput(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lock Indicator Card */}
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1">
              <p className="text-[10px] font-extrabold text-[#7A0C1E] uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" /> Mitigasi Salah Input Aktif
              </p>
              <p className="text-xs font-bold text-[#2D3748]">{selectedProkerForInput.namaProker}</p>
              <p className="text-[11px] text-slate-500">
                Bidang: <span className="font-semibold text-slate-700">{selectedProkerForInput.bidangNama}</span> • Kategori: <span className="font-semibold text-slate-700">{selectedProkerForInput.kategori}</span>
              </p>
            </div>

            <form onSubmit={handleSubmitTransaksi} className="space-y-3">
              {/* Tanggal Transaksi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Tanggal Transaksi *
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748]"
                />
              </div>

              {/* Jenis Nominal Toggle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Jenis Nominal Transaksi *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setJenisNominal('pemasukan')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      jenisNominal === 'pemasukan'
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    + Pemasukan (Kas Masuk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setJenisNominal('pengeluaran')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      jenisNominal === 'pengeluaran'
                        ? 'bg-[#C05621] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    - Pengeluaran (Kas Keluar)
                  </button>
                </div>
              </div>

              {/* Nominal Rupiah */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Nominal Transaksi (Rp) *
                </label>
                <input
                  type="text"
                  value={nominalStr}
                  onChange={(e) => setNominalStr(e.target.value)}
                  placeholder="Contoh: 500000"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-[#2D3748]"
                />
              </div>

              {/* Keterangan Transaksi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Rincian Keterangan / Sub-kategori *
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Rincian penggunaan dana atau sumber pemasukan..."
                  rows={2}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748]"
                />
              </div>

              {/* Kategori Alokasi */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Kategori Alokasi Transaksi
                </label>
                <select
                  value={jenisTransaksi}
                  onChange={(e) => setJenisTransaksi(e.target.value as JenisTransaksi)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748]"
                >
                  <option value="operasional">Operasional Program Kerja</option>
                  <option value="inventaris">Inventaris / Aset Organisasi</option>
                </select>
              </div>

              {/* Upload Bukti Nota */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Upload Bukti Nota Digital (Kamera Native)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50/60 hover:bg-slate-50 transition-all">
                  {photoSelected ? (
                    <div className="space-y-1.5">
                      <img src={photoSelected} alt="Preview Nota" className="h-24 mx-auto rounded-lg object-cover" />
                      <span className="text-[10px] font-bold text-[#81B29A] bg-[#81B29A]/15 px-2 py-0.5 rounded-full inline-block">
                        Watermark IMM Ready (Sharp Pipe)
                      </span>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-1 block">
                      <Camera className="w-5 h-5 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-[#2D3748]">Ambil Foto / Unggah Nota</p>
                      <p className="text-[10px] text-slate-400">Otomatis Watermarked & Google Drive Sync</p>
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

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProkerForInput(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-[#81B29A]" />
                  <span>Simpan Transaksi Proker</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE REPORT MODAL */}
      {selectedProkerForPrint && (
        <PrintableProkerReportModal
          proker={selectedProkerForPrint}
          transaksiList={transaksiList}
          currentLevel="PK"
          currentOrgName="PK IMM Teknik Mesin UI"
          onClose={() => setSelectedProkerForPrint(null)}
        />
      )}
    </div>
  );
};
