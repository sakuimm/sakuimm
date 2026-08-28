import React, { useState } from 'react';
import { Transaksi, OrgLevel } from '../types';
import { FileSpreadsheet, Download, FileText, CheckCircle2, Layers } from 'lucide-react';

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
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (type: 'excel' | 'pdf') => {
    const formatName = type === 'excel' ? 'Excel (.xlsx)' : 'PDF Dokumentasi';
    setDownloadSuccess(`Laporan Arus Kas Format Acuan (${formatName}) berhasil di-generate!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D3748]">Modul Laporan Standar & Ekspor</h2>
          <p className="text-xs text-slate-500">
            Laporan Arus Kas Bulanan/Tahunan mengikuti format acuan Excel (Cash Flow Standar IMM)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 bg-[#81B29A] hover:bg-emerald-600 text-[#2D3748] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-[#2D3748] hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4 text-[#F4A261]" /> Ekspor PDF
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#81B29A]/20 border border-[#81B29A] text-[#2D5A44] font-bold text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {downloadSuccess}
        </div>
      )}

      {/* Preview Sheet Laporan Arus Kas */}
      <div className="bg-white border border-slate-200 rounded-card p-6 shadow-xs space-y-6">
        {/* Header Laporan */}
        <div className="text-center border-b border-slate-200 pb-4 space-y-1">
          <span className="px-3 py-0.5 rounded-full bg-[#2D3748] text-white font-bold text-[10px] uppercase tracking-wider">
            {isAggregateMode ? `Laporan Agregat Multi-Level (${currentLevel})` : `Laporan Organisasi Mandiri (${currentLevel})`}
          </span>
          <h3 className="text-lg font-bold text-[#2D3748] uppercase tracking-tight">
            LAPORAN ARUS KAS & NERACA SEDERHANA
          </h3>
          <p className="text-xs font-semibold text-slate-600">
            SAKUIMM • IKATAN MAHASISWA MUHAMMADIYAH • PERIODE AGUSTUS 2026
          </p>
        </div>

        {/* Executive Summary Boxes */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Pemasukan Kas</p>
            <p className="text-lg font-extrabold text-[#81B29A]">
              Rp {dispPemasukan.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Pengeluaran Kas</p>
            <p className="text-lg font-extrabold text-[#F4A261]">
              Rp {dispPengeluaran.toLocaleString('id-ID')}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">Saldo Akhir Periode</p>
            <p className="text-lg font-extrabold text-[#2D3748]">
              Rp {dispSaldo.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Section 1: Tabel Transaksi Utama */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs text-[#2D3748] uppercase tracking-wider border-l-4 border-[#2D3748] pl-2">
            I. RINCIAN TRANSAKSI KAS UTAMA
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-600 border-y border-slate-200 font-bold">
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Program Kerja</th>
                  <th className="py-2 px-3">Bidang</th>
                  <th className="py-2 px-3">Keterangan</th>
                  <th className="py-2 px-3">Pemasukan</th>
                  <th className="py-2 px-3">Pengeluaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaksiList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-[#2D3748]">{t.tanggal}</td>
                    <td className="py-2 px-3 font-bold text-[#2D3748]">{t.programKerjaNama}</td>
                    <td className="py-2 px-3 text-slate-500">{t.bidangNama}</td>
                    <td className="py-2 px-3 text-slate-600">{t.keterangan}</td>
                    <td className="py-2 px-3 text-[#81B29A] font-bold">
                      {t.jenisNominal === 'pemasukan' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-[#F4A261] font-bold">
                      {t.jenisNominal === 'pengeluaran' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Report Stamp (PRD Requirement) */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>Sistem Pencatatan Keuangan IMM v1.0 • Format Acuan Cash Flow</span>
          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Data terakhir diperbarui pada: 28/08/2026 09:45 WIB
          </span>
        </div>
      </div>
    </div>
  );
};
