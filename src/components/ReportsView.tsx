import React, { useState } from 'react';
import { Transaksi, ProgramKerja, OrgLevel } from '../types';
import { MOCK_PROKER } from '../data/mockData';
import { PrintableProkerReportModal } from './PrintableProkerReportModal';
import { PrintableCashFlowReportModal } from './PrintableCashFlowReportModal';
import { exportService } from '../services/exportService';
import { FileSpreadsheet, Download, FileText, CheckCircle2, Printer, Calendar } from 'lucide-react';

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
  const [reportTab, setReportTab] = useState<'proker' | 'arus-kas'>('proker');
  const [selectedProkerForPrint, setSelectedProkerForPrint] = useState<ProgramKerja | null>(null);
  const [showPrintCashFlowModal, setShowPrintCashFlowModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportExcel = () => {
    if (reportTab === 'proker') {
      exportService.exportProkerSummaryToExcel(MOCK_PROKER, transaksiList, currentLevel);
      setDownloadSuccess(`File Laporan Keuangan Per Proker Excel (.csv) berhasil di-download!`);
    } else {
      exportService.exportTransactionsToExcel(transaksiList, currentLevel, 'Laporan_Arus_Kas_SAKU_IMM');
      setDownloadSuccess(`File Laporan Arus Kas Excel (.csv) berhasil di-download!`);
    }
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
          <h2 className="text-xl font-bold text-[#2D3748]">Modul Laporan Keuangan IMM</h2>
          <p className="text-xs text-slate-500">
            Laporan Keuangan Per Program Kerja & Arus Kas Standar Organisasi
          </p>
        </div>

        {/* Tab Switcher & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setReportTab('proker')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportTab === 'proker'
                  ? 'bg-[#7A0C1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#7A0C1E]'
              }`}
            >
              Laporan Per Program Kerja
            </button>
            <button
              onClick={() => setReportTab('arus-kas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportTab === 'arus-kas'
                  ? 'bg-[#7A0C1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#7A0C1E]'
              }`}
            >
              Laporan Arus Kas
            </button>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-[#81B29A] hover:bg-emerald-600 text-[#2D3748] font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            title="Download Berkas Excel (.csv) Ke Komputer / HP"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Excel (.xlsx)
          </button>
          
          {reportTab === 'proker' ? (
            <button
              onClick={() => setSelectedProkerForPrint(MOCK_PROKER[0])}
              className="px-3.5 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#81B29A]" /> Preview Cetak PDF Proker
            </button>
          ) : (
            <button
              onClick={() => setShowPrintCashFlowModal(true)}
              className="px-3.5 py-2 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#81B29A]" /> Preview Cetak PDF Arus Kas
            </button>
          )}
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
            {reportTab === 'proker' ? 'LAPORAN KEUANGAN PER PROGRAM KERJA' : 'LAPORAN ARUS KAS (CASH FLOW STATEMENT)'}
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

        {/* TAB 1: LAPORAN KEUANGAN PER PROGRAM KERJA */}
        {reportTab === 'proker' ? (
          <div className="space-y-6">
            <h4 className="font-bold text-xs text-[#2D3748] uppercase tracking-wider border-l-4 border-[#7A0C1E] pl-2">
              RINCIAN KEUANGAN PER PROGRAM KERJA (KEGIATAN)
            </h4>

            <div className="space-y-6">
              {MOCK_PROKER.map((proker) => {
                const prokerTrx = transaksiList.filter((t) => t.programKerjaId === proker.id);
                const pem = prokerTrx
                  .filter((t) => t.jenisNominal === 'pemasukan')
                  .reduce((sum, t) => sum + t.nominal, 0);
                const peng = prokerTrx
                  .filter((t) => t.jenisNominal === 'pengeluaran')
                  .reduce((sum, t) => sum + t.nominal, 0);
                const diff = pem - peng;

                return (
                  <div key={proker.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    {/* Proker Card Header */}
                    <div className="bg-slate-100 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#7A0C1E] text-white">
                          {proker.bidangNama}
                        </span>
                        <h5 className="font-extrabold text-[#2D3748] text-sm mt-1">{proker.namaProker}</h5>
                        <p className="text-[11px] text-slate-500">
                          Jadwal: <span className="font-semibold text-slate-700">{proker.tanggalPelaksanaan || '02 - 04 Sept 2026'}</span> • Kategori: <span className="font-semibold text-slate-700">{proker.kategori}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Surplus / Defisit</span>
                          <span className={`font-black text-sm ${diff >= 0 ? 'text-[#2D5A44]' : 'text-[#9C5217]'}`}>
                            Rp {diff.toLocaleString('id-ID')}
                          </span>
                        </div>

                        {/* Print Button Per Proker */}
                        <button
                          onClick={() => setSelectedProkerForPrint(proker)}
                          className="px-3 py-1.5 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                          title="Cetak Laporan Per Proker Ini"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#81B29A]" />
                          <span>Cetak Laporan</span>
                        </button>
                      </div>
                    </div>

                    {/* Proker Transactions Table */}
                    <div className="overflow-x-auto p-2">
                      {prokerTrx.length > 0 ? (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="text-slate-500 border-b border-slate-200 font-bold bg-slate-50">
                              <th className="py-2 px-3">Tanggal</th>
                              <th className="py-2 px-3">Keterangan Transaksi</th>
                              <th className="py-2 px-3">Jenis Alokasi</th>
                              <th className="py-2 px-3">Pemasukan (Rp)</th>
                              <th className="py-2 px-3">Pengeluaran (Rp)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {prokerTrx.map((t) => (
                              <tr key={t.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-semibold text-[#2D3748]">{t.tanggal}</td>
                                <td className="py-2 px-3 font-medium text-[#2D3748]">{t.keterangan}</td>
                                <td className="py-2 px-3 text-slate-500 uppercase text-[10px]">{t.jenisTransaksi}</td>
                                <td className="py-2 px-3 text-[#2E7D32] font-bold">
                                  {t.jenisNominal === 'pemasukan' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="py-2 px-3 text-[#C05621] font-bold">
                                  {t.jenisNominal === 'pengeluaran' ? `Rp ${t.nominal.toLocaleString('id-ID')}` : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-4 text-center text-slate-400 text-xs font-medium">
                          Belum ada transaksi yang dicatat untuk Program Kerja ini.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TAB 2: LAPORAN ARUS KAS (CASH FLOW STATEMENT) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-[#2D3748] uppercase tracking-wider border-l-4 border-[#2D3748] pl-2">
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
        )}

        {/* Footer Report Stamp */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
          <span>SAKU IMM Finance v1.0 • Persistensi Data & Real Excel (.xlsx) Download Ready</span>
          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Diperbarui pada: 03/09/2026 15:48 WIB
          </span>
        </div>
      </div>

      {/* PRINTABLE PROKER REPORT MODAL */}
      {selectedProkerForPrint && (
        <PrintableProkerReportModal
          proker={selectedProkerForPrint}
          transaksiList={transaksiList}
          currentLevel={currentLevel}
          currentOrgName={getOrgName(currentLevel)}
          onClose={() => setSelectedProkerForPrint(null)}
        />
      )}

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
