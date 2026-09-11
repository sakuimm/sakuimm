import React, { useState } from 'react';
import { Bidang, ProgramKerja, KategoriProker, UserRole } from '../types';
import {
  FolderPlus,
  Calendar,
  User,
  Coins,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  FolderKanban
} from 'lucide-react';

interface InputProkerViewProps {
  bidangList: Bidang[];
  onAddProker: (proker: ProgramKerja) => void;
  onNavigateToList: () => void;
  userRole: UserRole;
}

export const InputProkerView: React.FC<InputProkerViewProps> = ({
  bidangList,
  onAddProker,
  onNavigateToList,
  userRole,
}) => {
  const [selectedBidangId, setSelectedBidangId] = useState(bidangList[0]?.id || 'b1');
  const [namaProker, setNamaProker] = useState('');
  const [tanggalPelaksanaan, setTanggalPelaksanaan] = useState('02 - 04 September 2026');
  const [kategori, setKategori] = useState<KategoriProker>('Kemahasiswaan');
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [targetAnggaran, setTargetAnggaran] = useState<string>('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submittedProker, setSubmittedProker] = useState<ProgramKerja | null>(null);

  const selectedBidang = bidangList.find((b) => b.id === selectedBidangId) || bidangList[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProker.trim()) return;

    const numAnggaran = targetAnggaran ? parseInt(targetAnggaran.replace(/[^0-9]/g, ''), 10) : undefined;

    const newProker: ProgramKerja = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      bidangId: selectedBidangId,
      bidangNama: selectedBidang?.nama || 'Bidang Organisasi',
      namaProker: namaProker.trim(),
      kategori,
      tanggalPelaksanaan: tanggalPelaksanaan.trim() || '02 - 04 September 2026',
      statusLaporan: 'Belum',
      penanggungJawab: penanggungJawab.trim() || undefined,
      deskripsi: deskripsi.trim() || undefined,
      targetAnggaran: numAnggaran,
      tanggalDibuat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    onAddProker(newProker);
    setSubmittedProker(newProker);

    // Reset form fields
    setNamaProker('');
    setPenanggungJawab('');
    setTargetAnggaran('');
    setDeskripsi('');
  };

  const formatRupiah = (val: number | undefined) => {
    if (!val || isNaN(val)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // If user is Tim Verifikasi Internal (read-only restriction)
  if (userRole === 'tim_verifikasi_internal') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Input</span>
          <span>&gt;</span>
          <span className="text-[#7A0C1E] font-bold">Input Program Kerja</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#2D3748]">Akses Input Dibatasi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Akun Anda memiliki peran <span className="font-bold text-[#7A0C1E]">Tim Verifikasi Internal</span> yang dikhususkan untuk audit dan pemeriksaan bukti keuangan. Penambahan program kerja hanya dapat dilakukan oleh Bendahara Umum atau Pengurus Harian.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToList}
              className="px-5 py-2.5 bg-[#7A0C1E] hover:bg-[#600917] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Lihat Daftar Program Kerja</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>Input</span>
            <span>&gt;</span>
            <span className="text-[#7A0C1E] font-bold">Input Program Kerja</span>
          </div>
          <h2 className="text-xl font-black text-[#2D3748] tracking-tight flex items-center gap-2">
            <FolderPlus className="w-6 h-6 text-[#7A0C1E]" />
            <span>Pendaftaran Program Kerja Baru</span>
          </h2>
          <p className="text-xs text-slate-500">
            Formulir pendaftaran agenda program kerja per bidang naungan baku IMM beserta sasaran anggaran dan jadwal pelaksanaan.
          </p>
        </div>

        <button
          onClick={onNavigateToList}
          className="px-4 py-2 bg-white border border-slate-200 hover:border-[#7A0C1E] text-[#2D3748] hover:text-[#7A0C1E] text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs self-start md:self-auto"
        >
          <FolderKanban className="w-4 h-4 text-slate-400" />
          <span>Lihat Semua Program Kerja</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Success Banner Notification */}
      {submittedProker && (
        <div className="bg-[#81B29A]/15 border border-[#81B29A]/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#81B29A] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#2D5A44]">Program Kerja Berhasil Didaftarkan!</h4>
              <p className="text-[11px] text-slate-600">
                <span className="font-bold">{submittedProker.namaProker}</span> telah tercatat di bawah naungan {submittedProker.bidangNama}.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => setSubmittedProker(null)}
              className="px-3 py-1.5 bg-white text-slate-600 hover:text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 transition-all"
            >
              Tutup
            </button>
            <button
              onClick={onNavigateToList}
              className="px-3 py-1.5 bg-[#2D5A44] hover:bg-[#204030] text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Lihat di Tabel Proker</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Form (Left) & Live Preview + Tips (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A0C1E]"></span>
              <h3 className="font-black text-[#2D3748] text-sm">Formulir Pendaftaran Proker</h3>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#7A0C1E]/10 text-[#7A0C1E]">
              Wajib Isi Tanda *
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Bidang IMM Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pilih Bidang IMM <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBidangId}
                  onChange={(e) => setSelectedBidangId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                >
                  {bidangList.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.kode}] {b.nama}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#81B29A]" />
                Sesuai standar struktur baku 22 Bidang Tanfidz IMM
              </p>
            </div>

            {/* 2. Nama Program Kerja */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nama Program Kerja <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={namaProker}
                onChange={(e) => setNamaProker(e.target.value)}
                placeholder="Contoh: Darul Arqam Dasar (DAD) XXVII"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
              />
            </div>

            {/* 3. Tanggal Pelaksanaan & Kategori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tanggal Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={tanggalPelaksanaan}
                    onChange={(e) => setTanggalPelaksanaan(e.target.value)}
                    placeholder="Contoh: 02 - 04 September 2026"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Format: DD - DD Bulan YYYY</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori Kegiatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as KategoriProker)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                >
                  <option value="Kemahasiswaan">Kemahasiswaan</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Kemasyarakatan">Kemasyarakatan</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Trikompetensi Dasar IMM</p>
              </div>
            </div>

            {/* 4. Penanggung Jawab (PIC) & Target Anggaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Penanggung Jawab (PIC)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={penanggungJawab}
                    onChange={(e) => setPenanggungJawab(e.target.value)}
                    placeholder="Contoh: Immawan Fauzan"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimasi / Target Anggaran
                </label>
                <div className="relative">
                  <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={targetAnggaran}
                    onChange={(e) => setTargetAnggaran(e.target.value)}
                    placeholder="Contoh: 15000000"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Dalam rupiah (angka saja)</p>
              </div>
            </div>

            {/* 5. Deskripsi Singkat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Deskripsi / Catatan Program Kerja
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan ringkas sasaran atau deskripsi program kerja ini..."
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#2D3748] focus:outline-none focus:border-[#7A0C1E] focus:bg-white transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit & Reset Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#7A0C1E] hover:bg-[#600917] text-white font-bold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FolderPlus className="w-4 h-4" />
                <span>+ Daftarkan Program Kerja</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setNamaProker('');
                  setPenanggungJawab('');
                  setTargetAnggaran('');
                  setDeskripsi('');
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Preview Card + Guidelines (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Preview Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-gradient-to-r from-[#7A0C1E] to-[#600917] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#81B29A]" />
                <h4 className="text-xs font-black tracking-wide uppercase">Pratinjau Kartu Proker</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                Live Preview
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Bidang Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-[#7A0C1E] bg-[#7A0C1E]/10 px-2.5 py-1 rounded-full">
                  {selectedBidang?.kode} • {selectedBidang?.nama}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4A261]/20 text-[#9C5217]">
                  Status: Belum LPJ
                </span>
              </div>

              {/* Title */}
              <div>
                <h4 className="font-black text-sm text-[#2D3748] leading-snug">
                  {namaProker || 'Nama Program Kerja Belum Diisi'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {deskripsi || 'Belum ada deskripsi singkat kegiatan.'}
                </p>
              </div>

              {/* Badges and Attributes */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Kategori</span>
                  <span className="font-bold text-[#2D3748] text-xs">{kategori}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pelaksanaan</span>
                  <span className="font-bold text-[#2D3748] text-xs truncate block">
                    {tanggalPelaksanaan || '-'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Penanggung Jawab</span>
                  <span className="font-bold text-[#2D3748] text-xs truncate block">
                    {penanggungJawab || 'Belum Ditentukan'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Estimasi Anggaran</span>
                  <span className="font-bold text-[#7A0C1E] text-xs truncate block">
                    {targetAnggaran ? formatRupiah(parseInt(targetAnggaran.replace(/[^0-9]/g, ''), 10)) : 'Rp 0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidance Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#7A0C1E] font-bold text-xs">
              <Info className="w-4 h-4 text-[#81B29A]" />
              <span>Panduan Input Program Kerja IMM</span>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong>22 Bidang Baku:</strong> Gunakan bidang yang sesuai dengan nomenklatur Tanfidz IMM untuk memudahkan audit silang vertikal.
              </li>
              <li>
                <strong>Pencatatan Transaksi:</strong> Setelah proker didaftarkan, proker akan langsung muncul di pilihan dropdown menu <strong>Input Transaksi</strong>.
              </li>
              <li>
                <strong>Pelaporan Otomatis:</strong> Seluruh kwitansi dan nota yang di-input pada proker ini akan otomatis terangkum dalam format <em>Laporan Keuangan Per Program Kerja</em>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
