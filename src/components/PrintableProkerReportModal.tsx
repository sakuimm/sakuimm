import React from 'react';
import { ProgramKerja, Transaksi, OrgLevel } from '../types';
import { Printer, X, Download, FileText, CheckCircle2 } from 'lucide-react';

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

  // Separate income and expense transactions
  const pemasukanList = prokerTrx.filter((t) => t.jenisNominal === 'pemasukan');
  const pengeluaranList = prokerTrx.filter((t) => t.jenisNominal === 'pengeluaran');

  // Sample data fallback if proker has no transactions yet (to show complete ready-to-print demonstration)
  const displayPemasukan = pemasukanList.length > 0 ? pemasukanList : [
    { id: 'p-1', tanggal: '05 Agu', keterangan: 'Sponsor A', nominal: 10000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-2', tanggal: '07 Agu', keterangan: 'Sponsor B', nominal: 7000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-3', tanggal: '09 Agu', keterangan: 'Kontribusi peserta', nominal: 3000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName }
  ];

  const displayPengeluaran = pengeluaranList.length > 0 ? pengeluaranList : [
    { id: 'e-1', tanggal: '10 Agu', keterangan: 'Konsumsi peserta', jenisTransaksi: 'operasional' as const, nominal: 6000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-2', tanggal: '10 Agu', keterangan: 'Transportasi', jenisTransaksi: 'operasional' as const, nominal: 4500000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-3', tanggal: '11 Agu', keterangan: 'Sewa perlengkapan', jenisTransaksi: 'operasional' as const, nominal: 5000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'e-4', tanggal: '12 Agu', keterangan: 'Pembelian inventaris', jenisTransaksi: 'inventaris' as const, nominal: 3000000, jenisNominal: 'pengeluaran' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName }
  ];

  const totalPemasukanNum = displayPemasukan.reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaranNum = displayPengeluaran.reduce((sum, t) => sum + t.nominal, 0);
  const surplusDefisitNum = totalPemasukanNum - totalPengeluaranNum;

  // Sample receipts for section 4 BUKTI TRANSAKSI
  const sampleReceipts = [
    { title: '10 Agu – Konsumsi peserta', image: '/sample-receipt-1.svg' },
    { title: '10 Agu – Transportasi', image: '/sample-receipt-2.svg' },
    { title: '11 Agu – Sewa perlengkapan', image: '/sample-receipt-3.svg' },
    { title: '12 Agu – Pembelian inventaris', image: '/sample-receipt-4.svg' },
    { title: '9 Agu – Kontribusi peserta', image: '/sample-receipt-5.svg' },
  ];

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
            <h3 className="font-extrabold text-sm">Preview Dokumen Siap Cetak (Laporan Per Proker)</h3>
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

        {/* PRINTABLE A4 DOCUMENT CONTENT SHEET */}
        <div className="p-8 md:p-12 text-[#1A202C] font-serif leading-relaxed bg-white print:p-8" id="printable-report-area">
          
          {/* 1. KOP SURAT RESMI ORGANISASI IMM */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-1">
            {/* Logo Left */}
            <div className="w-24 flex items-center justify-center">
              <img src="/logosakuimmnew.png" alt="IMM Logo" className="h-16 object-contain" />
            </div>

            {/* Header Text Center */}
            <div className="text-center font-sans flex-1 px-4">
              <h1 className="text-lg md:text-xl font-black tracking-wider uppercase text-slate-900">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h1>
              <h2 className="text-base md:text-lg font-extrabold uppercase text-slate-800 tracking-wide mt-0.5">
                {getLevelHeaderTitle(currentLevel)}
              </h2>
              <p className="text-[11px] text-slate-600 font-medium mt-1">
                Jl. Kramat Raya No. 49, Jakarta Pusat 10450
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Telp. (021) 3903021 | Email: dpp@imm.or.id
              </p>
            </div>

            {/* Logo Right (BCA Syariah Co-branding / Verification Badge) */}
            <div className="w-24 flex items-center justify-center">
              <img src="/bca-syariah-logo.png" alt="BCA Syariah Logo" className="h-10 object-contain" />
            </div>
          </div>

          {/* Double Horizontal Divider Bar */}
          <div className="border-b-4 border-slate-900 mb-6" />

          {/* 2. METADATA PROGRAM KERJA */}
          <div className="font-sans text-xs space-y-1.5 mb-6 bg-slate-50/80 p-4 rounded-lg border border-slate-200">
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-bold text-slate-700">Nama Program Kerja</span>
              <span className="col-span-9 font-extrabold text-slate-900">: {proker.namaProker}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-bold text-slate-700">Bidang</span>
              <span className="col-span-9 font-bold text-slate-900">: {proker.bidangNama}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-bold text-slate-700">Kategori</span>
              <span className="col-span-9 font-bold text-slate-900">: {proker.kategori}</span>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <span className="col-span-3 font-bold text-slate-700">Pelaksanaan</span>
              <span className="col-span-9 font-bold text-slate-900">: {proker.tanggalPelaksanaan || '10 – 12 Agustus 2026'}</span>
            </div>
          </div>

          {/* 3. SEKSI 1: RINGKASAN KEUANGAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              1. RINGKASAN KEUANGAN
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
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pemasukan</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">
                    Rp{totalPemasukanNum.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-r border-slate-300 font-medium">Total Pengeluaran</td>
                  <td className="py-2 px-4 text-right font-bold text-slate-900">
                    Rp{totalPengeluaranNum.toLocaleString('id-ID')}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-black">
                  <td className="py-2.5 px-4 border-r border-slate-300 uppercase">Surplus / Defisit</td>
                  <td className="py-2.5 px-4 text-right text-slate-900 text-sm">
                    Rp{surplusDefisitNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4. SEKSI 2: RINCIAN PEMASUKAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              2. RINCIAN PEMASUKAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                  <th className="py-2 px-4 text-left border-r border-slate-400 w-1/4">Tanggal</th>
                  <th className="py-2 px-4 text-left border-r border-slate-400 w-1/2">Sumber / Keterangan</th>
                  <th className="py-2 px-4 text-right w-1/4">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {displayPemasukan.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-r border-slate-300 font-medium">{item.tanggal}</td>
                    <td className="py-2 px-4 border-r border-slate-300 font-medium">{item.keterangan}</td>
                    <td className="py-2 px-4 text-right font-bold text-slate-900">
                      Rp{item.nominal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-400">
                  <td colSpan={2} className="py-2.5 px-4 text-center border-r border-slate-300 uppercase">Total</td>
                  <td className="py-2.5 px-4 text-right text-slate-900 text-sm">
                    Rp{totalPemasukanNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. SEKSI 3: RINCIAN PENGELUARAN */}
          <div className="space-y-2 mb-6 font-sans">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              3. RINCIAN PENGELUARAN
            </h3>
            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                  <th className="py-2 px-3 text-left border-r border-slate-400 w-1/6">Tanggal</th>
                  <th className="py-2 px-3 text-left border-r border-slate-400 w-2/5">Keterangan</th>
                  <th className="py-2 px-3 text-center border-r border-slate-400 w-1/5">Jenis</th>
                  <th className="py-2 px-3 text-right w-1/4">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {displayPengeluaran.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 border-r border-slate-300 font-medium">{item.tanggal}</td>
                    <td className="py-2 px-3 border-r border-slate-300 font-medium">{item.keterangan}</td>
                    <td className="py-2 px-3 border-r border-slate-300 text-center font-medium capitalize">
                      {item.jenisTransaksi}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      Rp{item.nominal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-400">
                  <td colSpan={3} className="py-2.5 px-4 text-center border-r border-slate-300 uppercase">Total</td>
                  <td className="py-2.5 px-3 text-right text-slate-900 text-sm">
                    Rp{totalPengeluaranNum.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. SEKSI 4: BUKTI TRANSAKSI (MOCK/ACTUAL SCANNED RECEIPTS GRID) */}
          <div className="space-y-3 mb-8 font-sans page-break-inside-avoid">
            <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider">
              4. BUKTI TRANSAKSI
            </h3>
            
            <div className="grid grid-cols-5 gap-2 border border-slate-300 p-3 rounded-lg bg-slate-50/50">
              {sampleReceipts.map((rec, idx) => (
                <div key={idx} className="flex flex-col items-center justify-between bg-white p-2 border border-slate-200 rounded shadow-2xs text-center space-y-1.5">
                  {/* Styled Receipt Mock Graphic */}
                  <div className="w-full h-28 bg-slate-100 border border-slate-300 rounded p-1.5 flex flex-col justify-between text-[8px] font-mono text-slate-700 overflow-hidden leading-tight">
                    <div className="border-b border-dashed border-slate-400 pb-1 font-bold text-center">
                      *** NOTA BUKTI KAS ***
                      <br />
                      SAKU IMM - {currentLevel}
                    </div>
                    <div className="space-y-0.5 text-left py-1">
                      <p>TGL: {rec.title.split(' – ')[0]}</p>
                      <p>ITEM: {rec.title.split(' – ')[1]}</p>
                      <p>STATUS: Lunas (Verified)</p>
                    </div>
                    <div className="border-t border-dashed border-slate-400 pt-0.5 text-center font-bold text-[#7A0C1E]">
                      WATERMARKED IMM
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 line-clamp-2 leading-tight">
                    {rec.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. BLOK TANDA TANGAN LEGALISASI */}
          <div className="pt-4 flex justify-end font-sans page-break-inside-avoid">
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
