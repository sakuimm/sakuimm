import React, { useState } from 'react';
import { Transaksi, OrgLevel } from '../types';
import { PrintableCashFlowReportModal } from './PrintableCashFlowReportModal';
import { exportService } from '../services/exportService';
import { FileSpreadsheet, CheckCircle2, Printer } from 'lucide-react';

interface ReportsViewProps {
  transaksiList: Transaksi[];
  currentLevel: OrgLevel;
  isAggregateMode: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  transaksiList,
  currentLevel,
  isAggregateMode,
}) => {
  const [showPrintCashFlowModal, setShowPrintCashFlowModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportExcel = () => {
    exportService.exportTransactionsToExcel(transaksiList, currentLevel, 'Laporan_Arus_Kas_SAKU_IMM');
    setDownloadSuccess(`File Laporan Arus Kas Excel (.csv) berhasil di-download!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const totalPemasukan = transaksiList
    .filter((t) => t.jenisNominal === 'pemasukan')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalPengeluaran = transaksiList
    .filter((t) => t.jenisNominal === 'pengeluaran')
    .reduce((sum, t) => sum + t.nominal, 0);

  const mult = isAggregateMode ? (currentLevel === 'DPP' ? 15 : 5) : 1;
  const dispPemasukan = totalPemasukan * mult;
  const dispPengeluaran = totalPengeluaran * mult;
  const dispSaldo = dispPemasukan - dispPengeluaran;

  const getOrgName = (lvl: OrgLevel) => {
    switch (lvl) {
      case 'PK': return 'PK IMM Teknik Mesin UI';
      case 'KORKOM': return 'KORKOM IMM Universitas Indonesia';
      case 'PC': return 'PC IMM Jakarta Selatan';
      case 'DPD': return 'DPD IMM DKI Jakarta';
      case 'DPP': return 'DPP IMM (Pusat)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Modul Laporan Arus Kas IMM</h2>
          <p className="text-xs text-slate-500">
            Laporan Arus Kas (Cash Flow Statement) Standar Organisasi Ikatan Mahasiswa Muhammadiyah
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-[#81B29A] hover:bg-emerald-600 text-[#2D3748] hover:text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            title="Download Berkas Excel (.csv) Ke Komputer / HP"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Excel (.xlsx)
          </button>
          
          <button
            onClick={() => setShowPrintCashFlowModal(true)}
            className="px-3.5 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4 text-[#81B29A]" /> Preview Cetak PDF Arus Kas
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] font-bold text-xs rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" /> {downloadSuccess}
        </div>
      )}

      {/* Main Report Document Sheet */}
      <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-6">
        {/* Header Laporan Document */}
        <div className="text-center border-b border-slate-200 pb-4 space-y-1">
          <span className="px-3 py-0.5 rounded-full bg-[#7A0C1E] text-white font-bold text-[10px] uppercase tracking-wider">
            {isAggregateMode ? `Laporan Agregat Multi-Level (${currentLevel})` : `Laporan Mandiri Organisasi (${currentLevel})`}
          </span>
          <h3 className="text-lg font-black text-[#2D3748] uppercase tracking-tight">
            LAPORAN ARUS KAS (CASH FLOW STATEMENT)
          </h3>
          <p className="text-xs font-semibold text-slate-600">
            SAKU IMM • IKATAN MAHASISWA MUHAMMADIYAH • PERIODE AGUSTUS 2026
          </p>
        </div>

        {/* Executive Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Pemasukan Kas</p>
            <p className="text-lg font-extrabold text-[#2E7D32]">
              Rp {dispPemasukan.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Pengeluaran Kas</p>
            <p className="text-lg font-extrabold text-[#C05621]">
              Rp {dispPengeluaran.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Saldo Kas Akhir</p>
            <p className="text-lg font-extrabold text-[#1D4ED8]">
              Rp {dispSaldo.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* LAPORAN ARUS KAS (CASH FLOW STATEMENT) TABLE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#2D3748] uppercase tracking-wider border-l-4 border-[#7A0C1E] pl-2">
              RINCIAN ARUS KAS MASUK & KELUAR (CASH FLOW)
            </h4>
            <button
              onClick={() => setShowPrintCashFlowModal(true)}
              className="px-3.5 py-1.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#81B29A]" />
              <span>Cetak Laporan Arus Kas (PDF)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-600 border-y border-slate-200 font-bold">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Program Kerja</th>
                  <th className="py-2.5 px-3">Bidang Naungan</th>
                  <th className="py-2.5 px-3">Keterangan Nota</th>
                  <th className="py-2.5 px-3">Arus Kas Masuk (Pemasukan)</th>
                  <th className="py-2.5 px-3">Arus Kas Keluar (Pengeluaran)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaksiList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-[#2D3748]">{t.tanggal}</td>
                    <td className="py-2.5 px-3 font-bold text-[#2D3748]">{t.programKerjaNama}</td>
                    <td className="py-2.5 px-3 text-slate-500">{t.bidangNama}</td>
                    <td className="py-2.5 px-3 text-slate-600">{t.keterangan}</td>
                    <td className="py-2.5 px-3 text-[#2E7D32] font-bold">
                      {t.jenisNominal === 'pemasukan' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[#C05621] font-bold">
                      {t.jenisNominal === 'pengeluaran' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Report Stamp */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>SAKU IMM Finance v1.0 • Persistensi Data & Real Excel (.xlsx) Download Ready</span>
          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Diperbarui pada: 03/09/2026 15:48 WIB
          </span>
        </div>
      </div>

      {/* PRINTABLE CASH FLOW REPORT MODAL */}
      {showPrintCashFlowModal && (
        <PrintableCashFlowReportModal
          currentLevel={currentLevel}
          currentOrgName={getOrgName(currentLevel)}
          onClose={() => setShowPrintCashFlowModal(false)}
        />
      )}
    </div>
  );
};
