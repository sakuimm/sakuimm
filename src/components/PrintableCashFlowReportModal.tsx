import React from 'react';
import { OrgLevel } from '../types';
import { Printer, X, FileText } from 'lucide-react';

interface PrintableCashFlowReportModalProps {
  currentLevel: OrgLevel;
  currentOrgName: string;
  onClose: () => void;
}

export const PrintableCashFlowReportModal: React.FC<PrintableCashFlowReportModalProps> = ({
  currentLevel,
  currentOrgName,
  onClose,
}) => {
  // Monthly cash flow data (Januari - Agustus 2026) matching the reference mockup 100%
  const monthlyData = [
    { bulan: 'Januari', saldoAwal: '100.000.000', pemasukan: '45.000.000', pengeluaran: '32.000.000', net: '13.000.000', saldoAkhir: '113.000.000' },
    { bulan: 'Februari', saldoAwal: '113.000.000', pemasukan: '60.000.000', pengeluaran: '42.000.000', net: '18.000.000', saldoAkhir: '131.000.000' },
    { bulan: 'Maret', saldoAwal: '131.000.000', pemasukan: '38.000.000', pengeluaran: '35.000.000', net: '3.000.000', saldoAkhir: '134.000.000' },
    { bulan: 'April', saldoAwal: '134.000.000', pemasukan: '72.000.000', pengeluaran: '50.000.000', net: '22.000.000', saldoAkhir: '156.000.000' },
    { bulan: 'Mei', saldoAwal: '156.000.000', pemasukan: '55.000.000', pengeluaran: '48.000.000', net: '7.000.000', saldoAkhir: '163.000.000' },
    { bulan: 'Juni', saldoAwal: '163.000.000', pemasukan: '80.000.000', pengeluaran: '61.000.000', net: '19.000.000', saldoAkhir: '182.000.000' },
    { bulan: 'Juli', saldoAwal: '182.000.000', pemasukan: '65.000.000', pengeluaran: '52.000.000', net: '13.000.000', saldoAkhir: '195.000.000' },
    { bulan: 'Agustus', saldoAwal: '195.000.000', pemasukan: '95.000.000', pengeluaran: '70.000.000', net: '25.000.000', saldoAkhir: '220.000.000' },
  ];

  const getLevelHeaderTitle = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PIMPINAN KOMISARIAT IMM';
      case 'KORKOM': return 'KOORDINATOR KOMISARIAT IMM';
      case 'PC': return 'PIMPINAN CABANG IMM';
      case 'DPD': return 'DEWAN PIMPINAN DAERAH IMM';
      case 'DPP': return 'DEWAN PIMPINAN PUSAT IMM';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex justify-center items-start p-4 z-50 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 my-6 print:my-0 print:shadow-none print:border-none print:w-full">
        
        {/* Action Bar (Hidden during print) */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#81B29A]" />
            <h3 className="font-extrabold text-sm">Preview Dokumen Siap Cetak (Laporan Arus Kas)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#81B29A]" /> Cetak Sekarang (A4 / PDF)
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
          
          {/* 1. KOP SURAT RESMI ORGANISASI IMM */}
          <div className="flex items-center justify-between pb-3 mb-1">
            {/* Logo Left */}
            <div className="w-20 flex-shrink-0 flex items-center justify-center">
              <img src="/imm-shield-logo.svg" alt="IMM Logo" className="h-20 object-contain" />
            </div>

            {/* Header Text Center */}
            <div className="text-center flex-1 px-4">
              <h1 className="text-lg md:text-xl font-black tracking-wide uppercase text-[#1A202C]">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h1>
              <h2 className="text-base md:text-lg font-black uppercase text-[#7A0C1E] tracking-wide mt-0.5">
                {currentLevel === 'DPP' ? 'DEWAN PIMPINAN PUSAT IMM' : getLevelHeaderTitle(currentLevel)}
              </h2>
              <p className="text-xs text-slate-700 font-medium mt-1">
                Jl. Kramat Raya No.49, Jakarta Pusat 10450
              </p>
              <p className="text-xs text-slate-700 font-medium">
                Telp. (021) 3903021 | Email: dpp@imm.or.id
              </p>
            </div>

            {/* Badge Right (SAKU IMM Record Verification Stamp) */}
            <div className="w-48 text-right space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#7A0C1E] text-white rounded text-[10px] font-bold">
                <span className="bg-white text-[#7A0C1E] px-1 rounded font-black text-[9px]">IMM</span>
                <span>Dicatat melalui SAKU IMM</span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold">
                13 Agustus 2026 &nbsp;|&nbsp; 14:30 WIB
              </p>
            </div>
          </div>

          {/* Double Horizontal Divider Bar (Top Maroon Thick, Bottom Black Thin) */}
          <div className="space-y-0.5 mb-6">
            <div className="h-[3.5px] bg-[#7A0C1E] w-full" />
            <div className="h-[1px] bg-slate-900 w-full" />
          </div>

          {/* 2. TITLE SECTION */}
          <div className="text-center space-y-0.5 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-[#1A202C] uppercase tracking-wide">
              LAPORAN ARUS KAS
            </h2>
            <p className="text-sm md:text-base font-bold text-slate-800">
              Periode Januari – Agustus 2026
            </p>
            <p className="text-xs text-slate-500">
              (Disajikan dalam Rupiah)
            </p>
          </div>

          {/* 3. SEKSI 1: METRIK KEUANGAN (3 BOX BORDERED CONTAINER) */}
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
                  Rp900.000.000
                </p>
                <p className="text-[11px] text-slate-600 font-medium">
                  Pemasukan Rp510.000.000
                  <br />+ Pengeluaran Rp390.000.000
                </p>
              </div>

              {/* Box 2: Rata-Rata Pengeluaran / Bulan */}
              <div className="p-4 text-center space-y-1.5 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  RATA-RATA PENGELUARAN / BULAN
                </span>
                <p className="text-lg md:text-xl font-black text-[#1A202C]">
                  Rp48.750.000
                </p>
              </div>

              {/* Box 3: Pengeluaran Terbesar */}
              <div className="p-4 text-center space-y-1 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                  PENGELUARAN TERBESAR
                </span>
                <p className="text-xs font-semibold text-slate-800">Organisasi</p>
                <p className="text-base md:text-lg font-black text-[#1A202C]">
                  Rp85.000.000
                </p>
                <p className="text-[11px] text-slate-600 font-semibold">(21,79%)</p>
              </div>
            </div>
          </div>

          {/* 4. SEKSI 2: RINGKASAN ARUS KAS */}
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
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp100.000.000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pemasukan</td>
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp510.000.000</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pengeluaran</td>
                  <td className="py-2 px-4 text-right font-medium text-[#1A202C]">Rp390.000.000</td>
                </tr>
                {/* Highlighted Rows */}
                <tr className="bg-[#EBF7EE] font-bold">
                  <td className="py-2 px-4 border-r border-slate-300 text-[#1A202C]">Kenaikan / Penurunan Kas</td>
                  <td className="py-2 px-4 text-right font-black text-[#1A202C]">Rp120.000.000</td>
                </tr>
                <tr className="bg-[#EBF7EE] font-black">
                  <td className="py-2.5 px-4 border-r border-slate-300 text-[#1A202C]">Saldo Akhir</td>
                  <td className="py-2.5 px-4 text-right font-black text-[#1A202C]">Rp220.000.000</td>
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
                  <th className="py-2 px-3 border-r border-slate-300">Kenaikan / Penurunan Kas (Rp)</th>
                  <th className="py-2 px-3">Saldo Akhir (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-slate-800">
                {monthlyData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-medium border-r border-slate-300 text-left">{row.bulan}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.saldoAwal}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.pemasukan}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.pengeluaran}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">{row.net}</td>
                    <td className="py-2 px-3 text-right font-medium text-[#1A202C]">{row.saldoAkhir}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-[#EBF7EE] font-black border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 border-r border-slate-300 uppercase text-left">TOTAL</td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-300 text-slate-400">–</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">510.000.000</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">390.000.000</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">120.000.000</td>
                  <td className="py-2.5 px-3 text-right text-[#1A202C]">220.000.000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. CATATAN SISTEM & BLOK TANDA TANGAN LEGALISASI */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 page-break-inside-avoid">
            {/* Notes Left */}
            <div className="text-xs text-slate-700 space-y-1 max-w-sm">
              <p className="font-bold text-[#1A202C]">Catatan:</p>
              <p className="text-[11px] leading-relaxed text-slate-700">
                1. Laporan ini disusun berdasarkan data yang ada dalam sistem SAKU IMM.
              </p>
            </div>

            {/* Signature Right */}
            <div className="text-center w-64 space-y-16">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Jakarta, 13 Agustus 2026
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
