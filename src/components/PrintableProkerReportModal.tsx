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

  // Fallback demo data if proker has no transactions yet (matches the exact official mockup)
  const displayPemasukan = pemasukanList.length > 0 ? pemasukanList : [
    { id: 'p-1', tanggal: '5 Agu', keterangan: 'Sponsor A', nominal: 10000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-2', tanggal: '7 Agu', keterangan: 'Sponsor B', nominal: 7000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName },
    { id: 'p-3', tanggal: '9 Agu', keterangan: 'Kontribusi peserta', nominal: 3000000, jenisNominal: 'pemasukan' as const, jenisTransaksi: 'operasional' as const, uploadStatus: 'COMPLETED' as const, bidangId: proker.bidangId, bidangNama: proker.bidangNama, programKerjaId: proker.id, programKerjaNama: proker.namaProker, kategoriProker: proker.kategori, organisasiNama: currentOrgName }
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

  // 5 sample receipts for Section 4 BUKTI TRANSAKSI (Matching merchant names from mockup)
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
          <div className="flex items-center gap-5 pb-3 mb-1">
            {/* Logo Left */}
            <div className="w-20 flex-shrink-0 flex items-center justify-center">
              <img src="/logosakuimmnew.png" alt="IMM Logo" className="h-20 object-contain" />
            </div>

            {/* Header Text */}
            <div className="text-center flex-1 pr-6">
              <h1 className="text-xl md:text-2xl font-black tracking-wide uppercase text-[#1A202C]">
                IKATAN MAHASISWA MUHAMMADIYAH
              </h1>
              <h2 className="text-lg md:text-xl font-extrabold uppercase text-[#1A202C] tracking-wide mt-0.5">
                {getLevelHeaderTitle(currentLevel)}
              </h2>
              <p className="text-xs text-slate-700 font-medium mt-1">
                Jl. Kramat Raya No.49, Jakarta Pusat 10450
              </p>
              <p className="text-xs text-slate-700 font-medium">
                Telp. (021) 3903021 | Email: dpp@imm.or.id
              </p>
            </div>
          </div>

          {/* Double Horizontal Divider Bar (Top Maroon Bold, Bottom Thin Black) */}
          <div className="space-y-0.5 mb-6">
            <div className="h-1 bg-[#7A0C1E] w-full" />
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
              <span className="ml-2 font-medium text-[#1A202C]">{proker.tanggalPelaksanaan || '10 – 12 Agustus 2026'}</span>
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
                {displayPemasukan.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.tanggal}</td>
                    <td className="py-2 px-3 border-r border-slate-400 font-medium">{item.keterangan}</td>
                    <td className="py-2 px-3 text-right font-medium text-[#1A202C]">
                      Rp{item.nominal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
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
                {displayPengeluaran.map((item) => (
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
                ))}
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
            
            <div className="grid grid-cols-5 gap-3">
              {sampleReceipts.map((rec, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Real Thermal Paper Receipt Visual */}
                  <div className="w-full h-36 border border-slate-300 rounded overflow-hidden shadow-2xs bg-white flex items-center justify-center p-0.5">
                    <img src={rec.image} alt={rec.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="text-[10px] text-slate-800 text-center mt-1.5 leading-tight font-medium">
                    {rec.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. BLOK TANDA TANGAN LEGALISASI */}
          <div className="pt-6 flex justify-end font-sans page-break-inside-avoid">
            <div className="text-center w-64 space-y-16">
              <div>
                <p className="text-xs text-slate-800">
                  Jakarta, 13 Agustus 2026
                </p>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  Bendahara Umum DPP IMM
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
