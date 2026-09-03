import React from 'react';
import { OrgLevel } from '../types';
import { Printer, X, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

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
  // Monthly cash flow data (Januari - Agustus 2026)
  const monthlyData = [
    { bulan: 'Januari', saldoAwal: 100000000, pemasukan: 45000000, pengeluaran: 32000000, net: 13000000, saldoAkhir: 113000000 },
    { bulan: 'Februari', saldoAwal: 113000000, pemasukan: 60000000, pengeluaran: 42000000, net: 18000000, saldoAkhir: 131000000 },
    { bulan: 'Maret', saldoAwal: 131000000, pemasukan: 38000000, pengeluaran: 35000000, net: 3000000, saldoAkhir: 134000000 },
    { bulan: 'April', saldoAwal: 134000000, pemasukan: 72000000, pengeluaran: 50000000, net: 22000000, saldoAkhir: 156000000 },
    { bulan: 'Mei', saldoAwal: 156000000, pemasukan: 55000000, pengeluaran: 48000000, net: 7000000, saldoAkhir: 163000000 },
    { bulan: 'Juni', saldoAwal: 163000000, pemasukan: 80000000, pengeluaran: 61000000, net: 19000000, saldoAkhir: 182000000 },
    { bulan: 'Juli', saldoAwal: 182000000, pemasukan: 65000000, pengeluaran: 52000000, net: 13000000, saldoAkhir: 195000000 },
    { bulan: 'Agustus', saldoAwal: 195000000, pemasukan: 95000000, pengeluaran: 70000000, net: 25000000, saldoAkhir: 220000000 },
  ];

  const totalPemasukan = monthlyData.reduce((sum, item) => sum + item.pemasukan, 0);
  const totalPengeluaran = monthlyData.reduce((sum, item) => sum + item.pengeluaran, 0);
  const totalNetKas = totalPemasukan - totalPengeluaran;
  const initialSaldoAwal = monthlyData[0].saldoAwal;
  const finalSaldoAkhir = monthlyData[monthlyData.length - 1].saldoAkhir;
  const totalPutaran = totalPemasukan + totalPengeluaran;
  const avgPengeluaranBulan = totalPengeluaran / monthlyData.length;

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
              className="px-4 py-2 bg-[#81B29A] hover:bg-emerald-600 text-[#2D3748] font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" /> Cetak Dokumen / Simpan PDF
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
        <div className="p-8 md:p-12 text-[#1A202C] font-serif leading-relaxed bg-white print:p-8" id="printable-cashflow-area">
          
          {/* 1. KOP SURAT RESMI ORGANISASI IMM */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-1">
            {/* Logo Left */}
            <div className="w-20 flex items-center justify-center">
              <img src="/logosakuimmnew.png" alt="IMM Logo" className="h-16 object-contain" />
            </div>

            {/* Header Text Center */}
            <div className="text-center font-sans flex-1 px-4">
              <h1 className="text-lg md:text-xl font-black tracking-wider uppercase text-slate-900">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h1>
              <h2 className="text-base md:text-lg font-black uppercase text-[#7A0C1E] tracking-wide mt-0.5">
                {getLevelHeaderTitle(currentLevel)}
              </h2>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Jl. Kramat Raya No. 49, Jakarta Pusat 10450
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Telp. (021) 3903021 | Email: dpp@imm.or.id
              </p>
            </div>

            {/* Badge Right (SAKU IMM Record Verification Stamp) */}
            <div className="w-40 text-right font-sans space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#7A0C1E] text-white rounded text-[10px] font-bold">
                <span className="bg-white text-[#7A0C1E] px-1 rounded font-black text-[9px]">IMM</span>
                <span>Dicatat melalui SAKU IMM</span>
              </div>
              <p className="text-[10px] text-slate-600 font-semibold">
                13 Agustus 2026 | 14:30 WIB
              </p>
            </div>
          </div>

          {/* Double Horizontal Divider Bar */}
          <div className="border-b-4 border-slate-900 mb-6" />

          {/* 2. TITLE SECTION */}
          <div className="text-center font-sans space-y-0.5 mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              LAPORAN ARUS KAS
            </h2>
            <p className="text-sm font-extrabold text-slate-700">
              Periode Januari – Agustus 2026
            </p>
            <p className="text-xs text-slate-500 italic">
              (Disajikan dalam Rupiah)
            </p>
          </div>

          {/* 3. SEKSI 1: METRIK KEUANGAN (3 BOX GRID) */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              1. METRIK KEUANGAN
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {/* Box 1: Total Putaran Keuangan */}
              <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  TOTAL PUTARAN KEUANGAN
                </span>
                <p className="text-base font-black text-slate-900">
                  Rp{totalPutaran.toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Pemasukan Rp{totalPemasukan.toLocaleString('id-ID')}
                  <br />+ Pengeluaran Rp{totalPengeluaran.toLocaleString('id-ID')}
                </p>
              </div>

              {/* Box 2: Rata-Rata Pengeluaran / Bulan */}
              <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50/50 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  RATA-RATA PENGELUARAN / BULAN
                </span>
                <p className="text-base font-black text-slate-900">
                  Rp{Math.round(avgPengeluaranBulan).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Box 3: Pengeluaran Terbesar */}
              <div className="border border-slate-300 rounded-lg p-3 text-center bg-slate-50/50 flex flex-col justify-center space-y-1">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  PENGELUARAN TERBESAR
                </span>
                <p className="text-xs font-bold text-slate-700">Organisasi</p>
                <p className="text-base font-black text-slate-900">
                  Rp85.000.000
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">(21,79%)</p>
              </div>
            </div>
          </div>

          {/* 4. SEKSI 2: RINGKASAN ARUS KAS */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              2. RINGKASAN ARUS KAS
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                  <th className="py-2 px-4 text-left border-r border-slate-400 w-2/3">Keterangan</th>
                  <th className="py-2 px-4 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Saldo Awal</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">
                    Rp{initialSaldoAwal.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pemasukan</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">
                    Rp{totalPemasukan.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pengeluaran</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">
                    Rp{totalPengeluaran.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 px-4 border-r border-slate-300">Kenaikan / Penurunan Kas</td>
                  <td className="py-2 px-4 text-right text-slate-900 font-black">
                    Rp{totalNetKas.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-slate-100 font-black">
                  <td className="py-2.5 px-4 border-r border-slate-300 uppercase">Saldo Akhir</td>
                  <td className="py-2.5 px-4 text-right text-slate-900 text-sm">
                    Rp{finalSaldoAkhir.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. SEKSI 3: ARUS KAS PER BULAN */}
          <div className="space-y-2 mb-8 font-sans page-break-inside-avoid">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              3. ARUS KAS PER BULAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400 text-center">
                  <th className="py-2 px-3 text-left border-r border-slate-400">Bulan</th>
                  <th className="py-2 px-3 text-right border-r border-slate-400">Saldo Awal (Rp)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-400">Pemasukan (Rp)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-400">Pengeluaran (Rp)</th>
                  <th className="py-2 px-3 text-right border-r border-slate-400">Kenaikan / Penurunan Kas (Rp)</th>
                  <th className="py-2 px-3 text-right">Saldo Akhir (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {monthlyData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold border-r border-slate-300">{row.bulan}</td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">
                      {row.saldoAwal.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">
                      {row.pemasukan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">
                      {row.pengeluaran.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 text-right border-r border-slate-300 font-medium">
                      {row.net.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {row.saldoAkhir.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-400">
                  <td className="py-2.5 px-3 border-r border-slate-300 uppercase text-center">TOTAL</td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-300 text-slate-400">–</td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">
                    {totalPemasukan.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">
                    {totalPengeluaran.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right border-r border-slate-300">
                    {totalNetKas.toLocaleString('id-ID')}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-900">
                    {finalSaldoAkhir.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. CATATAN SISTEM & BLOK TANDA TANGAN LEGALISASI */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 font-sans page-break-inside-avoid">
            {/* Notes Left */}
            <div className="text-xs text-slate-600 space-y-1 max-w-xs">
              <p className="font-bold text-slate-800">Catatan:</p>
              <p className="text-[11px] leading-snug">
                1. Laporan ini disusun berdasarkan data yang ada dalam sistem SAKU IMM.
              </p>
            </div>

            {/* Signature Right */}
            <div className="text-center w-64 space-y-12">
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Jakarta, 13 Agustus 2026
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Bendahara Umum {currentLevel === 'DPP' ? 'DPP IMM' : currentOrgName}
                </p>
              </div>

              <div>
                <p className="text-xs font-extrabold text-slate-900">
                  ( Immawan Ahmad )
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  NBM. 129481.2026.IMM
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
