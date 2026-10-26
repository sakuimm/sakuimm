import React, { useState } from 'react';
import { OrgLevel, Transaksi } from '../types';
import { Printer, X, FileText, Download, Loader2 } from 'lucide-react';
import { exportService } from '../services/exportService';

interface PrintableCashFlowReportModalProps {
  currentLevel: OrgLevel;
  currentOrgName: string;
  onClose: () => void;
  transaksiList?: Transaksi[];
}

export const PrintableCashFlowReportModal: React.FC<PrintableCashFlowReportModalProps> = ({
  currentLevel,
  currentOrgName,
  onClose,
  transaksiList = [],
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper to extract month index from diverse date string formats
  const getMonthIndex = (dateStr: string): number => {
    const s = (dateStr || '').toLowerCase();
    if (s.includes('jan')) return 0;
    if (s.includes('feb')) return 1;
    if (s.includes('mar')) return 2;
    if (s.includes('apr')) return 3;
    if (s.includes('mei') || s.includes('may')) return 4;
    if (s.includes('jun')) return 5;
    if (s.includes('jul')) return 6;
    if (s.includes('agu') || s.includes('aug')) return 7;
    if (s.includes('sep')) return 8;
    if (s.includes('okt') || s.includes('oct')) return 9;
    if (s.includes('nov')) return 10;
    if (s.includes('des') || s.includes('dec')) return 11;
    return 7; // Default to August
  };

  const hasTransactions = transaksiList.length > 0;

  // Real aggregations
  const totalPemasukanNum = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaranNum = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  const netCashFlowNum = totalPemasukanNum - totalPengeluaranNum;
  const saldoAwalNum = 0;
  const saldoAkhirNum = saldoAwalNum + netCashFlowNum;
  const totalPutaranNum = totalPemasukanNum + totalPengeluaranNum;

  // Real breakdown by Bidang for largest expense
  const expenseByBidang: Record<string, number> = {};
  transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .forEach((t) => {
      const bName = t.bidangNama || 'Organisasi';
      expenseByBidang[bName] = (expenseByBidang[bName] || 0) + t.nominal;
    });

  let maxBidang = 'Organisasi';
  let maxExpenseNominal = 0;
  Object.entries(expenseByBidang).forEach(([bName, val]) => {
    if (val > maxExpenseNominal) {
      maxExpenseNominal = val;
      maxBidang = bName;
    }
  });

  const maxExpensePercent = totalPengeluaranNum > 0
    ? ((maxExpenseNominal / totalPengeluaranNum) * 100).toFixed(2).replace('.', ',')
    : '0,00';

  // Group real transactions into monthly breakdown
  const monthlyMap: Record<number, { pemasukan: number; pengeluaran: number }> = {};
  transaksiList.forEach((t) => {
    const mIdx = getMonthIndex(t.tanggal);
    if (!monthlyMap[mIdx]) {
      monthlyMap[mIdx] = { pemasukan: 0, pengeluaran: 0 };
    }
    if (t.jenisNominal === 'pemasukan') {
      monthlyMap[mIdx].pemasukan += t.nominal;
    } else {
      monthlyMap[mIdx].pengeluaran += t.nominal;
    }
  });

  const activeMonthIndices = Object.keys(monthlyMap).map(Number).sort((a, b) => a - b);
  const activeMonthCount = Math.max(activeMonthIndices.length, 1);
  const avgMonthlyExpenseNum = Math.round(totalPengeluaranNum / activeMonthCount);

  // Determine period text
  const periodText = activeMonthIndices.length > 0
    ? activeMonthIndices.length === 1
      ? `Periode ${MONTH_NAMES[activeMonthIndices[0]]} 2026`
      : `Periode ${MONTH_NAMES[activeMonthIndices[0]]} – ${MONTH_NAMES[activeMonthIndices[activeMonthIndices.length - 1]]} 2026`
    : 'Periode Tahun 2026';

  let runningBalance = saldoAwalNum;
  const dynamicMonthlyData = activeMonthIndices.map((mIdx) => {
    const p = monthlyMap[mIdx].pemasukan;
    const k = monthlyMap[mIdx].pengeluaran;
    const net = p - k;
    const startBal = runningBalance;
    runningBalance += net;
    return {
      bulan: MONTH_NAMES[mIdx],
      saldoAwal: startBal.toLocaleString('id-ID'),
      pemasukan: p.toLocaleString('id-ID'),
      pengeluaran: k.toLocaleString('id-ID'),
      net: (net < 0 ? '-' : '') + Math.abs(net).toLocaleString('id-ID'),
      saldoAkhir: runningBalance.toLocaleString('id-ID'),
    };
  });

  const getOfficialLeadershipTitle = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PIMPINAN KOMISARIAT';
      case 'KORKOM': return 'KOORDINATOR KOMISARIAT';
      case 'PC': return 'PIMPINAN CABANG';
      case 'DPD': return 'DEWAN PIMPINAN DAERAH';
      case 'DPP': return 'DEWAN PIMPINAN PUSAT';
      default: return 'PIMPINAN';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDirectDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const fileName = `Laporan_Arus_Kas_${currentLevel}_${new Date().toISOString().split('T')[0]}`;
      await exportService.exportPdfElement('printable-cashflow-area', fileName);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex justify-center items-start p-4 z-50 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 print:my-0 print:shadow-none print:border-none print:w-full">
        
        {/* Action Header Bar (Hidden during print) */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#81B29A]" />
            <h3 className="font-extrabold text-sm">Preview Dokumen Siap Cetak (Laporan Arus Kas)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDirectDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2 bg-[#81B29A] hover:bg-emerald-600 text-[#1A202C] hover:text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
              title="Unduh langsung berkas PDF A4 ke perangkat tanpa dialog printer"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen PDF</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95"
              title="Cetak melalui printer atau dialog browser"
            >
              <Printer className="w-4 h-4 text-[#81B29A]" />
              <span>Cetak Printer</span>
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

        {/* PRINTABLE A4 CASH FLOW DOCUMENT SHEET */}
        <div className="p-8 md:p-12 text-[#1A202C] font-sans leading-relaxed bg-white print:p-6" id="printable-cashflow-area">
          
          {/* 1. KOP SURAT RESMI ORGANISASI IMM (Sesuai Tanfidz Muktamar XVIII) */}
          <div className="flex items-center justify-between pb-2 mb-1">
            {/* Logo Kiri: Lambang Resmi Wikipedia IMM */}
            <div className="w-20 flex-shrink-0 flex items-center justify-start">
              <img src="/imm-logo-official.svg" alt="Lambang Resmi IMM" className="h-20 w-auto object-contain" />
            </div>

            {/* Header Text Center: Tipografi Merah Resmi IMM */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg md:text-xl font-black tracking-wider uppercase text-[#B71C1C] font-serif">
                {getOfficialLeadershipTitle(currentLevel)}
              </h1>
              <h2 className="text-base md:text-lg font-black uppercase text-[#B71C1C] tracking-wide font-serif mt-0.5">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h2>
              {currentLevel !== 'DPP' && currentOrgName && (
                <p className="text-xs md:text-sm font-bold text-[#B71C1C] uppercase tracking-wider font-serif mt-0.5">
                  {currentOrgName.replace(/^(DPD|PC|PK|KORKOM)\s+IMM\s+/i, '').trim()}
                </p>
              )}
            </div>

            {/* Logo Kanan: Logo SAKU IMM Resmi */}
            <div className="w-24 flex-shrink-0 flex items-center justify-end">
              <img src="/logosakuimmnew.png" alt="Logo SAKU IMM" className="h-14 w-auto object-contain" />
            </div>
          </div>

          {/* Garis Pembatas Ganda Merah Resmi IMM */}
          <div className="space-y-[2px] mb-6">
            <div className="h-[2.5px] bg-[#B71C1C] w-full" />
            <div className="h-[1px] bg-[#B71C1C] w-full" />
          </div>

          {/* 2. TITLE SECTION */}
          <div className="text-center space-y-0.5 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-[#1A202C] uppercase tracking-wide">
              LAPORAN ARUS KAS
            </h2>
            <p className="text-sm md:text-base font-bold text-slate-800">
              {periodText}
            </p>
            <p className="text-xs text-slate-500">
              (Disajikan dalam Rupiah)
            </p>
          </div>

          {/* 3. SEKSI 1: METRIK KEUANGAN (3 BOX BORDERED CONTAINER DARI DATA RIIL) */}
          <div className="space-y-2 mb-6">
            <h3 className="font-black text-xs text-[#1A202C] uppercase tracking-wider">
              1. METRIK KEUANGAN
            </h3>
            
            <div className="border border-slate-300 rounded-lg overflow-hidden grid grid-cols-3 divide-x divide-slate-300 bg-white">
              {/* Box 1: Total Putaran Keuangan */}
              <div className="p-4 text-center space-y-1.5 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  TOTAL PUTARAN KEUANGAN
                </span>
                <p className="text-lg md:text-xl font-black text-[#1A202C]">
                  Rp{totalPutaranNum.toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  Pemasukan Rp{totalPemasukanNum.toLocaleString('id-ID')}
                  <br />+ Pengeluaran Rp{totalPengeluaranNum.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Box 2: Rata-Rata Pengeluaran / Bulan */}
              <div className="p-4 text-center space-y-1.5 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  RATA-RATA PENGELUARAN / BULAN
                </span>
                <p className="text-lg md:text-xl font-black text-[#1A202C]">
                  Rp{avgMonthlyExpenseNum.toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-slate-500">
                  Dihitung dari {activeMonthCount} periode bulan aktif
                </p>
              </div>

              {/* Box 3: Pengeluaran Terbesar */}
              <div className="p-4 text-center space-y-1 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  PENGELUARAN TERBESAR
                </span>
                <p className="text-xs font-semibold text-slate-800 truncate" title={maxBidang}>
                  Bidang {maxBidang}
                </p>
                <p className="text-base md:text-lg font-black text-[#1A202C]">
                  Rp{maxExpenseNominal.toLocaleString('id-ID')}
                </p>
                <p className="text-[11px] text-slate-600 font-semibold">({maxExpensePercent}%)</p>
              </div>
            </div>
          </div>

          {/* 4. SEKSI 2: RINGKASAN ARUS KAS (DATA RIIL) */}
          <div className="space-y-2 mb-6">
            <h3 className="font-black text-xs text-[#1A202C] uppercase tracking-wider">
              2. RINGKASAN ARUS KAS
            </h3>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] text-slate-800 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-4 text-center border-r border-slate-300 w-1/2">Keterangan</th>
                  <th className="py-2.5 px-4 text-center w-1/2">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Saldo Awal</td>
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp{saldoAwalNum.toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pemasukan</td>
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp{totalPemasukanNum.toLocaleString('id-ID')}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pengeluaran</td>
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp{totalPengeluaranNum.toLocaleString('id-ID')}</td>
                </tr>
                {/* Highlighted Rows */}
                <tr className="bg-[#EBF7EE] font-bold">
                  <td className="py-2 px-4 border-r border-slate-300 text-[#1A202C]">Kenaikan / Penurunan Kas</td>
                  <td className="py-2 px-4 text-right font-black text-[#1A202C]">
                    {(netCashFlowNum < 0 ? '-' : '')}Rp{Math.abs(netCashFlowNum).toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-[#EBF7EE] font-black">
                  <td className="py-2.5 px-4 border-r border-slate-300 text-[#1A202C]">Saldo Akhir</td>
                  <td className="py-2.5 px-4 text-right font-black text-[#1A202C]">
                    Rp{saldoAkhirNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. SEKSI 3: ARUS KAS PER BULAN */}
          <div className="space-y-2 mb-6 page-break-inside-avoid">
            <h3 className="font-black text-xs text-[#1A202C] uppercase tracking-wider">
              3. ARUS KAS PER BULAN
            </h3>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-[#F1F5F9] text-slate-800 font-bold border-b border-slate-300 text-center">
                  <th className="py-2 px-3 border-r border-slate-300">Bulan</th>
                  <th className="py-2 px-3 border-r border-slate-300">Saldo Awal (Rp)</th>
                  <th className="py-2 px-3 border-r border-slate-300">Pemasukan (Rp)</th>
                  <th className="py-2 px-3 border-r border-slate-300">Pengeluaran (Rp)</th>
                  <th className="py-2 px-3 border-r border-slate-300">Kenaikan / Penurunan (Rp)</th>
                  <th className="py-2 px-3">Saldo Akhir (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                {dynamicMonthlyData.length > 0 ? (
                  dynamicMonthlyData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-medium border-r border-slate-300 text-left">{row.bulan}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.saldoAwal}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.pemasukan}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.pengeluaran}</td>
                      <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.net}</td>
                      <td className="py-2 px-3 text-right font-medium text-[#1A202C]">{row.saldoAkhir}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-slate-400 italic">
                      Belum ada transaksi arus kas tercatat dalam periode ini.
                    </td>
                  </tr>
                )}
                {/* Total Row */}
                <tr className="bg-[#EBF7EE] font-black border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 border-r border-slate-300 uppercase text-left">TOTAL</td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-300 text-slate-400">–</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">{totalPemasukanNum.toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">{totalPengeluaranNum.toLocaleString('id-ID')}</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">
                    {(netCashFlowNum < 0 ? '-' : '') + Math.abs(netCashFlowNum).toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#1A202C]">{saldoAkhirNum.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. CATATAN SISTEM & BLOK TANDA TANGAN LEGALISASI */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 page-break-inside-avoid">
            {/* Notes Left */}
            <div className="text-xs text-slate-700 space-y-1 max-w-sm">
              <p className="font-bold text-[#1A202C]">Catatan:</p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                1. Laporan ini disusun secara otomatis berdasarkan data transaksi sah dalam sistem SAKU IMM.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                2. Seluruh transaksi arus kas masuk dan keluar telah diverifikasi oleh Bendahara Umum.
              </p>
            </div>

            {/* Signature Right */}
            <div className="text-center w-64 space-y-16">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs font-bold text-[#1A202C] mt-0.5">
                  Bendahara Umum {currentLevel === 'DPP' ? 'DPP IMM' : currentOrgName}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-[#1A202C] tracking-wider">
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
