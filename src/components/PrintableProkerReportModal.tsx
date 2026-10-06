import React from 'react';
import { ProgramKerja, Transaksi, OrgLevel } from '../types';
import { Printer, X, Download, FileText } from 'lucide-react';

interface PrintableProkerReportModalProps {
  proker: ProgramKerja;
  transaksiList: Transaksi[];
  currentLevel: OrgLevel;
  currentOrgName: string;
  onClose: () => void;
}

export const PrintableProkerReportModal: React.FC<PrintableProkerReportModalProps> = ({
  proker,
  transaksiList,
  currentLevel,
  currentOrgName,
  onClose,
}) => {
  // Filter transactions for this proker
  const prokerTrx = transaksiList.filter((t) => t.programKerjaId === proker.id);

  const pemasukanList = prokerTrx.filter((t) => t.jenisNominal === 'pemasukan');
  const pengeluaranList = prokerTrx.filter((t) => t.jenisNominal === 'pengeluaran');

  // Real proker transaction data (no fake demo fallbacks)
  const displayPemasukan = pemasukanList;
  const displayPengeluaran = pengeluaranList;

  const totalPemasukanNum = displayPemasukan.reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaranNum = displayPengeluaran.reduce((sum, t) => sum + t.nominal, 0);
  const surplusDefisitNum = totalPemasukanNum - totalPengeluaranNum;

  // Uploaded receipt photos from real transactions
  const prokerReceipts = prokerTrx.filter((t) => t.buktiDriveUrl || t.buktiDriveFileId);

  const getLevelHeaderTitle = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PIMPINAN KOMISARIAT';
      case 'KORKOM': return 'KOORDINATOR KOMISARIAT';
      case 'PC': return 'PIMPINAN CABANG';
      case 'DPD': return 'DEWAN PIMPINAN DAERAH';
      case 'DPP': return 'DEWAN PIMPINAN PUSAT';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex justify-center items-start p-4 z-50 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 print:my-0 print:shadow-none print:border-none print:w-full">
        
        {/* Action Header Bar (Hidden during print) */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#81B29A]" />
            <h3 className="font-extrabold text-sm">Preview Dokumen Siap Cetak (Laporan Per Program Kerja)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#81B29A]" /> Cetak Dokumen / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Tutup Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 DOCUMENT CONTENT SHEET */}
        <div className="p-8 md:p-12 text-[#1A202C] font-sans leading-relaxed bg-white print:p-6" id="printable-report-area">
          
          {/* 1. KOP SURAT RESMI ORGANISASI IMM */}
          <div className="flex items-center justify-between pb-3 mb-1">
            {/* Logo Left */}
            <div className="w-20 flex-shrink-0 flex items-center justify-center">
              <img src="/imm-shield-logo.svg" alt="IMM Shield Logo" className="h-20 object-contain" />
            </div>

            {/* Header Text Center */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg md:text-xl font-black tracking-wide uppercase text-[#1A202C]">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h1>
              <h2 className="text-base md:text-lg font-black uppercase text-[#7A0C1E] tracking-wide mt-0.5">
                {getLevelHeaderTitle(currentLevel)}
              </h2>
              <p className="text-xs text-[#1A202C] font-extrabold mt-1 uppercase tracking-wider">
                {currentOrgName}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Sistem Tata Kelola Keuangan SAKU IMM • Terverifikasi Digital
              </p>
            </div>

            {/* Badge Right (SAKU IMM Record Verification Stamp) */}
            <div className="w-48 text-right space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#7A0C1E] text-white rounded text-[10px] font-bold">
                <span className="bg-white text-[#7A0C1E] px-1 rounded font-black text-[9px]">IMM</span>
                <span>Dicatat melalui SAKU IMM</span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Double Horizontal Divider Bar (Top Maroon Thick, Bottom Black Thin) */}
          <div className="space-y-0.5 mb-6">
            <div className="h-[3.5px] bg-[#7A0C1E] w-full" />
            <div className="h-[1px] bg-slate-900 w-full" />
          </div>

          {/* 2. METADATA PROGRAM KERJA */}
          <div className="text-xs space-y-1.5 mb-6 font-sans">
            <div className="flex items-start">
              <span className="w-44 font-bold text-[#1A202C]">Nama Program Kerja</span>
              <span className="font-bold text-[#1A202C]">:</span>
              <span className="ml-2 font-medium text-[#1A202C]">{proker.namaProker}</span>
            </div>
            <div className="flex items-start">
              <span className="w-44 font-bold text-[#1A202C]">Bidang</span>
              <span className="font-bold text-[#1A202C]">:</span>
              <span className="ml-2 font-medium text-[#1A202C]">{proker.bidangNama}</span>
            </div>
            <div className="flex items-start">
              <span className="w-44 font-bold text-[#1A202C]">Kategori</span>
              <span className="font-bold text-[#1A202C]">:</span>
              <span className="ml-2 font-medium text-[#1A202C]">{proker.kategori}</span>
            </div>
            <div className="flex items-start">
              <span className="w-44 font-bold text-[#1A202C]">Pelaksanaan</span>
              <span className="font-bold text-[#1A202C]">:</span>
              <span className="ml-2 font-medium text-[#1A202C]">{proker.tanggalPelaksanaan || '-'}</span>
            </div>
          </div>

          {/* 3. SEKSI 1: RINGKASAN KEUANGAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-bold text-xs text-[#1A202C] uppercase tracking-wide">
              1. RINGKASAN KEUANGAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="text-[#1A202C] font-bold border-b border-slate-400">
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-2/3">Keterangan</th>
                  <th className="py-2 px-3 text-center">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400">
                <tr>
                  <td className="py-2 px-3 border-r border-slate-400 font-medium">Total Pemasukan</td>
                  <td className="py-2 px-3 text-right font-medium text-[#1A202C]">
                    Rp{totalPemasukanNum.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border-r border-slate-400 font-medium">Total Pengeluaran</td>
                  <td className="py-2 px-3 text-right font-medium text-[#1A202C]">
                    Rp{totalPengeluaranNum.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-[#EBF7EE] font-bold">
                  <td className="py-2 px-3 border-r border-slate-400">Surplus / Defisit</td>
                  <td className="py-2 px-3 text-right text-[#1A202C]">
                    Rp{surplusDefisitNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. SEKSI 2: RINCIAN PEMASUKAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-bold text-xs text-[#1A202C] uppercase tracking-wide">
              2. RINCIAN PEMASUKAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="text-[#1A202C] font-bold border-b border-slate-400">
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-1/5">Tanggal</th>
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-3/5">Sumber / Keterangan</th>
                  <th className="py-2 px-3 text-center w-1/5">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400">
                {displayPemasukan.length > 0 ? (
                  displayPemasukan.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.tanggal}</td>
                      <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.keterangan}</td>
                      <td className="py-2 px-3 text-right font-medium text-[#1A202C]">
                        Rp{item.nominal.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-3 px-3 text-center text-slate-400 italic">
                      Belum ada transaksi pemasukan tercatat untuk proker ini
                    </td>
                  </tr>
                )}
                <tr className="bg-[#EBF7EE] font-bold border-t border-slate-400">
                  <td colSpan={2} className="py-2 px-3 text-center border-r border-slate-400">Total</td>
                  <td className="py-2 px-3 text-right text-[#1A202C]">
                    Rp{totalPemasukanNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. SEKSI 3: RINCIAN PENGELUARAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-bold text-xs text-[#1A202C] uppercase tracking-wide">
              3. RINCIAN PENGELUARAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="text-[#1A202C] font-bold border-b border-slate-400">
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-1/6">Tanggal</th>
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-2/5">Keterangan</th>
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-1/5">Jenis</th>
                  <th className="py-2 px-3 text-center w-1/4">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400">
                {displayPengeluaran.length > 0 ? (
                  displayPengeluaran.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.tanggal}</td>
                      <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.keterangan}</td>
                      <td className="py-2 px-3 border-r border-slate-400 text-center font-medium capitalize">
                        {item.jenisTransaksi}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-[#1A202C]">
                        Rp{item.nominal.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-center text-slate-400 italic">
                      Belum ada transaksi pengeluaran tercatat untuk proker ini
                    </td>
                  </tr>
                )}
                <tr className="bg-[#FDEAEA] font-bold border-t border-slate-400">
                  <td colSpan={3} className="py-2 px-3 text-center border-r border-slate-400">Total</td>
                  <td className="py-2 px-3 text-right text-[#1A202C]">
                    Rp{totalPengeluaranNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. SEKSI 4: BUKTI TRANSAKSI */}
          <div className="space-y-3 mb-6 font-sans page-break-inside-avoid">
            <h3 className="font-bold text-xs text-[#1A202C] uppercase tracking-wide">
              4. BUKTI TRANSAKSI
            </h3>
            
            {prokerReceipts.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {prokerReceipts.map((t, idx) => (
                  <div key={idx} className="flex flex-col items-center border border-slate-200 p-2 rounded-lg bg-slate-50">
                    <div className="w-full h-32 border border-slate-300 rounded overflow-hidden bg-white flex items-center justify-center">
                      <img src={t.buktiDriveUrl || '/sample-receipt-1.svg'} alt={t.keterangan} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-slate-800 text-center mt-1.5 leading-tight font-bold truncate w-full">
                      {t.keterangan}
                    </span>
                    <span className="text-[9px] text-slate-500 text-center">
                      Rp {t.nominal.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                Belum ada bukti nota digital yang terlampir pada transaksi program kerja ini.
              </p>
            )}
          </div>

          {/* 7. BLOK TANDA TANGAN LEGALISASI */}
          <div className="pt-6 flex justify-end font-sans page-break-inside-avoid">
            <div className="text-center w-72 space-y-16">
              <div>
                <p className="text-xs text-slate-800">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Bendahara Umum {currentOrgName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">
                  (_______________________)
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
