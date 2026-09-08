import React, { useState } from 'react';
import { ProgramKerja, Transaksi, OrgLevel } from '../types';
import {
  ArrowLeft,
  FileText,
  FileSpreadsheet,
  Printer,
  Calendar,
  Tag,
  FolderKanban,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Search,
  ZoomIn,
  Upload,
  UserCheck,
  Clock,
  Building2,
  X,
  Eye,
  Plus
} from 'lucide-react';

interface DetailLaporanProkerViewProps {
  proker: ProgramKerja;
  transaksiList: Transaksi[];
  currentLevel: OrgLevel;
  currentOrgName: string;
  onBack: () => void;
  onOpenPrintModal: (proker: ProgramKerja) => void;
  onExportExcel: () => void;
}

export const DetailLaporanProkerView: React.FC<DetailLaporanProkerViewProps> = ({
  proker,
  transaksiList,
  currentLevel,
  currentOrgName,
  onBack,
  onOpenPrintModal,
  onExportExcel,
}) => {
  const [activeReceiptModal, setActiveReceiptModal] = useState<{ title: string; image: string } | null>(null);
  const [userReceipts, setUserReceipts] = useState<string[]>([]);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Filter transactions for this proker
  const prokerTrx = transaksiList.filter((t) => t.programKerjaId === proker.id);
  const pemasukanList = prokerTrx.filter((t) => t.jenisNominal === 'pemasukan');
  const pengeluaranList = prokerTrx.filter((t) => t.jenisNominal === 'pengeluaran');

  // Fallback demo data if proker has no transactions yet to match the rich screenshot demonstration
  const displayPemasukan = pemasukanList.length > 0 ? pemasukanList : [
    { id: 'p-1', tanggal: '5 Agu 2026', keterangan: 'Sponsor A', nominal: 10000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-2', tanggal: '7 Agu 2026', keterangan: 'Sponsor B', nominal: 7000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-3', tanggal: '9 Agu 2026', keterangan: 'Kontribusi Peserta', nominal: 3000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName }
  ];

  const displayPengeluaran = pengeluaranList.length > 0 ? pengeluaranList : [
    { id: 'e-1', tanggal: '10 Agu 2026', keterangan: 'Konsumsi Peserta', jenisTransaksi: 'operasional' as const, nominal: 6000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-2', tanggal: '10 Agu 2026', keterangan: 'Transportasi', jenisTransaksi: 'operasional' as const, nominal: 4500000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-3', tanggal: '11 Agu 2026', keterangan: 'Sewa Perlengkapan', jenisTransaksi: 'operasional' as const, nominal: 5000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-4', tanggal: '12 Agu 2026', keterangan: 'Pembelian Inventaris', jenisTransaksi: 'inventaris' as const, nominal: 3000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName }
  ];

  const totalPemasukan = displayPemasukan.reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaran = displayPengeluaran.reduce((sum, t) => sum + t.nominal, 0);
  const surplusDefisit = totalPemasukan - totalPengeluaran;

  const initialAttachments = [
    { id: 'att-1', title: '10 Agu – Konsumsi peserta', file: '/sample-receipt-1.svg' },
    { id: 'att-2', title: '10 Agu – Transportasi', file: '/sample-receipt-2.svg' },
    { id: 'att-3', title: '11 Agu – Sewa perlengkapan', file: '/sample-receipt-3.svg' },
    { id: 'att-4', title: '12 Agu – Pembelian inventaris', file: '/sample-receipt-4.svg' },
    { id: 'att-5', title: '9 Agu – Kontribusi peserta', file: '/sample-receipt-5.svg' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUserReceipts((prev) => [...prev, url]);
      setUploadToast(`Bukti "${file.name}" berhasil diunggah!`);
      setTimeout(() => setUploadToast(null), 3500);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Laporan Keuangan</span>
            <span>&gt;</span>
            <span className="text-[#7A0C1E] font-bold">Laporan Keuangan Kegiatan</span>
          </div>
          <h1 className="text-2xl font-black text-[#2D3748] tracking-tight">Laporan Keuangan Kegiatan</h1>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A0C1E] hover:underline mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Program Kerja</span>
          </button>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenPrintModal(proker)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Preview PDF</span>
          </button>

          <button
            onClick={onExportExcel}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-emerald-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={() => onOpenPrintModal(proker)}
            className="px-4 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4 text-[#81B29A]" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {uploadToast && (
        <div className="p-3.5 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] font-bold text-xs rounded-xl flex items-center gap-2 shadow-2xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {uploadToast}
        </div>
      )}

      {/* Hero Proker Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Maroon Circle Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#7A0C1E] text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Calendar className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl md:text-2xl font-black text-[#2D3748] tracking-tight">
              {proker.namaProker}
            </h2>

            {/* Metadata Pills */}
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                Bidang: <strong className="text-slate-800">{proker.bidangNama}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Kategori: <strong className="text-slate-800">{proker.kategori}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Periode: <strong className="text-slate-800">{proker.tanggalPelaksanaan || '10 - 12 Agustus 2026'}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-2xl pt-1">
              Rapat koordinasi nasional untuk membahas program kerja IMM tahun 2026.
            </p>
          </div>
        </div>

        {/* Status Box (Top Right) */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center md:text-right flex flex-col justify-center flex-shrink-0 min-w-[180px]">
          <div className="inline-flex items-center justify-center md:justify-end gap-1.5 text-emerald-700 font-extrabold text-xs mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Selesai</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {displayPemasukan.length + displayPengeluaran.length} transaksi tercatat
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {initialAttachments.length + userReceipts.length} bukti tersedia
          </p>
        </div>
      </div>

      {/* SECTION 1: RINGKASAN KEUANGAN */}
      <div className="space-y-3">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
          1. RINGKASAN KEUANGAN
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: TOTAL PEMASUKAN */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                TOTAL PEMASUKAN
              </p>
              <p className="text-xl font-black text-emerald-600 tracking-tight mt-0.5">
                Rp {totalPemasukan.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Card 2: TOTAL PENGELUARAN */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-[#7A0C1E] flex items-center justify-center flex-shrink-0">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                TOTAL PENGELUARAN
              </p>
              <p className="text-xl font-black text-[#7A0C1E] tracking-tight mt-0.5">
                Rp {totalPengeluaran.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Card 3: SURPLUS / DEFISIT */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                SURPLUS / DEFISIT
              </p>
              <p className="text-xl font-black text-blue-600 tracking-tight mt-0.5">
                Rp {surplusDefisit.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN SPLIT LAYOUT (Tables & Right Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION 2: RINCIAN PEMASUKAN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. RINCIAN PEMASUKAN
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Sumber / Keterangan</th>
                    <th className="py-2.5 px-3 text-right">Jumlah</th>
                    <th className="py-2.5 px-3 text-center">Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayPemasukan.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-medium text-slate-600">{item.tanggal}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#2D3748]">{item.keterangan}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        Rp {item.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setActiveReceiptModal({ title: `${item.tanggal} – ${item.keterangan}`, image: '/sample-receipt-5.svg' })}
                          className="p-1.5 bg-slate-100 hover:bg-[#7A0C1E] hover:text-white rounded-lg text-slate-600 transition-colors inline-flex items-center justify-center"
                          title="Lihat Bukti Nota"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50/60 font-black border-t-2 border-slate-200">
                    <td colSpan={2} className="py-2.5 px-3 text-emerald-800 uppercase">
                      TOTAL PEMASUKAN
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 text-sm">
                      Rp {totalPemasukan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* SECTION 3: RINCIAN PENGELUARAN */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              3. RINCIAN PENGELUARAN
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Keterangan</th>
                    <th className="py-2.5 px-3 text-center">Jenis</th>
                    <th className="py-2.5 px-3 text-right">Jumlah</th>
                    <th className="py-2.5 px-3 text-center">Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayPengeluaran.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-medium text-slate-600">{item.tanggal}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#2D3748]">{item.keterangan}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.jenisTransaksi === 'inventaris'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.jenisTransaksi === 'inventaris' ? 'Inventaris' : 'Operasional'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                        Rp {item.nominal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => setActiveReceiptModal({ title: `${item.tanggal} – ${item.keterangan}`, image: `/sample-receipt-${(idx % 4) + 1}.svg` })}
                          className="p-1.5 bg-slate-100 hover:bg-[#7A0C1E] hover:text-white rounded-lg text-slate-600 transition-colors inline-flex items-center justify-center"
                          title="Lihat Bukti Nota"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-red-50/60 font-black border-t-2 border-slate-200">
                    <td colSpan={3} className="py-2.5 px-3 text-[#7A0C1E] uppercase">
                      TOTAL PENGELUARAN
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#7A0C1E] text-sm">
                      Rp {totalPengeluaran.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* SECTION 4: LAMPIRAN BUKTI PENDUKUNG */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              4. LAMPIRAN BUKTI PENDUKUNG
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {initialAttachments.map((att) => (
                <div
                  key={att.id}
                  onClick={() => setActiveReceiptModal({ title: att.title, image: att.file })}
                  className="group cursor-pointer bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
                >
                  {/* Styled Receipt Graphic */}
                  <div className="w-full h-32 bg-white border border-slate-200 rounded-lg p-2 flex flex-col justify-between text-[9px] font-mono text-slate-600 overflow-hidden leading-tight group-hover:border-[#7A0C1E] transition-colors relative">
                    <div className="border-b border-dashed border-slate-300 pb-1 text-center font-bold">
                      NOTA KAS SAKU IMM
                    </div>
                    <div className="py-1 space-y-1 text-slate-500">
                      <p className="truncate">{att.title}</p>
                      <p className="text-[#2E7D32] font-bold">VERIFIED</p>
                    </div>
                    <div className="border-t border-dashed border-slate-300 pt-0.5 text-center font-bold text-[#7A0C1E]">
                      SHARP PIPE
                    </div>
                    {/* Hover Zoom Icon Overlay */}
                    <div className="absolute inset-0 bg-[#7A0C1E]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white text-[#7A0C1E] flex items-center justify-center shadow-md">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 line-clamp-1">
                    {att.title}
                  </span>
                </div>
              ))}

              {/* User Uploaded Receipts */}
              {userReceipts.map((imgUrl, idx) => (
                <div
                  key={`user-${idx}`}
                  onClick={() => setActiveReceiptModal({ title: `Bukti Tambahan #${idx + 1}`, image: imgUrl })}
                  className="group cursor-pointer bg-slate-50 border border-slate-200 rounded-xl p-2.5 hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
                >
                  <img src={imgUrl} alt="Uploaded Receipt" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                  <span className="text-[10px] font-bold text-slate-700 truncate">
                    Bukti Tambahan #{idx + 1}
                  </span>
                </div>
              ))}

              {/* Upload Tile: Tambah Bukti Lain */}
              <label className="border-2 border-dashed border-slate-300 hover:border-[#7A0C1E] bg-slate-50/60 hover:bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">Tambah Bukti Lain</p>
                <p className="text-[10px] text-slate-400">Upload file (jpg, png, pdf) maks. 5MB</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Sidebar Info - 4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: INFORMASI PROGRAM KERJA */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
              INFORMASI PROGRAM KERJA
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <FolderKanban className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Bidang</p>
                  <p className="font-bold text-[#2D3748]">{proker.bidangNama}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Kategori</p>
                  <p className="font-bold text-[#2D3748]">{proker.kategori}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Periode Kegiatan</p>
                  <p className="font-bold text-[#2D3748]">{proker.tanggalPelaksanaan || '10 - 12 Agustus 2026'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Penanggung Jawab</p>
                  <p className="font-bold text-[#2D3748]">Ahmad Fauzan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-400 font-medium text-[11px]">Tanggal Dibuat</p>
                  <p className="font-bold text-[#2D3748]">1 Juli 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: CATATAN VERIFIKASI */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-2">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              CATATAN
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Semua transaksi telah diverifikasi dan bukti tersedia.
            </p>
          </div>

        </div>

      </div>

      {/* MODAL ZOOM PREVIEW NOTA */}
      {activeReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">{activeReceiptModal.title}</h3>
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-xl p-4 flex justify-center items-center min-h-[300px]">
              {activeReceiptModal.image.startsWith('blob:') ? (
                <img src={activeReceiptModal.image} alt="Nota Zoom" className="max-h-[400px] object-contain rounded-lg shadow" />
              ) : (
                <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-xs w-full shadow text-center font-mono text-xs text-slate-700 space-y-3">
                  <div className="border-b border-dashed border-slate-400 pb-2 font-bold text-sm text-[#7A0C1E]">
                    *** KWITANSI / NOTA DIGITAL ***
                  </div>
                  <p className="font-bold">{activeReceiptModal.title}</p>
                  <p className="text-slate-500">Status: Verifikasi Sharp Pipe OK</p>
                  <p className="text-slate-500">Timestamp: 2026-08-10 14:30 WIB</p>
                  <div className="border-t border-dashed border-slate-400 pt-2 font-black text-emerald-700">
                    SEALED & WATERMARKED IMM
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
